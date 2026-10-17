import { TestBed } from '@angular/core/testing';

import { FAVORITES_STORAGE_KEY, FavoritesStore } from './favorites-store';

// An in-memory Storage, so the tests don't depend on whether the test
// environment (jsdom + Node version) exposes a working localStorage.
class MemoryStorage {
  private readonly items = new Map<string, string>();
  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.items.set(key, String(value));
  }
  removeItem(key: string): void {
    this.items.delete(key);
  }
  clear(): void {
    this.items.clear();
  }
}

describe('FavoritesStore', () => {
  function createStore(): FavoritesStore {
    TestBed.resetTestingModule();
    return TestBed.inject(FavoritesStore);
  }

  beforeEach(() => vi.stubGlobal('localStorage', new MemoryStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it('toggles a favorite on and off', () => {
    const store = createStore();

    store.toggle(25);
    expect(store.has(25)).toBe(true);
    expect(store.count()).toBe(1);

    store.toggle(25);
    expect(store.has(25)).toBe(false);
    expect(store.count()).toBe(0);
  });

  it('persists favorites across store instances', () => {
    createStore().toggle(6);
    createStore().toggle(150);

    const store = createStore();
    expect(store.ids()).toEqual([6, 150]);
  });

  it('ignores invalid, duplicate and malformed stored ids', () => {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([25, 25, 0, 1026, 2.5, 'pikachu', null, { id: 7, addedAt: 'x' }, { id: 1 }]),
    );

    const store = createStore();
    expect(store.ids()).toEqual([25, 7, 1]);
    expect(store.entries()[1].addedAt).toBe(0);
  });

  it('recovers from storage that is not valid JSON', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, '{nope');

    expect(createStore().ids()).toEqual([]);
  });

  it('restores a removed favorite at its original position', () => {
    const store = createStore();
    [1, 4, 7].forEach((id) => store.add(id));

    store.remove(4);
    expect(store.ids()).toEqual([1, 7]);

    store.undoRemove();
    expect(store.ids()).toEqual([1, 4, 7]);
    expect(store.lastRemoved()).toBeNull();
  });

  it('moves a favorite to a new position', () => {
    const store = createStore();
    [1, 4, 7, 25].forEach((id) => store.add(id));

    store.moveTo(25, 0);
    expect(store.ids()).toEqual([25, 1, 4, 7]);

    store.moveTo(25, 99);
    expect(store.ids()).toEqual([1, 4, 7, 25]);
  });
});
