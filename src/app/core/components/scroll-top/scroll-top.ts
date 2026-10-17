import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';

import { ScrollState, readScrollState } from './scroll-state';

// "Back to top", minimal and honest: it appears once you've scrolled a
// while, its ring shows how much of the page you've read, and it closes
// (and turns red) when you reach the end. Clicking it returns to the top
// and puts focus on the page's heading, so keyboard and screen-reader users
// arrive where sighted users do.
@Component({
  selector: 'app-scroll-top',
  standalone: false,
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.scss',
})
export class ScrollTop {
  private readonly document = inject(DOCUMENT);

  protected readonly state = signal<ScrollState>({ visible: false, progress: 0, complete: false });

  constructor() {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    // Scroll events fire faster than frames; measure at most once per frame.
    let frame = 0;
    const measure = (): void => {
      frame = 0;
      this.state.set(
        readScrollState(view.scrollY, view.innerHeight, this.document.documentElement.scrollHeight),
      );
    };
    const schedule = (): void => {
      if (!frame) {
        frame = view.requestAnimationFrame(measure);
      }
    };

    view.addEventListener('scroll', schedule, { passive: true });
    view.addEventListener('resize', schedule, { passive: true });
    schedule();
    inject(DestroyRef).onDestroy(() => {
      view.removeEventListener('scroll', schedule);
      view.removeEventListener('resize', schedule);
      view.cancelAnimationFrame(frame);
    });
  }

  protected toTop(): void {
    const view = this.document.defaultView;
    const reducedMotion = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    view?.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });

    const heading = this.document.querySelector<HTMLElement>('main h1');
    if (heading) {
      if (!heading.hasAttribute('tabindex')) {
        heading.setAttribute('tabindex', '-1');
      }
      heading.focus({ preventScroll: true });
    }
  }
}
