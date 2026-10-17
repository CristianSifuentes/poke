import { Component } from '@angular/core';

import { POKEMON_GENERATIONS, PokemonGeneration } from '../../../../shared/utils/pokemon-generations';
import { REGION_STARTERS } from '../../about-stats';

interface RegionStop extends PokemonGeneration {
  speciesCount: number;
  starterId: number;
}

// Static by design: generation ranges are contiguous, so species counts
// and starters come from POKEMON_GENERATIONS alone — the timeline renders
// instantly, even before (or without) the Pokédex index.
@Component({
  selector: 'app-region-timeline',
  standalone: false,
  templateUrl: './region-timeline.html',
  styleUrl: './region-timeline.scss',
})
export class RegionTimeline {
  protected readonly regions: RegionStop[] = POKEMON_GENERATIONS.map((gen) => ({
    ...gen,
    speciesCount: gen.lastId - gen.firstId + 1,
    starterId: REGION_STARTERS[gen.id] ?? gen.firstId,
  }));
}
