import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokedexId',
  standalone: false,
})
export class PokedexIdPipe implements PipeTransform {
  transform(id: number | null | undefined, digits = 3): string {
    if (id == null) {
      return '';
    }
    return `#${id.toString().padStart(digits, '0')}`;
  }
}
