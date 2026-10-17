import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

// After moving to a different page, put keyboard and screen-reader focus on
// that page's heading, the way a full page load would start at the top.
// Query-param-only changes (typing in search, toggling a filter) don't
// count as a new page and leave focus alone.
@Injectable({ providedIn: 'root' })
export class NavigationFocus {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private lastPath: string | null = null;

  init(): void {
    // Anchor scrolling should land below the sticky header, not under it.
    inject(ViewportScroller).setOffset([0, 72]);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const path = event.urlAfterRedirects.split(/[?#]/)[0];
      const isFirstLoad = this.lastPath === null;
      const changed = path !== this.lastPath;
      this.lastPath = path;
      if (changed && !isFirstLoad) {
        // Wait a frame: lazy pages and their headings render after NavigationEnd.
        requestAnimationFrame(() => this.focusHeading());
      }
    });
  }

  private focusHeading(): void {
    const main = this.document.querySelector<HTMLElement>('main');
    // The new page already put focus somewhere on purpose (the search
    // field, after the "/" shortcut) — don't take it away.
    if (main?.contains(this.document.activeElement)) {
      return;
    }
    const target = main?.querySelector<HTMLElement>('h1') ?? main;
    if (!target) {
      return;
    }
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  }
}
