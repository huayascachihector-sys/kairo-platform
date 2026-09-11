// ─── KAIRO AI Engine — cliente del tutor + diagnóstico real ────────────────
// Las respuestas del tutor las genera el modelo en /api/chat (Gemini).
// No hay respuestas algorítmicas ni canned: todo pasa por el modelo real.

import type { StoreState } from "./store";

const SAFETY_BOILERPLATE =
  /user safety|response safety|unable to comply|pol[íi]tica de seguridad|fuera del ámbito/i;

export interface FileAttachment {
  name: string;
  type: string;
  data: string; // base64 for images, text for other files
  pageCount?: number;
  wordCount?: number;
  error?: string;
}

export interface ChatSession {
  id: string;
  startedAt: string;
  subject?: string;
  topics: string[];
  summary?: string;
  lastContext: string;
}

// ─── Memoria de sesión (contexto real de la conversación) ──────────────────

export function getSessionMemory(state: StoreState): ChatSession | null {
  const sessions = state.chatHistory
    .filter((m) => m.role === "user")
    .slice(-20);

  if (sessions.length === 0) return null;

  const lastAi = state.chatHistory.filter((m) => m.role === "ai").slice(-5);

  const topics = new Set<string>();
  for (const msg of sessions) {
    const text = msg.text.toLowerCase();
    if (text.includes("matem")) topics.add("Matemáticas");
    if (text.includes("física") || text.includes("fuerza") || text.includes("newton")) topics.add("Física");
    if (text.includes("quím") || text.includes("mole") || text.includes("tabla periódica")) topics.add("Química");
    if (text.includes("biolog") || text.includes("célula") || text.includes("genética")) topics.add("Biología");
    if (text.includes("historia") || text.includes("peru") || text.includes("independencia")) topics.add("Historia");
    if (text.includes("comunic") || text.includes("texto") || text.includes("ensayo")) topics.add("Comunicación");
    if (text.includes("inglés") || text.includes("english") || text.includes("grammar")) topics.add("Inglés");
    if (text.includes("program") || text.includes("python") || text.includes("algoritmo")) topics.add("Programación");
    if (text.includes("diagnost") || text.includes("rendimiento")) topics.add("Diagnóstico");
    if (text.includes("plan de estudio")) topics.add("Plan de Estudio");
  }

  return {
    id: `session_${Date.now()}`,
    startedAt: sessions[0]?.timestamp || new Date().toISOString(),
    topics: Array.from(topics),
    lastContext: lastAi.length > 0 ? lastAi[lastAi.length - 1].text : "",
  };
}

export function getSessionContextPrompt(state: StoreState): string {
  const session = getSessionMemory(state);
  if (!session || session.topics.length === 0) return "";

  return `\n\n[Contexto de la sesión actual: El estudiante ha estado trabajando en ${session.topics.join(", ")}. La última respuesta del tutor fue: "${session.lastContext.slice(0, 200)}"]. Continúa la conversación de forma coherente con este contexto.`;
}

// ─── Diagnóstico real (calculado sobre calificaciones del estudiante) ──────

export interface DiagnosticResult {
  topic: string;
  strength: number; // 0-100
  weakness: boolean;
  suggestion: string;
  nextLesson?: string;
}

export function diagnosePerformance(
  scoresByTopic: Record<string, number[]>
): DiagnosticResult[] {
  const results: DiagnosticResult[] = [];
  for (const [topic, scores] of Object.entries(scoresByTopic)) {
    if (scores.length === 0) continue;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const recent = scores.slice(-3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const trend = recentAvg - avg * 0.8;
    results.push({
      topic,
      strength: Math.round(avg),
      weakness: avg < 50 || trend < -10,
      suggestion: avg < 50
        ? `Necesitas reforzar ${topic}. Revisa las lecciones básicas y practica con ejercicios guiados.`
        : trend < -10
          ? `Tu rendimiento en ${topic} está bajando. Practica más ejercicios de este tema.`
          : `¡Buen trabajo en ${topic}! Sigue practicando para mantener el nivel.`,
      nextLesson: avg < 60 ? `lección-básica-${topic}` : undefined,
    });
  }
  return results.sort((a, b) => (a.weakness ? -1 : 1) - (b.weakness ? -1 : 1));
}

// ─── Llamada real al tutor (Gemini via /api/chat) ───────────────────────────

export async function getAIResponse(
  userMessage: string,
  history: Array<{ role: "user" | "model"; text: string }> = [],
  files: FileAttachment[] = [],
  sessionContext?: string
): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, history, files, sessionContext }),
    });

    if (res.status === 429) {
      return "⏳ Demasiadas consultas seguidas. Espera unos segundos y vuelve a intentarlo.";
    }
    if (res.status === 402) {
      return "💳 Se agotaron los créditos de IA del espacio de trabajo. Añádelos para seguir usando el asistente.";
    }
    if (res.status === 503) {
      return "⚠️ El servicio de IA no está configurado. Pide al administrador que revise las variables de entorno.";
    }

    if (res.ok) {
      const data = (await res.json()) as { text?: string };
      if (data.text && data.text.trim() && !SAFETY_BOILERPLATE.test(data.text)) {
        return data.text;
      }
    }

    return "⚠️ El tutor de IA no pudo responder en este momento. Inténtalo de nuevo en unos segundos.";
  } catch (err) {
    console.error("[aiEngine] Error:", err);
    return "⚠️ No se pudo conectar con el tutor de IA. Verifica tu conexión a internet e inténtalo de nuevo.";
  }
}