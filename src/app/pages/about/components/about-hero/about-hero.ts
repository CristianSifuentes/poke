import { Component } from '@angular/core';

import { POKEMON_TYPE_COLORS } from '../../../../shared/utils/pokemon-type-colors';

@Component({
  selector: 'app-about-hero',
  standalone: false,
  templateUrl: './about-hero.html',
  styleUrl: './about-hero.scss',
})
export class AboutHero {
  // All 18 type colors as one continuous ring — the app's whole palette in
  // the top half of a Poké Ball.
  protected readonly typeRing = `conic-gradient(${[
    ...Object.values(POKEMON_TYPE_COLORS),
    Object.values(POKEMON_TYPE_COLORS)[0],
  ].join(', ')})`;
}
