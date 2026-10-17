import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, shareReplay } from 'rxjs';

import { PokedexEntry } from '../models/pokedex-entry';
import { NATIONAL_DEX_SIZE, resolvePokemonGeneration } from '../../shared/utils/pokemon-generations';
import { POKEMON_TYPE_COLORS } from '../../shared/utils/pokemon-type-colors';

const POKE_API = 'https://pokeapi.co/api/v2';

interface NamedResource {
  name: string;
  url: string;
}

interface SpeciesListResponse {
  results: NamedResource[];
}

interface TypeResponse {
  pokemon: { slot: number; pokemon: NamedResource }[];
}

function idFromUrl(url: string): number {
  return Number(url.split('/').filter(Boolean).pop());
}

// The whole National Pokédex, indexed once per session. 1 species list +
// 18 type lists (19 small requests) is all it takes to search and filter
// every Pokémon client-side by name, number, type and generation — instead
// of 1,025 per-Pokémon detail requests. Artwork still comes straight from
// the jsDelivr sprite mirror by id, same as the home page.
@Injectable({ providedIn: 'root' })
export class PokedexService {
  private readonly http = inject(HttpClient);

  // shareReplay keeps the index for every later subscriber (leaving and
  // re-entering /search costs nothing); a failed load isn't cached, so a
  // retry simply subscribes again.
  private readonly index$ = forkJoin({
    species: this.http.get<SpeciesListResponse>(`${POKE_API}/pokemon-species`, {
      params: { limit: NATIONAL_DEX_SIZE },
    }),
    types: forkJoin(
      Object.keys(POKEMON_TYPE_COLORS).map((type) =>
        this.http
          .get<TypeResponse>(`${POKE_API}/type/${type}`)
          .pipe(map((response) => ({ type, members: response.pokemon }))),
      ),
    ),
  }).pipe(
    map(({ species, types }) => {
      const typesById = new Map<number, string[]>();
      for (const { type, members } of types) {
        for (const { slot, pokemon } of members) {
          const id = idFromUrl(pokemon.url);
          if (id > NATIONAL_DEX_SIZE) {
            continue; // alternate forms (megas, regionals…) live at ids 10001+
          }
          const slots = typesById.get(id) ?? [];
          slots[slot - 1] = type;
          typesById.set(id, slots);
        }
      }

      return species.results
        .map(({ name, url }): PokedexEntry => {
          const id = idFromUrl(url);
          return {
            id,
            name,
            types: (typesById.get(id) ?? []).filter(Boolean),
            generation: resolvePokemonGeneration(id),
          };
        })
        .sort((a, b) => a.id - b.id);
    }),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  loadIndex(): Observable<PokedexEntry[]> {
    return this.index$;
  }
}
