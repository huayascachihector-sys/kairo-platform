// ─── KAIRO Pedagogy engine — ported from OpenTutor ───────────────────────────
// + Socratic questioning FSM
// + FSRS-5/6 spaced repetition
// + Question metadata schema (8 question types, Bloom levels, difficulty layers)

export type SocraticState = "probe" | "clarify" | "confront" | "scaffold" | "confirm";

export type ResponseQuality =
  | "correct"
  | "partial"
  | "wrong"
  | "confused"
  | "no_response";

// ── Socratic state machine ───────────────────────────────────────────────────

const KEY_VALUES: Record<SocraticState, string> = {
  probe: "probe",
  clarify: "clarify",
  confront: "confront",
  scaffold: "scaffold",
  confirm: "confirm",
};

export const SOCRATIC_STATES: SocraticState[] = [
  "probe",
  "clarify",
  "confront",
  "scaffold",
  "confirm",
];

// (current_state, response_quality) -> next_state
const SOCRATIC_TRANSITIONS: Record<SocraticState, Record<ResponseQuality, SocraticState>> = {
  probe: {
    correct: "confirm",
    partial: "clarify",
    wrong: "confront",
    confused: "scaffold",
    no_response: "scaffold",
  },
  clarify: {
    correct: "confirm",
    partial: "scaffold",
    wrong: "confront",
    confused: "scaffold",
    no_response: "scaffold",
  },
  confront: {
    correct: "confirm",
    partial: "clarify",
    wrong: "scaffold",
    confused: "scaffold",
    no_response: "scaffold",
  },
  scaffold: {
    correct: "probe",
    partial: "clarify",
    wrong: "scaffold",
    confused: "scaffold",
    no_response: "scaffold",
  },
  confirm: {
    correct: "probe",
    partial: "clarify",
    wrong: "clarify",
    confused: "scaffold",
    no_response: "scaffold",
  },
};

const SOCRATIC_DIRECTIVES: Record<SocraticState, string> = {
  probe:
    "Haz al alumno una pregunta abierta sobre el concepto. No des la respuesta; deja que razone.",
  clarify:
    "La comprensión del alumno es vaga. Haz una pregunta más concreta para precisar qué entiende y qué no.",
  confront:
    "El alumno tiene una idea errónea. Presenta un contraejemplo que desafíe su entendimiento sin decirle que está mal.",
  scaffold:
    "El alumno necesita ayuda. Da UNA pista pequeña que lo acerque a la respuesta sin resolverle el problema. Divide en un paso menor.",
  confirm:
    "El alumno parece entender. Verifica con una pregunta de transferencia: que aplique el concepto en un contexto ligeramente distinto.",
};

const MAX_SCAFFOLD_TURNS = 4;

export interface SocraticContext {
  mastery: number; // 0-1
  cognitiveLoad: number; // 0-1
  errorType?: "conceptual" | "procedural" | "computational" | null;
}

export class SocraticEngine {
  state: SocraticState;
  turnsInState: number;
  mastery: number;
  cognitiveLoad: number;
  errorType: SocraticContext["errorType"];

  constructor(ctx: Partial<SocraticContext> & { state?: SocraticState; turnsInState?: number } = {}) {
    this.mastery = ctx.mastery ?? 0.5;
    this.cognitiveLoad = ctx.cognitiveLoad ?? 0;
    this.errorType = ctx.errorType ?? null;
    this.state = ctx.state ?? this.initialState();
    this.turnsInState = ctx.turnsInState ?? 0;
  }

  initialState(): SocraticState {
    if (this.cognitiveLoad > 0.7) return "scaffold";
    if (this.mastery < 0.3) return "scaffold";
    if (this.mastery > 0.7) return "probe";
    if (this.errorType === "conceptual") return "confront";
    if (this.errorType === "procedural" || this.errorType === "computational") return "scaffold";
    return "clarify";
  }

  transition(quality: ResponseQuality): SocraticState {
    const next = SOCRATIC_TRANSITIONS[this.state][quality] ?? "scaffold";
    if (next === this.state) {
      this.turnsInState += 1;
    } else {
      this.turnsInState = 0;
      this.state = next;
    }
    return this.state;
  }

  getDirective(): string {
    let d = SOCRATIC_DIRECTIVES[this.state];
    if (this.state === "scaffold" && this.turnsInState >= MAX_SCAFFOLD_TURNS) {
      d =
        "El alumno lleva varias rondas con dificultad. Da una explicación clara y directa con un ejemplo resuelto, y luego una pregunta sencilla para verificar que entendió.";
    }
    return `## Estrategia: ${KEY_VALUES[this.state].toUpperCase()}\n${d}`;
  }

  snapshot() {
    return {
      state: this.state,
      turnsInState: this.turnsInState,
      mastery: this.mastery,
      cognitiveLoad: this.cognitiveLoad,
      errorType: this.errorType,
    };
  }
}

// ── Question metadata (8 types, Bloom, difficulty layers) ────────────────────

export type QuestionType =
  | "mc"
  | "tf"
  | "short_answer"
  | "fill_blank"
  | "matching"
  | "select_all"
  | "free_response"
  | "coding";

