import { Directive, ElementRef, Input, OnChanges, OnDestroy, inject } from '@angular/core';

// Counts the host's text from 0 up to a number the first time it scrolls
// into view, easing out so it lands softly. Later changes (a live favorites
// count, say) are written straight through. Without IntersectionObserver,
// or under prefers-reduced-motion, the final value is shown immediately —
// the number is the content; the count is only decoration.
@Directive({
  selector: '[appCountUp]',
  standalone: false,
})
export class CountUpDirective implements OnChanges, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input({ alias: 'appCountUp', required: true }) value = 0;
  @Input('appCountUpDuration') duration = 1200;

  private observer?: IntersectionObserver;
  private frame?: number;
  private armed = false;
  private done = false;

  ngOnChanges(): void {
    if (this.done) {
      this.render(this.value);
    } else if (!this.armed) {
      this.arm();
    }
    // While counting, each frame reads the latest value on its own.
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
    }
  }

  private arm(): void {
    this.armed = true;
    const reducedMotion =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof IntersectionObserver !== 'function' || reducedMotion) {
      this.finish();
      return;
    }
    this.render(0);
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.observer?.disconnect();
          this.count();
        }
      },
      { threshold: 0.6 },
    );
    this.observer.observe(this.elementRef.nativeElement);
  }

  private count(): void {
    const start = performance.now();
    const step = (now: number): void => {
      const progress = Math.min(1, (now - start) / this.duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.render(Math.round(this.value * eased));
      if (progress < 1) {
        this.frame = requestAnimationFrame(step);
      } else {
        this.finish();
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  private finish(): void {
    this.done = true;
    this.render(this.value);
  }

  private render(value: number): void {
    this.elementRef.nativeElement.textContent = value.toLocaleString('en-US');
  }
}
