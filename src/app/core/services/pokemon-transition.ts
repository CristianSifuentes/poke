import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

// Which Pokémon's artwork should morph across the next route change.
// Only one element per page may carry a given view-transition-name, so
// cards opt in only for the Pokémon that was just opened (or is being
// returned to); the detail page's artwork always carries it.
@Injectable({ providedIn: 'root' })
export class PokemonTransition {
  readonly activeId = signal<number | null>(null);

  constructor() {
    // Once back on a list page and the transition has played, let the card
    // go — otherwise the same Pokémon on the *next* page (Home after
    // Search, say) would morph across too.
    inject(Router)
      .events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (!event.urlAfterRedirects.startsWith('/pokemon/')) {
          setTimeout(() => this.activeId.set(null), 1000);
        }
      });
  }

  mark(id: number | null): void {
    this.activeId.set(id);
  }
}

export const POKEMON_ART_TRANSITION = 'pokemon-art';
