import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { PokedexEntry } from '../../../../core/models/pokedex-entry';
import { PARTY_SIZE, PartyMove, readDraggedId, writeDraggedId } from '../../favorites-model';

// The six-slot party: one lead cell and five members, plus dashed empty
// slots that double as drop targets. Reordering works three ways — native
// drag & drop (mouse), the arrow buttons on each card (keyboard, touch),
// and dropping a Box card straight onto a slot.
@Component({
  selector: 'app-party-grid',
  standalone: false,
  templateUrl: './party-grid.html',
  styleUrl: './party-grid.scss',
})
export class PartyGrid {
  protected members: PokedexEntry[] = [];
  protected emptySlots: number[] = [];

  @Input({ required: true }) set party(party: PokedexEntry[]) {
    this.members = party;
    this.emptySlots = Array.from({ length: PARTY_SIZE - party.length }, (_, i) => party.length + i);
  }

  @Output() readonly move = new EventEmitter<PartyMove>();

  protected readonly draggingId = signal<number | null>(null);
  protected readonly dropIndex = signal<number | null>(null);

  protected onDragStart(event: DragEvent, id: number): void {
    writeDraggedId(event, id);
    this.draggingId.set(id);
  }

  protected onDragEnd(): void {
    this.draggingId.set(null);
    this.dropIndex.set(null);
  }

  protected onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dropIndex.set(index);
  }

  // dragleave also fires when the pointer crosses into a child element;
  // only clear the highlight once it has really left the slot.
  protected onDragLeave(event: DragEvent, index: number): void {
    const slot = event.currentTarget as HTMLElement;
    if (!slot.contains(event.relatedTarget as Node | null) && this.dropIndex() === index) {
      this.dropIndex.set(null);
    }
  }

  protected onDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    const id = readDraggedId(event);
    this.onDragEnd();
    if (id !== null) {
      this.move.emit({ id, index });
    }
  }

  protected trackByPokemonId(_index: number, entry: PokedexEntry): number {
    return entry.id;
  }
}
