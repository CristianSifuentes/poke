import { Component } from '@angular/core';

type BentoSize = 'hero' | 'wide' | 'tall' | 'regular';

interface DommiePokemon {
  id: number;
  name: string;
  nickname: string;
  image: string;
  types: string[];
  bento: BentoSize;
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
      types: ['electric'],
      bento: 'hero',
    },
    {
      id: 6,
      name: 'Charizard',
      nickname: 'Blaze',
      image: artwork(6),
      types: ['fire', 'flying'],
      bento: 'wide',
    },
    {
      id: 448,
      name: 'Lucario',
      nickname: 'Aura',
      image: artwork(448),
      types: ['fighting', 'steel'],
      bento: 'tall',
    },
    {
      id: 94,
      name: 'Gengar',
      nickname: 'Shadow',
      image: artwork(94),
      types: ['ghost', 'poison'],
      bento: 'regular',
    },
    {
      id: 197,
      name: 'Umbreon',
      nickname: 'Luna',
      image: artwork(197),
      types: ['dark'],
      bento: 'regular',
    },
    {
      id: 658,
      name: 'Greninja',
      nickname: 'Kunai',
      image: artwork(658),
      types: ['water', 'dark'],
      bento: 'regular',
    },
    {
      id: 282,
      name: 'Gardevoir',
      nickname: 'Aria',
      image: artwork(282),
      types: ['psychic', 'fairy'],
      bento: 'regular',
    },
    {
      id: 149,
      name: 'Dragonite',
      nickname: 'Rex',
      image: artwork(149),
      types: ['dragon', 'flying'],
      bento: 'wide',
    },
    {
      id: 1,
      name: 'Bulbasaur',
      nickname: 'Sprout',
      image: artwork(1),
      types: ['grass', 'poison'],
      bento: 'regular',
    },
    {
      id: 7,
      name: 'Squirtle',
      nickname: 'Puddle',
      image: artwork(7),
      types: ['water'],
      bento: 'regular',
    },
    {
      id: 133,
      name: 'Eevee',
      nickname: 'Clover',
      image: artwork(133),
      types: ['normal'],
      bento: 'regular',
    },
    {
      id: 143,
      name: 'Snorlax',
      nickname: 'Boulder',
      image: artwork(143),
      types: ['normal'],
      bento: 'tall',
    },
    {
      id: 150,
      name: 'Mewtwo',
      nickname: 'Genome',
      image: artwork(150),
      types: ['psychic'],
      bento: 'wide',
    },
    {
      id: 39,
      name: 'Jigglypuff',
      nickname: 'Melody',
      image: artwork(39),
      types: ['normal', 'fairy'],
      bento: 'regular',
    },
    {
      id: 65,
      name: 'Alakazam',
      nickname: 'Cipher',
      image: artwork(65),
      types: ['psychic'],
      bento: 'regular',
    },
    {
      id: 248,
      name: 'Tyranitar',
      nickname: 'Quake',
      image: artwork(248),
      types: ['rock', 'dark'],
      bento: 'regular',
    },
  ];

  trackByPokemonId(_index: number, pokemon: DommiePokemon): number {
    return pokemon.id;
  }
}
