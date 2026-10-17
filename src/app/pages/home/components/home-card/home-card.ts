import { Component, Input } from '@angular/core';

export type BentoSize = 'hero' | 'wide' | 'tall' | 'regular';

export interface HomeCardPokemon {
  id: number;
  name: string;
  nickname?: string;
  types: string[];
}

// One tile of the home bento mosaic. The grid decides where a tile sits and
// how many cells it spans (home.scss); the tile decides how its portrait
// and text arrange themselves inside that space (by `size`).
@Component({
  selector: 'app-home-card',
  standalone: false,
  templateUrl: './home-card.html',
  styleUrl: './home-card.scss',
})
export class HomeCard {
  @Input({ required: true }) pokemon!: HomeCardPokemon;
  @Input() size: BentoSize = 'regular';
  // Position in the mosaic — drives the entrance stagger and the
  // alternating left/right settle.
  @Input() index = 0;
}
