import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing-module';
import { Search } from './search';

@NgModule({
  declarations: [Search],
  imports: [CommonModule, SearchRoutingModule],
})
export class SearchModule {}
