import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home-module').then((m) => m.HomeModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search-module').then((m) => m.SearchModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about-module').then((m) => m.AboutModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./pages/favorites/favorites-module').then((m) => m.FavoritesModule)
  },
  {
    // wildcard MUST stay last — it matches any path and would otherwise
    // shadow every route declared above it
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
