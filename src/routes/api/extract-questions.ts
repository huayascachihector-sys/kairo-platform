import { createFileRoute } from "@tanstack/react-router";

const STANDARD_PROMPT = `Eres un extractor de preguntas de examen. Analiza el contenido proporcionado y extrae TODAS las preguntas de opción múltiple que encuentres.

Para cada pregunta, determina:
- question: el texto de la pregunta
- options: array de 4 opciones de respuesta
- correct: índice (0-3) de la opción correcta
- explanation: explicación breve de por qué es correcta
- difficulty: "facil", "medio", o "dificil" según la complejidad

RESPONDE ÚNICAMENTE CON UN ARRAY JSON VÁLIDO. Sin markdown, sin texto adicional, solo JSON.

Ejemplo de formato:
[
  {
    "question": "¿Cuánto es 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correct": 1,
    "explanation": "2 + 2 = 4",
    "difficulty": "facil"
  }
]

Si el contenido no contiene preguntas de opción múltiple reconocibles, responde con un array vacío [].`;

const IB_PROMPT = `Eres un extractor de preguntas de exámenes IB (International Baccalaureate). Analiza el contenido proporcionado y extrae TODAS las preguntas de opción múltiple que encuentres.

Para cada pregunta, determina:
- question: el texto completo de la pregunta (incluye cualquier enunciado, gráfico descrito o contexto necesario)
- options: array de opciones de respuesta (tal como aparecen en el examen, pueden ser 4 o 5 opciones)
- correct: índice (0-based) de la opción correcta
- explanation: explica brevemente por qué es correcta, mencionando conceptos clave del programa IB
- difficulty: "facil", "medio", o "dificil" según la dificultad estimada dentro del nivel IB

Reglas importantes:
- Conserva la numeración o letras de las opciones originales si aparecen (A, B, C, D o 1, 2, 3, 4)
- Si una pregunta tiene más de 4 opciones, inclúyelas todas en el array options
- Si encuentras preguntas que no son de opción múltiple (abiertas, de desarrollo, ensayo), conviértelas a opción múltiple generando opciones plausibles si es posible, pero priorizando las que ya son de opción múltiple
- Si una pregunta hace referencia a una figura/gráfico, incluye "[Ver figura en el PDF original]" en el texto de la pregunta
- No inventes preguntas que no estén en el contenido

RESPONDE ÚNICAMENTE CON UN ARRAY JSON VÁLIDO. Sin markdown, sin texto adicional, solo JSON.

Ejemplo de formato:
[
  {
    "question": "What is the value of ∫₀¹ x² dx?",
    "options": ["1/3", "1/2", "2/3", "1"],
    "correct": 0,
    "explanation": "∫₀¹ x² dx = [x³/3]₀¹ = 1/3 - 0 = 1/3. This is a standard integration result in the IB Mathematics HL curriculum.",
    "difficulty": "medio"
  }
]

Si el contenido del curso no contiene preguntas de opción múltiple reconocibles, responde con un array vacío [].`;

export const Route = createFileRoute("/api/extract-questions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          text?: string;
          sourceName?: string;
          mode?: 'standard' | 'ib';
        };

        const text = body.text?.trim();
        if (!text || text.length < 10) {
          return Response.json(
            { error: "Se requiere contenido de texto para extraer preguntas", questions: [] },
            { status: 400 }
          );
        }

        const apiKey = process.env.OPENROUTER_API_KEY || "";
        if (!apiKey) {
          return Response.json(
            { error: "⚠️ El servicio de IA no está configurado.", questions: [] },
            { status: 503 }
          );
        }

        const truncated = text.length > 80000 ? text.slice(0, 80000) + "\n\n[... contenido truncado por límite de tamaño]" : text;

        const prompt = body.mode === 'ib' ? IB_PROMPT : STANDARD_PROMPT;

        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
              "HTTP-Referer": "https://kairo-platform.studymind.pe",
              "X-Title": "KAIRO Question Extractor",
            },
            body: JSON.stringify({
              model: "openrouter/free",
              messages: [
                { role: "system", content: prompt },
                {
                  role: "user",
                  content: `Extrae todas las preguntas del siguiente contenido de ${body.mode === 'ib' ? 'examen IB' : 'examen'}:\n\n${truncated}`,
                },
              ],
              max_tokens: 8192,
              temperature: 0.1,
              top_p: 0.95,
            }),
          });

          if (res.status === 429) {
            return Response.json({ error: "quota_exceeded", questions: [] }, { status: 429 });
          }
          if (res.status === 402) {
            return Response.json({ error: "credits_exhausted", questions: [] }, { status: 402 });
          }
          if (!res.ok) {
            const detail = await res.text();
            console.error("[api/extract-questions] error", res.status, detail);
            return Response.json({ error: `gateway_error_${res.status}`, questions: [] }, { status: 500 });
          }

          const data = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const raw = data.choices?.[0]?.message?.content ?? "";

          if (!raw || raw.trim().length === 0) {
            return Response.json(
              { error: "No se recibió respuesta del extractor", questions: [] },
              { status: 500 }
            );
          }

          let cleaned = raw.trim();
          if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/```(?:json)?\s*/g, "").trim();
          }
          if (cleaned.endsWith("```")) {
            cleaned = cleaned.slice(0, -3).trim();
          }

          try {
            const questions = JSON.parse(cleaned);
            if (!Array.isArray(questions)) {
              return Response.json({
                error: "Formato inválido: se esperaba un array",
                questions: [],
                raw: cleaned.slice(0, 500),
              }, { status: 500 });
            }
            return Response.json({ questions, error: null });
          } catch (parseErr) {
            return Response.json({
              error: "Error al parsear la respuesta JSON",
              questions: [],
              raw: cleaned.slice(0, 500),
            }, { status: 500 });
          }
        } catch (err) {
          console.error("[api/extract-questions]", err);
          return Response.json({ error: "internal_error", questions: [] }, { status: 500 });
        }
      },
    },
  },
});
