import { Component, Input } from '@angular/core';

import { PokedexEntry } from '../../../../core/models/pokedex-entry';

@Component({
  selector: 'app-party-card',
  standalone: false,
  templateUrl: './party-card.html',
  styleUrl: './party-card.scss',
})
export class PartyCard {
  @Input({ required: true }) pokemon!: PokedexEntry;
  // Zero-based position in the party; slot 0 is the lead.
  @Input() slot = 0;
}
