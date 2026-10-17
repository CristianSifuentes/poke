import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeartButton } from './components/heart-button/heart-button';
import { StatePanel } from './components/state-panel/state-panel';

import { ArtworkFallbackDirective } from './directives/artwork-fallback-directive';
import { CountUpDirective } from './directives/count-up-directive';
import { EntranceRevealDirective } from './directives/entrance-reveal-directive';
import { MagneticTiltDirective } from './directives/magnetic-tilt-directive';
import { ArtTransitionDirective, PokemonLinkDirective } from './directives/pokemon-link-directive';
import { ScrollSentinelDirective } from './directives/scroll-sentinel-directive';
import { ScrollRailDirective } from './directives/scroll-rail-directive';
import { TypeColorDirective } from './directives/type-color-directive';
import { PokedexIdPipe } from './pipes/pokedex-id-pipe';
import { PokemonArtworkPipe } from './pipes/pokemon-artwork-pipe';
import { PokemonNamePipe } from './pipes/pokemon-name-pipe';
import { PokemonTypeColorPipe } from './pipes/pokemon-type-color-pipe';
import { StaggerPipe } from './pipes/stagger-pipe';

@NgModule({
  declarations: [
    HeartButton,
    StatePanel,
    PokedexIdPipe,
    PokemonTypeColorPipe,
    PokemonNamePipe,
    PokemonArtworkPipe,
    StaggerPipe,
    TypeColorDirective,
    EntranceRevealDirective,
    MagneticTiltDirective,
    ArtworkFallbackDirective,
    ScrollSentinelDirective,
    ScrollRailDirective,
    CountUpDirective,
    PokemonLinkDirective,
    ArtTransitionDirective,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    HeartButton,
    StatePanel,
    PokedexIdPipe,
    PokemonTypeColorPipe,
    PokemonNamePipe,
    PokemonArtworkPipe,
    StaggerPipe,
    TypeColorDirective,
    EntranceRevealDirective,
    MagneticTiltDirective,
    ArtworkFallbackDirective,
    ScrollSentinelDirective,
    ScrollRailDirective,
    CountUpDirective,
    PokemonLinkDirective,
    ArtTransitionDirective,
  ],
})
export class SharedModule {}
