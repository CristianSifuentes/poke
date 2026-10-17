import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';

// Emits whenever the host scrolls near the viewport — the trigger for
// "render the next page" in long lists. IntersectionObserver only reports
// *changes* in intersection, so after each emit the host is re-observed on
// the next tick: if newly rendered content didn't push it out of view, the
// fresh observation fires again and the list keeps filling the screen.
@Directive({
  selector: '[appScrollSentinel]',
  standalone: false,
})
export class ScrollSentinelDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private reobserveTimer?: ReturnType<typeof setTimeout>;

  @Output('appScrollSentinel') readonly reached = new EventEmitter<void>();

  ngOnInit(): void {
    if (typeof IntersectionObserver !== 'function') {
      return;
    }
    const host: HTMLElement = this.elementRef.nativeElement;
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }
        this.reached.emit();
        this.observer?.unobserve(host);
        this.reobserveTimer = setTimeout(() => this.observer?.observe(host), 150);
      },
      { rootMargin: '0px 0px 600px 0px' },
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    clearTimeout(this.reobserveTimer);
    this.observer?.disconnect();
  }
}
