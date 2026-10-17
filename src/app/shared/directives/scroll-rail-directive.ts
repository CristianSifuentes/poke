import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy, inject, signal } from '@angular/core';

// A horizontally scrolling row that knows whether there's hidden content
// past either edge. Templates read canScrollStart/canScrollEnd (via
// #rail="scrollRail") to show arrow buttons and edge fades only when
// there's actually something to reveal, and call scrollByPage() from them.
@Directive({
  selector: '[appScrollRail]',
  standalone: false,
  exportAs: 'scrollRail',
})
export class ScrollRailDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private resizeObserver?: ResizeObserver;

  readonly canScrollStart = signal(false);
  readonly canScrollEnd = signal(false);

  ngAfterViewInit(): void {
    this.update();
    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(() => this.update());
      this.resizeObserver.observe(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  @HostListener('scroll')
  update(): void {
    const { scrollLeft, scrollWidth, clientWidth } = this.elementRef.nativeElement;
    // 1px tolerance: fractional widths can leave scrollLeft a hair short.
    this.canScrollStart.set(scrollLeft > 1);
    this.canScrollEnd.set(scrollLeft + clientWidth < scrollWidth - 1);
  }

  // Pages by most of the visible width, keeping a sliver of overlap so the
  // eye has an anchor between "before" and "after".
  scrollByPage(direction: 1 | -1): void {
    const rail: HTMLElement = this.elementRef.nativeElement;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: preferredScrollBehavior() });
  }
}

export function preferredScrollBehavior(): ScrollBehavior {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';
}
