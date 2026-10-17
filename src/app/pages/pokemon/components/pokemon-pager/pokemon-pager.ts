import { Component, Input } from '@angular/core';

import { PokedexEntry } from '../../../../core/models/pokedex-entry';

// Previous / next in National Pokédex order, each with a little portrait.
@Component({
  selector: 'app-pokemon-pager',
  standalone: false,
  templateUrl: './pokemon-pager.html',
  styleUrl: './pokemon-pager.scss',
})
export class PokemonPager {
  @Input() previous: PokedexEntry | null = null;
  @Input() next: PokedexEntry | null = null;
}
