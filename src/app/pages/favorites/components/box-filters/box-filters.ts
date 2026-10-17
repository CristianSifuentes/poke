import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BoxSort, TypeCount } from '../../favorites-model';

@Component({
  selector: 'app-box-filters',
  standalone: false,
  templateUrl: './box-filters.html',
  styleUrl: './box-filters.scss',
})
export class BoxFilters {
  // Only the types actually present in the box, most common first.
  @Input() types: TypeCount[] = [];
  @Input() selectedType: string | null = null;
  @Input() sort: BoxSort = 'recent';
  @Output() readonly typeChange = new EventEmitter<string | null>();
  @Output() readonly sortChange = new EventEmitter<BoxSort>();

  protected readonly sortOptions: readonly { value: BoxSort; label: string }[] = [
    { value: 'recent', label: 'Recent' },
    { value: 'id', label: 'No.' },
    { value: 'name', label: 'A–Z' },
  ];
}
