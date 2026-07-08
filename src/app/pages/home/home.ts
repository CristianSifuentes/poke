import { Component } from '@angular/core';

interface PokemonType {
  name: string;
  color: string;
}

type BentoSize = 'hero' | 'wide' | 'tall' | 'regular';

interface DommiePokemon {
  id: number;
  name: string;
  nickname: string;
  image: string;
  types: PokemonType[];
  bento: BentoSize;
}

const TYPE_COLORS: Record<string, string> = {
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

function pokemonTypes(...names: string[]): PokemonType[] {
  return names.map((name) => ({ name, color: TYPE_COLORS[name] }));
}

function artwork(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly trainerName = 'Dommie';

  readonly pokemons: DommiePokemon[] = [
    {
      id: 25,
      name: 'Pikachu',
      nickname: 'Sparky',
      image: artwork(25),
      types: pokemonTypes('electric'),
      bento: 'hero',
    },
    {
      id: 6,
      name: 'Charizard',
      nickname: 'Blaze',
      image: artwork(6),
      types: pokemonTypes('fire', 'flying'),
      bento: 'wide',
    },
    {
      id: 448,
      name: 'Lucario',
      nickname: 'Aura',
      image: artwork(448),
      types: pokemonTypes('fighting', 'steel'),
      bento: 'tall',
    },
    {
      id: 94,
      name: 'Gengar',
      nickname: 'Shadow',
      image: artwork(94),
      types: pokemonTypes('ghost', 'poison'),
      bento: 'regular',
    },
    {
      id: 197,
      name: 'Umbreon',
      nickname: 'Luna',
      image: artwork(197),
      types: pokemonTypes('dark'),
      bento: 'regular',
    },
    {
      id: 658,
      name: 'Greninja',
      nickname: 'Kunai',
      image: artwork(658),
      types: pokemonTypes('water', 'dark'),
      bento: 'regular',
    },
    {
      id: 282,
      name: 'Gardevoir',
      nickname: 'Aria',
      image: artwork(282),
      types: pokemonTypes('psychic', 'fairy'),
      bento: 'regular',
    },
    {
      id: 149,
      name: 'Dragonite',
      nickname: 'Rex',
      image: artwork(149),
      types: pokemonTypes('dragon', 'flying'),
      bento: 'wide',
    },
    {
      id: 1,
      name: 'Bulbasaur',
      nickname: 'Sprout',
      image: artwork(1),
      types: pokemonTypes('grass', 'poison'),
      bento: 'regular',
    },
    {
      id: 7,
      name: 'Squirtle',
      nickname: 'Puddle',
      image: artwork(7),
      types: pokemonTypes('water'),
      bento: 'regular',
    },
    {
      id: 133,
      name: 'Eevee',
      nickname: 'Clover',
      image: artwork(133),
      types: pokemonTypes('normal'),
      bento: 'regular',
    },
    {
      id: 143,
      name: 'Snorlax',
      nickname: 'Boulder',
      image: artwork(143),
      types: pokemonTypes('normal'),
      bento: 'tall',
    },
    {
      id: 150,
      name: 'Mewtwo',
      nickname: 'Genome',
      image: artwork(150),
      types: pokemonTypes('psychic'),
      bento: 'wide',
    },
    {
      id: 39,
      name: 'Jigglypuff',
      nickname: 'Melody',
      image: artwork(39),
      types: pokemonTypes('normal', 'fairy'),
      bento: 'regular',
    },
    {
      id: 65,
      name: 'Alakazam',
      nickname: 'Cipher',
      image: artwork(65),
      types: pokemonTypes('psychic'),
      bento: 'regular',
    },
    {
      id: 248,
      name: 'Tyranitar',
      nickname: 'Quake',
      image: artwork(248),
      types: pokemonTypes('rock', 'dark'),
      bento: 'regular',
    },
  ];

  trackByPokemonId(_index: number, pokemon: DommiePokemon): number {
    return pokemon.id;
  }

  paddedId(id: number): string {
    return id.toString().padStart(3, '0');
  }
}
