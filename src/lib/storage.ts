// ─── Storage Adapter ─────────────────────────────────────────────────────────
// Capa de persistencia desacoplada: hoy usa localStorage, mañana puede apuntar
// a un backend (Supabase/Firebase) sin tocar el resto del código.

export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export const localStorageAdapter: StorageAdapter = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // storage lleno o no disponible
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

const memoryStore = new Map<string, string>();

export const memoryAdapter: StorageAdapter = {
  get: (key) => memoryStore.get(key) ?? null,
  set: (key, value) => {
    memoryStore.set(key, value);
  },
  remove: (key) => {
    memoryStore.delete(key);
  },
};

let activeAdapter: StorageAdapter = localStorageAdapter;

export function setStorageAdapter(adapter: StorageAdapter): void {
  activeAdapter = adapter;
}

export function getStorageAdapter(): StorageAdapter {
  return activeAdapter;
}

export function storageGet(key: string): string | null {
  return activeAdapter.get(key);
}

export function storageSet(key: string, value: string): void {
  activeAdapter.set(key, value);
}

export function storageRemove(key: string): void {
  activeAdapter.remove(key);
}
