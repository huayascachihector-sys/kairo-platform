// ─── KAIRO Gamification Engine ─────────────────────────────────────────────
// Módulo puro: solo define constantes, cálculos y transformaciones de estado.
// Las funciones que escriben a localStorage viven en store.ts para evitar
// dependencias circulares (aquí solo se importan tipos).

import type { StoreState, QuestProgress, QuestType, LeagueDivision, LeagueState } from "./store";

// ─── Constantes ─────────────────────────────────────────────────────────────

export const MAX_HEARTS = 5;
export const HEART_REFILL_MS = 30 * 60 * 1000; // 1 corazón por 30 min
export const DAILY_XP_GOAL = 100;
export const GEM_PER_LESSON = 10;
export const GEM_PER_PERFECT = 20;
export const GEM_PER_QUEST = 15;
export const XP_BOOST_MULTIPLIER = 2;
export const XP_BOOST_DURATION_MS = 15 * 60 * 1000;

export const SHOP_ITEMS = [
  {
    id: "refill_hearts",
    name: "Recargar corazones",
    description: "Recupera todos tus corazones al instante.",
    cost: 100,
    icon: "❤️",
  },
  {
    id: "streak_freeze",
    name: "Escudo de racha",
    description: "Protege tu racha por un día si no estudias.",
    cost: 200,
    icon: "🧊",
  },
  {
    id: "xp_boost",
    name: "Doble XP",
    description: "Gana el doble de XP durante 15 minutos.",
    cost: 150,
    icon: "⚡",
  },
  {
    id: "revive",
    name: "Revivir lección",
    description: "Recupera un corazón durante una lección.",
    cost: 80,
    icon: "💊",
  },
] as const;

export type ShopItemId = (typeof SHOP_ITEMS)[number]["id"];

export const MASCOT_OUTFITS = [
  { id: "base", name: "Clásico", icon: "🦉", cost: 0 },
  { id: "graduado", name: "Graduado", icon: "🎓", cost: 300 },
  { id: "superheroe", name: "Superhéroe", icon: "🦸", cost: 500 },
  { id: "astronauta", name: "Astronauta", icon: "🚀", cost: 750 },
] as const;

export type MascotOutfitId = (typeof MASCOT_OUTFITS)[number]["id"];

export const LEAGUE_DIVISIONS: LeagueDivision[] = [
  "bronce",
  "plata",
  "oro",
  "zafiro",
  "esmeralda",
  "rubi",
  "diamante",
];

export const LEAGUE_META: Record<
  LeagueDivision,
  { label: string; color: string; promotion: number }
> = {
  bronce: { label: "Bronce", color: "#b08d57", promotion: 4 },
  plata: { label: "Plata", color: "#c0c0c0", promotion: 4 },
  oro: { label: "Oro", color: "#ffd700", promotion: 4 },
  zafiro: { label: "Zafiro", color: "#4169e1", promotion: 3 },
  esmeralda: { label: "Esmeralda", color: "#2e8b57", promotion: 3 },
  rubi: { label: "Rubí", color: "#e0115f", promotion: 3 },
  diamante: { label: "Diamante", color: "#b9f2ff", promotion: 2 },
};

// Bots ficticios para las ligas locales (modo demostración)
export const LEAGUE_BOTS: Array<{ name: string; avatar: string; xp: number }> = [
  { name: "María", avatar: "🦋", xp: 180 },
  { name: "José", avatar: "🦁", xp: 150 },
  { name: "Valentina", avatar: "🦊", xp: 120 },
  { name: "Luis", avatar: "🐯", xp: 90 },
  { name: "Camila", avatar: "🐰", xp: 70 },
  { name: "Diego", avatar: "🐼", xp: 50 },
  { name: "Sofía", avatar: "🦄", xp: 35 },
  { name: "Mateo", avatar: "🐸", xp: 20 },
  { name: "Renata", avatar: "🐙", xp: 10 },
];

// ─── Niveles ───────────────────────────────────────────────────────────────

export function getLevelFromXp(xp: number): {
  level: number;
  current: number;
  next: number;
  pct: number;
} {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const prev = 50 * Math.pow(level - 1, 2);
  const next = 50 * Math.pow(level, 2);
  const current = xp - prev;
  const pct = next > prev ? Math.min(100, Math.round((current / (next - prev)) * 100)) : 100;
  return { level, current, next, pct };
}

