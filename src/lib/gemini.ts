// ─── KAIRO Gemini Client — único punto de acceso al modelo de Google ──────

export interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

type SafetyThreshold =
  | "BLOCK_NONE"
  | "BLOCK_ONLY_HIGH"
  | "BLOCK_MEDIUM_AND_ABOVE"
  | "BLOCK_LOW_AND_ABOVE";

const SAFETY_SETTINGS: Array<{ category: string; threshold: SafetyThreshold }> = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
];

// Solo existe en el servidor (estas rutas corren en Nitro). Nunca exponer la
// clave en el cliente: no usar variables VITE_* para esto.
const GEMINI_API_KEY: string =
  typeof process !== "undefined" && process.env
    ? process.env.GEMINI_API_KEY || ""
    : "";

export const GEMINI_MODEL: string =
  typeof process !== "undefined" && process.env && process.env.GEMINI_MODEL
    ? process.env.GEMINI_MODEL
    : "gemini-2.0-flash";

export function hasGeminiKey(): boolean {
  return GEMINI_API_KEY.length > 1;
}

export interface GenerateGeminiOptions {
  systemInstruction?: string;
  contents: GeminiContent[];
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  responseMimeType?: "text/plain" | "application/json";
}

export interface GeminiResult {
  status: number;
  text: string;
}

export async function generateGeminiText(
  opts: GenerateGeminiOptions
): Promise<GeminiResult> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: opts.systemInstruction
          ? { parts: [{ text: opts.systemInstruction }] }
          : undefined,
        contents: opts.contents,
        generationConfig: {
          temperature: opts.temperature ?? 0.7,
          maxOutputTokens: opts.maxOutputTokens ?? 4096,
          topP: opts.topP ?? 0.95,
          ...(opts.responseMimeType
            ? { responseMimeType: opts.responseMimeType }
            : {}),
        },
        safetySettings: SAFETY_SETTINGS,
      }),
    });

    if (res.status === 429) {
      console.error("[gemini] cuota agotada (429)");
      return { status: 429, text: "" };
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[gemini] error", res.status, detail.slice(0, 500));
      return { status: res.status, text: "" };
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      promptFeedback?: { blockReason?: string };
    };

    if (data.promptFeedback?.blockReason) {
      console.warn("[gemini] bloqueado:", data.promptFeedback.blockReason);
      return { status: 200, text: "" };
    }

    const text = data.candidates
      ?.flatMap((c) => c.content?.parts?.map((p) => p.text ?? "") ?? [])
      .join("");

    return { status: 200, text: text ?? "" };
  } catch (err) {
    console.error("[gemini] error de red", err);
    return { status: 0, text: "" };
  }
}