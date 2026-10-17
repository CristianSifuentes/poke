import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  signal,
} from '@angular/core';

import { POKEMON_GENERATIONS } from '../../../../shared/utils/pokemon-generations';

@Component({
  selector: 'app-generation-filter',
  standalone: false,
  templateUrl: './generation-filter.html',
  styleUrl: './generation-filter.scss',
})
export class GenerationFilter implements AfterViewInit, OnDestroy {
  @Input() selected: number | null = null;
  // Keyed by generation id; key 0 holds the total across all generations.
  @Input() counts: Record<number, number> = {};
  @Input() disabled = false;
  @Output() readonly generationChange = new EventEmitter<number | null>();

  @ViewChild('track', { static: true }) private readonly track!: ElementRef<HTMLElement>;

  protected readonly generations = POKEMON_GENERATIONS;

  // Whether there is hidden content past each edge — drives both the arrow
  // buttons and the edge fades, so neither shows when everything fits.
  protected readonly canScrollStart = signal(false);
  protected readonly canScrollEnd = signal(false);

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.updateScrollState();
    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(() => this.updateScrollState());
      this.resizeObserver.observe(this.track.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  protected updateScrollState(): void {
    const { scrollLeft, scrollWidth, clientWidth } = this.track.nativeElement;
    // 1px tolerance: fractional widths can leave scrollLeft a hair short.
    this.canScrollStart.set(scrollLeft > 1);
    this.canScrollEnd.set(scrollLeft + clientWidth < scrollWidth - 1);
  }

  // Pages by most of the visible width, keeping one pill of overlap so the
  // eye has an anchor between "before" and "after".
  protected scrollByPage(direction: 1 | -1): void {
    const track = this.track.nativeElement;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: this.scrollBehavior() });
  }

  protected choose(id: number | null, pill: HTMLElement): void {
    this.generationChange.emit(id);
    pill.scrollIntoView({ behavior: this.scrollBehavior(), block: 'nearest', inline: 'nearest' });
  }

  private scrollBehavior(): ScrollBehavior {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
  }
}
