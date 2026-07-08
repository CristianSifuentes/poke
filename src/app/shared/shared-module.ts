import { NgModule } from '@angular/core';

import { RevealOnInteractionDirective } from './directives/reveal-on-interaction-directive';
import { TypeColorDirective } from './directives/type-color-directive';
import { PokedexIdPipe } from './pipes/pokedex-id-pipe';
import { PokemonTypeColorPipe } from './pipes/pokemon-type-color-pipe';

@NgModule({
  declarations: [
    PokedexIdPipe,
    PokemonTypeColorPipe,
    TypeColorDirective,
    RevealOnInteractionDirective,
  ],
  exports: [
    PokedexIdPipe,
    PokemonTypeColorPipe,
    TypeColorDirective,
    RevealOnInteractionDirective,
  ],
})
export class SharedModule {}
