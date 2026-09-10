// ─── KAIRO Pedagogy engine — ported from OpenTutor ───────────────────────────
// + Socratic questioning FSM

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