export type BloomLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export const QUESTION_TYPES: Record<QuestionType, string> = {
  mc: "Opción múltiple — una respuesta correcta entre 4 opciones",
  tf: "Verdadero/Falso",
  short_answer: "Respuesta breve",
  fill_blank: "Completar el espacio en blanco",
  matching: "Emparejar elementos de dos columnas",
  select_all: "Seleccionar todas las que apliquen",
  free_response: "Respuesta extendida",
  coding: "Código — evaluado por IA",
};

export interface ProblemMetadata {
  difficultyLayer: 1 | 2 | 3;
  coreConcept: string;
  bloomLevel: BloomLevel;
  potentialTraps: string[];
  layerJustification: string;
  skillFocus: string;
  sourceSection?: string;
}

export interface PracticeProblem {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  questionType: QuestionType;
  question: string;
  options?: { [label: string]: string };
  correctAnswer: string;
  explanation: string;
  difficultyLayer: 1 | 2 | 3;
  metadata: ProblemMetadata;
  orderIndex: number;
}

// ── FSRS-5/6 spaced repetition ───────────────────────────────────────────────

export const FSRS_DEFAULT_W = [
  0.4, 0.6, 2.4, 5.8, //
  4.93, 0.94, 0.86, 0.01,
  1.49, 0.14, 0.94,
  2.18, 0.05, 0.34, 1.26,
  0.29, 2.61,
  0.0, 0.0, 0.0,
  1.0,
];

export type FSRSRating = 1 | 2 | 3 | 4;

export interface FSRSCard {
  difficulty: number;
  stability: number;
  reps: number;
  lapses: number;
  lastReview?: number; // epoch ms
  due?: number; // epoch ms
  state: "new" | "learning" | "review" | "relearning";
}

export interface ReviewLog {
  rating: FSRSRating;
  scheduledDays: number;
  state: string;
  reviewTime: number;
}

const initialStability = (rating: number, w = FSRS_DEFAULT_W): number =>
  Math.max(w[rating - 1], 0.1);

const initialDifficulty = (rating: number, w = FSRS_DEFAULT_W): number => {
  const d = w[4] - Math.exp(w[5] * (rating - 1)) + 1;
  return Math.min(Math.max(d, 1), 10);
};

const nextDifficulty = (d: number, rating: number, w = FSRS_DEFAULT_W): number => {
  const delta_d = -w[6] * (rating - 3);
  let d_new = d + (delta_d * (10 - d)) / 9;
  d_new = w[7] * initialDifficulty(4, w) + (1 - w[7]) * d_new;
  return Math.min(Math.max(d_new, 1), 10);
};

const retrievability = (elapsedDays: number, stability: number, w = FSRS_DEFAULT_W): number => {
  if (stability <= 0) return 0;
  const decay = w.length > 20 ? w[20] : 1.0;
  const factor = 9 * decay;
  return Math.pow(1 + elapsedDays / (factor * stability), -decay);
};

const nextStability = (
  d: number,
  s: number,
  r: number,
  rating: number,
  w = FSRS_DEFAULT_W,
): number => {
  if (rating === 1) {
    return Math.max(w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp((1 - r) * w[14]), 0.1);
  }
  const hardPenalty = rating === 2 ? w[15] : 1.0;
  const easyBonus = rating === 4 ? w[16] : 1.0;
  const newS =
    s *
    (1 +
      Math.exp(w[8]) *
        (11 - d) *
        Math.pow(s, -w[9]) *
        (Math.exp((1 - r) * w[10]) - 1) *
        hardPenalty *
        easyBonus);
  return Math.max(newS, 0.1);
};

const sameDayStability = (s: number, rating: number, w = FSRS_DEFAULT_W): number => {
  if (w.length <= 19 || (w[17] === 0 && w[18] === 0 && w[19] === 0)) return s;
  const newS = s * Math.exp(w[17] * (rating - 3 + w[18])) * Math.pow(s, -w[19]);
  return Math.max(newS, 0.1);
};

export function newCard(): FSRSCard {
  return { difficulty: 5, stability: 0, reps: 0, lapses: 0, state: "new" };
}

export function reviewCard(card: FSRSCard, rating: FSRSRating, now: Date = new Date()): { card: FSRSCard; log: ReviewLog } {
  const elapsedDays = card.lastReview ? (now.getTime() - card.lastReview) / 86400000 : 0;
  const oldState = card.state;
  const c = { ...card };

  if (c.state === "new" || c.reps === 0) {
    c.difficulty = initialDifficulty(rating);
    c.stability = initialStability(rating);
    c.state = rating < 3 ? "learning" : "review";
  } else {
    const r = retrievability(elapsedDays, c.stability);
    if (elapsedDays < 1.0 && c.reps > 0) {
      c.stability = sameDayStability(c.stability, rating);
    } else {
      c.stability = nextStability(c.difficulty, c.stability, r, rating);
    }
    c.difficulty = nextDifficulty(c.difficulty, rating);
    if (rating === 1) {
      c.lapses += 1;
      c.state = "relearning";
    } else {
      c.state = "review";
    }
  }

  c.reps += 1;

  let scheduledDays: number;
  if (rating === 1) scheduledDays = 1;
  else if (c.state === "learning") scheduledDays = 1;
  else scheduledDays = Math.max(1, Math.round(c.stability));

  c.due = now.getTime() + scheduledDays * 86400000;

  const correct = c.stability;
  return {
    card: c,
    log: {
      rating,
      scheduledDays,
      state: oldState,
      reviewTime: now.getTime(),
    },
  };
}