import { Component, Input } from '@angular/core';

import { PokedexEntry } from '../../../../core/models/pokedex-entry';

@Component({
  selector: 'app-search-card',
  standalone: false,
  templateUrl: './search-card.html',
  styleUrl: './search-card.scss',
})
export class SearchCard {
  @Input({ required: true }) pokemon!: PokedexEntry;
  // Entrance stagger in ms, so a fresh page of results ripples in.
  @Input() delay = 0;
}
