import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'quickbite_favorites';

let cachedIds: string[] = [];
let cachedSnapshot: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function setIds(ids: string[]) {
  const unique = [...new Set(ids)];
  cachedIds = unique;
  // Sorted so the persisted JSON is stable regardless of toggle order
  cachedSnapshot = new Set(unique);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...unique].sort()));
  } catch {
    // Storage full/blocked — keep in-memory state
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ReadonlySet<string> {
  return cachedSnapshot;
}

// Initialise once at module load
setIds(loadFromStorage());

/** Set of favourited meal ids. Re-renders all consumers when any card toggles. */
export function useFavorites(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function toggleFavorite(id: string) {
  setIds(cachedIds.includes(id) ? cachedIds.filter((i) => i !== id) : [...cachedIds, id]);
}

export function isFavorite(id: string): boolean {
  return cachedSnapshot.has(id);
}
