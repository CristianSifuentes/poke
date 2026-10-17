export interface PokemonStat {
  // PokeAPI stat slug: hp, attack, defense, special-attack, special-defense, speed.
  name: string;
  value: number;
}

export interface PokemonAbility {
  name: string;
  hidden: boolean;
}

// What the detail page knows beyond the index entry — one /pokemon and
// one /pokemon-species request, fetched only when a detail page is opened.
export interface PokemonDetail {
  id: number;
  // In meters and kilograms (PokeAPI reports decimeters and hectograms).
  height: number;
  weight: number;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  genus: string;
  flavorText: string;
  legendary: boolean;
  mythical: boolean;
}
