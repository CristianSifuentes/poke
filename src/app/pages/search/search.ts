import { Component, DestroyRef, computed, inject, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, skip } from 'rxjs';

import { PokedexEntry } from '../../core/models/pokedex-entry';
import { PokedexService } from '../../core/services/pokedex-service';
import { NATIONAL_DEX_SIZE, POKEMON_GENERATIONS } from '../../shared/utils/pokemon-generations';
import { POKEMON_TYPE_COLORS, resolvePokemonTypeColor } from '../../shared/utils/pokemon-type-colors';

export type SearchSort = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';
type LoadStatus = 'loading' | 'ready' | 'error';

const PAGE_SIZE = 36;
const MAX_TYPES = 2; // no Pokémon has more than two types
const SORTS: readonly SearchSort[] = ['id-asc', 'id-desc', 'name-asc', 'name-desc'];

// "Mr. Mime", "mr mime" and "mr-mime" all collapse to "mrmime".
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]/g, '');
}

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private readonly pokedex = inject(PokedexService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sortOptions: readonly { value: SearchSort; label: string }[] = [
    { value: 'id-asc', label: 'No. ↑' },
    { value: 'id-desc', label: 'No. ↓' },
    { value: 'name-asc', label: 'A–Z' },
    { value: 'name-desc', label: 'Z–A' },
  ];
  protected readonly generations = POKEMON_GENERATIONS;
  protected readonly dexSize = NATIONAL_DEX_SIZE;
  protected readonly pageSize = PAGE_SIZE;
  protected readonly skeletons = Array.from({ length: 12 }, (_, i) => i);

  // Filter state starts from the URL, so a filtered view can be shared or
  // bookmarked, and is written back to it (debounced) as it changes.
  protected readonly query = signal('');
  protected readonly types = signal<string[]>([]);
  protected readonly generation = signal<number | null>(null);
  protected readonly sort = signal<SearchSort>('id-asc');

  protected readonly status = signal<LoadStatus>('loading');
  private readonly entries = signal<PokedexEntry[]>([]);

  // Everything matching the query and generation, before types narrow it —
  // the shared base for the result list and for each type's facet count.
  private readonly matchingQueryAndGeneration = computed(() => {
    const generation = this.generation();
    const matches = this.queryMatcher();
    return this.entries().filter(
      (entry) => (generation === null || entry.generation === generation) && matches(entry),
    );
  });

  protected readonly results = computed(() => {
    const types = this.types();
    const sort = this.sort();
    const filtered = this.matchingQueryAndGeneration().filter((entry) =>
      types.every((type) => entry.types.includes(type)),
    );
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'id-desc':
          return b.id - a.id;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return a.id - b.id;
      }
    });
  });

  // Resets to the first page whenever the result set itself changes.
  private readonly renderLimit = linkedSignal({
    source: this.results,
    computation: () => PAGE_SIZE,
  });

  protected readonly visibleResults = computed(() => this.results().slice(0, this.renderLimit()));
  protected readonly hasMore = computed(() => this.renderLimit() < this.results().length);

  // How many results each type chip would leave you with if you tapped it.
  // A chip at 0 is disabled — it can only ever lead to an empty page.
  protected readonly typeCounts = computed(() => {
    const selected = this.types();
    const base = this.matchingQueryAndGeneration();
    const counts: Record<string, number> = {};
    for (const type of Object.keys(POKEMON_TYPE_COLORS)) {
      const wanted = selected.includes(type) ? selected : [...selected, type];
      counts[type] = base.filter((entry) => wanted.every((t) => entry.types.includes(t))).length;
    }
    return counts;
  });

  protected readonly generationCounts = computed(() => {
    const types = this.types();
    const matches = this.queryMatcher();
    const counts: Record<number, number> = { 0: 0 };
    for (const entry of this.entries()) {
      if (matches(entry) && types.every((type) => entry.types.includes(type))) {
        counts[entry.generation] = (counts[entry.generation] ?? 0) + 1;
        counts[0]++;
      }
    }
    return counts;
  });

  protected readonly selectedGeneration = computed(() =>
    this.generations.find((gen) => gen.id === this.generation()),
  );

  protected readonly hasActiveFilters = computed(
    () => !!this.query().trim() || this.types().length > 0 || this.generation() !== null,
  );

  // The search bar's focus tint: the first selected type's color, or the
  // brand red when no type is chosen.
  protected readonly glowA = computed(() =>
    this.types()[0] ? resolvePokemonTypeColor(this.types()[0]) : 'var(--poke-red)',
  );

  private readonly queryMatcher = computed(() => {
    const raw = this.query().trim();
    if (!raw) {
      return (_entry: PokedexEntry) => true;
    }
    const digits = raw.replace(/^#/, '');
    if (/^\d+$/.test(digits)) {
      const id = Number(digits);
      return (entry: PokedexEntry) =>
        entry.id === id || entry.id.toString().padStart(3, '0').startsWith(digits);
    }
    const needle = normalize(raw);
    return (entry: PokedexEntry) => normalize(entry.name).includes(needle);
  });

  constructor() {
    this.restoreFromUrl();
    this.load();

    toObservable(computed(() => [this.query(), this.types(), this.generation(), this.sort()] as const))
      .pipe(skip(1), debounceTime(250), takeUntilDestroyed())
      .subscribe(([query, types, generation, sort]) => {
        this.router.navigate([], {
          relativeTo: this.route,
          replaceUrl: true,
          // Refining a search isn't a new page: stay where you are.
          scroll: 'manual',
          queryParams: {
            q: query.trim() || null,
            types: types.join(',') || null,
            gen: generation,
            sort: sort === 'id-asc' ? null : sort,
          },
        });
      });
  }

  protected load(): void {
    this.status.set('loading');
    this.pokedex
      .loadIndex()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (entries) => {
          this.entries.set(entries);
          this.status.set('ready');
        },
        error: () => this.status.set('error'),
      });
  }

  protected toggleType(type: string): void {
    this.types.update((types) => {
      if (types.includes(type)) {
        return types.filter((t) => t !== type);
      }
      return types.length < MAX_TYPES ? [...types, type] : types;
    });
  }

  protected removeType(type: string): void {
    this.types.update((types) => types.filter((t) => t !== type));
  }

  protected clearAll(): void {
    this.query.set('');
    this.types.set([]);
    this.generation.set(null);
  }

  protected showMore(): void {
    this.renderLimit.update((limit) => limit + PAGE_SIZE);
  }

  protected trackByPokemonId(_index: number, entry: PokedexEntry): number {
    return entry.id;
  }

  private restoreFromUrl(): void {
    const params = this.route.snapshot.queryParamMap;
    this.query.set(params.get('q') ?? '');

    const types = (params.get('types') ?? '')
      .split(',')
      .map((type) => type.trim().toLowerCase())
      .filter((type) => type in POKEMON_TYPE_COLORS);
    this.types.set([...new Set(types)].slice(0, MAX_TYPES));

    const generation = Number(params.get('gen'));
    this.generation.set(this.generations.some((gen) => gen.id === generation) ? generation : null);

    const sort = params.get('sort') as SearchSort | null;
    this.sort.set(sort && SORTS.includes(sort) ? sort : 'id-asc');
  }
}
