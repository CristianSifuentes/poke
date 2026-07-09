import { Directive, ElementRef, HostBinding, OnDestroy, OnInit, inject } from '@angular/core';

// Gives a grid item an organic "rise into view" entrance the moment it
// crosses the viewport, instead of the whole bento mosaic slamming onto
// screen at once. ElementRef is the reason this can't just be a
// [class.x]/[style.x] binding on the component: the directive needs the
// host's real DOM node to hand to IntersectionObserver, which is
// per-element viewport geometry no template expression can express.
@Directive({
  selector: '[appEntranceReveal]',
  standalone: false,
})
export class EntranceRevealDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  // Set only once JS confirms it can animate the reveal — if this never
  // flips true, the host stays in its normal, fully visible resting state.
  @HostBinding('class.pending-reveal')
  pending = false;

  @HostBinding('class.is-in-view')
  inView = false;

  ngOnInit(): void {
    const canAnimate =
      typeof matchMedia === 'function' &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches &&
      typeof IntersectionObserver === 'function';

    if (!canAnimate) {
      return;
    }

    this.pending = true;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.inView = true;
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
