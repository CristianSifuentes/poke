import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PokedexEntry } from '../../core/models/pokedex-entry';
import { FavoritesStore } from '../../core/services/favorites-store';
import { PokedexService } from '../../core/services/pokedex-service';
import { BoxSort, CollectedPokemon, PARTY_SIZE, PartyMove, TypeCount } from './favorites-model';

type LoadStatus = 'loading' | 'ready' | 'error';

const SUGGESTION_COUNT = 3;

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  private readonly pokedex = inject(PokedexService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly favorites = inject(FavoritesStore);

  protected readonly partySize = PARTY_SIZE;
  protected readonly skeletons = Array.from({ length: PARTY_SIZE }, (_, i) => i);

  protected readonly status = signal<LoadStatus>('loading');
  private readonly entriesById = signal(new Map<number, PokedexEntry>());
  protected readonly suggestions = signal<PokedexEntry[]>([]);

  protected readonly boxType = signal<string | null>(null);
  protected readonly boxSort = signal<BoxSort>('recent');

  // Favorites in the user's own arrangement, resolved against the Pokédex index.
  protected readonly collection = computed<CollectedPokemon[]>(() => {
    const byId = this.entriesById();
    return this.favorites
      .entries()
      .filter((record) => byId.has(record.id))
      .map((record) => ({ pokemon: byId.get(record.id)!, addedAt: record.addedAt }));
  });

  protected readonly allPokemon = computed(() => this.collection().map((item) => item.pokemon));
  protected readonly party = computed(() => this.allPokemon().slice(0, PARTY_SIZE));
  private readonly boxed = computed(() => this.collection().slice(PARTY_SIZE));

  protected readonly boxTypeCounts = computed<TypeCount[]>(() => {
    const counts = new Map<string, number>();
    for (const { pokemon } of this.boxed()) {
      for (const type of pokemon.types) {
        counts.set(type, (counts.get(type) ?? 0) + 1);
      }
    }
    return [...counts].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
  });

  // A type filter whose last Pokémon just left the box quietly lets go.
  protected readonly activeBoxType = computed(() => {
    const type = this.boxType();
    return this.boxTypeCounts().some((item) => item.type === type) ? type : null;
  });

  protected readonly box = computed(() => {
    const type = this.activeBoxType();
    const sort = this.boxSort();
    return this.boxed()
      .filter(({ pokemon }) => !type || pokemon.types.includes(type))
      .sort((a, b) => {
        switch (sort) {
          case 'id':
            return a.pokemon.id - b.pokemon.id;
          case 'name':
            return a.pokemon.name.localeCompare(b.pokemon.name);
          default:
            return b.addedAt - a.addedAt;
        }
      })
      .map(({ pokemon }) => pokemon);
  });

  protected readonly boxCount = computed(() => this.boxed().length);

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
          this.entriesById.set(new Map(entries.map((entry) => [entry.id, entry])));
          this.suggestions.set(pickRandom(entries, SUGGESTION_COUNT));
          this.status.set('ready');
        },
        error: () => this.status.set('error'),
      });
  }

  protected moveInParty(move: PartyMove): void {
    this.favorites.moveTo(move.id, move.index);
  }

  // Joins the party as its last member; if the party is full, the current
  // sixth member steps down to the box.
  protected sendToParty(id: number): void {
    this.favorites.moveTo(id, Math.min(this.party().length, PARTY_SIZE - 1));
  }

  protected trackByPokemonId(_index: number, entry: PokedexEntry): number {
    return entry.id;
  }
}

function pickRandom<T>(items: readonly T[], count: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
