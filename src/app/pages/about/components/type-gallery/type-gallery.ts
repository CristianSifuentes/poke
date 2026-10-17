import { Component, Input } from '@angular/core';

import { POKEMON_TYPE_COLORS } from '../../../../shared/utils/pokemon-type-colors';
import { TypeStat } from '../../about-stats';

@Component({
  selector: 'app-type-gallery',
  standalone: false,
  templateUrl: './type-gallery.html',
  styleUrl: './type-gallery.scss',
})
export class TypeGallery {
  // Until the index loads, every swatch still renders — color and name are
  // static; only the count and the artwork wait for data.
  protected swatches: TypeStat[] = placeholderSwatches();

  @Input() set types(types: TypeStat[] | null) {
    this.swatches = types ?? placeholderSwatches();
  }

  protected trackByType(_index: number, stat: TypeStat): string {
    return stat.type;
  }
}

function placeholderSwatches(): TypeStat[] {
  return Object.keys(POKEMON_TYPE_COLORS).map((type) => ({ type, count: 0, representativeId: null }));
}
