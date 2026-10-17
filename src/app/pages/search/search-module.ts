import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing-module';
import { Search } from './search';
import { SearchBar } from './components/search-bar/search-bar';
import { TypeFilter } from './components/type-filter/type-filter';
import { GenerationFilter } from './components/generation-filter/generation-filter';
import { SearchCard } from './components/search-card/search-card';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [Search, SearchBar, TypeFilter, GenerationFilter, SearchCard],
  imports: [CommonModule, SearchRoutingModule, SharedModule],
})
export class SearchModule {}
