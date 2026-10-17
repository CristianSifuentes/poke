import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FavoritesStore } from '../../core/services/favorites-store';
import { PokedexService } from '../../core/services/pokedex-service';
import { PokedexStats, summarizePokedex } from './about-stats';

type LoadStatus = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private readonly pokedex = inject(PokedexService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly favorites = inject(FavoritesStore);

  protected readonly status = signal<LoadStatus>('loading');
  protected readonly stats = signal<PokedexStats | null>(null);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.status.set('loading');
    this.pokedex
      .loadIndex()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (entries) => {
          this.stats.set(summarizePokedex(entries));
          this.status.set('ready');
        },
        error: () => this.status.set('error'),
      });
  }
}
