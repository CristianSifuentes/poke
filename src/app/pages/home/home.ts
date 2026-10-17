import { Component } from '@angular/core';

import { BentoSize, HomeCardPokemon } from './components/home-card/home-card';

interface DommiePokemon extends HomeCardPokemon {
  nickname: string;
  bento: BentoSize;
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
      types: ['electric'],
      bento: 'hero',
    },
    {
      id: 6,
      name: 'Charizard',
      nickname: 'Blaze',
      types: ['fire', 'flying'],
      bento: 'wide',
    },
    {
      id: 448,
      name: 'Lucario',
      nickname: 'Aura',
      types: ['fighting', 'steel'],
      bento: 'tall',
    },
    {
      id: 94,
      name: 'Gengar',
      nickname: 'Shadow',
      types: ['ghost', 'poison'],
      bento: 'regular',
    },
    {
      id: 197,
      name: 'Umbreon',
      nickname: 'Luna',
      types: ['dark'],
      bento: 'regular',
    },
    {
      id: 658,
      name: 'Greninja',
      nickname: 'Kunai',
      types: ['water', 'dark'],
      bento: 'regular',
    },
    {
      id: 282,
      name: 'Gardevoir',
      nickname: 'Aria',
      types: ['psychic', 'fairy'],
      bento: 'regular',
    },
    {
      id: 149,
      name: 'Dragonite',
      nickname: 'Rex',
      types: ['dragon', 'flying'],
      bento: 'wide',
    },
    {
      id: 1,
      name: 'Bulbasaur',
      nickname: 'Sprout',
      types: ['grass', 'poison'],
      bento: 'regular',
    },
    {
      id: 7,
      name: 'Squirtle',
      nickname: 'Puddle',
      types: ['water'],
      bento: 'regular',
    },
    {
      id: 133,
      name: 'Eevee',
      nickname: 'Clover',
      types: ['normal'],
      bento: 'regular',
    },
    {
      id: 143,
      name: 'Snorlax',
      nickname: 'Boulder',
      types: ['normal'],
      bento: 'tall',
    },
    {
      id: 150,
      name: 'Mewtwo',
      nickname: 'Genome',
      types: ['psychic'],
      bento: 'wide',
    },
    {
      id: 39,
      name: 'Jigglypuff',
      nickname: 'Melody',
      types: ['normal', 'fairy'],
      bento: 'regular',
    },
    {
      id: 65,
      name: 'Alakazam',
      nickname: 'Cipher',
      types: ['psychic'],
      bento: 'regular',
    },
    {
      id: 248,
      name: 'Tyranitar',
      nickname: 'Quake',
      types: ['rock', 'dark'],
      bento: 'regular',
    },
  ];

  trackByPokemonId(_index: number, pokemon: DommiePokemon): number {
    return pokemon.id;
  }
}
