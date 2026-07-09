import { Pipe, PipeTransform } from '@angular/core';

import { resolvePokemonTypeColor } from '../utils/pokemon-type-colors';

@Pipe({
  name: 'pokemonTypeColor',
  standalone: false,
})
export class PokemonTypeColorPipe implements PipeTransform {
  transform(type: string | null | undefined): string {
    return resolvePokemonTypeColor(type);
  }
}