// ─── Corazones (energía) ────────────────────────────────────────────────────

export function getEffectiveHearts(state: StoreState): number {
  if (state.plan === "premium") return MAX_HEARTS;
  if (state.hearts >= MAX_HEARTS) return state.hearts;
  const elapsed = Date.now() - new Date(state.lastHeartRefillAt).getTime();
  const refilled = Math.floor(elapsed / HEART_REFILL_MS);
  return Math.min(MAX_HEARTS, state.hearts + refilled);
}

export function getHeartRefillMs(state: StoreState): number | null {
  if (state.plan === "premium" || state.hearts >= MAX_HEARTS) return null;
  const elapsed = Date.now() - new Date(state.lastHeartRefillAt).getTime();
  return HEART_REFILL_MS - (elapsed % HEART_REFILL_MS);
}

export function getHeartsLeft(state: StoreState): number {
  const h = getEffectiveHearts(state);
  return state.plan === "premium" ? Infinity : h;
}

export function canStartLesson(state: StoreState): boolean {
  return state.plan === "premium" || getEffectiveHearts(state) > 0;
}

// ─── XP boost ───────────────────────────────────────────────────────────────

export function getEffectiveBoost(state: StoreState): number {
  if (state.xpBoostUntil && Date.now() < new Date(state.xpBoostUntil).getTime()) {
    return state.xpBoostMultiplier;
  }
  return 1;
}

export function getBoostRemainingMs(state: StoreState): number {
  if (!state.xpBoostUntil) return 0;
  return Math.max(0, new Date(state.xpBoostUntil).getTime() - Date.now());
}

// ─── Ligas ──────────────────────────────────────────────────────────────────

export function getLeagueRanking(state: StoreState) {
  const my = state.league.weeklyXP;
  const rows = [
    ...LEAGUE_BOTS.map((b) => ({ ...b, isYou: false })),
    { name: (state.user?.name || "Tú").split(" ")[0], avatar: "⭐", xp: my, isYou: true },
  ].sort((a, b) => b.xp - a.xp);
  const youPos = rows.findIndex((r) => r.isYou);
  return { rows, youPos: youPos === -1 ? rows.length - 1 : youPos, total: rows.length };
}

export function getLeagueNextDivision(division: LeagueDivision): LeagueDivision | null {
  const idx = LEAGUE_DIVISIONS.indexOf(division);
  return idx >= 0 && idx < LEAGUE_DIVISIONS.length - 1 ? LEAGUE_DIVISIONS[idx + 1] : null;
}

export function getLeaguePrevDivision(division: LeagueDivision): LeagueDivision | null {
  const idx = LEAGUE_DIVISIONS.indexOf(division);
  return idx > 0 ? LEAGUE_DIVISIONS[idx - 1] : null;
}

export function isLeaguePromotable(state: StoreState): boolean {
  const { youPos, total } = getLeagueRanking(state);
  const meta = LEAGUE_META[state.league.division];
  return youPos < meta.promotion && !!getLeagueNextDivision(state.league.division);
}

export function isLeagueDemotable(state: StoreState): boolean {
  const { youPos, total } = getLeagueRanking(state);
  return youPos >= total - 2 && !!getLeaguePrevDivision(state.league.division);
}

// ─── Misiones diarias (Daily Quests) ────────────────────────────────────────

