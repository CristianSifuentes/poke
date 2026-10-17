import { Pipe, PipeTransform } from '@angular/core';

import { pokemonArtwork } from '../utils/pokemon-artwork';

@Pipe({
  name: 'pokemonArtwork',
  standalone: false,
})
export class PokemonArtworkPipe implements PipeTransform {
  transform(id: number): string {
    return pokemonArtwork(id);
  }
}
