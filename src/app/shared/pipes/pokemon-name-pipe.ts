import { Pipe, PipeTransform } from '@angular/core';

// PokeAPI slugs mostly read fine once dashes become spaces ("iron-treads"
// → "Iron Treads"), but a handful carry punctuation or symbols the slug
// had to drop. Those are spelled out here rather than guessed at.
const SPECIAL_NAMES: Readonly<Record<string, string>> = {
  'nidoran-f': 'Nidoran♀',
  'nidoran-m': 'Nidoran♂',
  'mr-mime': 'Mr. Mime',
  'mime-jr': 'Mime Jr.',
  'mr-rime': 'Mr. Rime',
  farfetchd: 'Farfetch’d',
  sirfetchd: 'Sirfetch’d',
  'type-null': 'Type: Null',
  flabebe: 'Flabébé',
};

// Names where the dash is part of the real name, not a word separator.
const HYPHENATED_NAMES = new Set([
  'ho-oh',
  'porygon-z',
  'jangmo-o',
  'hakamo-o',
  'kommo-o',
  'wo-chien',
  'chien-pao',
  'ting-lu',
  'chi-yu',
]);

@Pipe({
  name: 'pokemonName',
  standalone: false,
})
export class PokemonNamePipe implements PipeTransform {
  transform(slug: string | null | undefined): string {
    if (!slug) {
      return '';
    }
    if (SPECIAL_NAMES[slug]) {
      return SPECIAL_NAMES[slug];
    }
    const separator = HYPHENATED_NAMES.has(slug) ? '-' : ' ';
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(separator);
  }
}
