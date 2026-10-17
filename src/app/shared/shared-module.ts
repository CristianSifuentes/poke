import { NgModule } from '@angular/core';

import { ArtworkFallbackDirective } from './directives/artwork-fallback-directive';
import { EntranceRevealDirective } from './directives/entrance-reveal-directive';
import { MagneticTiltDirective } from './directives/magnetic-tilt-directive';
import { ScrollSentinelDirective } from './directives/scroll-sentinel-directive';
import { TypeColorDirective } from './directives/type-color-directive';
import { PokedexIdPipe } from './pipes/pokedex-id-pipe';
import { PokemonArtworkPipe } from './pipes/pokemon-artwork-pipe';
import { PokemonNamePipe } from './pipes/pokemon-name-pipe';
import { PokemonTypeColorPipe } from './pipes/pokemon-type-color-pipe';

@NgModule({
  declarations: [
    PokedexIdPipe,
    PokemonTypeColorPipe,
    PokemonNamePipe,
    PokemonArtworkPipe,
    TypeColorDirective,
    EntranceRevealDirective,
    MagneticTiltDirective,
    ArtworkFallbackDirective,
    ScrollSentinelDirective,
  ],
  exports: [
    PokedexIdPipe,
    PokemonTypeColorPipe,
    PokemonNamePipe,
    PokemonArtworkPipe,
    TypeColorDirective,
    EntranceRevealDirective,
    MagneticTiltDirective,
    ArtworkFallbackDirective,
    ScrollSentinelDirective,
  ],
})
export class SharedModule {}
