import { PokedexEntry } from '../../core/models/pokedex-entry';
import { findNeighbors } from './pokemon-neighbors';

const entries: PokedexEntry[] = [1, 2, 3].map((id) => ({ id, name: `p${id}`, types: ['normal'], generation: 1 }));

describe('findNeighbors', () => {
  it('returns the Pokémon on either side', () => {
    const { previous, next } = findNeighbors(entries, 2);

    expect(previous?.id).toBe(1);
    expect(next?.id).toBe(3);
  });

  it('does not wrap around at the ends', () => {
    expect(findNeighbors(entries, 1).previous).toBeNull();
    expect(findNeighbors(entries, 3).next).toBeNull();
  });

  it('has no neighbors for an unknown id', () => {
    expect(findNeighbors(entries, 99)).toEqual({ previous: null, next: null });
  });
});
