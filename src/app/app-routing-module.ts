import { NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  Routes,
  TitleStrategy,
  ViewTransitionInfo,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { PokeTitleStrategy } from './core/routing/poke-title-strategy';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    title: 'Home',
    loadChildren: () => import('./pages/home/home-module').then((m) => m.HomeModule)
  },
  {
    path: 'search',
    title: 'Pokédex',
    loadChildren: () => import('./pages/search/search-module').then((m) => m.SearchModule)
  },
  {
    // The detail page titles itself ("Pikachu #025") once its data is in.
    path: 'pokemon/:id',
    loadChildren: () => import('./pages/pokemon/pokemon-module').then((m) => m.PokemonModule)
  },
  {
    path: 'about',
    title: 'About',
    loadChildren: () => import('./pages/about/about-module').then((m) => m.AboutModule)
  },
  {
    path: 'favorites',
    title: 'Your party',
    loadChildren: () => import('./pages/favorites/favorites-module').then((m) => m.FavoritesModule)
  },
  {
    // wildcard MUST stay last — it matches any path and would otherwise
    // shadow every route declared above it
    path: '**',
    title: 'Not found',
    loadChildren: () => import('./pages/not-found/not-found-module').then((m) => m.NotFoundModule)
  }
];

// "/search" for /search?types=fire, "/pokemon/25" for /pokemon/25.
function routePath(root: ActivatedRouteSnapshot): string {
  const segments: string[] = [];
  for (let route: ActivatedRouteSnapshot | null = root; route; route = route.firstChild) {
    segments.push(...route.url.map((segment) => segment.path));
  }
  return '/' + segments.join('/');
}

// Only real page changes animate. Refining a search rewrites the query
// string several times a second; cross-fading the page for each would
// make it flicker.
function skipSamePageTransitions({ transition, from, to }: ViewTransitionInfo): void {
  if (routePath(from) === routePath(to)) {
    transition.skipTransition();
  }
}

@NgModule({
  // RouterModule (directives) plus provideRouter (configuration): the
  // functional features below — view transitions with a skip hook — have no
  // forRoot() equivalent.
  exports: [RouterModule],
  providers: [
    provideRouter(
      routes,
      // Back/forward returns to where you were; a new page starts at the
      // top. Filter changes on /search opt out per navigation.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      // Cross-fades between pages, and lets a Pokémon's artwork morph from
      // card to detail page — where the browser supports it.
      withViewTransitions({ skipInitialTransition: true, onViewTransitionCreated: skipSamePageTransitions }),
      withComponentInputBinding(),
    ),
    { provide: TitleStrategy, useClass: PokeTitleStrategy },
  ],
})
export class AppRoutingModule {}
