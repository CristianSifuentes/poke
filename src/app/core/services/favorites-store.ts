import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';

import { NATIONAL_DEX_SIZE } from '../../shared/utils/pokemon-generations';

export interface FavoriteRecord {
  id: number;
  addedAt: number;
}

export interface RemovedFavorite {
  record: FavoriteRecord;
  index: number;
}

export const FAVORITES_STORAGE_KEY = 'poke.favorites.v1';

// The array order *is* the user's arrangement: the first six records are
// the party, the rest the box. New favorites join at the end.
@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly records = signal<FavoriteRecord[]>(readFavorites());
  private readonly removed = signal<RemovedFavorite | null>(null);

  readonly entries = this.records.asReadonly();
  readonly lastRemoved = this.removed.asReadonly();
  readonly ids = computed(() => this.records().map((record) => record.id));
  readonly count = computed(() => this.records().length);
  private readonly idSet = computed(() => new Set(this.ids()));

  constructor() {
    // Another tab changed the list — adopt it, so two open tabs never
    // overwrite each other with stale copies.
    if (typeof window !== 'undefined') {
      const onStorage = (event: StorageEvent): void => {
        if (event.key === FAVORITES_STORAGE_KEY || event.key === null) {
          this.records.set(readFavorites());
        }
      };
      window.addEventListener('storage', onStorage);
      inject(DestroyRef).onDestroy(() => window.removeEventListener('storage', onStorage));
    }
  }

  has(id: number): boolean {
    return this.idSet().has(id);
  }

  toggle(id: number): void {
    if (this.has(id)) {
      this.remove(id);
    } else {
      this.add(id);
    }
  }

  add(id: number): void {
    if (!isValidId(id) || this.has(id)) {
      return;
    }
    this.commit([...this.records(), { id, addedAt: Date.now() }]);
  }

  remove(id: number): void {
    const records = this.records();
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) {
      return;
    }
    this.removed.set({ record: records[index], index });
    this.commit(records.filter((record) => record.id !== id));
  }

  // Puts the last removed favorite back exactly where it was.
  undoRemove(): void {
    const removed = this.removed();
    this.removed.set(null);
    if (!removed || this.has(removed.record.id)) {
      return;
    }
    const records = [...this.records()];
    records.splice(Math.min(removed.index, records.length), 0, removed.record);
    this.commit(records);
  }

  dismissUndo(): void {
    this.removed.set(null);
  }

  // Moves a favorite to a new position in the arrangement (clamped).
  moveTo(id: number, index: number): void {
    const records = this.records();
    const from = records.findIndex((record) => record.id === id);
    if (from === -1) {
      return;
    }
    const next = records.filter((record) => record.id !== id);
    const to = Math.max(0, Math.min(index, next.length));
    if (to === from) {
      return;
    }
    next.splice(to, 0, records[from]);
    this.commit(next);
  }

  clear(): void {
    this.commit([]);
  }

  private commit(records: FavoriteRecord[]): void {
    this.records.set(records);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(records));
    } catch {
      // Private mode or blocked storage: favorites still work for this visit.
    }
  }
}

function isValidId(id: unknown): id is number {
  return Number.isInteger(id) && (id as number) >= 1 && (id as number) <= NATIONAL_DEX_SIZE;
}

// Storage is user-editable and may come from an older version of the app,
// so nothing read from it is trusted: bad ids are dropped, duplicates kept
// once, and bare numbers are accepted as records without a timestamp.
function readFavorites(): FavoriteRecord[] {
  let raw: unknown;
  try {
    raw = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) {
    return [];
  }
  const seen = new Set<number>();
  const records: FavoriteRecord[] = [];
  for (const item of raw) {
    const id = typeof item === 'number' ? item : (item as Partial<FavoriteRecord> | null)?.id;
    if (!isValidId(id) || seen.has(id)) {
      continue;
    }
    const addedAt = Number((item as Partial<FavoriteRecord> | null)?.addedAt);
    seen.add(id);
    records.push({ id, addedAt: Number.isFinite(addedAt) ? addedAt : 0 });
  }
  return records;
}
