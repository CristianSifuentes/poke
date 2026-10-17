import { Component, Input } from '@angular/core';

import { PokemonGeneration } from '../../../../shared/utils/pokemon-generations';

// "Where next?" — into /search, pre-filtered by this Pokémon's types and
// by its home region.
@Component({
  selector: 'app-explore-links',
  standalone: false,
  templateUrl: './explore-links.html',
  styleUrl: './explore-links.scss',
})
export class ExploreLinks {
  @Input() types: string[] = [];
  @Input() generation: PokemonGeneration | null = null;
}
