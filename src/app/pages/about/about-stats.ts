import { PokedexEntry } from '../../core/models/pokedex-entry';
import { POKEMON_TYPE_COLORS } from '../../shared/utils/pokemon-type-colors';

export interface TypeStat {
  type: string;
  // Pokémon carrying this type in either slot.
  count: number;
  // Lowest-numbered Pokémon with this as its *primary* type — the face of
  // the type in the gallery. Null only if no Pokémon leads with it.
  representativeId: number | null;
}

export interface PokedexStats {
  total: number;
  typeCount: number;
  regionCount: number;
  dualTypeCount: number;
  topType: TypeStat | null;
  // One per known type, in POKEMON_TYPE_COLORS order.
  types: TypeStat[];
}

// The grass starter that opens each region — Gen V's #494 is Victini, a
// mythical, so Unova starts at Snivy (#495) instead.
export const REGION_STARTERS: Readonly<Record<number, number>> = {
  1: 1,
  2: 152,
  3: 252,
  4: 387,
  5: 495,
  6: 650,
  7: 722,
  8: 810,
  9: 906,
};

export function summarizePokedex(entries: readonly PokedexEntry[]): PokedexStats {
  const counts = new Map<string, number>();
  const representatives = new Map<string, number>();
  const regions = new Set<number>();
  let dualTypeCount = 0;

  for (const entry of entries) {
    regions.add(entry.generation);
    if (entry.types.length > 1) {
      dualTypeCount++;
    }
    entry.types.forEach((type) => counts.set(type, (counts.get(type) ?? 0) + 1));
    const primary = entry.types[0];
    if (primary && entry.id < (representatives.get(primary) ?? Infinity)) {
      representatives.set(primary, entry.id);
    }
  }

  const types = Object.keys(POKEMON_TYPE_COLORS).map((type) => ({
    type,
    count: counts.get(type) ?? 0,
    representativeId: representatives.get(type) ?? null,
  }));
  const topType = types.reduce<TypeStat | null>(
    (top, stat) => (stat.count > (top?.count ?? 0) ? stat : top),
    null,
  );

  return {
    total: entries.length,
    typeCount: types.filter((stat) => stat.count > 0).length,
    regionCount: regions.size,
    dualTypeCount,
    topType,
    types,
  };
}
