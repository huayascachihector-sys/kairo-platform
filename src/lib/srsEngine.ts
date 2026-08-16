export type SRSAction = 'again' | 'hard' | 'good' | 'easy';

export interface SRSCardData {
  ease: number;
  interval: number;
  dueDate: number;
  repetitions: number;
  totalReviews: number;
  correctCount: number;
  incorrectCount: number;
}

export interface SRSReview {
  cardId: string;
  subjectId: string;
  level?: string;
  dueDate: number;
  data: SRSCardData;
}

const STORAGE_KEY = 'kairo_srs_cards';

export function createInitialSRSData(): SRSCardData {
  return {
    ease: 2.5,
    interval: 0,
    dueDate: Date.now(),
    repetitions: 0,
    totalReviews: 0,
    correctCount: 0,
    incorrectCount: 0,
  };
}

export function calculateNextReview(prev: SRSCardData, action: SRSAction, now: number = Date.now()): SRSCardData {
  const next = { ...prev };
  next.totalReviews++;

  if (action === 'again') {
    next.incorrectCount++;
    next.ease = Math.max(1.3, prev.ease - 0.2);
    next.interval = 1;
    next.repetitions = 0;
  } else {
    next.correctCount++;
    if (action === 'hard') {
      next.ease = Math.max(1.3, prev.ease - 0.15);
      next.interval = Math.max(1, Math.round(prev.interval * 1.2));
      next.repetitions++;
    } else if (action === 'good') {
      if (prev.repetitions === 0) next.interval = 1;
      else if (prev.repetitions === 1) next.interval = 6;
      else next.interval = Math.round(prev.interval * prev.ease);
      next.repetitions++;
    } else if (action === 'easy') {
      if (prev.repetitions === 0) next.interval = 4;
      else if (prev.repetitions === 1) next.interval = 10;
      else next.interval = Math.round(prev.interval * prev.ease * 1.3);
      next.ease = prev.ease + 0.15;
      next.repetitions++;
    }
  }

  next.dueDate = now + next.interval * 86400000;
  return next;
}

export function loadAllCards(): Map<string, SRSCardData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    return new Map(JSON.parse(raw));
  } catch {
    return new Map();
  }
}

export function saveAllCards(cards: Map<string, SRSCardData>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(cards.entries())));
  } catch {
    // Storage full or unavailable
  }
}

export function getCardData(cardId: string): SRSCardData | null {
  const cards = loadAllCards();
  return cards.get(cardId) ?? null;
}

export function updateCardData(cardId: string, action: SRSAction): SRSCardData {
  const cards = loadAllCards();
  const prev = cards.get(cardId) ?? createInitialSRSData();
  const next = calculateNextReview(prev, action);
  cards.set(cardId, next);
  saveAllCards(cards);
  return next;
}

export function batchUpdateCards(updates: Array<{ cardId: string; action: SRSAction }>): void {
  const cards = loadAllCards();
  for (const { cardId, action } of updates) {
    const prev = cards.get(cardId) ?? createInitialSRSData();
    const next = calculateNextReview(prev, action);
    cards.set(cardId, next);
  }
  saveAllCards(cards);
}

export function getDueCards(now: number = Date.now()): SRSReview[] {
  const cards = loadAllCards();
  const due: SRSReview[] = [];
  for (const [cardId, data] of cards) {
    if (data.dueDate <= now) {
      const parts = cardId.split(':');
      due.push({
        cardId,
        subjectId: parts[1] || 'unknown',
        level: parts[2],
        dueDate: data.dueDate,
        data,
      });
    }
  }
  return due.sort((a, b) => a.dueDate - b.dueDate);
}

export function getDueCount(now: number = Date.now()): number {
  const cards = loadAllCards();
  let count = 0;
  for (const [, data] of cards) {
    if (data.dueDate <= now) count++;
  }
  return count;
}

export function getStats() {
  const cards = loadAllCards();
  let total = 0;
  let due = 0;
  let learned = 0;
  let correct = 0;
  let incorrect = 0;
  const now = Date.now();

  for (const [, data] of cards) {
    total++;
    if (data.dueDate <= now) due++;
    if (data.repetitions >= 3) learned++;
    correct += data.correctCount;
    incorrect += data.incorrectCount;
  }

  return { total, due, learned, correct, incorrect, retention: total > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0 };
}

export function buildCardId(source: 'bank' | 'ib' | 'imported' | 'error', ...parts: string[]): string {
  return [source, ...parts].join(':');
}

export function parseCardId(cardId: string): { source: string; parts: string[] } {
  const parts = cardId.split(':');
  return { source: parts[0], parts: parts.slice(1) };
}
