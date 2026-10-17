import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PokedexEntry } from '../../../../core/models/pokedex-entry';
import { writeDraggedId } from '../../favorites-model';

// A compact PC-box tile. Draggable onto any party slot, with an explicit
// "send to party" button for keyboard and touch users.
@Component({
  selector: 'app-box-card',
  standalone: false,
  templateUrl: './box-card.html',
  styleUrl: './box-card.scss',
})
export class BoxCard {
  @Input({ required: true }) pokemon!: PokedexEntry;
  @Input() delay = 0;
  @Input() draggable = true;
  @Input() showPartyAction = true;
  @Output() readonly toParty = new EventEmitter<number>();

  protected onDragStart(event: DragEvent): void {
    writeDraggedId(event, this.pokemon.id);
  }
}
