import { Component, Input } from '@angular/core';

import { PokemonStat } from '../../../../core/models/pokemon-detail';

// Base stats top out at 255 (Blissey's HP), so bars are drawn against that
// — the same ruler for every Pokémon, so pages can be compared by eye.
const STAT_CEILING = 255;

const STAT_LABELS: Readonly<Record<string, string>> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

interface StatRow {
  label: string;
  value: number;
  share: number;
}

@Component({
  selector: 'app-stat-bars',
  standalone: false,
  templateUrl: './stat-bars.html',
  styleUrl: './stat-bars.scss',
})
export class StatBars {
  protected rows: StatRow[] = [];
  protected total = 0;

  @Input({ required: true }) set stats(stats: PokemonStat[]) {
    this.rows = stats.map(({ name, value }) => ({
      label: STAT_LABELS[name] ?? name,
      value,
      share: Math.min(value / STAT_CEILING, 1),
    }));
    this.total = stats.reduce((sum, stat) => sum + stat.value, 0);
  }
}
