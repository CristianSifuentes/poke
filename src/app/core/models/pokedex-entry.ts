export interface PokedexEntry {
  id: number;
  // PokeAPI species slug ("mr-mime") — rendered through the pokemonName pipe.
  name: string;
  // Ordered by slot: types[0] is always the primary type.
  types: string[];
  generation: number;
}
