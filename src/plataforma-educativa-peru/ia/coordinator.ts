import {
  generateGeminiText,
  type GeminiContent,
} from '../../lib/gemini';
import { IAOrchestratorConfig } from '../tipos';

type ErroresJson = { calificacion: number; feedback: string; areasMejora: string[] };

function extraerJson(texto: string): unknown {
  const limpio = texto.replace(/```(?:json)?\s*/g, '').trim();
  const match = limpio.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match ? JSON.parse(match[0]) : JSON.parse(limpio);
}

export class IAServicio {
  private config: IAOrchestratorConfig;
  private apiKey: string;

  constructor(config: IAOrchestratorConfig) {
    this.config = config;
    this.apiKey =
      config.apiKey ||
      (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY
        ? process.env.GEMINI_API_KEY
        : '');
  }

  async evaluarRespuesta(usuarioRespuesta: string, respuestaEsperada: string): Promise<{
    calificacion: number;
    feedback: string;
    areasMejora: string[];
  }> {
    const systemInstruction = `Eres un tutor preuniversitario de la plataforma KAIRO. Evalúa la respuesta del estudiante frente a la respuesta esperada y califica de 0 a 1 (0 = incorrecta, 1 = perfecta).
Responde ÚNICAMENTE con JSON válido en este formato exacto:
{"calificacion": 0.0-1.0, "feedback": "texto breve y motivador en español con lo que hizo bien y lo que falta", "areasMejora": ["máximo 3 puntos concretos de mejora"]}
Sin markdown, sin texto adicional.`;

    const contents: GeminiContent[] = [
      {
        role: 'user',
        parts: [
          {
            text: `Respuesta del estudiante:\n"""${usuarioRespuesta}"""\n\nRespuesta esperada:\n"""${respuestaEsperada}"""`,
          },
        ],
      },
    ];

    const result = await this.llamar(systemInstruction, contents);
    const parsed = extraerJson(result.text) as Partial<ErroresJson>;

    if (
      typeof parsed?.calificacion !== 'number' ||
      typeof parsed?.feedback !== 'string'
    ) {
      throw new Error('La respuesta de Gemini no tiene el formato esperado');
    }

    return {
      calificacion: Math.max(0, Math.min(1, parsed.calificacion)),
      feedback: parsed.feedback,
      areasMejora: Array.isArray(parsed.areasMejora)
        ? parsed.areasMejora.filter((a): a is string => typeof a === 'string').slice(0, 3)
        : [],
    };
  }

  async coachingPersonalizado(historialErrores: string[]): Promise<string> {
    const systemInstruction = `Eres un tutor personalizado de la plataforma KAIRO. Basándote en el historial de errores del estudiante, da 1 recomendación concreta y motivadora en español, con una analogía visual y un ejercicio corto para practicar. Máximo 3 oraciones. Sin listas ni markdown pesado.`;

    const contents: GeminiContent[] = [
      {
        role: 'user',
        parts: [
          {
            text: `Historial de errores del estudiante:\n- ${historialErrores.join('\n- ')}`,
          },
        ],
      },
    ];

    const result = await this.llamar(systemInstruction, contents);
    const texto = result.text.trim();
    if (!texto) throw new Error('Gemini no devolvió una recomendación');
    return texto;
  }

  async generarInfografiaAnime(tema: string, estilo: string): Promise<string> {
    const systemInstruction = `Eres un diseñador de infografías educativas anime. Devuelve un prompt detallado (en español) para generar una infografía ilustrada estilo anime sobre el tema indicado, con estructura visual, paleta de colores y elementos a incluir. Máximo 120 palabras.`;

    const contents: GeminiContent[] = [
      {
        role: 'user',
        parts: [{ text: `Tema: ${tema} | Estilo: ${estilo}` }],
      },
    ];

    const result = await this.llamar(systemInstruction, contents);
    const texto = result.text.trim();
    if (!texto) throw new Error('Gemini no devolvió la descripción de la infografía');
    return texto;
  }

  async corregirRedaccion(texto: string): Promise<{
    puntuacionCoherencia: number;
    puntuacionEstilo: number;
    sugerencias: string[];
    feedback: string;
  }> {
    const systemInstruction = `Eres un evaluador de redacción para estudiantes peruanos de secundaria. Evalúa el texto en coherencia (0-1) y estilo (0-1).
Responde ÚNICAMENTE con JSON válido en este formato exacto:
{"puntuacionCoherencia": 0.0-1.0, "puntuacionEstilo": 0.0-1.0, "sugerencias": ["máximo 3 sugerencias concretas"], "feedback": "párrafo breve y constructivo en español"}
Sin markdown, sin texto adicional.`;

    const contents: GeminiContent[] = [
      { role: 'user', parts: [{ text: `Texto del estudiante:\n"""${texto}"""` }] },
    ];

    const result = await this.llamar(systemInstruction, contents);
    const parsed = extraerJson(result.text) as {
      puntuacionCoherencia?: number;
      puntuacionEstilo?: number;
      sugerencias?: string[];
      feedback?: string;
    };

    if (
      typeof parsed?.puntuacionCoherencia !== 'number' ||
      typeof parsed?.puntuacionEstilo !== 'number' ||
      typeof parsed?.feedback !== 'string'
    ) {
      throw new Error('La respuesta de Gemini no tiene el formato esperado');
    }

    return {
      puntuacionCoherencia: Math.max(0, Math.min(1, parsed.puntuacionCoherencia)),
      puntuacionEstilo: Math.max(0, Math.min(1, parsed.puntuacionEstilo)),
      sugerencias: Array.isArray(parsed.sugerencias)
        ? parsed.sugerencias.filter((s): s is string => typeof s === 'string').slice(0, 3)
        : [],
      feedback: parsed.feedback,
    };
  }

  private async llamar(
    systemInstruction: string,
    contents: GeminiContent[]
  ): Promise<{ status: number; text: string }> {
    if (!this.apiKey) {
      throw new Error('El servicio de IA no está configurado (GEMINI_API_KEY)');
    }

    const result = await generateGeminiText({
      systemInstruction,
      contents,
      temperature: this.config.temperatura,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json',
    });

    if (result.status !== 200 || !result.text.trim()) {
      throw new Error(`Gemini no respondió (status ${result.status})`);
    }
    return result;
  }
}