import { TestBed } from '@angular/core/testing';

import { THEME_STORAGE_KEY, ThemeService } from './theme-service';

class MemoryStorage {
  private readonly items = new Map<string, string>();
  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.items.set(key, String(value));
  }
  removeItem(key: string): void {
    this.items.delete(key);
  }
  clear(): void {
    this.items.clear();
  }
}

// A controllable prefers-color-scheme media query.
function stubSystemTheme(dark: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('dark') ? dark : false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
}

describe('ThemeService', () => {
  let storage: MemoryStorage;

  function createService(): ThemeService {
    TestBed.resetTestingModule();
    return TestBed.inject(ThemeService);
  }

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal('localStorage', storage);
    stubSystemTheme(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute('data-theme');
  });

  it('follows the operating system when nothing is saved', () => {
    stubSystemTheme(true);
    const service = createService();

    expect(service.preference()).toBe('system');
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('restores a saved choice over the system setting', () => {
    storage.setItem(THEME_STORAGE_KEY, 'dark');
    const service = createService();

    expect(service.theme()).toBe('dark');
  });

  it('ignores garbage in storage', () => {
    storage.setItem(THEME_STORAGE_KEY, 'purple');

    expect(createService().preference()).toBe('system');
  });

  it('toggles, persists and applies the theme to <html>', () => {
    const service = createService();

    service.toggle();

    expect(service.theme()).toBe('dark');
    expect(storage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('goes back to following the system when toggled to the system theme', () => {
    const service = createService();

    service.toggle(); // light (system) → dark
    service.toggle(); // dark → light, which is what the system uses

    expect(service.preference()).toBe('system');
    expect(storage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(service.theme()).toBe('light');
  });
});
