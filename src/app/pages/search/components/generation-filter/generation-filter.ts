import { Component, EventEmitter, Input, Output } from '@angular/core';

import { POKEMON_GENERATIONS } from '../../../../shared/utils/pokemon-generations';

@Component({
  selector: 'app-generation-filter',
  standalone: false,
  templateUrl: './generation-filter.html',
  styleUrl: './generation-filter.scss',
})
export class GenerationFilter {
  @Input() selected: number | null = null;
  // Keyed by generation id; key 0 holds the total across all generations.
  @Input() counts: Record<number, number> = {};
  @Input() disabled = false;
  @Output() readonly generationChange = new EventEmitter<number | null>();

  protected readonly generations = POKEMON_GENERATIONS;
}
