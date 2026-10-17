import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PokedexStats } from '../../about-stats';

@Component({
  selector: 'app-stat-grid',
  standalone: false,
  templateUrl: './stat-grid.html',
  styleUrl: './stat-grid.scss',
})
export class StatGrid {
  @Input() stats: PokedexStats | null = null;
  @Input() status: 'loading' | 'ready' | 'error' = 'loading';
  // Live from FavoritesStore — the one number on this page that's yours.
  @Input() favoriteCount = 0;
  @Output() readonly retry = new EventEmitter<void>();

  protected readonly skeletons = Array.from({ length: 6 }, (_, i) => i);
}
