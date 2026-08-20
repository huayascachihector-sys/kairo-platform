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

export class IAOrchestrator {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async corregirPronunciacion(audioBase64: string): Promise<CorreccionPronunciacion> {
    try {
      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          file: audioBase64,
          model: 'whisper-1',
          language: 'en',
        }),
      });

      const transcripcion = await response.json();

      const feedbackPositivo = await this.generarFeedbackPositivo(transcripcion.text);
      const errores = await this.analizarErrores(transcripcion.text);

      return {
        textoGrabado: transcripcion.text,
        transcripcion: transcripcion.text,
        erroresFoneticos: errores,
        puntuacionFluidez: this.calcularFluidez(transcripcion.text),
        feedbackPositivo,
        sugerenciaMejora: this.generarSugerenciaMejora(errores),
      };
    } catch (error) {
      console.error('Error en corrección de pronunciación:', error);
      return {
        textoGrabado: '',
        transcripcion: '',
        erroresFoneticos: [],
        puntuacionFluidez: 0,
        feedbackPositivo: '¡Muy bien intentado!',
        sugerenciaMejora: '¡Sigue practicando!',
      };
    }
  }

  async roleplay(
    contexto: string,
    personalidad: 'curioso' | 'divertido' | 'valiente' | 'sabio',
    mensajeUsuario: string
  ): Promise<RoleplayResponse> {
    const systemPrompt = `Eres un NPC amigable en un juego de inglés para niños. 
    Tu personalidad es: ${personalidad}. 
    El contexto es: ${contexto}.
    Mantén las respuestas cortas y adaptadas a niños de 6-10 años.
    Usa el humor de forma natural y apropiada.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: mensajeUsuario },
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      const data = await response.json();

      return {
        npcName: 'Coach Spark',
        npcPersonality: personalidad,
        contexto,
        respuesta: data.choices[0]?.message?.content || '¡Genial!',
        followUp: '¿Quieres intentarlo otra vez?',
      };
    } catch (error) {
      console.error('Error en roleplay:', error);
      return {
        npcName: 'Coach Spark',
        npcPersonality: personalidad,
        contexto,
        respuesta: '¡Muy bien!',
        followUp: '¿Listo para el siguiente reto?',
      };
    }
  }

  private async generarFeedbackPositivo(texto: string): Promise<string> {
    const respuestas = [
      '¡Excelente pronunciación!',
      '¡Muy creativo!',
      '¡Te la pasas de campeón!',
      '¡Fantástico!',
      '¡Así se hace!',
    ];
    return respuestas[Math.floor(Math.random() * respuestas.length)];
  }

  private calcularFluidez(texto: string): number {
    const palabras = texto.split(' ').length;
    if (palabras < 3) return 0.3;
    if (palabras < 8) return 0.6;
    return 0.9;
  }

  private async analizarErrores(texto: string): Promise<ErrorFonetico[]> {
    const erroresComunes: ErrorFonetico[] = [];

    const fonemasProblematicos = ['f', 'v', 'th', 'r', 'l', 's', 'z'];

    for (const fonema of fonemasProblematicos) {
      if (texto.toLowerCase().includes(fonema)) {
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
}