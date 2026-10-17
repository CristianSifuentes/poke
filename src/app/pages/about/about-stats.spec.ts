import { PokedexEntry } from '../../core/models/pokedex-entry';
import { summarizePokedex } from './about-stats';

function entry(id: number, types: string[], generation = 1): PokedexEntry {
  return { id, name: `pokemon-${id}`, types, generation };
}

describe('summarizePokedex', () => {
  const entries = [
    entry(7, ['water']),
    entry(1, ['grass', 'poison']),
    entry(4, ['fire']),
    entry(9, ['water']),
    entry(158, ['water'], 2),
    entry(43, ['grass', 'poison']),
  ];

  it('counts totals, regions and dual-type Pokémon', () => {
    const stats = summarizePokedex(entries);

    expect(stats.total).toBe(6);
    expect(stats.regionCount).toBe(2);
    expect(stats.dualTypeCount).toBe(2);
    expect(stats.typeCount).toBe(4);
  });

  it('counts a type in either slot and picks the most common one', () => {
    const stats = summarizePokedex(entries);
    const poison = stats.types.find((stat) => stat.type === 'poison');

    expect(poison?.count).toBe(2);
    expect(stats.topType?.type).toBe('water');
    expect(stats.topType?.count).toBe(3);
  });

  it('represents each type by its lowest-numbered primary-type Pokémon', () => {
    const stats = summarizePokedex(entries);
    const byType = Object.fromEntries(stats.types.map((stat) => [stat.type, stat.representativeId]));

    expect(byType['water']).toBe(7);
    expect(byType['grass']).toBe(1);
    // Poison only ever appears as a secondary type here.
    expect(byType['poison']).toBeNull();
  });

  it('lists every known type, even ones with no Pokémon', () => {
    const stats = summarizePokedex([]);

    expect(stats.types).toHaveLength(18);
    expect(stats.topType).toBeNull();
    expect(stats.typeCount).toBe(0);
  });
});
