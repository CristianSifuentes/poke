import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PokedexEntry } from '../../core/models/pokedex-entry';
import { FavoritesStore } from '../../core/services/favorites-store';
import { PokedexService } from '../../core/services/pokedex-service';
import { PokemonNamePipe } from '../../shared/pipes/pokemon-name-pipe';
import { NATIONAL_DEX_SIZE } from '../../shared/utils/pokemon-generations';

import { BentoSize, HomeCardPokemon } from './components/home-card/home-card';

interface DommiePokemon extends HomeCardPokemon {
  nickname: string;
  bento: BentoSize;
}

interface PartyTile {
  pokemon: HomeCardPokemon;
  bento: BentoSize;
}

// Bento shapes per party size, chosen so every size tiles the 4-column
// grid without holes — a full party leads and closes with a hero cell.
const PARTY_LAYOUTS: Readonly<Record<number, BentoSize[]>> = {
  1: ['wide'],
  2: ['wide', 'wide'],
  3: ['hero', 'wide', 'wide'],
  4: ['wide', 'wide', 'wide', 'wide'],
  5: ['hero', 'regular', 'regular', 'wide', 'wide'],
  6: ['hero', 'wide', 'wide', 'regular', 'regular', 'hero'],
};

const PARTY_SIZE = 6;
const displayName = new PokemonNamePipe();

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly favorites = inject(FavoritesStore);

  readonly trainerName = 'Dommie';
  protected readonly dexSize = NATIONAL_DEX_SIZE;

  private readonly entriesById = signal(new Map<number, PokedexEntry>());

  // The visitor's own party (first six favorites), once the index can
  // name them. Empty until then — Dommie's team carries the page alone.
  protected readonly party = computed<PartyTile[]>(() => {
    const byId = this.entriesById();
    const members = this.favorites
      .ids()
      .slice(0, PARTY_SIZE)
      .map((id) => byId.get(id))
      .filter((entry): entry is PokedexEntry => !!entry);
    const layout = PARTY_LAYOUTS[members.length] ?? [];
    return members.map((entry, i) => ({
      pokemon: { id: entry.id, name: displayName.transform(entry.name), types: entry.types },
      bento: layout[i] ?? 'regular',
    }));
  });

  constructor() {
    // Only worth fetching the index if there's a party to show.
    if (this.favorites.count()) {
      inject(PokedexService)
        .loadIndex()
        .pipe(takeUntilDestroyed())
        .subscribe((entries) => this.entriesById.set(new Map(entries.map((e) => [e.id, e]))));
    }
  }

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

  protected trackByTile(_index: number, tile: PartyTile): number {
    return tile.pokemon.id;
  }
}
