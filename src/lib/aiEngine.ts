// ─── KAIRO AI Engine — tutor + diagnostic + adaptive engine ──────

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

export function getSessionMemory(state: StoreState): ChatSession | null {
  const sessions = state.chatHistory
    .filter((m) => m.role === "user")
    .slice(-20);

  if (sessions.length === 0) return null;

  const lastAi = state.chatHistory
    .filter((m) => m.role === "ai")
    .slice(-5);

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
    if (text.includes("plan de estudio") || text.includes("plan de estudio")) topics.add("Plan de Estudio");
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

export interface DiagnosticResult {
  topic: string;
  strength: number; // 0-100
  weakness: boolean;
  suggestion: string;
  nextLesson?: string;
}

export async function getAIResponse(
  userMessage: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = [],
  files: FileAttachment[] = [],
  sessionContext?: string
): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, history, files, sessionContext }),
    });

    if (res.status === 429) {
      return '⏳ Demasiadas consultas seguidas. Espera unos segundos y vuelve a intentarlo.';
    }
    if (res.status === 402) {
      return '💳 Se agotaron los créditos de IA del espacio de trabajo. Añádelos para seguir usando el asistente.';
    }

    if (res.ok) {
      const data = (await res.json()) as { text?: string };
      if (data.text && data.text.trim() && !SAFETY_BOILERPLATE.test(data.text)) {
        return data.text;
      }
    }

    return generateLocalResponse(userMessage, files, sessionContext);
  } catch (err) {
    console.error('[aiEngine] Error:', err);
    return '⚠️ No se pudo conectar con el tutor de IA. Verifica tu conexión a internet e inténtalo de nuevo.';
  }
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
    const trend = recentAvg - (avg * 0.8);
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

