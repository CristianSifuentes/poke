import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }, {
    
    path: 'home',
    //dynamic import for javascript
    loadChildren: () => import('./pages/home/home-routing-module').then((m) => m.HomeRoutingModule)
    // ,
    // children: [
    //   {
    //     path: 'detail',
    //     component: 
    //     HomeDetail
    //   }
    // ]
  }, { 
     path: 'search',
     loadChildren: () => import('./pages/search/search-module').then((m) => m.SearchModule)
  }, { 
     path: 'about',
     loadChildren: () => import('./pages/about/about-module').then((m) => m.AboutModule)
  }, { 
     path: 'favorites',
     loadChildren: () => import('./pages/favorites/favorites-module').then((m) => m.FavoritesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
