import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { FALLBACK_ARTWORK } from '../utils/pokemon-artwork';

// A CDN hiccup is usually transient — a single retry on a fresh connection
// clears most of them. Only fall back to the local placeholder once that
// retry has also failed, so a real outage still degrades gracefully instead
// of showing a broken-image icon.
@Directive({
  selector: 'img[appArtworkFallback]',
  standalone: false,
})
export class ArtworkFallbackDirective {
  private readonly elementRef = inject(ElementRef<HTMLImageElement>);
  private retried = false;

  @HostListener('error')
  onError(): void {
    const img: HTMLImageElement = this.elementRef.nativeElement;
    if (this.retried) {
      if (img.src !== FALLBACK_ARTWORK) {
        img.src = FALLBACK_ARTWORK;
      }
      return;
    }
    this.retried = true;
    const freshUrl = img.src.split('?')[0] + `?retry=${Date.now()}`;
    setTimeout(() => {
      img.src = freshUrl;
    }, 600);
  }
}