function generateLocalResponse(msg: string, files?: FileAttachment[], sessionContext?: string): string {
  const q = msg.toLowerCase().trim();
  const contextNote = sessionContext ? `\n\n[Contexto previo de la sesión: ${sessionContext}]` : "";

  // RAG: responder basado en el contenido de documentos adjuntos
  if (files && files.length > 0) {
    const docText = files.map((f) => f.data || "").join("\n\n").slice(0, 40000);
    if (docText.trim().length > 0) return localRagResponse(msg, files, docText);
  }

  // Diagnóstico de rendimiento
  if (q.includes('diagnostico') || q.includes('diagnóstico') || q.includes('rendimiento') || q.includes('cómo voy') || q.includes('que tan bien') || q.includes('mis notas') || q.includes('debilidades')) {
    return diagnosticPlaceholderResponse();
  }

  // Tutor socrático
  if (isSocraticActivation(q)) {
    return socraticResponse(q);
  }
  if (isSocraticAnswer(q)) {
    return socraticFeedback(q);
  }

  // Plan de estudio inteligente
  if (q.includes('plan') && (q.includes('estudio') || q.includes('estudiar') || q.includes('preparar') || q.includes('examen'))) {
    return generateStudyPlanResponse(q);
  }

  // Motivación / ánimo
  if (q.includes('animo') || q.includes('motivar') || q.includes('decir') && q.includes('algo') || q.includes('estoy cansado') || q.includes('no puedo') || q.includes('rendir') || q.includes('fracaso') || q.includes('no sé') || q.includes('difícil')) {
    return motivationalResponse(q);
  }

  // Nivel de estudiante
  if (q.includes('nivel') && q.includes('estudiante')) {
    return `**¿Qué nivel eres?**

Puedo adaptarme a diferentes niveles:

- **Básico**: Repaso de fundamentos, ejercicios simples
- **Intermedio**: Problemas más complejos, aplicación de conceptos
- **Avanzado**: Preparación para exámenes de admisión, problemas difíciles

 dime tu nivel y la materia que quieres practicar para personalizar mi respuesta.`;
  }

  // ─── Math: linear equations ──────────────────────────────────────────
  const linearMatch = q.match(/(?:resuelve|resuelv[eo]|solve|calcula|hallar|encuentra)?\s*(?:la\s+)?(?:ecuaci[oó]n|equation)?.*?([+-]?\d*\.?\d*)x\s*([+-])\s*(\d*\.?\d*)\s*=\s*([+-]?\d*\.?\d*)/);
  if (linearMatch || (q.includes('ecuaci') && q.includes('x') && q.includes('='))) {
    return solveLinearEquation(msg);
  }

  // ─── Math: quadratic equations ────────────────────────────────────────
  if ((q.includes('cuadr') || q.includes('cuadratic')) && q.includes('=')) {
    return solveQuadratic(msg);
  }

  // ─── Physics: Newton's laws ──────────────────────────────────────────
  if (q.includes('newton') || q.includes('ley') && q.includes('newton')) {
    return physicsNewtonResponse();
  }

  // ─── Physics: gravity ──────────────────────────────────────────────────
  if (q.includes('graved') || q.includes('gravity') || q.includes('caída libre') || q.includes('caida libre')) {
    return physicsGravityResponse();
  }

  // ─── Physics: force and motion ────────────────────────────────────────
  if ((q.includes('fuerza') || q.includes('fricción') || q.includes('friccion') || q.includes('velocidad') || q.includes('aceleración') || q.includes('aceleracion')) && (q.includes('calcular') || q.includes('hallar') || q.includes('find') || q.includes('resuelve') || q.includes('resolv'))) {
    return physicsMotionResponse();
  }

  // ─── Chemistry: mole ──────────────────────────────────────────────────
  if (q.includes('mol') && (q.includes('quim') || q.includes('quím') || q.includes('mole') || q.includes('que es') || q.includes('qué es'))) {
    return chemistryMoleResponse();
  }

  // ─── Chemistry: periodic table ────────────────────────────────────────
  if (q.includes('tabla periódica') || q.includes('periodica') || q.includes('periodic table')) {
    return chemistryPeriodicResponse();
  }

  // ─── Biology ────────────────────────────────────────────────────────────
  if (q.includes('biolog') || q.includes('célula') || q.includes('celula') || q.includes('adn') || q.includes('dna') || q.includes('genética') || q.includes('genetica') || q.includes('mendel') || q.includes('herencia')) {
    return biologyResponse(q);
  }

  // ─── Programming ────────────────────────────────────────────────────────
  if (q.includes('programación') || q.includes('programing') || q.includes('python') || q.includes('algoritmo') || q.includes('código') || q.includes('codigo') || q.includes('loop') || q.includes('función') || q.includes('funcion') || q.includes('variable')) {
    return programmingResponse(q);
  }

  // ─── History: Peru independence ────────────────────────────────────────
  if (q.includes('independencia') && (q.includes('peru') || q.includes('perú')) || q.includes('independencia del peru') || q.includes('independencia del perú')) {
    return historyPeruIndependence();
  }

  // ─── History: general ──────────────────────────────────────────────────
  if (q.includes('historia') || q.includes('historia del peru') || q.includes('historia universal') || (q.includes('inca') && q.includes('imperio'))) {
    return historyPeruTimeline();
  }

  // ─── English: Present Perfect ──────────────────────────────────────────
  if (q.includes('present perfect') || q.includes('presente perfecto')) {
    return englishPresentPerfect();
  }

  // ─── English: grammar ──────────────────────────────────────────────────
  if (q.includes('english') || q.includes('ingl') || q.includes('grammar') || q.includes('gramática') || q.includes('past tense') || q.includes('pasado')) {
    return englishGrammarOverview();
  }

  // ─── Communication: text types ─────────────────────────────────────────
  if (q.includes('tipos de texto') || (q.includes('texto') && (q.includes('comunicaci') || q.includes('tipo')))) {
    return communicationTextTypes();
  }

  // ─── Essay writing ──────────────────────────────────────────────────────
  if (q.includes('ensayo') || q.includes('essay') || q.includes('redacción') || q.includes('escribir') || q.includes('componer un texto') || q.includes('admisión') || q.includes('universidad') && q.includes('ensayo')) {
    return essayWritingResponse(q);
  }

  // ─── Study tips ──────────────────────────────────────────────────────────
  if (q.includes('cómo estudiar') || q.includes('técnica') || q.includes('método') || q.includes('consejo') || q.includes('tips') || q.includes('aprender rápido') || q.includes('aprendo') || q.includes('memorizar')) {
    return studyTipsResponse(q);
  }

  // ─── Math: general help ────────────────────────────────────────────────
  if (q.includes('matem') || q.includes('math') || q.includes('algebra') || q.includes('álgebra') || q.includes('geometr') || q.includes('calcul') || q.includes('cálcul')) {
    return `**Matemáticas — ¿En qué te ayudo?**

Puedo resolver y explicar:

- **Álgebra:** Ecuaciones lineales, cuadráticas, sistemas de ecuaciones
- **Aritmética:** Operaciones, porcentajes, proporciones
- **Geometría:** Áreas, perímetros, teorema de Pitágoras
- **Cálculo:** Derivadas básicas, límites, integrales
- **Trigonometría:** Razones trigonométricas, identidades
- **Estadística:** Probabilidad, mediana, desviación estándar

**Escríbeme tu problema**, por ejemplo:
> "Resuelve 3x - 7 = 14"
> "Calcula 45 + 38"
> "¿Cuánto vale el área de un círculo de radio 5?"

¿O necesitas ayuda para elegir qué estudiar? Usa la palabra DIAGNÓSTICO para analizar tu rendimiento.`;
  }

  // ─── Pythagoras ───────────────────────────────────────────────────────────
  if (q.includes('pitag') || q.includes('pythag') || (q.includes('triangulo') && q.includes('rectang'))) {
    return `**Teorema de Pitágoras**

En un triángulo rectángulo: **a² + b² = c²**
donde *c* es la hipotenusa y *a*, *b* son los catetos.

**Ejemplo:** Si a = 3 y b = 4:
> c² = 3² + 4² = 9 + 16 = 25
> c = √25 = **5**

**Aplicación:** Calcular distancias, alturas, diagonales.

¿Quieres resolver un problema con el teorema de Pitágoras?`;
  }

  // ─── Greetings ────────────────────────────────────────────────────────────
  if (/^(hola|hi|hello|hey|buenas|que tal|qu[eé] tal)/.test(q)) {
    return `¡Hola! Soy KAIRO, tu tutor inteligente. Puedo ayudarte con:

📐 **Matemáticas** — álgebra, geometría, cálculo, estadística
🔬 **Física** — fuerzas, energía, movimiento, termodinámica
⚗️ **Química** — moles, tabla periódica, enlaces, reacciones
🧬 **Biología** — célula, genética, evolución, ecología
💻 **Programación** — Python, algoritmos, estructuras de datos
📜 **Historia** — del Perú y universal
📝 **Comunicación** — tipos de texto, redacción, comprensión lectora
🇬🇧 **Inglés** — gramática, vocabulario, escritura
📄 **Ensayos** — cómo escribir para admisión universitaria
🎓 **Diagnóstico** — analizo tu rendimiento y te sugiero qué estudiar

Diagnóstico: **diagnostico** → analiza tus fortalezas y debilidades
Plan de estudio: **plan de estudio** → genero un plan personalizado

¿Qué quieres aprender hoy?`;
  }

  // ─── Document: summarization ─────────────────────────────────────────
  if (q.includes('resum') || q.includes('resumen') || q.includes('resumir') || q.includes('síntesis') || q.includes('sintesis') || q.includes('puntos clave') || q.includes('puntos principales')) {
    return `**Resumen de documento**

No tengo acceso al contenido del documento en este momento porque el servicio de IA principal no está disponible.

**Para obtener un resumen cuando el servicio funcione:**
1. Adjunta el documento usando el botón 📎 (PDF, TXT, DOC, MD)
2. Escribe **"resumir"** o **"dame un resumen"**
3. KAIRO analizará el contenido completo y te entregará:
   - Ideas principales del documento
   - Estructura y organización
   - Puntos clave resumidos en párrafos cortos
   - Términos importantes destacados

**Mientras tanto, puedes:**
- Leer el documento directamente desde **Mis Documentos**
- Usar las notas de la plataforma para crear tus propios resúmenes
- Preguntarme sobre cualquier tema académico que necesites`;
  }

  // ─── Document: explanation ──────────────────────────────────────────
  if ((q.includes('explic') || q.includes('explícame') || q.includes('explique') || q.includes('enseñ') || q.includes('entiende') || q.includes('comprend')) && (q.includes('documento') || q.includes('archivo') || q.includes('texto') || q.includes('pdf') || q.includes('lectura'))) {
    return `**Explicación de documento**

Para explicarte el contenido de un documento, necesito que:

1. **Adjunta el archivo** usando el botón 📎 (formatos: PDF, TXT, DOC, DOCX, MD)
2. **Escribe tu pregunta**, por ejemplo:
   - "Explícame este documento como si tuviera 12 años"
   - "¿Cuáles son los conceptos más importantes?"
   - "Hazme un resumen de cada sección"

Cuando el servicio de IA esté conectado, podré analizar el documento completo y explicarte sus conceptos de forma clara y didáctica, adaptándome a tu nivel.

**¿Necesitas ayuda con otro tema?** Puedo asistirte con Matemáticas, Física, Química, Historia, Comunicación, Inglés, Biología y Programación.`;
  }

  // ─── Document: analysis (default document intent) ──────────────────
  if (q.includes('analiza') || q.includes('analizar') || q.includes('analisis') || q.includes('análisis') || q.includes('revisa') || q.includes('revisar') || q.includes('documento') || q.includes('archivo adjunto')) {
    return `**Análisis de documento**

Para analizar un archivo correctamente:

1. **Adjunta el documento** usando el botón 📎
2. **Especifica qué tipo de análisis necesitas:**
   - "Resumen" → puntos clave del documento
   - "Explicación" → conceptos explicados paso a paso
   - "Preguntas" → preguntas basadas en el contenido
   - "Vocabulario" → términos importantes con definiciones

**Formatos soportados:** PDF, TXT, DOC, DOCX, MD, CSV, JSON, HTML

Si el asistente no puede conectarse al servicio de IA, la respuesta usará contenido predefinido. Para análisis completos, asegúrate de que la API key de OpenRouter esté configurada.`;
  }

  // ─── Default fallback ─────────────────────────────────────────────
  return `Puedo ayudarte con **Matemáticas, Física, Química, Historia, Comunicación, Inglés, Biología y Programación**.

Nuevas capacidades:
- 🧠 **Diagnóstico**: Escribe "diagnostico" para analizar tu rendimiento
- 📄 **Ensayos**: Pregúntame cómo escribir un ensayo de admisión
- 📚 **Plan de estudio**: Pide un "plan de estudio" para cualquier meta
- 💪 **Motivación**: Dime si necesitas ánimo
- 📎 **Documentos**: Adjunta un archivo PDF, TXT o DOC y te ayudo a entenderlo

¿Sobre qué tema quieres que te ayude?`;
}

