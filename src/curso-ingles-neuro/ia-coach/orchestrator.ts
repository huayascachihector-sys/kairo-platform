import {
  generateGeminiText,
  type GeminiContent,
} from '../../lib/gemini';

interface CorreccionPronunciacion {
  textoGrabado: string;
  transcripcion: string;
  erroresFoneticos: ErrorFonetico[];
  puntuacionFluidez: number;
  feedbackPositivo: string;
  sugerenciaMejora: string;
}

interface ErrorFonetico {
  palabra: string;
  fonemaCorrecto: string;
  fonemaProducido: string;
  explicacion: string;
}

interface RoleplayResponse {
  npcName: string;
  npcPersonality: 'curioso' | 'divertido' | 'valiente' | 'sabio';
  contexto: string;
  respuesta: string;
  followUp: string;
}

function extraerJson(texto: string): unknown {
  const limpio = texto.replace(/```(?:json)?\s*/g, '').trim();
  const match = limpio.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match ? JSON.parse(match[0]) : JSON.parse(limpio);
}

export class IAOrchestrator {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey =
      apiKey ||
      (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY
        ? process.env.GEMINI_API_KEY
        : '');
  }

  async corregirPronunciacion(
    audioBase64: string,
    mimeType = 'audio/webm'
  ): Promise<CorreccionPronunciacion> {
    const systemInstruction = `Eres Coach Spark, un coach de pronunciación de inglés para niños de 6-10 años.
Escucha el audio del niño e:
1. Transcribe exactamente lo que dijo en inglés.
2. Da un feedback positivo breve, cariñoso y específico en español.
3. Da una sugerencia de mejora práctica y divertida en español.
Responde ÚNICAMENTE con JSON válido:
{"transcripcion": "...", "feedbackPositivo": "...", "sugerenciaMejora": "..."}
Sin markdown, sin texto adicional.`;

    const contents: GeminiContent[] = [
      {
        role: 'user',
        parts: [
          { text: 'Transcribe y corrige la pronunciación del siguiente audio de inglés del estudiante:' },
          { inlineData: { mimeType, data: audioBase64 } },
        ],
      },
    ];

    const result = await this.llamar(systemInstruction, contents);
    const parsed = extraerJson(result.text) as {
      transcripcion?: string;
      feedbackPositivo?: string;
      sugerenciaMejora?: string;
    };

    const transcripcion = (parsed?.transcripcion || '').trim();
    if (typeof parsed?.feedbackPositivo !== 'string') {
      throw new Error('La respuesta de Gemini no tiene el formato esperado');
    }

    const errores = this.analizarErrores(transcripcion);

    return {
      textoGrabado: transcripcion,
      transcripcion,
      erroresFoneticos: errores,
      puntuacionFluidez: this.calcularFluidez(transcripcion),
      feedbackPositivo: parsed.feedbackPositivo,
      sugerenciaMejora: parsed.sugerenciaMejora || this.generarSugerenciaMejora(errores),
    };
  }

  async roleplay(
    contexto: string,
    personalidad: 'curioso' | 'divertido' | 'valiente' | 'sabio',
    mensajeUsuario: string
  ): Promise<RoleplayResponse> {
    const systemInstruction = `Eres un NPC amigable en un juego de inglés para niños.
Tu personalidad es: ${personalidad}.
El contexto es: ${contexto}.
Mantén las respuestas cortas y adaptadas a niños de 6-10 años.
Usa el humor de forma natural y apropiada.
Responde ÚNICAMENTE con JSON válido:
{"respuesta": "tu respuesta breve en inglés de forma natural", "followUp": "una pregunta corta en inglés para que el niño siga hablando"}
Sin markdown, sin texto adicional.`;

    const contents: GeminiContent[] = [
      { role: 'user', parts: [{ text: mensajeUsuario }] },
    ];

    const result = await this.llamar(systemInstruction, contents);
    const parsed = extraerJson(result.text) as {
      respuesta?: string;
      followUp?: string;
    };

    if (typeof parsed?.respuesta !== 'string') {
      throw new Error('La respuesta de Gemini no tiene el formato esperado');
    }

    return {
      npcName: 'Coach Spark',
      npcPersonality: personalidad,
      contexto,
      respuesta: parsed.respuesta,
      followUp: parsed.followUp || '',
    };
  }

  private calcularFluidez(texto: string): number {
    const palabras = texto.split(' ').length;
    if (palabras < 3) return 0.3;
    if (palabras < 8) return 0.6;
    return 0.9;
  }

  private analizarErrores(texto: string): ErrorFonetico[] {
    const erroresComunes: ErrorFonetico[] = [];

    const fonemasProblematicos = ['f', 'v', 'th', 'r', 'l', 's', 'z'];

    for (const fonema of fonemasProblematicos) {
      if (/^[a-z]+$/.test(fonema) && texto.toLowerCase().includes(fonema)) {
        erroresComunes.push({
          palabra: fonema,
          fonemaCorrecto: fonema,
          fonemaProducido: '',
          explicacion: this.obtenerExplicacionError(fonema),
        });
      }
    }

    return erroresComunes;
  }

  private obtenerExplicacionError(fonema: string): string {
    const explicaciones: Record<string, string> = {
      f: 'Intenta soplar aire por delante de los dientes superiores.',
      v: 'Coloca tus dientes sobre tu labio inferior y vibra.',
      th: 'Coloca la lengua entre tus dientes superiores e inferiores al soplar.',
      r: 'Curva la punta de la lengua hacia atrás sin tocar el paladar.',
      l: 'Toca la punta de tu lengua al paladar superior al pronunciar.',
      s: 'Mantén los dientes ligeramente separados y sopla aire por los surcos.',
      z: 'Mantén los dientes ligeramente separados y haz vibrar las cuerdas vocales.',
    };
    return explicaciones[fonema] || 'Practica el sonido correcto.';
  }

  private generarSugerenciaMejora(errores: ErrorFonetico[]): string {
    if (errores.length === 0) return '¡Excelente!';

    const prioritarios = errores.filter(e => ['r', 'th'].includes(e.palabra));
    if (prioritarios.length > 0) {
      return `Intenta el sonido /${prioritarios[0].palabra}/ más claramente.`;
    }

    const primero = errores[0];
    return `${this.obtenerExplicacionError(primero.palabra)} ${this.obtenerSugerenciaAdicional(primero.palabra)}`;
  }

  private obtenerSugerenciaAdicional(fonema: string): string {
    const sugerencias: Record<string, string> = {
      r: ' Imita a un león rugiendo: "RRR!"',
      l: ' Toque el paladar con la lengua mientras habla.',
      s: ' Mantenga los dientes separados y sople suavemente.',
    };
    return sugerencias[fonema] || '';
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
      temperature: 0.7,
      maxOutputTokens: 512,
      responseMimeType: 'application/json',
    });

    if (result.status !== 200 || !result.text.trim()) {
      throw new Error(`Gemini no respondió (status ${result.status})`);
    }
    return result;
  }
}