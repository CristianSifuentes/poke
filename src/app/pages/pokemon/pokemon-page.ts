import { Component, HostListener, Input, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { PokedexEntry } from '../../core/models/pokedex-entry';
import { PokemonDetail } from '../../core/models/pokemon-detail';
import { PokedexService } from '../../core/services/pokedex-service';
import { POKEMON_ART_TRANSITION, PokemonTransition } from '../../core/services/pokemon-transition';
import { formatPageTitle } from '../../core/routing/poke-title-strategy';
import { PokedexIdPipe } from '../../shared/pipes/pokedex-id-pipe';
import { PokemonNamePipe } from '../../shared/pipes/pokemon-name-pipe';
import { POKEMON_GENERATIONS, NATIONAL_DEX_SIZE } from '../../shared/utils/pokemon-generations';
import { findNeighbors } from './pokemon-neighbors';

type DetailState =
  | { status: 'loading' }
  | { status: 'ready'; detail: PokemonDetail }
  | { status: 'error' }
  | { status: 'missing' };

const displayName = new PokemonNamePipe();
const displayId = new PokedexIdPipe();

@Component({
  selector: 'app-pokemon-page',
  standalone: false,
  templateUrl: './pokemon-page.html',
  styleUrl: './pokemon-page.scss',
})
export class PokemonPage {
  private readonly pokedex = inject(PokedexService);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly transition = inject(PokemonTransition);

  protected readonly artTransition = POKEMON_ART_TRANSITION;
  protected readonly pokemonId = signal(0);
  private readonly retries = signal(0);

  // Bound from the :id route param (bindToComponentInputs).
  @Input() set id(value: string) {
    const id = Number(value);
    this.pokemonId.set(Number.isInteger(id) && id >= 1 && id <= NATIONAL_DEX_SIZE ? id : 0);
    this.transition.mark(id);
  }

  private readonly entries = signal<PokedexEntry[] | null>(null);

  protected readonly entry = computed(() => this.entries()?.find((e) => e.id === this.pokemonId()) ?? null);
  protected readonly neighbors = computed(() => findNeighbors(this.entries() ?? [], this.pokemonId()));
  protected readonly generation = computed(() =>
    POKEMON_GENERATIONS.find((gen) => gen.id === this.entry()?.generation),
  );

  protected readonly state = signal<DetailState>({ status: 'loading' });
  protected readonly detail = computed(() => {
    const state = this.state();
    return state.status === 'ready' ? state.detail : null;
  });

  constructor() {
    this.pokedex
      .loadIndex()
      .pipe(takeUntilDestroyed())
      .subscribe({ next: (entries) => this.entries.set(entries), error: () => this.entries.set([]) });

    toObservable(computed(() => [this.pokemonId(), this.retries()] as const))
      .pipe(
        switchMap(([id]) =>
          id === 0
            ? of<DetailState>({ status: 'missing' })
            : this.pokedex.loadDetail(id).pipe(
                map((detail): DetailState => ({ status: 'ready', detail })),
                catchError(() => of<DetailState>({ status: 'error' })),
                startWith<DetailState>({ status: 'loading' }),
              ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((state) => this.state.set(state));

    effect(() => {
      const entry = this.entry();
      this.title.setTitle(
        formatPageTitle(entry ? `${displayName.transform(entry.name)} ${displayId.transform(entry.id)}` : 'Pokémon'),
      );
    });
  }

  protected retry(): void {
    this.retries.update((n) => n + 1);
  }

  // ← and → page through the Pokédex, unless the user is typing somewhere.
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
      return;
    }
    const { previous, next } = this.neighbors();
    const destination = event.key === 'ArrowLeft' ? previous : event.key === 'ArrowRight' ? next : null;
    if (destination) {
      event.preventDefault();
      this.transition.mark(destination.id);
      this.router.navigate(['/pokemon', destination.id]);
    }
  }
}
