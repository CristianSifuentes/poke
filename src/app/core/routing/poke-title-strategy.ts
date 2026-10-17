import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const APP_NAME = 'Poké';

// "Search · Poké", "Pikachu #025 · Poké" — page first, so a row of tabs
// stays tellable-apart; the bare app name only where a route has no title.
@Injectable()
export class PokeTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    // A page that knows a better title than its route (the detail page,
    // once it knows which Pokémon it shows) sets it itself.
    if (deepestRoute(snapshot).data['pageOwnsTitle']) {
      return;
    }
    this.title.setTitle(formatPageTitle(this.buildTitle(snapshot)));
  }
}

export function formatPageTitle(pageTitle: string | undefined): string {
  return pageTitle ? `${pageTitle} · ${APP_NAME}` : APP_NAME;
}

function deepestRoute(snapshot: RouterStateSnapshot): ActivatedRouteSnapshot {
  let route = snapshot.root;
  while (route.firstChild) {
    route = route.firstChild;
  }
  return route;
}
