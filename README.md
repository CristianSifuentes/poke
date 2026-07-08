# 🔴 Poke

> A minimalistic Angular 22 application, built on classic **NgModules** (no standalone components), organized around a scalable **Core / Shared / Pages** architecture.

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
- [Project Structure](#project-structure)
  - [Current Folder Tree](#current-folder-tree)
  - [Folder Responsibilities](#folder-responsibilities)
- [Naming & Coding Conventions](#naming--coding-conventions)
- [UI Pattern Spotlight: The Home Bento Grid](#ui-pattern-spotlight-the-home-bento-grid)
- [Shared Pipes: Pure Transformations, Not Template Methods](#shared-pipes-pure-transformations-not-template-methods)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Build](#build)
  - [Testing](#testing)
- [NPM Scripts](#npm-scripts)
- [Scaling the Project](#scaling-the-project)
  - [Adding a New Feature Module](#adding-a-new-feature-module)
  - [Future-Ready Blueprint](#future-ready-blueprint)
  - [Growth Path](#growth-path)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Poke** is the foundation of a Pokémon-themed Angular application, deliberately started **lean and framework-idiomatic**: `NgModule`-based (not standalone), SCSS-first styling, and a folder layout that separates cross-cutting concerns (`core`) from routed features (`pages`). The goal of this structure is simple: **every future addition should be additive** — a new feature, service, or UI element should have one obvious place to live, without forcing a rewrite of what already exists.

## Tech Stack

| Concern            | Choice                                   |
| ------------------- | ----------------------------------------- |
| Framework           | [Angular 22](https://angular.dev) (NgModules, non-standalone) |
| Language            | TypeScript 6.0                           |
| Styling             | SCSS (component-scoped + global tokens)  |
| Reactive primitives | Angular Signals                          |
| Routing             | `@angular/router` — root `AppRoutingModule` **lazy-loads every feature** via `loadChildren()`; each feature declares its own `forChild` routes internally |
| Unit testing        | Vitest + jsdom                           |
| Tooling             | Angular CLI 22, Prettier                 |
| CI                  | GitHub Actions (Claude PR Assistant & Code Review workflows) |

## Architecture

### Guiding Principles

1. **Feature isolation, fully lazy** — each routed page is its own `NgModule` (declarations + routing) under `pages/`, loaded on demand via `loadChildren()`. `AppModule` never imports a feature module directly — features are wired **only** through the router, so each one ships as its own JS chunk and can be deleted without touching sibling features.
2. **Core is a singleton** — `CoreModule` holds app-shell UI (`Header`, wired to every route via `routerLink`/`routerLinkActive`) and, going forward, app-wide singleton services, guards, and interceptors. It is imported **once**, eagerly, in `AppModule` (the shell must exist before any route resolves).
3. **Shared is stateless and reusable** — presentational components, pipes, and directives used by *multiple* features belong in a `SharedModule` (see [Future-Ready Blueprint](#future-ready-blueprint)), never in `Core` or a single feature.
4. **Additive over invasive** — new features are new folders + new `loadChildren` entries. `AppModule` is never touched for a new feature; only `AppRoutingModule` gains one route object.
5. **Style locality** — component SCSS lives next to its component (`header.scss` next to `header.ts`); only truly global rules (resets, typography, design tokens shared app-wide) live in `src/styles.scss`.
6. **Route table owns navigation, and order is load-bearing** — `AppRoutingModule` is the single source of truth for top-level paths. The router matches top-to-bottom and stops at the first match, so the `**` wildcard **must be declared last**; declaring it before the feature routes would silently swallow every navigation (a real regression this project hit and fixed — see the route table below).

### Module Map

```
AppModule (root, eager — shell only)
 ├─ CoreModule            → app shell: Header (singleton, imported once, links to every route)
 └─ AppRoutingModule       → root route table (forRoot), matched top-to-bottom:
      ├─ ''         → redirectTo 'home'
      ├─ 'home'      loadChildren → HomeModule      ─┐
      ├─ 'search'    loadChildren → SearchModule     │ each is its own lazy chunk,
      ├─ 'about'     loadChildren → AboutModule      │ fetched only when its route
      ├─ 'favorites' loadChildren → FavoritesModule ─┘ is first navigated to
      └─ '**'        redirectTo 'home'    ← MUST stay last (matches any path)
           each feature module → its own <feature>-routing-module.ts
           (RouterModule.forChild, path: '' — relative to the lazy segment above)
```

## Project Structure

### Current Folder Tree

```
poke/
├── .github/
│   └── workflows/              # CI: Claude PR Assistant & Code Review
├── public/                     # Static assets copied as-is (favicon, images)
├── src/
│   ├── app/
│   │   ├── app-module.ts       # Root NgModule — bootstraps the app
│   │   ├── app-routing-module.ts # Root route table — redirect, 4x loadChildren, wildcard LAST
│   │   ├── app.ts               # Root component (application shell)
│   │   ├── app.html
│   │   ├── app.scss
│   │   ├── app.spec.ts
│   │   │
│   │   ├── core/                        # Singleton, app-wide concerns
│   │   │   ├── core-module.ts            # Imported once by AppModule
│   │   │   ├── components/
│   │   │   │   └── header/               # App shell navbar — links to every page below
│   │   │   │       ├── header.ts
│   │   │   │       ├── header.html
│   │   │   │       └── header.scss
│   │   │   └── pipes/
│   │   │       └── custom-pipe-pipe.ts   # Scaffold stub — see Shared Pipes below
│   │   │
│   │   ├── pages/                        # Routed, feature-scoped modules
│   │       ├── home/
│   │       │   ├── home-module.ts        # Feature NgModule — lazy-loaded target
│   │       │   ├── home-routing-module.ts# path: '' (relative to /home segment)
│   │       │   ├── home.ts               # "Dommie's Pokémon" — bento-grid dataset + view logic
│   │       │   ├── home.html
│   │       │   ├── home.scss             # Bento CSS Grid — see UI Pattern Spotlight below
│   │       │   ├── home-detail/          # Nested view, declared in HomeModule
│   │       │   │   ├── home-detail.ts
│   │       │   │   ├── home-detail.html
│   │       │   │   └── home-detail.scss
│   │       │   ├── home-card/            # Reserved — empty scaffold, not yet extracted
│   │       │   └── home-card-container/  # Reserved — empty scaffold, not yet extracted
│   │       ├── search/                   # Pokédex search — lazy-loaded target
│   │       │   ├── search-module.ts
│   │       │   ├── search-routing-module.ts # path: '' (relative to /search segment)
│   │       │   ├── search.ts
│   │       │   ├── search.html
│   │       │   └── search.scss
│   │       ├── favorites/                # lazy-loaded target
│   │       │   ├── favorites-module.ts
│   │       │   ├── favorites-routing-module.ts # path: '' (relative to /favorites segment)
│   │       │   ├── favorites.ts
│   │       │   ├── favorites.html
│   │       │   └── favorites.scss
│   │       └── about/                    # lazy-loaded target
│   │           ├── about-module.ts
│   │           ├── about-routing-module.ts # path: '' (relative to /about segment)
│   │           ├── about.ts
│   │           ├── about.html
│   │           └── about.scss
│   │
│   │   └── shared/                       # Reusable, stateless — imported by any feature that needs it
│   │       ├── shared-module.ts          # Declares + exports every shared pipe
│   │       └── pipes/
│   │           ├── pokedex-id-pipe.ts        # number → '#025'
│   │           └── pokemon-type-color-pipe.ts # type name → its brand color
│   │
│   ├── index.html
│   ├── main.ts                 # Bootstraps AppModule via platformBrowser
│   └── styles.scss             # Global resets & base typography
│
├── angular.json                # Workspace config (standalone: false by default)
├── package.json
└── tsconfig*.json
```

### Folder Responsibilities

| Path                        | Responsibility                                                                 | Grows by...                                      |
| --------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| `app/core/`                 | App shell UI, singleton services, guards, interceptors — loaded **once**        | Adding `services/`, `guards/`, `interceptors/` subfolders |
| `app/core/components/`      | Structural UI rendered once per app (header, footer, side-nav)                  | One new component folder per shell element         |
| `app/core/pipes/`           | Transforms that only ever make sense wrapped around the app shell itself — currently just the unimplemented `customPipe` stub (see [Shared Pipes](#shared-pipes-pure-transformations-not-template-methods)) | Fold into `shared/pipes/` instead unless the transform is genuinely shell-only |
| `app/pages/<feature>/`      | One routed feature: its module, routing, components, and page-local styles      | One new sibling folder per feature — never touches other features |
| `app/shared/`               | Reusable, stateless building blocks used by 2+ features — today, `pokedexId` and `pokemonTypeColor` pipes | New component/pipe/directive, declared + exported from `SharedModule`, imported by whichever feature module needs it |
| `app/models/` *(planned)*   | TypeScript interfaces/types for domain data (e.g., `Pokemon`, `PokemonListItem`) | New `*.model.ts` file per domain entity            |
| `src/styles.scss`           | Global resets, base typography — **not** component-specific rules               | Rare edits; prefer component SCSS instead          |

## Naming & Coding Conventions

- **No standalone components** — `angular.json` schematics default `standalone: false` for components, directives, and pipes; every new piece generated via `ng generate` follows this automatically.
- **File suffixes** describe role, not type-in-brackets: `header.ts`, `header-module.ts`, `header-routing-module.ts` (Angular 22's schematic convention — no more `.component.ts`).
- **One module per feature folder**, colocated with its routing module (`<feature>-routing-module.ts`).
- **SCSS colocation** — every component owns its own `.scss`; cross-cutting tokens (colors, spacing) are promoted to `styles.scss` only once genuinely shared by 2+ components.
- **Signals over manual subscriptions** for local component state (see `Header`'s `isMenuOpen` signal, toggled/closed via a mobile hamburger menu).
- **Navigation stays declarative** — `Header` uses `routerLink` + `routerLinkActive` (with `[routerLinkActiveOptions]="{ exact: true }"` so a link only highlights on an exact path match, not a prefix) for all four primary routes; no imperative `Router.navigate()` calls for top-level nav.
- **Pipes are named and filed like every other Angular building block here** — `name` in camelCase (`pokedexId`, `pokemonTypeColor`), class name is the PascalCase name + `Pipe` suffix, file name is the kebab-case name + `-pipe.ts` (`pokedex-id-pipe.ts`), matching the same "role-suffix, no dot-bracket" convention used for modules and routing modules. `angular.json` defaults `standalone: false` for pipes too, so they're declared in `SharedModule` rather than a component's own `imports`.

## UI Pattern Spotlight: The Home Bento Grid

`pages/home` is the first feature to move past scaffolding, and it doubles as a worked example of every styling convention above. It renders "Dommie's Pokémon" — a typed roster (`DommiePokemon[]` in `home.ts`) — as a **Bento-style CSS Grid**, and is a reference for four reusable patterns:

1. **Size-driven dense packing.** Each Pokémon carries a `bento: 'hero' | 'wide' | 'tall' | 'regular'` field. `home.scss` maps each variant to a `grid-column`/`grid-row` span on a `grid-auto-flow: dense` container, so the mosaic look comes entirely from data, not hand-placed markup — adding a Pokémon is a one-object addition to the array, never a template edit.
2. **Component-local design tokens.** Like `Header`, `Home` declares its own `--poke-red` / `--poke-ink` / `--poke-gray` / `--poke-border` / `--poke-bg` custom properties on `:host` rather than reading from a shared file (there isn't one yet — see [Growth Path](#growth-path)). Per-card accents (`--accent`) are set inline via `[style.--accent]="pokemon.types[0] | pokemonTypeColor"` — the type-to-color mapping itself lives in `shared/pipes`, not in `home.ts` (see [Shared Pipes](#shared-pipes-pure-transformations-not-template-methods) below), and is consumed by `border`, `box-shadow`, and `::before` rules.
3. **Hover-reveal, gated by real input capability.** `regular`-sized tiles hide their artwork by default and only reveal it — a crossfade + scale, eased with `cubic-bezier(0.16, 1, 0.3, 1)` — inside `@media (hover: hover) and (pointer: fine)`, so touch devices simply always show the artwork instead of hitting a dead-end tap target. The same tiles get `tabindex="0"` + `:focus-within` so keyboard users get equivalent access, and every transition collapses under `@media (prefers-reduced-motion: reduce)`.
4. **Responsive art bound to the stable dimension.** Both the `hero` and `wide` variants scale their Pokémon artwork by `aspect-ratio` against whichever box dimension stays predictable across breakpoints — `hero` sizes from the grid row's height (via `aspect-ratio: 1 / 1` + `max-height`) until its row height goes indeterminate at the single-column breakpoint, where it switches to sizing from width instead; `wide` sizes its thumbnail from the row's own height (`align-self: stretch` + `aspect-ratio: 1 / 1`) rather than a percentage of the row's width, so the image holds its shape whether the tile spans 2 of 4 columns (desktop) or 2 of 2 (tablet). `object-fit: contain` guarantees the artwork is always shown whole, never cropped, at every size.

None of this required a new dependency — it's `grid-auto-flow: dense`, `aspect-ratio`, CSS custom properties, and media queries, matching the "additive, framework-idiomatic" spirit of the rest of the app. The same four patterns are the intended starting point once `search` and `favorites` grow past their current placeholder state.

## Shared Pipes: Pure Transformations, Not Template Methods

`home.ts` originally computed two purely presentational values with plain TypeScript: a zero-padded Pokédex id (`#025`) and a type-name-to-hex-color lookup, both invoked as template method calls (`{{ paddedId(pokemon.id) }}`). Method calls in a template are **impure by construction** — Angular re-invokes them on every change-detection pass, whether or not their input actually changed. Both have since moved to `app/shared/pipes/`:

| Pipe | Input → Output | Used as |
| --- | --- | --- |
| `pokedexId` | `25` → `"#025"` | `{{ pokemon.id \| pokedexId }}` |
| `pokemonTypeColor` | `"electric"` → `"#f8d030"` | `[style.background]="type \| pokemonTypeColor"` |

This is a small change with an outsized architectural payoff:

- **Pure by default.** Neither pipe sets `pure: false`, so Angular caches the transform per input value/reference instead of recomputing it every check — a genuine performance win over the method-call approach it replaced, not just a style preference.
- **One color palette, not one per feature.** `POKEMON_TYPE_COLORS` previously lived inside `home.ts`; now it's the only copy in the repo. When `search` and `favorites` render real Pokémon, they `import { SharedModule }` and get the same badge colors for free — no re-deriving, no drift.
- **The data model got simpler, not more abstract.** `DommiePokemon.types` shrank from `{ name: string; color: string }[]` to plain `string[]` — the component's job is to hold *what* a Pokémon is, not *how* its type should be painted. That question now has exactly one answer, in exactly one file.
- **Declared where the "planned" `SharedModule` in [Folder Responsibilities](#folder-responsibilities) said it would be.** `shared-module.ts` declares and exports both pipes; `HomeModule` imports `SharedModule` alongside `CommonModule` and `HomeRoutingModule` — the same "one new import, zero existing files rewritten" shape as every other addition in this app.

**A second, `core`-scoped pipe exists too, and it's a useful contrast.** `core/pipes/custom-pipe-pipe.ts` declares `customPipe`, generated as a scaffold and registered directly in `CoreModule` — its `transform()` currently just returns `null` and it isn't referenced from any template yet. Its location is the tell: `core/` is for the app shell and singleton concerns ([Guiding Principle #2](#guiding-principles)), so a pipe declared there is implicitly saying "this only ever makes sense wrapped around shell-level UI, not feature data." Neither `pokedexId` nor `pokemonTypeColor` fit that description — they're Pokémon-domain transforms any feature might need — which is exactly why they live in `shared/`, not `core/`, instead. Until `customPipe` is implemented and given a real, shell-specific job, treat it the same as the empty `home-card` / `home-card-container` folders: a placeholder marking an intention, not a pattern to copy.

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 11 (or your package manager of choice)

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/` — the app reloads automatically on file changes.

### Build

```bash
npm run build
```

Artifacts are emitted to `dist/poke/`, production-optimized by default.

### Testing

```bash
npm test
```

Runs unit tests via Vitest + jsdom.

## NPM Scripts

| Script          | Command                                  | Purpose                              |
| --------------- | ----------------------------------------- | ------------------------------------- |
| `npm start`     | `ng serve`                                | Local dev server with live reload     |
| `npm run build` | `ng build`                                | Production build to `dist/`           |
| `npm run watch` | `ng build --watch --configuration development` | Continuous dev build (no server) |
| `npm test`      | `ng test`                                 | Unit tests via Vitest                 |

## Scaling the Project

### Adding a New Feature Module

`home`, `search`, `favorites`, and `about` all follow the same lazy-loaded recipe today, so a new page (e.g., a Pokémon detail view) repeats it — **create, don't modify**:

```bash
ng generate module pages/detail --routing
ng generate component pages/detail
```

The feature's own routing module keeps `path: ''` — it's always mounted *relative to* the segment the router lazy-loads it under, so it never needs to know its own top-level path:

```typescript
// pages/detail/detail-routing-module.ts
const routes: Routes = [
  { path: '', component: Detail },
];
```

Register that one top-level segment in `AppRoutingModule` — **`AppModule` is never touched**:

```typescript
// app-routing-module.ts
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home-module').then(m => m.HomeModule) },
  { path: 'search', loadChildren: () => import('./pages/search/search-module').then(m => m.SearchModule) },
  { path: 'about', loadChildren: () => import('./pages/about/about-module').then(m => m.AboutModule) },
  { path: 'favorites', loadChildren: () => import('./pages/favorites/favorites-module').then(m => m.FavoritesModule) },
  { path: 'detail', loadChildren: () => import('./pages/detail/detail-module').then(m => m.DetailModule) }, // ← the only entry a new feature adds

  // '**' MUST remain the last entry — it matches any path and would
  // otherwise shadow every route declared above it
  { path: '**', redirectTo: 'home' },
];
```

Two rules make this safe every time:

1. **Insert new feature routes *before* `**`, never after.** The router matches top-to-bottom and stops at the first hit — this repo shipped a bug where `**` sat second in the list and silently redirected every click back to `/home` before any feature route was ever tried.
2. **Point `loadChildren` at the feature's `*-module.ts`** (the NgModule with `declarations`), not its `*-routing-module.ts`. The routing module alone has no component declarations — loading it directly leaves the router with routes but nothing to render.

Finally, add one `routerLink` (+ `routerLinkActive` and `[routerLinkActiveOptions]="{ exact: true }"`) in `header.html` if the feature belongs in primary navigation. No existing feature module is touched or re-declared anywhere — the new page is fully self-contained and ships as its own chunk (`ng build` output shows one `chunk-*.js` per feature).

### Future-Ready Blueprint

As the app grows, the structure extends **outward**, not **through** existing code:

```
src/app/
├── core/
│   ├── components/          # header, footer, side-nav…
│   ├── services/            # PokemonApiService, StorageService…
│   ├── guards/              # authGuard, unsavedChangesGuard…
│   └── interceptors/        # errorInterceptor, loadingInterceptor…
│
├── shared/
│   ├── components/          # app-button, app-card, app-badge…
│   ├── pipes/                # capitalizeType, statBar…
│   └── directives/           # appLazyImage…
│
├── models/
│   └── pokemon.model.ts      # Domain types shared across features
│
├── pages/
│   ├── home/                  # lazy-loaded
│   ├── search/                # lazy-loaded, detail-ready
│   ├── favorites/             # lazy-loaded
│   └── about/                 # lazy-loaded
│
└── app-routing-module.ts     # Root route table — redirect, loadChildren per
                                # feature, '**' wildcard always last
```

### Growth Path

| Stage | Milestone                                                                 |
| ----- | --------------------------------------------------------------------------- |
| ✅ 0   | NgModule shell, `CoreModule` header, first `pages/home` feature             |
| ✅ 1  | Root `AppRoutingModule` (`redirectTo: 'home'` + `**` wildcard) wired into `AppModule` |
| ✅ 2  | Four routed features (`home`, `search`, `favorites`, `about`) with a shell `Header` linking all of them |
| ✅ 3  | All four features fully **lazy-loaded** via `loadChildren`; `AppModule` only imports `CoreModule` + `AppRoutingModule` — verified by `ng build` emitting one lazy `chunk-*.js` per feature |
| ✅ 4  | `pages/home` moved past scaffolding: a responsive **Bento CSS Grid** ("Dommie's Pokémon") establishing the size-driven dense-packing, component-local token, hover-reveal, and aspect-ratio patterns — see [UI Pattern Spotlight](#ui-pattern-spotlight-the-home-bento-grid) |
| ✅ 5  | `SharedModule` introduced with its first two exports, `pokedexId` and `pokemonTypeColor` — see [Shared Pipes](#shared-pipes-pure-transformations-not-template-methods). Reusable **components** (buttons, the card layout itself) are still pending — the empty `home-card` / `home-card-container` scaffolds mark where that extraction is expected to land |
| 🔜 6  | Typed `PokemonApiService` in `core/services`, backed by the [PokéAPI](https://pokeapi.co/) — to replace `home.ts`'s hand-authored roster and back `search`/`favorites` |
| 🔜 7  | `models/` for strongly-typed domain entities (promoting `home.ts`'s local `DommiePokemon` interface into a shared model) |
| 🔜 8  | HTTP interceptors (loading state, error normalization) in `core/interceptors` |
| 🔜 9  | Route-level `preloadingStrategy` (e.g. `PreloadAllModules`) once enough features exist that first-navigation lazy-load latency is noticeable |
| 🔜 10 | State management (Signals-based store, or NgRx if complexity demands it) — likely needed once `favorites` persists selections |
| 🔜 11 | E2E test suite (Playwright/Cypress) alongside the existing Vitest unit tests |

Each stage is purely **additive**: new folders, new modules, new lazy routes — existing features never need to change shape to accommodate the next one.

## CI/CD

GitHub Actions workflows (`.github/workflows/`) run:

- **Claude Code Review** — automated review on pull requests.
- **Claude PR Assistant** — automated PR assistance triggered via mentions.

## Contributing

1. Create a feature branch from `main`.
2. Follow the folder conventions above — new features go in `pages/`, shared UI in `shared/` (once introduced).
3. Keep components NgModule-based (`standalone: false`) to match the rest of the codebase.
4. Open a pull request — CI will run the Claude review workflows automatically.

## License

Not yet specified.
