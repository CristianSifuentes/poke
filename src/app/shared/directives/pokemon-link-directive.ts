import { Directive, HostBinding, HostListener, Input, inject } from '@angular/core';

import { POKEMON_ART_TRANSITION, PokemonTransition } from '../../core/services/pokemon-transition';

// Put on a link to a Pokémon's detail page (alongside its routerLink):
// remembers which Pokémon is being opened, so its artwork can carry the
// shared view-transition-name into the detail page.
@Directive({
  selector: 'a[appPokemonLink]',
  standalone: false,
})
export class PokemonLinkDirective {
  private readonly transition = inject(PokemonTransition);

  @Input({ alias: 'appPokemonLink', required: true }) pokemonId!: number;

  @HostListener('click')
  onClick(): void {
    this.transition.mark(this.pokemonId);
  }
}

// Put on a card's artwork: claims the shared view-transition-name while
// its Pokémon is the one being opened or returned to.
@Directive({
  selector: 'img[appArtTransition]',
  standalone: false,
})
export class ArtTransitionDirective {
  private readonly transition = inject(PokemonTransition);

  @Input({ alias: 'appArtTransition', required: true }) pokemonId!: number;

  @HostBinding('style.view-transition-name')
  get name(): string | null {
    return this.transition.activeId() === this.pokemonId ? POKEMON_ART_TRANSITION : null;
  }
}
