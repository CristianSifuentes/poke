import { NgModule } from '@angular/core';

import { PokedexIdPipe } from './pipes/pokedex-id-pipe';
import { PokemonTypeColorPipe } from './pipes/pokemon-type-color-pipe';

@NgModule({
  declarations: [PokedexIdPipe, PokemonTypeColorPipe],
  exports: [PokedexIdPipe, PokemonTypeColorPipe],
})
export class SharedModule {}
