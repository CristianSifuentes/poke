import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
// 'system' follows the operating system, live.
export type ThemePreference = Theme | 'system';

export const THEME_STORAGE_KEY = 'poke.theme.v1';

// The page canvas per theme, for the browser UI (address bar on mobile).
const THEME_COLORS: Readonly<Record<Theme, string>> = { light: '#ffffff', dark: '#111113' };

export interface RevealOrigin {
  x: number;
  y: number;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

// Light, dark, or whatever the OS says. The choice lives in a signal,
// persists in localStorage, follows the OS while it's 'system', syncs
// across tabs, and is written to <html data-theme> — which is all the CSS
// needs: every color in the app is a token that the dark palette redefines.
//
// index.html runs a tiny inline script that applies the same logic before
// Angular boots, so there's never a flash of the wrong theme.
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly media =
    typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;

  private readonly systemPrefersDark = signal(this.media?.matches ?? false);
  private readonly _preference = signal<ThemePreference>(readPreference());

  readonly preference = this._preference.asReadonly();
  readonly theme = computed<Theme>(() => {
    const preference = this._preference();
    if (preference !== 'system') {
      return preference;
    }
    return this.systemPrefersDark() ? 'dark' : 'light';
  });
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.apply();

    const onSystemChange = (event: MediaQueryListEvent): void => {
      this.systemPrefersDark.set(event.matches);
      this.apply();
    };
    // Another tab changed the theme: follow it, without an animation.
    const onStorage = (event: StorageEvent): void => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        this._preference.set(readPreference());
        this.apply();
      }
    };
    this.media?.addEventListener('change', onSystemChange);
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
    }
    inject(DestroyRef).onDestroy(() => {
      this.media?.removeEventListener('change', onSystemChange);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
      }
    });
  }

  // Flips between light and dark. Choosing the same theme the OS already
  // uses stores 'system' instead — so from then on the app quietly follows
  // the OS again, and there's no separate "use system setting" control.
  toggle(origin?: RevealOrigin): void {
    const next: Theme = this.isDark() ? 'light' : 'dark';
    const systemTheme: Theme = this.systemPrefersDark() ? 'dark' : 'light';
    this.setPreference(next === systemTheme ? 'system' : next, origin);
  }

  setPreference(preference: ThemePreference, origin?: RevealOrigin): void {
    const update = (): void => {
      this._preference.set(preference);
      persist(preference);
      // Applied synchronously, not in an effect: a view transition takes
      // its "after" snapshot right after this callback returns.
      this.apply();
    };
    this.withReveal(update, origin);
  }

  private apply(): void {
    const theme = this.theme();
    const root = this.document.documentElement;
    root.setAttribute('data-theme', theme);
    this.document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute('content', THEME_COLORS[theme]));
  }

  // The new theme grows out of the toggle as a circle, using the View
  // Transitions API. Without support, or with reduced motion, it just
  // switches.
  private withReveal(update: () => void, origin?: RevealOrigin): void {
    const doc = this.document as ViewTransitionDocument;
    const reducedMotion =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reducedMotion) {
      update();
      return;
    }

    const root = doc.documentElement;
    const view = doc.defaultView;
    const width = view?.innerWidth ?? 0;
    const height = view?.innerHeight ?? 0;
    const x = origin?.x ?? width / 2;
    const y = origin?.y ?? 0;
    // Far enough to reach the farthest corner of the viewport.
    const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
    root.style.setProperty('--reveal-x', `${x}px`);
    root.style.setProperty('--reveal-y', `${y}px`);
    root.style.setProperty('--reveal-r', `${radius}px`);
    root.classList.add('theme-switching');

    doc
      .startViewTransition(update)
      .finished.finally(() => root.classList.remove('theme-switching'))
      .catch(() => undefined);
  }
}

function readPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
}

function persist(preference: ThemePreference): void {
  try {
    if (preference === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit.
  }
}
