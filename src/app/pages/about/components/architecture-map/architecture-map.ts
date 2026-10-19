import { Component, signal } from '@angular/core';

type ModuleId = 'core' | 'shared' | 'pages';

interface ArchModule {
  id: ModuleId;
  name: string;
  kind: string;
  items: string[];
  role: string;
  // Modules this one works with — lit up alongside it on hover/focus.
  related: ModuleId[];
}

interface Decision {
  title: string;
  body: string;
}

@Component({
  selector: 'app-architecture-map',
  standalone: false,
  templateUrl: './architecture-map.html',
  styleUrl: './architecture-map.scss',
})
export class ArchitectureMap {
  protected readonly active = signal<ModuleId | null>(null);

  protected readonly modules: readonly ArchModule[] = [
    {
      id: 'core',
      name: 'CoreModule',
      kind: 'Eager · singleton',
      items: [
        'Header',
        'ThemeToggle',
        'ToastOutlet',
        'ScrollTop',
        'PokedexService',
        'FavoritesStore',
        'ThemeService',
        'ToastService',
        'PokemonTransition',
        'TitleStrategy',
        'NavigationFocus',
      ],
      role: 'The shell, app-wide state and the routing helpers, imported once.',
      related: [],
    },
    {
      id: 'shared',
      name: 'SharedModule',
      kind: 'Stateless · reusable',
      items: ['5 pipes', '9 directives', 'HeartButton', 'StatePanel', '3 utils'],
      role: 'The toolkit every page imports. Knows nothing about any page; its utils are the single source for type colors, generations and artwork.',
      related: ['pages'],
    },
    {
      id: 'pages',
      name: 'Pages',
      kind: 'Lazy · loadChildren',
      items: ['Home', 'Search', 'Pokémon', 'Favorites', 'About', '404'],
      role: 'One module and one chunk each, fetched on first visit.',
      related: ['shared'],
    },
  ];

  protected readonly decisions: readonly Decision[] = [
    {
      title: '19 requests, not 1,025',
      body: 'One species list plus one list per type builds the whole index, then search runs in memory.',
    },
    {
      title: 'Pipes over template methods',
      body: 'Pure pipes only recompute when their input changes; a method call reruns on every check.',
    },
    {
      title: 'Directives for the DOM',
      body: 'Tilt, reveal, count-up, scroll rails: behavior that needs a real element lives in one directive.',
    },
    {
      title: 'Keyframes over transitions',
      body: 'A keyframe animation plays the moment its class exists, so entrances never race the first paint.',
    },
    {
      title: 'The URL holds the search',
      body: 'Filters live in the query string, so any search can be shared, bookmarked or undone with Back.',
    },
    {
      title: 'Signals for state, RxJS for time',
      body: 'Signals hold what the app knows; RxJS handles requests, debouncing and cancelling stale ones.',
    },
    {
      title: 'A theme is a token set',
      body: 'Dark mode redefines the color tokens on <html>; no component ever asks which theme it is in.',
    },
    {
      title: 'Components measure themselves',
      body: 'Container queries size each section by its own width, not the window’s, so layouts fit where they land.',
    },
  ];

  protected isLit(id: ModuleId): boolean {
    const active = this.active();
    return active === id || (!!active && this.modules.find((m) => m.id === active)!.related.includes(id));
  }

  protected trackById(_index: number, module: ArchModule): ModuleId {
    return module.id;
  }
}
