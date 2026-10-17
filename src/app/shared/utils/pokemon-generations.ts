export interface PokemonGeneration {
  id: number;
  numeral: string;
  region: string;
  firstId: number;
  lastId: number;
}

// National Pokédex ranges per generation. Ids are contiguous by design, so
// "which generation is #448?" is a range lookup — no extra API call needed.
export const POKEMON_GENERATIONS: readonly PokemonGeneration[] = [
  { id: 1, numeral: 'I', region: 'Kanto', firstId: 1, lastId: 151 },
  { id: 2, numeral: 'II', region: 'Johto', firstId: 152, lastId: 251 },
  { id: 3, numeral: 'III', region: 'Hoenn', firstId: 252, lastId: 386 },
  { id: 4, numeral: 'IV', region: 'Sinnoh', firstId: 387, lastId: 493 },
  { id: 5, numeral: 'V', region: 'Unova', firstId: 494, lastId: 649 },
  { id: 6, numeral: 'VI', region: 'Kalos', firstId: 650, lastId: 721 },
  { id: 7, numeral: 'VII', region: 'Alola', firstId: 722, lastId: 809 },
  { id: 8, numeral: 'VIII', region: 'Galar', firstId: 810, lastId: 905 },
  { id: 9, numeral: 'IX', region: 'Paldea', firstId: 906, lastId: 1025 },
];

export const NATIONAL_DEX_SIZE = POKEMON_GENERATIONS[POKEMON_GENERATIONS.length - 1].lastId;

export function resolvePokemonGeneration(id: number): number {
  return POKEMON_GENERATIONS.find((gen) => id >= gen.firstId && id <= gen.lastId)?.id ?? 0;
}
