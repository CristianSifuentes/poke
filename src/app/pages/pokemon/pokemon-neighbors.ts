import { PokedexEntry } from '../../core/models/pokedex-entry';

export interface PokemonNeighbors {
  previous: PokedexEntry | null;
  next: PokedexEntry | null;
}

// The Pokémon on either side of `id` in National Pokédex order. The ends
// don't wrap: Bulbasaur has no previous, the last entry has no next.
export function findNeighbors(entries: readonly PokedexEntry[], id: number): PokemonNeighbors {
  const index = entries.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: entries[index - 1] ?? null,
    next: entries[index + 1] ?? null,
  };
}
