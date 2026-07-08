import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritesRoutingModule } from './favorites-routing-module';
import { Favorites } from './favorites';

@NgModule({
  declarations: [Favorites],
  imports: [CommonModule, FavoritesRoutingModule],
})
export class FavoritesModule {}
