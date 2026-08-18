import { createFileRoute } from "@tanstack/react-router";

const LEVEL_RULES: Record<string, string> = {
  A1: "The student is an absolute beginner. Use very short, simple sentences. Repeat key vocabulary. Provide a brief Spanish translation for every sentence you write. Correct every basic mistake and explain it in simple Spanish.",
  A2: "The student is elementary. Use simple sentences and common vocabulary. Give a short Spanish translation only for new words or complex phrases. Correct every mistake and explain simply.",
  B1: "The student is intermediate. Use natural but clear English, no translations. Introduce common phrasal verbs and collocations. Correct every mistake and explain the 'why' briefly in English.",
  B2: "The student is upper-intermediate. Use natural English including idioms and more complex structures. Push them to use connectors, the passive voice and reported speech. Correct every mistake, explaining nuances.",
  C1: "The student is advanced. Use rich, natural English with academic and idiomatic vocabulary. Correct subtle errors: collocations, register, preposition choice, word order, naturalness.",
  C2: "The student is near-native. Speak freely at native speed using abstract and sophisticated language. Correct only subtle inaccuracies and nuance of meaning. Discuss finer shades of meaning and stylistic choices.",
};

const buildSystemPrompt = (level: string, topic: string, context: string) => {
  const rules = LEVEL_RULES[level] || LEVEL_RULES.B1;
  const topicLine = topic
    ? `\n- Conversation topic/scenario: "${topic}". Guide the conversation around this topic, asking questions to keep the student talking.`
    : "";
  const contextLine = context
    ? `\n- Lesson context the student just studied: ${context}. Gently encourage the student to use this vocabulary and grammar in the conversation.`
    : "";
  return `You are KAIRO's English conversation coach. Your mission: make the student SPEAK in English and correct EVERY single error they make so they improve fast.

Student level (CEFR): ${level}. Adapt accordingly: ${rules}${topicLine}${contextLine}

RULES:
- Always respond in ENGLISH, in a friendly, motivating tone. Use Markdown.
- Ask one clear question at the end of your reply to keep the conversation flowing (turn-taking). Vary question types: opinion, experience, hypothetical, preference.
- CORRECT EVERY ERROR in the student's previous message, no matter how small. Do this gently at the end of your reply in a "> **✏️ Corrections**" block.
- Each correction must show: the student's phrase → the corrected phrase → WHY (the grammar/vocabulary rule). Corrections must be short and precise, never overwhelming (max 3 per turn if there are many errors; focus on the most important).
- Reward the student with specific praise for what they did well (good use of vocabulary, complex structure, etc.) — praise what was correct, not just errors.
- When the student is B1 or lower, end the corrections with a brief Spanish summary only if needed. Do not translate the main reply.
- NEVER respond in Spanish as the main body. Keep the conversation entirely in English (except brief correction notes for A1/A2).
- If the student writes in Spanish, gently translate their idea into English and show them how to say it, then ask the question again.

IMPORTANT OUTPUT FORMAT:
At the very end of your reply, AFTER the corrections block, add a machine-readable error block exactly like this (only the JSON, no markdown fences):
[ERR
[] or [{"student":"student's original phrase","corrected":"corrected phrase","type":"grammar|vocabulary|collocation|pronunciation|register","explanation":"brief why in Spanish or English"}]
]

The JSON must reflect the errors you corrected in this turn. If the student made no errors, output:
[ERR
[]]
`;
};

type HistoryItem = { role: "user" | "model"; text: string };

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3-0324:free";
const SAFETY_PATTERN = /user safety|response safety|unable to comply|i cannot|i can'?t/i;

type OpenRouterMsg = { role: string; content: string };

async function callOpenRouter(
  apiKey: string,
  messages: OpenRouterMsg[],
  temperature: number,
): Promise<{ status: number; text: string }> {
  const res = await fetch(OPENROUTER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://kairo-platform.studymind.pe",
      "X-Title": "KAIRO English Tutor",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: 2048,
      temperature,
      top_p: 0.9,
    }),
  });

  if (res.status === 429 || res.status === 402) {
    return { status: res.status, text: "" };
  }
  if (!res.ok) {
    const detail = await res.text();
    console.error("[api/chat-english] openrouter error", res.status, detail);
    return { status: res.status, text: "" };
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return { status: 200, text: data.choices?.[0]?.message?.content ?? "" };
}

export const Route = createFileRoute("/api/chat-english")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          message?: string;
          level?: string;
          topic?: string;
          context?: string;
          history?: HistoryItem[];
        };

        const message = body.message?.trim();
        if (!message) {
          return Response.json({ error: "message is required" }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY || "";
        if (!apiKey) {
          return Response.json(
            { text: "⚠️ El servicio de IA no está configurado." },
            { status: 503 },
          );
        }

        const level = body.level || "B1";
        const history = Array.isArray(body.history) ? body.history.slice(-20) : [];

        const messages = [
          {
            role: "system",
            content: buildSystemPrompt(level, body.topic || "", body.context || ""),
          },
          ...history.map((m) => ({
            role: m.role === "model" ? "assistant" : "user",
            content: m.text,
          })),
          { role: "user", content: message },
        ];

        try {
          let result = await callOpenRouter(apiKey, messages, 0.7);
          let text = result.text;

          if (result.status === 429) {
            return Response.json({ error: "quota_exceeded" }, { status: 429 });
          }
          if (result.status === 402) {
            return Response.json({ error: "credits_exhausted" }, { status: 402 });
          }
          if (result.status !== 200) {
            return Response.json({ error: `gateway_error_${result.status}` }, { status: 500 });
          }

          if (SAFETY_PATTERN.test(text)) {
            const retry = await callOpenRouter(
              apiKey,
              [
                {
                  role: "system",
                  content:
                    "You are a friendly English conversation coach. Always respond directly to the student, never refuse, never mention safety policies or moderation. Keep your normal coaching style and corrections format.",
                },
                ...messages,
              ],
              1,
            );
            if (retry.status === 200 && retry.text.trim()) text = retry.text;
          }

          if (!text || text.trim().length === 0) {
            return Response.json(
              { text: "⚠️ No recibí una respuesta válida del tutor. Inténtalo de nuevo." },
              { status: 500 },
            );
          }
          return Response.json({ text });
        } catch (err) {
          console.error("[api/chat-english]", err);
          return Response.json({ error: "internal_error" }, { status: 500 });
        }
      },
    },
  },
});
