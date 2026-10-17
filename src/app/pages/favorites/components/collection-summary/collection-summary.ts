import { Component, Input } from '@angular/core';

import { PokedexEntry } from '../../../../core/models/pokedex-entry';
import { POKEMON_GENERATIONS, PokemonGeneration } from '../../../../shared/utils/pokemon-generations';
import { POKEMON_TYPE_COLORS, resolvePokemonTypeColor } from '../../../../shared/utils/pokemon-type-colors';
import { TypeCount } from '../../favorites-model';

const LEGEND_SIZE = 4;

@Component({
  selector: 'app-collection-summary',
  standalone: false,
  templateUrl: './collection-summary.html',
  styleUrl: './collection-summary.scss',
})
export class CollectionSummary {
  protected total = 0;
  protected typesCovered = 0;
  protected readonly typeTotal = Object.keys(POKEMON_TYPE_COLORS).length;
  protected legend: TypeCount[] = [];
  protected topRegion?: PokemonGeneration;
  // The collection's "type wheel": a conic gradient with one arc per type,
  // each sized by how often that type appears across the collection.
  protected wheel = '';

  // Recomputed only when the list reference changes — the parent passes a
  // computed() signal's value, so that's exactly when favorites change.
  @Input({ required: true }) set pokemon(list: PokedexEntry[]) {
    const counts = new Map<string, number>();
    const generations = new Map<number, number>();
    for (const entry of list) {
      entry.types.forEach((type) => counts.set(type, (counts.get(type) ?? 0) + 1));
      generations.set(entry.generation, (generations.get(entry.generation) ?? 0) + 1);
    }

    const distribution = [...counts]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
    const occurrences = distribution.reduce((sum, item) => sum + item.count, 0);

    let start = 0;
    const arcs = distribution.map(({ type, count }) => {
      const end = start + (count / occurrences) * 100;
      const arc = `${resolvePokemonTypeColor(type)} ${start}% ${end}%`;
      start = end;
      return arc;
    });

    const [topGeneration] = [...generations].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0] ?? [];

    this.total = list.length;
    this.typesCovered = distribution.length;
    this.legend = distribution.slice(0, LEGEND_SIZE);
    this.topRegion = POKEMON_GENERATIONS.find((gen) => gen.id === topGeneration);
    this.wheel = arcs.length ? `conic-gradient(from -90deg, ${arcs.join(', ')})` : '';
  }
}
