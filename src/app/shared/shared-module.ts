import { NgModule } from '@angular/core';

import { EntranceRevealDirective } from './directives/entrance-reveal-directive';
import { MagneticTiltDirective } from './directives/magnetic-tilt-directive';
import { TypeColorDirective } from './directives/type-color-directive';
import { PokedexIdPipe } from './pipes/pokedex-id-pipe';
import { PokemonTypeColorPipe } from './pipes/pokemon-type-color-pipe';

@NgModule({
  declarations: [
    PokedexIdPipe,
    PokemonTypeColorPipe,
    TypeColorDirective,
    EntranceRevealDirective,
    MagneticTiltDirective,
  ],
  exports: [
    PokedexIdPipe,
    PokemonTypeColorPipe,
    TypeColorDirective,
    EntranceRevealDirective,
    MagneticTiltDirective,
  ],
})
export class SharedModule {}