const QUEST_TEMPLATES: Array<{
  type: QuestType;
  title: string;
  description: string;
  target: (level: number) => number;
  reward: number;
}> = [
  {
    type: "xp",
    title: "Gana XP",
    description: "Consigue {n} XP hoy",
    target: (level) => 20 + level * 5,
    reward: 50,
  },
  {
    type: "lessons",
    title: "Lección tras lección",
    description: "Completa {n} lección(es)",
    target: () => 2,
    reward: 60,
  },
  {
    type: "practice",
    title: "Práctica de repaso",
    description: "Practica {n} veces en el hub de práctica",
    target: () => 3,
    reward: 40,
  },
  {
    type: "perfect",
    title: "Impecable",
    description: "Saca 100% en {n} lección(es)",
    target: () => 1,
    reward: 70,
  },
  {
    type: "streak",
    title: "Racha encendida",
    description: "Estudia hoy y mantén tu racha viva",
    target: () => 1,
    reward: 30,
  },
];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDailyQuests(state: StoreState, seed: number): QuestProgress[] {
  const rand = mulberry32(seed);
  const { level } = getLevelFromXp(state.xp);
  const pool = [...QUEST_TEMPLATES];
  const chosen: QuestProgress[] = [];
  while (chosen.length < 3 && pool.length > 0) {
    const idx = Math.floor(rand() * pool.length);
    const t = pool.splice(idx, 1)[0];
    const target = t.target(level);
    chosen.push({
      id: t.type,
      title: t.title,
      description: t.description.replace("{n}", String(target)),
      type: t.type,
      target,
      progress: 0,
      reward: t.reward,
      completed: false,
      claimed: false,
    });
  }
  return chosen;
}

export function advanceQuestType(
  quests: QuestProgress[],
  type: QuestType,
  amount: number,
): QuestProgress[] {
  return quests.map((q) =>
    q.type === type && !q.completed
      ? {
          ...q,
          progress: Math.min(q.target, q.progress + amount),
          completed: q.progress + amount >= q.target,
        }
      : q,
  );
}

export function getDailyQuestsDone(quests: QuestProgress[]): number {
  return quests.filter((q) => q.completed && q.claimed).length;
}

export function getDailyQuestsClaimableXP(quests: QuestProgress[]): number {
  return quests.filter((q) => q.completed && !q.claimed).reduce((s, q) => s + q.reward, 0);
}

// ─── Utilidades de fecha ────────────────────────────────────────────────────

export function getMondayKey(d: Date = new Date()): string {
  const date = new Date(d);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

export function getTodayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function isSameDay(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}

// ─── Estado diario y semanal (reset automático) ─────────────────────────────

export function ensureDailyState(state: StoreState): void {
  const today = getTodayKey();
  if (state.dailyXp.date !== today) {
    state.dailyXp = { date: today, xp: 0 };
  }
  if (state.lastQuestDate !== today || state.dailyQuests.length === 0) {
    state.lastQuestDate = today;
    const seed = parseInt(today.replace(/-/g, ""), 10);
    state.dailyQuests = generateDailyQuests(state, seed);
  }
  const monday = getMondayKey();
  if (state.league.weekStart !== monday) {
    const wasActive = state.league.weeklyXP > 0;
    let nextDivision: LeagueDivision | null = state.league.division;
    if (wasActive) {
      nextDivision = isLeaguePromotable(state)
        ? getLeagueNextDivision(state.league.division)
        : isLeagueDemotable(state)
          ? getLeaguePrevDivision(state.league.division)
          : state.league.division;
    }
    state.league.weekStart = monday;
    state.league.weeklyXP = 0;
    state.league.position = 1;
    if (nextDivision) state.league.division = nextDivision;
  }
}

export function applyStreak(state: StoreState): void {
  const today = new Date().toDateString();
  if (state.lastStudyDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (state.lastStudyDate === yesterday) {
    state.streak += 1;
  } else if (state.streakFreezes > 0 && state.streak > 0) {
    state.streakFreezes -= 1;
  } else {
    state.streak = 1;
  }
  state.lastStudyDate = today;
}

export interface GameRewardOpts {
  xp: number;
  quests?: Array<{ type: QuestType; amount: number }>;
  gems?: number;
}

export function applyGameRewards(state: StoreState, opts: GameRewardOpts): void {
  ensureDailyState(state);
  const boost = getEffectiveBoost(state);
  const gained = Math.max(0, Math.round(opts.xp * boost));
  state.xp += gained;
  state.dailyXp.xp += gained;
  state.league.weeklyXP += gained;
  state.gems += opts.gems ?? 0;
  applyStreak(state);
  for (const q of opts.quests ?? []) {
    state.dailyQuests = advanceQuestType(state.dailyQuests, q.type, q.amount);
  }
}

// ─── Utilidades de fecha (alias) ────────────────────────────────────────────
