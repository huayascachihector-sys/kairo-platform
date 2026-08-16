// ─── KAIRO English Conversation Engine ──────────────────────────────

import type { ErrorEntry } from "./store";

const CONTEXT_KEY = "kairo_english_tutor_context";

export interface EnglishTutorContext {
  topic: string;
  context: string;
}

export function setEnglishTutorContext(ctx: EnglishTutorContext): void {
  try {
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(ctx));
  } catch {
    // localStorage unavailable
  }
}

export function getEnglishTutorContext(): EnglishTutorContext | null {
  try {
    const raw = localStorage.getItem(CONTEXT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EnglishTutorContext;
    return parsed && parsed.context ? parsed : null;
  } catch {
    return null;
  }
}

export function clearEnglishTutorContext(): void {
  try {
    localStorage.removeItem(CONTEXT_KEY);
  } catch {
    // localStorage unavailable
  }
}

export interface EnglishTutorResult {
  reply: string;
  errors: ErrorEntry[];
}

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export interface EnglishHistoryItem {
  role: "user" | "model";
  text: string;
}

const ERROR_BLOCK_PATTERN = /\[ERR\s*([\s\S]*?)\]\s*$/i;

export async function getEnglishTutorResponse(
  message: string,
  level: string,
  topic: string,
  context: string,
  history: EnglishHistoryItem[] = [],
): Promise<EnglishTutorResult> {
  try {
    const res = await fetch("/api/chat-english", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, level, topic, context, history }),
    });

    if (res.status === 429) {
      return {
        reply: "⏳ Demasiadas consultas seguidas. Espera unos segundos y vuelve a intentarlo.",
        errors: [],
      };
    }
    if (res.status === 402) {
      return {
        reply:
          "💳 Se agotaron los créditos de IA del espacio de trabajo. Añádelos para seguir usando el tutor de inglés.",
        errors: [],
      };
    }

    if (res.ok) {
      const data = (await res.json()) as { text?: string };
      if (data.text && data.text.trim()) {
        return { reply: stripErrorBlock(data.text), errors: parseErrors(data.text) };
      }
    }

    return {
      reply:
        "⚠️ No se pudo conectar con el tutor. Verifica tu conexión a internet e inténtalo de nuevo.",
      errors: [],
    };
  } catch {
    return {
      reply:
        "⚠️ No se pudo conectar con el tutor de inglés. Verifica tu conexión a internet e inténtalo de nuevo.",
      errors: [],
    };
  }
}

export function stripErrorBlock(text: string): string {
  return text.replace(ERROR_BLOCK_PATTERN, "").trim();
}

export function parseErrors(text: string): ErrorEntry[] {
  const match = text.match(ERROR_BLOCK_PATTERN);
  if (!match) return [];

  const raw = match[1].trim();
  if (!raw || raw === "[]") return [];

  try {
    const parsed = JSON.parse(raw) as Array<{
      student?: string;
      corrected?: string;
      type?: string;
      explanation?: string;
    }>;

    if (!Array.isArray(parsed)) return [];

    const validTypes = ["grammar", "vocabulary", "collocation", "pronunciation", "register"];
    return parsed
      .filter((e) => e && typeof e === "object")
      .map((e) => ({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        studentText: typeof e.student === "string" ? e.student : "",
        correctedText: typeof e.corrected === "string" ? e.corrected : "",
        explanation: typeof e.explanation === "string" ? e.explanation : "",
        type: validTypes.includes(e.type || "") ? (e.type as ErrorEntry["type"]) : "grammar",
        createdAt: new Date().toISOString(),
        resolved: false,
      }))
      .filter((e) => e.studentText && e.correctedText);
  } catch {
    return [];
  }
}
