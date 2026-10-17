import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritesRoutingModule } from './favorites-routing-module';
import { Favorites } from './favorites';
import { CollectionSummary } from './components/collection-summary/collection-summary';
import { PartyGrid } from './components/party-grid/party-grid';
import { PartyCard } from './components/party-card/party-card';
import { BoxCard } from './components/box-card/box-card';
import { BoxFilters } from './components/box-filters/box-filters';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [Favorites, CollectionSummary, PartyGrid, PartyCard, BoxCard, BoxFilters],
  imports: [CommonModule, FavoritesRoutingModule, SharedModule],
})
export class FavoritesModule {}
