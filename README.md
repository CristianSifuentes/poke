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
| Routing             | `@angular/router` (feature-level `forChild`, root routing to be added) |
| Unit testing        | Vitest + jsdom                           |
| Tooling             | Angular CLI 22, Prettier                 |
| CI                  | GitHub Actions (Claude PR Assistant & Code Review workflows) |

## Architecture

### Guiding Principles

1. **Feature isolation** — each routed page is its own `NgModule` (declarations + routing) under `pages/`, so features can be lazy-loaded independently and deleted without side effects.
2. **Core is a singleton** — `CoreModule` holds app-shell UI (header, footer, nav) and, going forward, app-wide singleton services, guards, and interceptors. It is imported **once**, in `AppModule`.
3. **Shared is stateless and reusable** — presentational components, pipes, and directives used by *multiple* features belong in a `SharedModule` (see [Future-Ready Blueprint](#future-ready-blueprint)), never in `Core` or a single feature.
4. **Additive over invasive** — new features are new folders + new modules wired into routing. Existing modules are touched only to register a new lazy route, not to absorb unrelated logic.
5. **Style locality** — component SCSS lives next to its component (`header.scss` next to `header.ts`); only truly global rules (resets, typography, design tokens shared app-wide) live in `src/styles.scss`.

### Module Map

```
AppModule (root, eager)
 ├─ CoreModule            → app shell: Header (singleton, imported once)
 └─ (future) AppRoutingModule → registers lazy feature routes
     └─ HomeModule (feature, currently eager — lazy-loadable)
         └─ HomeRoutingModule → local routes for the Home feature
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
│   │   ├── app.ts               # Root component (application shell)
│   │   ├── app.html
│   │   ├── app.scss
│   │   ├── app.spec.ts
│   │   │
│   │   ├── core/                        # Singleton, app-wide concerns
│   │   │   ├── core-module.ts            # Imported once by AppModule
│   │   │   └── components/
│   │   │       └── header/               # App shell navbar
│   │   │           ├── header.ts
│   │   │           ├── header.html
│   │   │           └── header.scss
│   │   │
│   │   └── pages/                        # Routed, feature-scoped modules
│   │       └── home/
│   │           ├── home-module.ts        # Feature NgModule
│   │           ├── home-routing-module.ts# Feature-local routes
│   │           ├── home.ts
│   │           ├── home.html
│   │           └── home.scss
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
| `app/pages/<feature>/`      | One routed feature: its module, routing, components, and page-local styles      | One new sibling folder per feature — never touches other features |
| `app/shared/` *(planned)*   | Reusable, stateless building blocks used by 2+ features (buttons, cards, pipes) | New component/pipe/directive, exported from `SharedModule` |
| `app/models/` *(planned)*   | TypeScript interfaces/types for domain data (e.g., `Pokemon`, `PokemonListItem`) | New `*.model.ts` file per domain entity            |
| `src/styles.scss`           | Global resets, base typography — **not** component-specific rules               | Rare edits; prefer component SCSS instead          |

## Naming & Coding Conventions

- **No standalone components** — `angular.json` schematics default `standalone: false` for components, directives, and pipes; every new piece generated via `ng generate` follows this automatically.
- **File suffixes** describe role, not type-in-brackets: `header.ts`, `header-module.ts`, `header-routing-module.ts` (Angular 22's schematic convention — no more `.component.ts`).
- **One module per feature folder**, colocated with its routing module (`<feature>-routing-module.ts`).
- **SCSS colocation** — every component owns its own `.scss`; cross-cutting tokens (colors, spacing) are promoted to `styles.scss` only once genuinely shared by 2+ components.
- **Signals over manual subscriptions** for local component state (see `Header`'s `isMenuOpen` signal).

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

To add a new page (e.g., a Pokédex list), the pattern is always the same — **create, don't modify**:

```bash
ng generate module pages/pokedex --routing
ng generate component pages/pokedex/pokedex-list
```

Then register it as a **lazy route** in the (to-be-added) `AppRoutingModule`:

```typescript
// app-routing-module.ts
const routes: Routes = [
  { path: 'pokedex', loadChildren: () => import('./pages/pokedex/pokedex-module').then(m => m.PokedexModule) },
];
```

No existing file is touched beyond that single route registration — the feature is fully self-contained.

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
│   ├── home/
│   ├── pokedex/              # list + detail, lazy-loaded
│   ├── favorites/            # lazy-loaded
│   └── about/                # lazy-loaded
│
└── app-routing-module.ts     # Root route table — one line per feature
```

### Growth Path

| Stage | Milestone                                                                 |
| ----- | --------------------------------------------------------------------------- |
| ✅ 0   | NgModule shell, `CoreModule` header, first `pages/home` feature             |
| 🔜 1  | Root `AppRoutingModule` with lazy-loaded feature routes                     |
| 🔜 2  | `SharedModule` for reusable presentational components                      |
| 🔜 3  | Typed `PokemonApiService` in `core/services`, backed by the [PokéAPI](https://pokeapi.co/) |
| 🔜 4  | `models/` for strongly-typed domain entities                               |
| 🔜 5  | HTTP interceptors (loading state, error normalization) in `core/interceptors` |
| 🔜 6  | State management (Signals-based store, or NgRx if complexity demands it)   |
| 🔜 7  | E2E test suite (Playwright/Cypress) alongside the existing Vitest unit tests |

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