// ─── DIAGNOSTIC ─────────────────────────────────────────────────────────

function diagnosticPlaceholderResponse(): string {
  return `**Diagnóstico de Rendimiento KAIRO**

Esta función analiza tus resultados en ejercicios y genera un perfil de fortalezas y debilidades.

**Para usar el diagnóstico:**
1. Completa ejercicios en cada curso o tema
2. Escribe "diagnostico" en el chat después de haber practicado
3. KAIRO analizará tus patrones y te dirá:
   - 🟢 Temas fuertes (puedes avanzar a nivel avanzado)
   - 🟡 Temas medios (necesitan más práctica)
   - 🔴 Temas débiles (requieren revisión desde lo básico)

**Ejemplo de uso:**
> "Hice muchos ejercicios de matemáticas, ahora dime mi diagnostico"

Para activar el diagnóstico completo, completa al menos 5 ejercicios por tema y vuelve a preguntar.`;
}

// ─── Study Plan generation ────────────────────────────────────────────

function generateStudyPlanResponse(msg: string): string {
  const weeks = msg.match(/(\d+)\s*(?:semanas?|semana)/i);
  const days = msg.match(/(\d+)\s*(?:d[ií]as?|d[íí]a)/i);
  let timeframe = msg.includes('examen') ? 'examen' : 'general';
  let daysNum = days ? parseInt(days[1]) : weeks ? parseInt(weeks[1]) * 7 : 14;
  daysNum = Math.max(3, Math.min(60, daysNum));

  const today = new Date();
  const tasks: string[] = [];
  for (let i = 1; i <= Math.min(daysNum, 14); i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + (i - 1));
    const type = i === daysNum ? 'simulacro' : i % 4 === 0 ? 'repaso' : i % 3 === 0 ? 'ejercicios' : 'teoria';
    const typeLabel = type === 'simulacro' ? 'Simulacro completo' : type === 'repaso' ? 'Repaso de temas débiles' : type === 'ejercicios' ? 'Práctica intensiva' : 'Nueva teoría';
    tasks.push(`${i}. **${typeLabel}** (${d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' })}) — 60 min`);
  }

  return `**Plan de Estudio KAIRO — ${daysNum} días**

**Meta:** ${timeframe === 'examen' ? 'Preparación para examen de admisión' : 'Progreso continuo en tus estudios'}

${tasks.join('\n')}

**Recomendaciones:**
- Estudia 60-90 min diarios con descansos de 10 min
- Revisa tus errores al final de cada sesión
- Usa el modo SIMULACRO para practicar bajo presión de tiempo
- Escribe "plan de estudio [meta]" para personalizarlo aún más

¿Tienes un examen específico próximo? Dime la fecha y personalizo el plan.`;
}

// ─── Motivation ────────────────────────────────────────────────────────

