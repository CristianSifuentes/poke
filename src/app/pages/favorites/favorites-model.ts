import { PokedexEntry } from '../../core/models/pokedex-entry';

export const PARTY_SIZE = 6;

export type BoxSort = 'recent' | 'id' | 'name';

export interface TypeCount {
  type: string;
  count: number;
}

export interface PartyMove {
  id: number;
  index: number;
}

export interface CollectedPokemon {
  pokemon: PokedexEntry;
  addedAt: number;
}

// Drag payload type shared by party slots and box cards, so a box card can
// be dropped straight onto a party slot.
export const POKEMON_DRAG_TYPE = 'application/x-poke-id';

export function readDraggedId(event: DragEvent): number | null {
  const raw = event.dataTransfer?.getData(POKEMON_DRAG_TYPE) || event.dataTransfer?.getData('text/plain');
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function writeDraggedId(event: DragEvent, id: number): void {
  if (!event.dataTransfer) {
    return;
  }
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData(POKEMON_DRAG_TYPE, String(id));
  event.dataTransfer.setData('text/plain', String(id));
}
