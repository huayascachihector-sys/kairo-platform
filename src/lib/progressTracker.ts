const STORAGE_KEY = 'kairo_daily_progress';

export interface DailyEntry {
  date: string;
  questionsAnswered: number;
  correct: number;
  srsReviewed: number;
  minutesStudied: number;
  subjects: Record<string, { correct: number; total: number }>;
}

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadDailyHistory(): DailyEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveDailyHistory(entries: DailyEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function recordDailyEntry(partial: Partial<DailyEntry>): void {
  const entries = loadDailyHistory();
  const today = getTodayKey();
  let entry = entries.find(e => e.date === today);
  if (!entry) {
    entry = { date: today, questionsAnswered: 0, correct: 0, srsReviewed: 0, minutesStudied: 0, subjects: {} };
    entries.push(entry);
  }
  if (partial.questionsAnswered) entry.questionsAnswered += partial.questionsAnswered;
  if (partial.correct !== undefined) entry.correct += partial.correct;
  if (partial.srsReviewed) entry.srsReviewed += partial.srsReviewed;
  if (partial.minutesStudied) entry.minutesStudied += partial.minutesStudied;
  if (partial.subjects) {
    for (const [id, v] of Object.entries(partial.subjects)) {
      if (!entry.subjects[id]) entry.subjects[id] = { correct: 0, total: 0 };
      entry.subjects[id].correct += v.correct;
      entry.subjects[id].total += v.total;
    }
  }
  saveDailyHistory(entries);
}

export function getWeeklyData(): { day: string; answered: number; correct: number }[] {
  const entries = loadDailyHistory();
  const days: { day: string; answered: number; correct: number }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = entries.find(e => e.date === key);
    const dayLabel = d.toLocaleDateString('es', { weekday: 'short' }).slice(0, 3);
    days.push({
      day: dayLabel,
      answered: entry?.questionsAnswered || 0,
      correct: entry?.correct || 0,
    });
  }
  return days;
}

export function getOverallStats() {
  const entries = loadDailyHistory();
  const totalAnswered = entries.reduce((s, e) => s + e.questionsAnswered, 0);
  const totalCorrect = entries.reduce((s, e) => s + e.correct, 0);
  const totalSrs = entries.reduce((s, e) => s + e.srsReviewed, 0);
  const currentStreak = calcStreak(entries);
  return {
    totalAnswered,
    totalCorrect,
    accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    totalSrs,
    currentStreak,
  };
}

function calcStreak(entries: DailyEntry[]): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = entries.find(e => e.date === key);
    if (entry && entry.questionsAnswered > 0) streak++;
    else if (i > 0) break;
  }
  return streak;
}
