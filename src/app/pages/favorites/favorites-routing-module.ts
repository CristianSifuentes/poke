import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Favorites } from './favorites';

const routes: Routes = [
  {
    path: 'favorites',
    component: Favorites
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritesRoutingModule {}
