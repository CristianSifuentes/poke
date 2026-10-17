import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PokemonPage } from './pokemon-page';
import { StatBars } from './components/stat-bars/stat-bars';
import { PokemonPager } from './components/pokemon-pager/pokemon-pager';
import { ExploreLinks } from './components/explore-links/explore-links';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [PokemonPage, StatBars, PokemonPager, ExploreLinks],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: PokemonPage, data: { pageOwnsTitle: true } }]),
    SharedModule,
  ],
})
export class PokemonModule {}
