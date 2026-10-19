import { Component, EventEmitter, Input, Output } from '@angular/core';

import { POKEMON_TYPE_COLORS } from '../../../../shared/utils/pokemon-type-colors';

@Component({
  selector: 'app-type-filter',
  standalone: false,
  templateUrl: './type-filter.html',
  styleUrl: './type-filter.scss',
})
export class TypeFilter {
  @Input() selected: string[] = [];
  @Input() counts: Partial<Record<string, number>> = {};
  @Input() disabled = false;
  @Output() readonly typeToggle = new EventEmitter<string>();

  protected readonly types = Object.keys(POKEMON_TYPE_COLORS);
}
