import { Pipe, PipeTransform } from '@angular/core';

// The single source of truth for Pokémon type → brand color. Any feature
// that renders a type badge or accent (home today; search/favorites once
// they have real data) reads from here instead of keeping its own copy.
const POKEMON_TYPE_COLORS: Readonly<Record<string, string>> = {
  normal: '#a8a878',
  fire: '#f08030',
  water: '#6890f0',
  electric: '#f8d030',
  grass: '#78c850',
  ice: '#98d8d8',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#e0c068',
  flying: '#a890f0',
  psychic: '#f85888',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0',
  fairy: '#ee99ac',
};

const FALLBACK_COLOR = POKEMON_TYPE_COLORS['normal'];

@Pipe({
  name: 'pokemonTypeColor',
  standalone: false,
})
export class PokemonTypeColorPipe implements PipeTransform {
  transform(type: string | null | undefined): string {
    if (!type) {
      return FALLBACK_COLOR;
    }
    return POKEMON_TYPE_COLORS[type.toLowerCase()] ?? FALLBACK_COLOR;
  }
}
