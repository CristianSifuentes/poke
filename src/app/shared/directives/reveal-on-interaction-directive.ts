import { Directive, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

// Formalizes the "quiet by default, reveals on a precise pointer" pattern
// used by the bento grid's regular cards. Previously this state lived
// entirely in CSS (`:hover`, `:focus-within`, a `(hover: hover) and
// (pointer: fine)` media query) while the template carried a parallel,
// hand-written `[attr.tabindex]` ternary to keep keyboard users in sync.
// Centralizing it here means there is exactly one place that decides
// whether a card is revealed, and the template just toggles the directive
// on or off per item via `[appRevealOnInteraction]="condition"`.
@Directive({
  selector: '[appRevealOnInteraction]',
  standalone: false,
})
export class RevealOnInteractionDirective implements OnInit, OnDestroy {
  @Input('appRevealOnInteraction') enabled = true;

  private hoverCapable = true;
  private mediaQuery?: MediaQueryList;
  private readonly onMediaChange = (event: MediaQueryListEvent): void => {
    this.hoverCapable = event.matches;
    this.revealed = !this.hoverCapable;
  };

  revealed = false;

  @HostBinding('class.is-revealed')
  get isRevealed(): boolean {
    return this.enabled && this.revealed;
  }

  @HostBinding('class.can-hover')
  get canHover(): boolean {
    return this.enabled && this.hoverCapable;
  }

  @HostBinding('attr.tabindex')
  get tabindex(): number | null {
    return this.enabled ? 0 : null;
  }

  ngOnInit(): void {
    if (typeof matchMedia !== 'function') {
      return;
    }
    this.mediaQuery = matchMedia('(hover: hover) and (pointer: fine)');
    this.hoverCapable = this.mediaQuery.matches;
    this.revealed = !this.hoverCapable;
    this.mediaQuery.addEventListener('change', this.onMediaChange);
  }

  ngOnDestroy(): void {
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
  }

  @HostListener('mouseenter')
  @HostListener('focusin')
  onEnter(): void {
    this.revealed = true;
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  onLeave(): void {
    this.revealed = !this.hoverCapable;
  }
}
