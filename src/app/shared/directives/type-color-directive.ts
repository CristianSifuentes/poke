import { Directive, HostBinding, Input } from '@angular/core';

import { resolvePokemonTypeColor } from '../utils/pokemon-type-colors';

export type TypeColorMode = 'accent' | 'fill';

// Wires a Pokémon type straight to the color it should paint on the host —
// the `--accent` custom property a card reads for its border/glow, or a
// solid `background` fill for a type badge. One directive, one source of
// truth (resolvePokemonTypeColor), instead of a `[style.*]` binding plus a
// pipe call repeated at every call site.
@Directive({
  selector: '[appTypeColor]',
  standalone: false,
})
export class TypeColorDirective {
  @Input('appTypeColor') type: string | null | undefined;
  @Input('appTypeColorMode') mode: TypeColorMode = 'accent';

  @HostBinding('style.--accent')
  get accent(): string | null {
    return this.mode === 'accent' ? resolvePokemonTypeColor(this.type) : null;
  }

  @HostBinding('style.background')
  get fill(): string | null {
    return this.mode === 'fill' ? resolvePokemonTypeColor(this.type) : null;
  }
}
