import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input() canMoveEarlier = false;
  @Input() canMoveLater = false;
  // -1 = one slot earlier, 1 = one slot later.
  @Output() readonly move = new EventEmitter<-1 | 1>();
}
