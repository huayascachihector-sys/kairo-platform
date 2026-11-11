// ─── KAIRO Premium — activación y progreso de cursos IB ────────────────────
//
// Módulo aislado (localStorage, sin dependencias del store principal):
//  - Activación libre "modo demo": cualquier usuario puede activar Premium.
//  - Progreso de cursos premium (abierto / completado) por curso y materia.

const ACTIVE_KEY = "kairo.premium.active";
const PROGRESS_KEY = "kairo.premium.progress";

export interface PremiumCourseProgress {
  startedAt: string | null;
  completedAt: string | null;
  lastOpenedAt: string | null;
}

export type PremiumProgressMap = Record<string, PremiumCourseProgress>;

type Listener = () => void;
const listeners = new Set<Listener>();

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function notify(): void {
  for (const fn of listeners) fn();
}

function safeGet(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    console.warn("[premium] no se pudo guardar en localStorage");
  }
}

// ─── Activación (modo demo, libre) ──────────────────────────────────────────

export function isPremiumActive(): boolean {
  return safeGet(ACTIVE_KEY) === "1";
}

export function activatePremium(): void {
  safeSet(ACTIVE_KEY, "1");
  notify();
}

export function deactivatePremium(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* noop */
  }
  notify();
}

/** Suscripción para que los componentes React reaccionen a cambios. */
export function subscribePremium(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === ACTIVE_KEY || e.key === PROGRESS_KEY) {
      listener();
    }
  };
  if (isBrowser()) {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (isBrowser()) {
      window.removeEventListener("storage", onStorage);
    }
  };
}

// ─── Progreso de cursos ────────────────────────────────────────────────────

function readProgress(): PremiumProgressMap {
  const raw = safeGet(PROGRESS_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as PremiumProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeProgress(map: PremiumProgressMap): void {
  safeSet(PROGRESS_KEY, JSON.stringify(map));
  notify();
}

export function getPremiumProgressMap(): PremiumProgressMap {
  return readProgress();
}

export function getPremiumCourseProgress(courseId: string): PremiumCourseProgress | null {
  return readProgress()[courseId] ?? null;
}

export function markPremiumCourseOpened(courseId: string): void {
  const map = readProgress();
  const prev = map[courseId];
  const now = new Date().toISOString();
  map[courseId] = {
    startedAt: prev?.startedAt ?? now,
    completedAt: prev?.completedAt ?? null,
    lastOpenedAt: now,
  };
  writeProgress(map);
}

export function markPremiumCourseCompleted(courseId: string): void {
  const map = readProgress();
  const prev = map[courseId];
  const now = new Date().toISOString();
  map[courseId] = {
    startedAt: prev?.startedAt ?? now,
    completedAt: prev?.completedAt ?? now,
    lastOpenedAt: now,
  };
  writeProgress(map);
}

export function resetPremiumCourseProgress(courseId: string): void {
  const map = readProgress();
  if (courseId in map) {
    delete map[courseId];
    writeProgress(map);
  }
}

export interface PremiumSubjectStats {
  total: number;
  started: number;
  completed: number;
  pct: number;
}

/** Estadísticas de avance sobre una lista de ids de cursos premium. */
export function getPremiumStats(courseIds: string[]): PremiumSubjectStats {
  const map = readProgress();
  let started = 0;
  let completed = 0;
  for (const id of courseIds) {
    const p = map[id];
    if (p?.completedAt) {
      completed++;
      started++;
    } else if (p?.startedAt) {
      started++;
    }
  }
  const total = courseIds.length;
  return {
    total,
    started,
    completed,
    pct: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
