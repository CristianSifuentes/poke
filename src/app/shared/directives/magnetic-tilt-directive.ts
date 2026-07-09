import { Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';

// A quiet 3D tilt + light-follows-cursor glow for the grid's largest cells
// (hero/wide), where there's enough surface area for the effect to read as
// craft rather than gimmick. ElementRef is required here for the same
// reason as EntranceRevealDirective: turning a raw PointerEvent into a
// tilt angle needs the host's own bounding rect, which only the DOM node
// itself can provide.
@Directive({
  selector: '[appMagneticTilt]',
  standalone: false,
})
export class MagneticTiltDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input('appMagneticTilt') enabled = true;

  private active = false;
  private mediaQuery?: MediaQueryList;
  private readonly onMediaChange = (event: MediaQueryListEvent): void => {
    this.active = this.enabled && event.matches;
  };

  @HostBinding('style.--tilt-x') tiltX = '0deg';
  @HostBinding('style.--tilt-y') tiltY = '0deg';
  @HostBinding('style.--glow-x') glowX = '50%';
  @HostBinding('style.--glow-y') glowY = '50%';

  ngOnInit(): void {
    if (!this.enabled || typeof matchMedia !== 'function') {
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.mediaQuery = matchMedia('(hover: hover) and (pointer: fine)');
    this.active = this.enabled && this.mediaQuery.matches;
    this.mediaQuery.addEventListener('change', this.onMediaChange);
  }

  ngOnDestroy(): void {
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.active) {
      return;
    }
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const maxTiltDeg = 4;

    this.tiltY = `${(px - 0.5) * maxTiltDeg * 2}deg`;
    this.tiltX = `${(0.5 - py) * maxTiltDeg * 2}deg`;
    this.glowX = `${px * 100}%`;
    this.glowY = `${py * 100}%`;
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    this.tiltX = '0deg';
    this.tiltY = '0deg';
    this.glowX = '50%';
    this.glowY = '50%';
  }
}
