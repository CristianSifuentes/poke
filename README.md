# 🔴 Poké

> A Pokédex built with Angular 22 on classic **NgModules** (no standalone components). It's organized as **Core / Shared / Pages** and held together by one small design system.

[![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/Styles-SCSS-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [Guiding Principles](#guiding-principles)
  - [Module Map](#module-map)
  - [Data Flow](#data-flow)
- [Project Structure](#project-structure)
  - [Folder Tree](#folder-tree)
  - [Folder Responsibilities](#folder-responsibilities)
- [Design System](#design-system)
  - [Tokens](#tokens)
  - [Shared Style Patterns](#shared-style-patterns)
  - [Motion](#motion)
- [Naming & Coding Conventions](#naming--coding-conventions)
- [Shared Building Blocks](#shared-building-blocks)
  - [Components](#components)
  - [Directives](#directives)
  - [Pipes](#pipes)
- [Features](#features)
- [Navigation & Feedback](#navigation--feedback)
- [Getting Started](#getting-started)
- [NPM Scripts](#npm-scripts)
- [Scaling the Project](#scaling-the-project)
  - [Adding a New Feature Module](#adding-a-new-feature-module)
  - [Growth Path](#growth-path)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Poké** lets you search all 1,025 Pokémon by name, number, type and generation. You can open any one of them, collect favorites into a six-member party, and read how the app itself is built. It stays **framework-idiomatic** on purpose: `NgModule`-based, SCSS-first, signals for state and no UI library. Every addition is **additive**: a new feature, service or visual pattern has one obvious place to live and doesn't force a rewrite of what already exists.

## Tech Stack

| Concern             | Choice |
| ------------------- | ------ |
| Framework           | [Angular 22](https://angular.dev) (NgModules, `standalone: false`) |
| Language            | TypeScript 6.0 |
| Styling             | SCSS: global tokens in `src/styles.scss`, shared mixins in `src/styles/_poke.scss`, component-scoped styles |
| State               | Angular Signals (`signal`, `computed`, `linkedSignal`), with RxJS at the HTTP edges |
| Data                | [PokeAPI](https://pokeapi.co/) for species, types and details. Official artwork comes from the [PokeAPI/sprites](https://github.com/PokeAPI/sprites) repo via jsDelivr |
| Routing             | `provideRouter` in `AppRoutingModule`, every page lazy-loaded with `loadChildren`, plus view transitions, scroll restoration and component input binding |
| Unit testing        | Vitest + jsdom |
| Tooling             | Angular CLI 22, Prettier |
| CI                  | GitHub Actions (Claude PR Assistant & Code Review workflows) |

## Architecture

### Guiding Principles

1. **Feature isolation, fully lazy.** Each routed page is its own `NgModule` under `pages/`, loaded on demand. `AppModule` never imports a feature module. Each page ships as its own chunk and can be deleted without touching its siblings.
2. **Core holds singletons.** `CoreModule` holds the app shell (`Header`, `ToastOutlet`). `core/` also holds the app-wide services (index, favorites, toasts, transitions) and the routing helpers (title strategy, focus management). It is imported once, eagerly, by `AppModule`.
3. **Shared is stateless and reusable.** Pipes, directives and small presentational components used by two or more pages live in `SharedModule` and never know which page uses them.
4. **Additive over invasive.** A new page means a new folder plus one route entry. `AppModule` doesn't change.
5. **One design system.** Colors, radii, shadows, motion and type are tokens on `:root`. Recurring patterns (cards, chips, rails, skeletons, buttons) are mixins. A component only adds what is genuinely its own.
6. **Route order is load-bearing.** The router matches top-to-bottom, so the `**` wildcard stays **last**. Declaring it earlier once silently swallowed every navigation in this repo.

### Module Map

```
AppModule (root, eager)
 ├─ CoreModule        → Header, ToastOutlet (shell, imported once)
 └─ AppRoutingModule  → provideRouter(routes, scrolling, view transitions, input binding)
      ├─ ''             → redirectTo 'home'
      ├─ 'home'         loadChildren → HomeModule       ─┐
      ├─ 'search'       loadChildren → SearchModule      │
      ├─ 'pokemon/:id'  loadChildren → PokemonModule     │ one lazy chunk each,
      ├─ 'about'        loadChildren → AboutModule       │ fetched on first visit
      ├─ 'favorites'    loadChildren → FavoritesModule   │
      └─ '**'           loadChildren → NotFoundModule  ──┘ ← MUST stay last
```

Every feature module imports `SharedModule` and declares its own page-local components.

### Data Flow

```
PokeAPI ──► PokedexService.loadIndex()   19 requests → 1,025 PokedexEntry (id, name, types, generation)
        │                                shareReplay: fetched once per session
        └► PokedexService.loadDetail(id) /pokemon + /pokemon-species → PokemonDetail, cached per id

FavoritesStore  signal ⇄ localStorage (validated on read, synced across tabs, undoable)
ToastService    one toast at a time, app-wide (e.g. "Pikachu left your favorites. Undo")
```

Search, filtering, counts and stats all run in memory over the index. Nothing makes one request per Pokémon except the detail page.

## Project Structure

### Folder Tree

```
src/
├── styles.scss                  # Design tokens, shared keyframes, global craft rules
├── styles/
│   └── _poke.scss               # Shared mixins — `@use 'poke'` from any component
└── app/
    ├── app-module.ts            # Root NgModule: CoreModule + AppRoutingModule + providers
    ├── app-routing-module.ts    # Route table (wildcard LAST) + router features
    ├── app.ts / .html / .scss   # Shell: header, <main>, toast outlet
    │
    ├── core/
    │   ├── core-module.ts
    │   ├── components/
    │   │   ├── header/          # Nav, live favorites badge, "/" shortcut
    │   │   └── toast-outlet/    # Renders ToastService
    │   ├── models/              # PokedexEntry, PokemonDetail
    │   ├── routing/             # PokeTitleStrategy, NavigationFocus
    │   └── services/            # PokedexService, FavoritesStore, ToastService, PokemonTransition
    │
    ├── shared/
    │   ├── shared-module.ts     # Declares + exports everything below
    │   ├── components/          # heart-button, state-panel
    │   ├── directives/          # 9 directives (see Shared Building Blocks)
    │   ├── pipes/               # pokedexId, pokemonName, pokemonArtwork, pokemonTypeColor, stagger
    │   └── utils/               # pokemon-type-colors, pokemon-generations, pokemon-artwork
    │
    └── pages/
        ├── home/                # Bento mosaic: your party + Dommie's team (components/home-card)
        ├── search/              # search-bar, type-filter, generation-filter, search-card
        ├── pokemon/             # Detail page: stat-bars, explore-links, pokemon-pager
        ├── favorites/           # party-grid, party-card, box-card, box-filters, collection-summary
        ├── about/               # about-hero, stat-grid, type-gallery, region-timeline, architecture-map
        └── not-found/           # "This route fled!"
```

### Folder Responsibilities

| Path | Responsibility | Grows by… |
| ---- | -------------- | --------- |
| `src/styles.scss` | Tokens on `:root`, keyframes used by many components, global craft rules (selection, focus, press) | A new token only once two or more components need the same value |
| `src/styles/_poke.scss` | Mixins for patterns that repeat across components | A new mixin when a pattern is copied a second time |
| `app/core/` | The shell, singleton services and routing helpers, loaded once | `services/`, `routing/`, later `guards/` and `interceptors/` |
| `app/shared/` | Stateless building blocks used by 2+ pages | A component, pipe or directive declared and exported from `SharedModule` |
| `app/pages/<feature>/` | One routed page: its module, routing, page component and `components/` | A new sibling folder, without touching other pages |

## Design System

### Tokens

All tokens are defined once on `:root` in `src/styles.scss`. Components read them directly and don't redeclare them.

| Group | Tokens |
| ----- | ------ |
| Palette | `--poke-red`, `--poke-red-dark`, `--poke-blue`, `--poke-ink`, `--poke-gray`, `--poke-muted`, `--poke-border`, `--poke-bg`, `--poke-surface`, `--poke-surface-hi` |
| Shape | `--radius-sm` (0.75rem), `--radius-md` (1rem), `--radius-lg` (1.25rem, cards), `--radius-pill` |
| Elevation | `--shadow-rest`, `--shadow-raised`, `--shadow-float`, `--shadow-overlay` |
| Motion | `--ease-out`, `--ease-spring`, `--dur-fast`, `--dur-base`, `--dur-slow`, `--dur-enter` |
| Type | `--font-sans`, `--font-mono`, `--text-xs`, `--text-sm`, `--text-md`, `--text-title`, `--text-section` |
| Layout | `--page-max` (1080px), `--gutter` (1.5rem, 1rem on phones) |

Type colors aren't tokens. They live in `POKEMON_TYPE_COLORS` (`shared/utils/pokemon-type-colors.ts`), and `appTypeColor` hands them to CSS as `--accent` on whatever it's placed on (and `--accent-2` for a second type).

### Shared Style Patterns

`@use 'poke';` makes these available in any component stylesheet (`includePaths` points at `src/styles`):

| Mixin | What it gives you |
| ----- | ----------------- |
| `card`, `type-hairline`, `accent-lift`, `type-spotlight` | The card surface, the top hairline in the type colors, the hover lift with a type-tinted shadow, the pool of color behind artwork |
| `bloom`, `skeleton` | The grayscale-to-color entrance (with `appEntranceReveal`), shimmer placeholders |
| `eyebrow`, `page-title`, `section-title`, `lede`, `outline-numeral` | The text scale every page shares |
| `primary-button`, `icon-button`, `segmented`, `type-chip-selected` | Buttons and controls |
| `rail-track`, `rail-arrow` | Horizontal rails with edge fades and arrows (pair with `appScrollRail`) |
| `stretched-link`, `card-focus` | A whole card clickable through its one link, with a visible focus ring |
| `focus-ring`, `touch-target`, `hover`, `reduced-motion` | Accessibility and capability helpers |

### Motion

- **Two curves, a few durations.** Entrances never take longer than `--dur-enter` (0.8s), and the `stagger` pipe caps how long a long list keeps rippling in.
- **Keyframes over transitions for entrances.** A keyframe animation plays the moment its class exists, so it never races the first paint.
- **Hover only where hover exists.** Hover effects sit behind `(hover: hover) and (pointer: fine)`.
- **Everything degrades** under `prefers-reduced-motion`, including route transitions.
- **Route transitions** use the View Transitions API. They're skipped on first load and when only the query string changes, and a Pokémon's artwork morphs from its card into the detail page.

## Naming & Coding Conventions

- **No standalone components.** `angular.json` schematics default to `standalone: false` for components, directives and pipes.
- **Role suffixes, no dot-brackets.** `header.ts`, `search-module.ts`, `search-routing-module.ts`, `pokedex-id-pipe.ts`, `type-color-directive.ts`.
- **Page-local components** live in `pages/<feature>/components/<name>/`. They're promoted to `shared/` only when a second page needs them.
- **Inputs and outputs** use `@Input`/`@Output` with `EventEmitter`. Lists use `*ngFor` with `trackBy`.
- **State** lives in signals, and components inject dependencies with `inject()`.
- **Pure pipes instead of template method calls** for presentational values.
- **Directives only for behavior that needs a DOM node**: geometry, observers, events.
- **Budgets.** Each component stylesheet stays under 4 kB. When one grows past that, it gets split into subcomponents rather than trimmed in quality.
- **UI copy** is in English, warm and brief: "Pokémon" always with its accent, numbers with thousands separators, ids as `#025`.

## Shared Building Blocks

### Components

| Component | Purpose |
| --------- | ------- |
| `<app-heart-button>` | The only way into favorites. It sits in a card's corner, adds with a burst in the type color, and removes with an undo toast. |
| `<app-state-panel>` | Every empty and error state: a line-drawn Poké Ball, a heading, one sentence, one next step. Extra content (such as suggestions) is projected. |

### Directives

| Directive | Selector | Does |
| --------- | -------- | ---- |
| `TypeColorDirective` | `[appTypeColor]` (+ `appTypeColorMode="accent" \| "fill"`) | Turns a type into `--accent` or a solid background |
| `EntranceRevealDirective` | `appEntranceReveal` | Marks a card for the `bloom` entrance. The animation itself is pure CSS |
| `MagneticTiltDirective` | `[appMagneticTilt]` | Pointer-follow tilt and glow for large cards (hover devices only) |
| `ArtworkFallbackDirective` | `img[appArtworkFallback]` | Retries a failed CDN image once, then shows an inline SVG silhouette |
| `ScrollSentinelDirective` | `(appScrollSentinel)` | Emits when the host nears the viewport (infinite lists) |
| `ScrollRailDirective` | `appScrollRail` (`#rail="scrollRail"`) | Exposes `canScrollStart`/`canScrollEnd` and `scrollByPage()` for horizontal rails |
| `CountUpDirective` | `[appCountUp]` | Counts a number up from 0 when it scrolls into view |
| `PokemonLinkDirective` | `a[appPokemonLink]` | Marks which Pokémon is being opened, for the artwork morph |
| `ArtTransitionDirective` | `img[appArtTransition]` | Gives a card's artwork the shared `view-transition-name` while it's the one being opened |

### Pipes

| Pipe | Input → Output |
| ---- | -------------- |
| `pokedexId` | `25` → `#025` |
| `pokemonName` | `mr-mime` → `Mr. Mime`, `ho-oh` → `Ho-Oh` |
| `pokemonArtwork` | `25` → official artwork URL (jsDelivr) |
| `pokemonTypeColor` | `electric` → `#f8d030` |
| `stagger` | `i \| stagger: 30` → capped entrance delay in ms |

## Features

- **Home (`/home`).** A bento mosaic. If you have favorites, your party leads ("Welcome back"), laid out to tile the grid at any party size. Dommie's hand-picked team follows.
- **Pokédex (`/search`).** Search by name or number, narrow by up to two types and by generation, and sort. Every filter lives in the URL. Type chips and generation pills show how many results each would leave, and dead ends are disabled.
- **Pokémon (`/pokemon/:id`).** The artwork on its own stage, plus genus, flavor text, height, weight and abilities. Base stats are drawn against a shared 255 ceiling. Links continue into filtered searches, and previous/next work with ← → keys.
- **Your party (`/favorites`).** The first six favorites form the lineup, reorderable by drag and drop or with arrow buttons. The rest wait in the Box, which you can filter and sort. A type-wheel summary shows the collection's mix.
- **About (`/about`).** An editorial page: a self-drawing Poké Ball, live numbers from the index, an 18-type palette, a region timeline and a map of this architecture.
- **404.** "This route fled!", with a way back to the Pokédex.

## Navigation & Feedback

- **Tab titles.** Set per route by `PokeTitleStrategy` ("Pokédex · Poké"). The detail page titles itself ("Charizard #006 · Poké").
- **Focus.** It moves to the new page's `<h1>` after a path change (`NavigationFocus`). It's left alone when the new page has already focused something, such as the search field.
- **Scroll.** It's restored on back/forward and starts at the top on a new page. Filtering on `/search` opts out per navigation (`scroll: 'manual'`), so refining a search never moves you.
- **Header.** It keeps "Pokédex" lit on detail pages and filtered searches. A badge counts your favorites. `/` opens search from anywhere.
- **Toasts.** One at a time, app-wide, with an optional action and a visible countdown.

## Getting Started

**Prerequisites:** Node.js ≥ 20 and npm ≥ 11.

```bash
npm install
npm start        # http://localhost:4200
npm run build    # production build → dist/poke/
npm test         # Vitest + jsdom
```

The app needs network access to PokeAPI and jsDelivr at runtime. Favorites are stored in `localStorage` under `poke.favorites.v1`.

## NPM Scripts

| Script          | Command | Purpose |
| --------------- | ------- | ------- |
| `npm start`     | `ng serve` | Dev server with live reload |
| `npm run build` | `ng build` | Production build to `dist/` |
| `npm run watch` | `ng build --watch --configuration development` | Continuous dev build |
| `npm test`      | `ng test` | Unit tests via Vitest |

## Scaling the Project

### Adding a New Feature Module

**Create, don't modify:**

```bash
ng generate module pages/moves --routing
ng generate component pages/moves
```

The feature's routing keeps `path: ''` (it's mounted relative to its lazy segment) and imports `SharedModule` for the shared building blocks. Then add one entry to `AppRoutingModule`, **before** the wildcard:

```typescript
{
  path: 'moves',
  title: 'Moves',
  loadChildren: () => import('./pages/moves/moves-module').then((m) => m.MovesModule),
},
// …
{ path: '**', title: 'Not found', loadChildren: () => import('./pages/not-found/not-found-module').then((m) => m.NotFoundModule) },
```

Two rules make this safe:

1. **New routes go before `**`, never after.**
2. **`loadChildren` points at the feature's `*-module.ts`**, not its routing module.

If the page belongs in primary navigation, add a `routerLink` + `routerLinkActive` to `header.html`. For styles, start from the mixins in `_poke.scss` and the tokens rather than new literal values.

### Growth Path

| Stage | Milestone |
| ----- | --------- |
| ✅ 0–3 | NgModule shell, `CoreModule` header, four lazy routed pages, wildcard last |
| ✅ 4–5 | Home bento grid; `SharedModule` with the first pipes and directives |
| ✅ 6 | `PokedexService` on PokeAPI: a 19-request in-memory index, plus cached per-Pokémon detail |
| ✅ 7 | `/search` with URL-backed filters; `/favorites` with a persisted, undoable `FavoritesStore` |
| ✅ 8 | `/about` editorial page; `appCountUp` and `appScrollRail` |
| ✅ 9 | Cohesion pass: design tokens and mixins, `/pokemon/:id`, view transitions, title strategy, focus management, app-wide toasts, 404 |
| 🔜 10 | HTTP interceptors (retry, error normalization) in `core/interceptors` |
| 🔜 11 | `PreloadAllModules` (or a hover-based preloading strategy) once first-visit latency is noticeable |
| 🔜 12 | Dark theme: tokens are already centralized, so it's a second token set |
| 🔜 13 | E2E tests (Playwright) for search filters, drag-and-drop reordering and the artwork morph |

## CI/CD

GitHub Actions workflows (`.github/workflows/`) run:

- **Claude Code Review**: automated review on pull requests.
- **Claude PR Assistant**: PR assistance triggered via mentions.

## Contributing

1. Branch from `develop` (features merge there, then into `main`).
2. Follow the structure above: pages in `pages/`, cross-page pieces in `shared/`, singletons in `core/`.
3. Keep everything NgModule-based (`standalone: false`), and keep `npx ng build` warning-free and `npm test` green.
4. Open a pull request. CI runs the Claude review workflows automatically.

## License

Not yet specified.