function motivationalResponse(msg: string): string {
  const responses = [
    `**¡Ánimo, tú puedes! 💪**

Cada gran logro en la vida comenzó con un solo paso. Tú ya estás dando ese paso al estudiar con KAIRO.

**Datos que inspiran:**
- El 90% de los estudiantes que practicanconsistentemente mejoran sus resultados
- Cada lección que completas te acerca más a tu meta
- La constancia > la intensidad

**Hoy:** Ponte una meta pequeña y conquístala. Luego, la siguiente. Así hasta llegar donde quieras.

¿En qué te puedo ayudar ahora?`,
    `**Recuerda esta frase:** "El secreto del éxito es constancia." — Confucio

Cada pregunta que haces, cada ejercicio que resuelves, cada error que analizas... eso es lo que te hace más inteligente.

**Tú estás aquí para:**
- 🎯 Llegar a la universidad de tus sueños
- 📚 Dominar temas que antes te costaban
- 💪 Ser la mejor versión de ti mismo

**La diferencia entre quienes logran y quienes no:** simplemente no se rinden. Y tú YA no te estás rindiendo.

¿Necesitas ayuda con algo específico ahora?`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// ─── Physics: Newton ───────────────────────────────────────────────────

function physicsNewtonResponse(): string {
  return `**Las 3 Leyes de Newton**

**1ª Ley (Inercia):** Todo cuerpo permanece en reposo o MRU a menos que una fuerza neta actúe sobre él.
> Ejemplo: Un libro sobre la mesa no se mueve porque las fuerzas están equilibradas.

**2ª Ley (F = m·a):** La aceleración de un cuerpo es proporcional a la fuerza neta e inversamente proporcional a su masa.
> F = m × a → Si aplicas 10 N a 2 kg, la aceleración es 5 m/s².

**3ª Ley (Acción-Reacción):** A toda acción corresponde una reacción igual y opuesta.
> Ejemplo: Al caminar empujas el suelo hacia atrás y el suelo te impulsa hacia adelante.

**Fórmula para resolver problemas:**
1. Identifica todas las fuerzas → dibuja un diagrama de cuerpo libre
2. Suma las fuerzas en cada dirección (ΣF = ma)
3. Despeja lo que te pidan

¿Quieres que resolvamos un problema aplicando estas leyes? ¡Dame los datos!`;
}

// ─── Physics: Gravity ──────────────────────────────────────────────────

function physicsGravityResponse(): string {
  return `**Gravedad y Caída Libre**

La gravedad es la fuerza que atrae los cuerpos hacia el centro de la Tierra. En la superficie terrestre:
> **g ≈ 9.8 m/s²** (aproximamos a 10 para cálculos)

**Fórmulas clave:**
- v = g·t (velocidad en el tiempo t)
- h = ½·g·t² (altura caída)
- v² = 2·g·h (velocidad final desde altura h)

**Ejemplo:** Una piedra cae desde 80 m. ¿Cuánto tarda?
> h = ½·g·t² → 80 = ½(10)t² → t² = 16 → **t = 4 s**

**Objetos lanzados hacia arriba:**
- Suben hasta v = 0, luego caen
- El tiempo de subida = tiempo de bajada
- En la cima: v = 0 pero a = g (la gravedad nunca desaparece)

¿Quieres resolver un problema de caída libre?`;
}

// ─── Physics: Force and motion ──────────────────────────────────────────

function physicsMotionResponse(): string {
  return `**Fuerza y Movimiento**

Puedo ayudarte con estos temas de Física:

**Fuerza (F):** Empuje o tracción. Unidad: Newton (N)
**Masa (m):** Cantidad de materia. Unidad: kilogramos (kg)
**Aceleración (a):** Cambio de velocidad por unidad de tiempo. Unidad: m/s²

**Fórmulas esenciales:**
- F = m · a (2ª Ley de Newton)
- v = v₀ + a · t (velocidad con aceleración)
- x = x₀ + v₀·t + ½a·t² (posición con aceleración)
- F_fricción = μ · N (fuerza de fricción)
- P = m · g (peso = fuerza gravitacional)

**Ejemplo:** Un objeto de 5 kg recibe una fuerza neta de 20 N. ¿Cuál es su aceleración?
> a = F/m = 20/5 = **4 m/s²**

Dame los datos del problema y lo resolvemos juntos.`;
}

// ─── Chemistry: mole ──────────────────────────────────────────────────

function chemistryMoleResponse(): string {
  return `**El Mol en Química**

**1 mole = 6.022 × 10²³ partículas** (Número de Avogadro)

**Masa Molar:** La masa de 1 mol de una sustancia en **g/mol**.

**Fórmulas clave:**
> n = m / M  (moles = masa / masa molar)
> m = n × M  (masa = moles × masa molar)
> N = n × Nₐ (partículas = moles × Avogadro)

**Ejemplo:** ¿Cuántos moles hay en 36 g de H₂O?
- Masa molar del H₂O = 2(1) + 16 = 18 g/mol
- n = 36/18 = **2 moles**
- Partículas = 2 × 6.022×10²³ = **1.2044×10²⁴**

**Estequiometría:**
En reacciones químicas, las proporciones molares vienen de los coeficientes.
> 2H₂ + O₂ → 2H₂O
> 2 moles H₂ + 1 mol O₂ → 2 moles H₂O

¿Quieres resolver un problema de moles o estequiometría?`;
}

// ─── Chemistry: periodic table ─────────────────────────────────────────

function chemistryPeriodicResponse(): string {
  return `**La Tabla Periódica**

Organiza los elementos por número atómico (Z) y propiedades.

**Grupos importantes:**
| Grupo | Nombre | Ejemplos |
|-------|--------|----------|
| 1 | Metales alcalinos | Li, Na, K (muy reactivos) |
| 2 | Alcalinotérreos | Mg, Ca, Ba |
| 17 | Halógenos | F, Cl, Br (reactivos) |
| 18 | Gases nobles | He, Ne, Ar (inertes) |

**Tendencias periódicas:**
| Propiedad | Aumenta en periodo → | Aumenta en grupo ↑ |
|-----------|----------------------|---------------------|
| Radio atómico | Disminuye | Aumenta |
| Electronegatividad | Aumenta | Disminuye |
| Energía de ionización | Aumenta | Disminuye |

**Ejemplos de aplicación:**
- Los metales alcalinos (grupo 1) reaccionan violentamente con agua
- Los gases nobles (grupo 18) son prácticamente inertes
- El cloro (grupo 17) es muy reactivo → forma sal con Na

¿Quieres saber sobre un elemento o tendencia específica?`;
}

// ─── Biology ────────────────────────────────────────────────────────────

function biologyResponse(msg: string): string {
  if (msg.includes('célula') || msg.includes('celula') || msg.includes('biolog') || msg.includes('biolo') && msg.includes('celula')) {
    return `**Biología Celular**

**La Célula** es la unidad básica de la vida.

**Tipos principales:**
- **Procariota:** Sin núcleo (bacterias). Pequeña (1-10 μm)
- **Eucariota:** Con núcleo envuelto en membrana (animales, plantas, hongos). Más grande (10-100 μm)

**Organelos clave:**
| Organelo | Función |
|----------|---------|
| **Núcleo** | Controla la célula, contiene el ADN |
| **Mitocondria** | Produce energía (ATP) |
| **Ribosoma** | Sintetiza proteínas |
| **Aparato de Golgi** | Empaqueta y transporta proteínas |
| **Membrana** | Regula el paso de sustancias |

**Transporte de membrana:**
- **Pasivo** (sin energía): difusión, ósmosis, difusión facilitada
- **Activo** (con ATP): bomba Na⁺/K⁺, endocitosis, exocitosis

¿Quieres profundizar en algún organelo o proceso celular?`;
  }
  if (msg.includes('adn') || msg.includes('dna') || msg.includes('genética') || msg.includes('genetica') || msg.includes('mendel')) {
    return `**Genética — Mendel**

**Gregor Mendel:** Padre de la genética. Cruzó guisantes (1856-1864).

**Conceptos esenciales:**
- **Gen:** Unidad de herencia (segmento de ADN)
- **Alelo:** Variedad de un gen (ej: A, a)
- **Genotipo:** Composición genética (AA, Aa, aa)
- **Fenotipo:** Característica observable

**Leyes de Mendel:**
1. **Separación:** Cada individuo tiene 2 alelos que se separan en gametos
2. **Independencia:** Genes diferentes se heredan independientemente

**Cruce monohíbrido Aa × Aa:**

|        | A | a |
|--------|---|---|
| A | AA | Aa |
| a | Aa | aa |

→ Phenotypic ratio: **3 dominante : 1 recesivo**

**Herencia ligada al X:** genes en el cromosoma X (daltonismo, hemofilia). Los hombres la expresan más fácilmente.

¿Quieres que explique un cruce genético específico?`;
  }
  return `**Biología — ¿En qué te ayudo?**

Puedo explicar:
- **Biología celular:** estructura de la célula, organelos, transporte de membrana
- **Genética:** Mendel, herencia, cruces genéticos, ligamiento al X
- **Evolución:** selección natural, adaptación, especiación
- **Ecología:** ecosistemas, cadenas tróficas, biodiversidad

¿Sobre qué tema de biología quieres aprender?`;
}

// ─── Programming ──────────────────────────────────────────────────────

function programmingResponse(msg: string): string {
  if (msg.includes('python') || msg.includes('algoritmo') || msg.includes('programar') || msg.includes('coding') || msg.includes('código') || msg.includes('codigo')) {
    return `**Programación con Python**

**Variables y tipos:**
\`\`\`python
nombre = "KAIRO"       # String
edad = 16              # Integer
promedio = 15.5        # Float
aprobado = True        # Boolean
notas = [12, 15, 18]   # Lista
\`\`\`

**Condicionales:**
\`\`\`python
if nota >= 18:
    print("Distinción")
elif nota >= 14:
    print("Bueno")
elif nota >= 11:
    print("Regular")
else:
    print("Deficiente")
\`\`\`

**Bucles:**
\`\`\`python
for i in range(5):     # Repite 5 veces
    print(i)           # 0, 1, 2, 3, 4

n = 10
while n > 0:           # Mientras sea verdadero
    print(n)
    n -= 1
\`\`\`

**Funciones:**
\`\`\`python
def saludar(nombre):
    return f"¡Hola, {nombre}!"

saludar("Carlos")  # → "¡Hola, Carlos!"
\`\`\`

¿Quieres que explique un concepto específico o resuelva un ejercicio de programación?`;
  }
  if (msg.includes('algoritmo') || msg.includes('estructura de datos') || msg.includes('lista') || msg.includes('diccionario') || msg.includes('tuple') || msg.includes('tupla')) {
    return `**Estructuras de Datos en Python**

**Listas** (mutable, ordenada):
\`\`\`python
frutas = ["manzana", "banana"]
frutas.append("cereza")   # Añadir
frutas[-1]                # Último elemento
\`\`\`

**Tuplas** (inmutable, ordenada):
\`\`\`python
coordenadas = (10, 20)
# coordenadas[0] = 30  ← ERROR, no se puede modificar
\`\`\`

**Diccionarios** (clave-valor):
\`\`\`python
estudiante = {"nombre": "Ana", "edad": 16}
estudiante["grado"] = "5to"  # Añadir
for clave, valor in estudiante.items():
    print(clave, valor)
\`\`\`

**Complejidad algorítmica (Big O):**
| Notación | Significado | Ejemplo |
|----------|-------------|---------|
| O(1) | Constante | Acceso por índice |
| O(n) | Lineal | Recorrer una lista |
| O(n²) | Cuadrático | Bubble sort |
| O(log n) | Logarítmica | Búsqueda binaria |

¿Quieres resolver un ejercicio de programación?`;
  }
  return `**Programación — ¿En qué te ayudo?**

Puedo explicar:
- **Python:** variables, funciones, bucles, condicionales, listas, diccionarios
- **Algoritmos:** búsqueda, ordenamiento, complejidad
- **Estructuras de datos:** listas, pilas, colas, árboles, grafos
- **Fundamentos:** lógica de programación, pseudocódigo

¿Sobre qué tema de programación quieres aprender?`;
}

// ─── History: Peru independence ────────────────────────────────────────

function historyPeruIndependence(): string {
  return `**Independencia del Perú**

La independencia del Perú se proclamó el **28 de julio de 1821** por **José de San Martín** en la Plaza Mayor de Lima.

**Hechos clave:**
- **1820:** San Martín desembarca en Paracas
- **1821, 28 de julio:** Declaración de independencia
- **1824:** Batalla de Ayacucho (9 de diciembre) — Sucre derrota al ejército español

**Protagonistas:** San Martín, Simón Bolívar, Antonio José de Sucre.

¿Quieres que te explique la campaña de San Martín o la batalla de Ayacucho en detalle?`;
}

// ─── History: general ──────────────────────────────────────────────────

function historyPeruTimeline(): string {
  return `**Historia del Perú**

| Época | Años | Eventos |
|-------|------|---------|
| **Prehispánico** | 1200-1532 | Cultura Chavín, Nazca, Mochica, Chimú, Imperio Inca |
| **Conquista** | 1532 | Llegada de Pizarro, captura de Atahualpa |
| **Virreinato** | 1542-1821 | Dominio español, minera de Potosí |
| **Independencia** | 1821-1824 | San Martín, Bolívar, Batalla de Ayacucho |
| **República** | 1821- | Guerra con Chile, Guerra del Pacífico |

¿Sobre qué período quieres profundizar?`;
}

// ─── English: Present Perfect ──────────────────────────────────────────

function englishPresentPerfect(): string {
  return `**Present Perfect Tense**

**Structure:** Subject + have/has + past participle
**Use:** Actions that started in the past and continue, or past actions with present results

**Examples:**
- I **have studied** English for 3 years.
- She **has visited** Paris twice.
- They **have finished** their homework.

**Signal words:** ever, never, already, yet, just, since, for

**Tip:** Use *has* for he/she/it, *have* for I/you/we/they.

¿Quieres practicar con ejercicios?`;
}

// ─── English: grammar overview ─────────────────────────────────────────

function englishGrammarOverview(): string {
  return `**English Grammar — Verb Tenses**

| Tense | Form | Use | Example |
|-------|------|-----|---------|
| **Present Simple** | Subject + base verb | Habits, facts | I study every day |
| **Present Continuous** | am/is/are + verb-ing | Actions now | She is studying |
| **Past Simple** | Subject + verb-ed/irregular | Completed past | I went yesterday |
| **Past Continuous** | was/were + verb-ing | Past ongoing | I was reading |
| **Present Perfect** | have/has + past participle | Past → now | I have visited Paris |
| **Future (will)** | will + base verb | Predictions | I will study |

**Irregular verbs (essential):**
| Base | Past | Participle |
|------|------|------------|
| go → went → gone |
| write → wrote → written |
| see → saw → seen |
| eat → ate → eaten |

¿Quieres practicar un tiempo verbal específico?`;
}

// ─── Communication: text types ─────────────────────────────────────────

function communicationTextTypes(): string {
  return `**Tipos de Texto**

| Tipo | Propósito | Ejemplo |
|------|-----------|---------|
| **Narrativo** | Contar una historia | Cuento, novela |
| **Descriptivo** | Describir algo | Retrato, paisaje |
| **Expositivo** | Informar/explicar | Artículo científico |
| **Argumentativo** | Convencer con razones | Ensayo, editorial |
| **Instructivo** | Guiar acciones | Manual, receta |
| **Conversacional** | Diálogo | Entrevista, obra de teatro |

**Partes de un párrafo:**
1. **Oración tópica:** idea principal
2. **Oraciones de desarrollo:** evidencia y ejemplos
3. **Oración de cierre:** conclusión o transición

¿Quieres practicar la identificación de tipos de texto?`;
}

// ─── Essay writing ──────────────────────────────────────────────────────

function essayWritingResponse(msg: string): string {
  if (msg.includes('admisión') || msg.includes('universidad') && msg.includes('ensayo')) {
    return `**Cómo escribir un ensayo de admisión universitaria**

**Estructura recomendada (650 palabras máx.)**

**1. HOOK (introducción):** Abre con una historia personal, una cita o un hecho impactante que capte la atención inmediata. No uses definiciones genéricas.

**2. Desarrollo (3-4 párrafos):**
- Cada párrafo desarrolla UNA idea con ejemplos concretos
- Muestra tu crecimiento y reflexión, no solo tus logros
- Conecta tus experiencias con tus metas

**3. CONCLUSIÓN:** Cierra con tu visión de futuro y cómo la universidad elegida te ayudará a lograrla.

**Errores comunes que cometen los postulantes:**
- ❌ Ser genérico y sin historias personales
- ❌ Solo listar logros sin reflexionar sobre ellos
- ❌ Repetir lo que ya está en el expediente académico
- ❌ Usar vocabulario rebuscado para impresionar

**Errores que debes evitar:**
- ❌ No seguir las instrucciones del prompt
- ❌ Exceder el límite de palabras
- ❌ Usar lenguaje informal o jerga

**Tip:** Lee tu ensayo en voz alta — si suena como un robot, reescríbelo. Debe sonar a TI.

¿Quieres que te ayude a generar ideas para tu ensayo? Dime la universidad a la que postulas.`;
  }
  return `**Redacción y Ensayo**

Puedo ayudarte con:
- **Estructura de ensayos:** introudcción, desarrollo y conclusión
- **Técnicas argumentativas:** cómo persuadir al lector
- **Redacción para admisión universitaria:** ensayos para SAT, ACT y universidades peruanas
- **Coherencia y cohesión:** conectores, transiciones y flujo lógico
- **Ortografía y gramática:** corrección de errores comunes

¿Tienes un tema o prompt de ensayo? Escríbelo y te ayudo a estructurarlo y mejorarlo.`;
}

// ─── Study tips ──────────────────────────────────────────────────────────

function studyTipsResponse(msg: string): string {
  return `**Técnicas de Estudio Efectivas 📚**

**1. Repetición Espaciada**
Revisa el material en intervalos crecientes: 1 día → 3 días → 7 días → 14 días → 30 días. Esto fija la información en la memoria a largo plazo.

**2. Técnicas activas (no solo leer)**
- **Pasiva:** Leer el texto 10 veces → mal método
- **Activa:** Resolver ejercicios, explicarle a alguien, enseñar lo aprendido → ¡10 veces mejor retención!

**3. Pomodoro**
Estudia 25 minutos → descansa 5 minutos → repite. Después de 4 ciclos, descansa 15-30 min.

**4. Mapas mentales**
Organiza visualmente las conexiones entre conceptos.

**5. Simulacros bajo presión**
Practica con tiempo cronometrado para acostumbrarte al estrés del examen.

**6. Dormir bien**
El cerebro consolida la memoria durante el sueño. No estudies de madrugada.

**7. Enseñar para aprender (técnica Feynman)**
Explica el tema como si le enseñaras a un niño de 10 años. Si no puedes simplificarlo, es que no lo entiendes del todo.

¿Quieres que te ayude a aplicar alguna de estas técnicas a una materia específica?`;
}

// ─── Math solvers ─────────────────────────────────────────────────────

function solveLinearEquation(input: string): string {
  const m = input.match(/([+-]?\d*\.?\d*)x\s*([+-])\s*(\d*\.?\d*)\s*=\s*([+-]?\d*\.?\d*)/);
  if (!m) return 'No pude identificar la ecuación. Escribe algo como: 2x + 3 = 11';

  const a = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : parseFloat(m[1]);
  const sign = m[2] === '-' ? -1 : 1;
  const b = sign * (parseFloat(m[3]) || 0);
  const c = parseFloat(m[4]);

  const x = (c - b) / a;

  return `**Ecuación:** ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}

**Paso 1:** Aislar el término con x
> ${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}
> ${a}x = ${c - b}

**Paso 2:** Despejar x
> x = ${c - b} / ${a}
> x = **${x}**

**Comprobación:** ${a}(${x}) ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${a * x + b} ✓

¿Quieres resolver otra ecuación?`;
}

function solveQuadratic(input: string): string {
  const m = input.match(/([+-]?\d*\.?\d*)x\s*2|x²|x\^2.*?([+-])\s*(\d*\.?\d*)x\s*([+-])\s*(\d*\.?\d*)\s*=\s*0/);
  const m2 = input.match(/([+-]?\d*\.?\d*)x²\s*([+-])\s*(\d*\.?\d*)x\s*([+-])\s*(\d*\.?\d*)\s*=\s*0/);
  const m3 = input.match(/(-?\d+)\s*x\s*\^\s*2\s*([+-])\s*(\d+)\s*x\s*([+-])\s*(\d+)\s*=\s*0/);

  let a = 1, b = 0, c = 0;
  if (m3) {
    a = parseFloat(m3[1]);
    b = m3[2] === '-' ? -parseFloat(m3[3]) : parseFloat(m3[3]);
    c = m3[4] === '-' ? -parseFloat(m3[5]) : parseFloat(m3[5]);
  } else if (m2) {
    a = parseFloat(m2[1]) || 1;
    b = m2[2] === '-' ? -parseFloat(m2[3]) : parseFloat(m2[3]);
    c = m2[4] === '-' ? -parseFloat(m2[5]) : parseFloat(m2[5]);
  } else {
    return `Para ecuaciones cuadráticas, escribe algo como: x² - 5x + 6 = 0

Uso la fórmula general:
> x = (-b ± √(b² - 4ac)) / 2a

¿Quieres intentar con un ejemplo?`;
  }

  const disc = b * b - 4 * a * c;

  let result = `**Ecuación:** ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0\n\n`;
  result += `**Fórmula general:** x = (-b ± √(b² - 4ac)) / 2a\n\n`;
  result += `**Discriminante:** b² - 4ac = ${b}² - 4(${a})(${c}) = **${disc}**\n\n`;

  if (disc < 0) {
    result += `Como el discriminante es **negativo**, no hay soluciones reales.\n\n`;
    result += `Las soluciones son **complejas (imaginarias)**.`;
  } else if (disc === 0) {
    const x = -b / (2 * a);
    result += `Hay **una solución real** (raíz doble):\n> x = **${x}**`;
  } else {
    const sqrtD = Math.sqrt(disc);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    result += `**Soluciones:**\n> x₁ = ${x1.toFixed(4)}\n> x₂ = ${x2.toFixed(4)}`;
  }

  result += '\n\n¿Quieres resolver otra ecuación?';
  return result;
}

function solveArithmetic(a: number, op: string, b: number): string {
  let result: number;
  let opSym: string;
  switch (op) {
    case '+': result = a + b; opSym = '+'; break;
    case '-': result = a - b; opSym = '-'; break;
    case '*': case 'x': case '×': result = a * b; opSym = '×'; break;
    case '/': case '÷':
      if (b === 0) return `**No se puede dividir entre 0.**\n\nLa división por cero no está definida en matemáticas.`;
      result = a / b; opSym = '÷'; break;
    default: return 'No pude identificar la operación.';
  }
  return `**${a} ${opSym} ${b} = ${result}**

¿Necesitas otra operación?`;
}

// ─── Socratic tutor (dual-agent: hints + checker) ───────────────────────────

const SOCRATIC_KEYWORDS = ['socratic', 'socrático', 'no me digas la respuesta', 'dame pistas'];

interface SocraticProblem {
  enunciado: string;
  formula: string;
  answer: number;
  tolerancia: number;
  hints: string[];
}

const SOCRATIC_TOPICS: Record<string, SocraticProblem> = {
  newton: {
    enunciado: 'una persona empuja una caja de 10 kg con 20 N. Si no hay fricción, halla su aceleración en m/s².',
    formula: 'F = m · a  →  a = F / m',
    answer: 2,
    tolerancia: 0.1,
    hints: [
      '¿Qué magnitud te piden? La aceleración (a). ¿Qué datos conoces? Fuerza (F) y masa (m).',
      'La 2ª Ley de Newton dice F = m·a. Para hallar "a", despejamos dividiendo entre m.',
      'Divide la fuerza (20 N) entre la masa (10 kg). ¿Cuánto te da?',
    ],
  },
  ecuacion: {
    enunciado: '3x - 7 = 14. ¿Cuál es el valor de x?',
    formula: 'Aislar la x: sumar la constante, luego dividir por el coeficiente.',
    answer: 7,
    tolerancia: 0.05,
    hints: [
      'Queremos dejar la "x" sola. Antes hay un "-7" restado: ¿qué haremos con él?',
      'Suma 7 a ambos lados: 3x = 14 + 7 = 21.',
      'Ahora 3 multiplica a x. Para aislarla divide ambos lados entre 3: x = 21 / 3 = ?',
    ],
  },
  mole: {
    enunciado: '¿Cuántos moles hay en 36 g de agua (H₂O, masa molar 18 g/mol)?',
    formula: 'n = m / M  (moles = masa / masa molar)',
    answer: 2,
    tolerancia: 0.05,
    hints: [
      'La fórmula del número de moles es n = masa / masa molar.',
      'La masa son 36 gramos y la masa molar del agua es 18 g/mol.',
      'Divide 36 entre 18. ¿Cuántas moles obtienes?',
    ],
  },
  pitagoras: {
    enunciado: 'Un triángulo rectángulo tiene catetos de 3 y 4. ¿Cuánto mide la hipotenusa?',
    formula: 'a² + b² = c²',
    answer: 5,
    tolerancia: 0.1,
    hints: [
      'El teorema es a² + b² = c², donde c es la hipotenusa (el lado más largo).',
      'Sustituye: 3² + 4² = 9 + 16 = 25.',
      'Para hallar c, saca la raíz cuadrada: √25 = ?',
    ],
  },
  porcentaje: {
    enunciado: 'Un celular cuesta 800 soles. Si hay 25% de descuento, ¿cuánto pagas?',
    formula: 'Pago = precio − (precio × 25/100)',
    answer: 600,
    tolerancia: 1,
    hints: [
      'Primero calcula cuántos soles es el 25% (25 de cada 100).',
      '25% de 800 = 800 × 0.25 = 200 soles de descuento.',
      'Resta el descuento al precio: 800 − 200 = ?',
    ],
  },
  general: {
    enunciado: 'Un tren recorre 300 km en 3 horas a velocidad constante. ¿Cuál es su velocidad en km/h?',
    formula: 'v = d / t',
    answer: 100,
    tolerancia: 1,
    hints: [
      'La velocidad es la distancia dividida entre el tiempo.',
      'Distancia = 300 km, tiempo = 3 h.',
      'Divide 300 entre 3. ¿Cuántos km/h?',
    ],
  },
};

function isSocraticActivation(q: string): boolean {
  return SOCRATIC_KEYWORDS.some((k) => q.includes(k));
}

function isSocraticAnswer(q: string): boolean {
  return q.includes('socratic') || q.includes('socrático') || q.includes('sigamos con el tutor');
}

function socraticResponse(q: string): string {
  const tp = detectSocraticTopic(q);
  return `**Tutor socrático** 🧠
No te daré la respuesta directa. Vamos a resolverlo paso a paso con pistas guiadas.

**Problema:** ${tp.enunciado}

🧩 **Pista 1:** ${tp.hints[0]}

> Escribe "socrático" + tu respuesta/intento, o "socrático pista" para la siguiente.`;
}

function socraticFeedback(q: string): string {
  const tp = detectSocraticTopic(q);
  const numbers = q.match(/-?\d+(?:\.\d+)?/g);
  let report = `> En un curso socrático no importa acertar a la primera, importa *razonar*.\n\n`;
  report += `**Fórmula clave:** ${tp.formula}\n\n`;

  if (numbers && numbers.length > 0) {
    const lastNum = parseFloat(numbers[numbers.length - 1]);
    if (Math.abs(lastNum - tp.answer) <= tp.tolerancia) {
      report = `✅ **¡Correcto!** La respuesta es ${tp.answer}.\n\n`;
      report += `Lo lograste razonando. La clave fue:\n- ${tp.formula}\n- Operación con los datos del enunciado.\n\n`;
      report += `¿Quieres otro ejercicio socrático o pasamos a un tema distinto?`;
    } else {
      report += `Comprobaste que el valor **${lastNum}** no coincide con la respuesta correcta **${tp.answer}**.\n\n`;
      report += `**Pistas para llegar ahí:**\n`;
      report += tp.hints.map((h, i) => `${i + 1}. ${h}`).join('\n');
    }
  } else {
    report += `No encontré tu número. Intenta responder con el valor numérico final y lo comprobamos juntos. 😉`;
    report += `\n**Pistas:**\n` + tp.hints.map((h, i) => `${i + 1}. ${h}`).join('\n');
  }
  return report;
}

function detectSocraticTopic(q: string): SocraticProblem {
  let key = 'mole';
  if (q.includes('newton') || q.includes('fuerza') || q.includes('caja')) key = 'newton';
  else if (q.includes('ecuaci')) key = 'ecuacion';
  else if (q.includes('pitag') || q.includes('triangulo')) key = 'pitagoras';
  else if (q.includes('mole') || q.includes('agua') || q.includes('quim')) key = 'mole';
  else if (q.includes('porcent') || q.includes('descuento') || q.includes('celular')) key = 'porcentaje';
  return SOCRATIC_TOPICS[key];
}

// ─── Local RAG (document answers) ───────────────────────────────────────────

const STOPWORDS = new Set([
  "para", "como", "cual", "cómo", "cuál", "esta", "este", "esta", "esto", "ese", "esa",
  "documento", "archivo", "según", "sobre", "resumen", "resume", "explíca", "explicame",
  "explica", "cuenta", "que", "dime", "quiero", "hacer", "tengo", "permite", "conocer",
  "necesito", "indica", "qué", "que", "dame", "puedes", "saber", "más", "menos", "mira",
]);

function extractKeywords(msg: string): string[] {
  return msg
    .toLowerCase()
    .split(/[^a-záéíóúñü0-9]+/g)
    .filter((w) => w.length > 3)
    .filter((w) => !STOPWORDS.has(w));
}

function scoreParagraph(paragraph: string, keywords: string[]): number {
  const lower = paragraph.toLowerCase();
  return keywords.reduce((s, k) => {
    if (lower.includes(k)) {
      const re = new RegExp(k, "g");
      const hits = lower.match(re)?.length ?? 1;
      return s + (k.length > 5 ? 2 : 1) + (hits > 1 ? 1 : 0);
    }
    return s;
  }, 0);
}

function getBestExcerpt(docText: string, keywords: string[], maxLen = 700): { excerpt: string; found: boolean } {
  const paragraphs = docText.split(/\n{2,}|\n?•\n?/).map((p) => p.trim()).filter((p) => p.length > 0);
  const scored = paragraphs
    .map((p, i) => ({ p, i, s: scoreParagraph(p, keywords) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i);
  const best = scored[0]?.p || paragraphs[0] || "";
  const found = scored.length > 0;
  return { excerpt: best.length > maxLen ? best.slice(0, maxLen) + "…" : best, found };
}

function localRagResponse(msg: string, files: FileAttachment[], docText: string): string {
  const keywords = extractKeywords(msg);
  const { excerpt, found } = getBestExcerpt(docText, keywords);
  const summaryTitle = files.map((f) => f.name).join(", ");

  const lower = msg.toLowerCase();
  if (lower.includes("resumen") || lower.includes("resume") || lower.includes("síntesis") || lower.includes("sintesis")) {
    // Heuristic summary: first sentences of document
    const sentences = docText.split(/\.\s+/).slice(0, 12).join(". ") + ".";
    return `**Resumen basado en tu documento** 📄 (${files.length} archivo${files.length > 1 ? "s" : ""})

${sentences}

*El asistente está en modo offline; para un resumen más profundo, activa la conexión de IA.*`;
  }

  if (!found) {
    return `**Respuesta basada en tu documento** 📄

No encontré un fragmento directamente relacionado con *"${msg.trim()}"* en "${summaryTitle}".

**Sugerencias:**
- Reformula con una palabra clave del tema (p. ej. "romanos", "fracciones", "biografía").
- Activa la IA conectada para una respuesta más completa.

*Primeras líneas de tu documento:*\n> ${docText.split(/\.\s+/).slice(0, 3).join(". ")}.`;
  }

  return `**Respuesta basada en tu documento** 📄

En "${summaryTitle}" encontré esto:

> ${excerpt}

Consejo: con la IA conectada puedo darte una respuesta más completa y adaptada a tu pregunta. Mientras tanto, revisa el fragmento de arriba.`;
}
