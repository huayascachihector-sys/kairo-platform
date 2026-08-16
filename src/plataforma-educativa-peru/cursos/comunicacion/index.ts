import { CursoBase, QuizActiveRecall } from '../../tipos';

function leccion(
  id: string,
  titulo: string,
  duracion: number,
  intuicion: string,
  analogia: string,
  pasos: string[],
  definicion: string,
  formula: string | undefined,
  ejemplos: string[],
  errores: string[],
  aplicaciones: string[],
  retoEnunciado: string,
  retoTipo: 'problema_resuelto' | 'ejercicio_contextualizado' | 'simulacion',
  retoPistas: string[],
  retoSolucion: { paso: number; descripcion: string; formulaUsada?: string; resultadoParcial?: string }[],
  retoVerificacion: string,
  palabrasClave: string[],
  quiz: QuizActiveRecall[]
) {
  return {
    id,
    titulo,
    duracionAproximada: duracion,
    explicacionFeynman: {
      intuicionInicial: intuicion,
      analogiaSimple: analogia,
      pasoAPasoIntuitivo: pasos,
    },
    conceptoTecnico: {
      definicionFormal: definicion,
      formulaMatematica: formula,
      ejemplos,
      erroresComunes: errores,
      conexionAplicaciones: aplicaciones,
    },
    retoPractico: {
      tipo: retoTipo,
      enunciado: retoEnunciado,
      pistas: retoPistas,
      solucionPasoAPaso: retoSolucion,
      verificacionActiveRecall: retoVerificacion,
    },
    palabrasClave,
    quizActiveRecall: quiz,
  };
}

export const ComunicacionCurso: CursoBase = {
  id: 'comunicacion-neuro',
  nombre: 'Háblica: Comprende, Escribe y Vive la Palabra',
  descripcion: 'Curso de Comunicación y redacción académica con análisis crítico, basado en la técnica "Sácalo y verifica" con literatura peruana como hilo conductor.',
  nivelEducativo: 'Secundaria',
  competencias: [
    'Leer y analizar textos literarios y científicos',
    'Escribir textos académicos con coherencia y estilo',
    'Interpretar el contexto histórico-cultural de obras',
    'Desarrollar pensamiento crítico frente a la información',
    'Comunicarse oralmente con claridad y persuasión',
  ],
  duracionEstimada: '11 meses',
  metodologia: {
    metodoFeynman: true,
    activeRecall: true,
    spacedRepetition: true,
    intuicionAntesFormula: true,
    estrategiasTransversales: [
      'Técnica Sácalo y verifica para redacción',
      'Análisis de literatura peruana como eje central',
      'Lectura profunda con marcas de comprensión',
      'Feedback de IA para coherencia y estilo',
      'Autoevaluación estructurada',
    ],
  },
  modulos: [
    {
      id: 'comprension-lectora',
      titulo: 'Comprensión Lectora: Entre Líneas y Más Allá',
      orden: 1,
      spacedReviewSchedule: ['día 1', 'día 3', 'día 8', 'día 20'],
      lecciones: [
        leccion(
          'lectura-profunda',
          'La Lectura como Viaje Interior',
          24,
          'Leer no es pasar los ojos sobre las palabras. Es como tener una conversación con el autor. Pregúntale al texto: ¿qué quieres decir? ¿por qué lo dices así?',
          'Leer es como explorar una cueva: las palabras son las paredes, pero las ideas son los tesoros escondidos detrás.',
          [
            'Primero entiende qué dice el texto literalmente',
            'Luego pregunta: ¿qué significa esto en mi vida?',
            'Busca conexiones con lo que ya sabes',
            'Identifica la intención del autor: ¿qué quiere que pienses?',
          ],
          'La comprensión lectora es el proceso de construir significado mediante la interacción entre conocimientos previos e información explícita/implícita del texto.',
          'Explícito + Conocimiento previo + Inferencia = Comprensión',
          [
            'Texto explícito: "El sol brillaba"',
            'Texto implícito: "Llevaba paraguas" (sugerencia de lluvia)',
            'Inferencia: "Sus ojos estaban rojos" (probablemente lloraba)',
          ],
          [
            'Saltar palabras sin procesar su significado',
            'Leer sin hacer preguntas al texto',
            'No activar conocimientos previos antes de leer',
          ],
          [
            'Entender instrucciones de exámenes',
            'Analizar noticias y fake news',
            'Interpretar literatura universal',
          ],
          'Lee este fragmento y marca lo explícito e implícito: "María cerró la puerta con cuidado y dejó el celular sobre la mesa. No volvió a mirar atrás."',
          'ejercicio_contextualizado',
          [
            'Identifica hechos concretos (explícitos)',
            'Busca sugerencias de intención (implícitas)',
            'Considera el contexto emocional',
          ],
          [
            { paso: 1, descripcion: 'Explícito: María cerró la puerta y dejó el celular', resultadoParcial: 'Acciones concretas descritas' },
            { paso: 2, descripcion: 'Implícito: No volvió a mirar atrás sugiere intención final', resultadoParcial: 'Posible despedida definitiva' },
            { paso: 3, descripcion: 'Contexto: Tono sugiere tensión o conflicto', resultadoParcial: 'Emociones no expresadas directamente' },
          ],
          '¿Cómo cambia tu comprensión si lees el fragmento 3 veces?',
          ['comprensión', 'inferencia', 'explícito', 'implícito', 'contexto'],
          [
            { pregunta: '¿Qué diferencia hay entre texto explícito e implícito?', respuestaCorrecta: 'Explícito: lo dice directamente; implícito: lo sugiere', explicacion: 'El implícito requiere interpretación del lector.', tipoMemoria: 'conceptual' },
            { pregunta: 'Si un texto menciona "ayer llovió", ¿qué podemos inferir?', respuestaCorrecta: 'Probablemente el suelo esté mojado', explicacion: 'La lluvia implica humedad, aunque no se diga explícitamente.', tipoMemoria: 'conceptual' },
            { pregunta: '¿Por qué es importante activar conocimientos previos al leer?', respuestaCorrecta: 'Te ayuda a conectar y entender mejor el texto', explicacion: 'Los conocimientos previos facilitan la construcción de significado.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'tipos-texto',
          'Tipos de Texto: La Intención Comunicativa',
          22,
          'Todo texto tiene una intención: contar una historia, describir un lugar, convencer de una idea. Es como identificar el propósito de una carta: ¿quieres contar algo, pedir algo o persuadir?',
          'Imagina recibir una carta: si te cuenta un viaje, es narrativo. Si te describe un cuadro, es descriptivo. Si te pide votar por algo, es argumentativo.',
          [
            'Narrativo: cuenta hechos o historias (novelas, cuentos)',
            'Descriptivo: caracteriza objetos o personas (retratos, paisajes)',
            'Expositivo: informa y explica (artículos científicos, manuales)',
            'Argumentativo: convence con razones (ensayos, editoriales)',
            'Instructivo: guía acciones (recetas, tutoriales)',
          ],
          'Los textos se clasifican según su intención comunicativa: narrativo, descriptivo, expositivo, argumentativo e instructivo. Cada uno tiene estructuras y propósitos distintos.',
          'n/a',
          [
            'Narrativo: "Había una vez..."',
            'Descriptivo: "El árbol era alto y verde..."',
            'Expositivo: "La fotosíntesis convierte luz en energía..."',
          ],
          [
            'Creer que todo texto es solo informativo',
            'No distinguir narrativo de expositivo',
            'Usar conectores de un tipo en otro',
          ],
          [
            'Redacción de ensayos según tipo',
            'Análisis de noticias en medios',
            'Creación de contenidos para redes sociales',
          ],
          'Clasifica estos textos: (1) "El Perú es el segundo país más grande de Sudamérica", (2) "Hoy comí una manzana roja y jugosa", (3) "Deberías reciclar para salvar el planeta"',
          'ejercicio_contextualizado',
          ['Analiza la intención de cada texto', 'Identifica estructura y propósito', 'Justifica tu clasificación'],
          [
            { paso: 1, descripcion: 'Texto 1: Da información (expositivo)', resultadoParcial: 'Propósito: informar' },
            { paso: 2, descripcion: 'Texto 2: Describe algo (descriptivo/expositivo)', resultadoParcial: 'Propósito: describir' },
            { paso: 3, descripcion: 'Texto 3: Busca cambiar opinión (argumentativo)', resultadoParcial: 'Propósito: convencer' },
          ],
          '¿Cuál tipo de texto es una receta de cocina?',
          ['texto narrativo', 'texto descriptivo', 'texto expositivo', 'texto argumentativo', 'texto instructivo'],
          [
            { pregunta: '¿Qué tipo de texto busca convencer al lector?', respuestaCorrecta: 'Argumentativo', explicacion: 'Usa argumentos y evidencias para persuadir.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué tipo de texto es "El sol sale por el este"?', respuestaCorrecta: 'Descriptivo o expositivo', explicacion: 'Informa o describe un fenómeno.', tipoMemoria: 'conceptual' },
            { pregunta: '¿Qué tipo de texto es una novela?', respuestaCorrecta: 'Narrativo', explicacion: 'Cuenta una historia con personajes y trama.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'idea-principal-inferencia',
          'Idea Principal e Inferencias: Leer entre Líneas',
          25,
          'Cuando lees un texto, tu cerebro busca dos cosas: la idea principal (¿de qué trata?) y las inferencias (¿qué sugiere?). Es como escuchar una conversación y entender lo que NO se dice directamente.',
          'La idea principal es como el título implícito del texto. Las inferencias son como leer entre líneas: el autor no lo dice, pero puedes deducirlo.',
          [
            'La idea principal es el mensaje central del texto',
            'Suele estar en la primera o última oración del párrafo',
            'Las ideas secundarias (detalles, ejemplos) la apoyan',
            'Las inferencias se construyen con pistas del texto + tu conocimiento',
          ],
          'La idea principal (o tema) es el mensaje más importante del texto. Las inferencias son conclusiones obtenidas del texto, no expresadas directamente.',
          'Tesis + Evidencias + Conocimiento = Comprensión',
          [
            'Idea principal: "El cambio climático es un problema global"',
            'Inferencia: "Juan llega con camisa mojada" → probablemente llovió',
            'Evidencia: "Las glaciares se derriten" → "El nivel del mar sube"',
          ],
          [
            'Confundir idea principal con primera oración',
            'Saltar inferencias por no leer atentamente',
            'No diferenciar opinión de evidencia',
          ],
          [
            'Comprensión de exámenes estandarizados',
            'Análisis crítico de noticias',
            'Interpretación de textos literarios',
          ],
          'En un párrafo que dice: "La deforestación en la Amazonía aumentó 20% en el último año, según reportes del INRENA. Los agricultores expanden tierras para cultivo, y los incendios forestales siguen subiendo.", ¿cuál es la idea principal y qué inferencias puedes hacer?',
          'ejercicio_contextualizado',
          ['Identifica la idea central', 'Busca datos que la apoyan', 'Extrae inferencias adicionales'],
          [
            { paso: 1, descripcion: 'Idea principal: La deforestación aumenta', resultadoParcial: 'Mensaje central' },
            { paso: 2, descripcion: 'Evidencia: 20% en el último año, incendios suben', resultadoParcial: 'Datos concretos' },
            { paso: 3, descripcion: 'Inferencia: Agricultura expandida causa deforestación', resultadoParcial: 'Relación causa-efecto' },
            { paso: 4, descripcion: 'Inferencia: El gobierno debe intervenir', resultadoParcial: 'Sugiere solución' }
          ],
          '¿Cómo identificarías la idea principal de un artículo de noticias?',
          ['idea principal', 'inferencia', 'tema', 'argumento', 'tesis'],
          [
            { pregunta: '¿Qué es una inferencia?', respuestaCorrecta: 'Una conclusión obtenida implícitamente del texto', explicacion: 'No está dicha directamente, pero se deduce.', tipoMemoria: 'factual' },
            { pregunta: '¿Dónde suelen estar las ideas secundarias?', respuestaCorrecta: 'En las oraciones de desarrollo del párrafo', explicacion: 'Apoyan y explican la idea principal.', tipoMemoria: 'factual' },
            { pregunta: '¿De qué tipo de inferencia trata "Si llueve hoy, mañana estará húmedo"?', respuestaCorrecta: 'Causal (causa-efecto)', explicacion: 'Relaciona causa y consecuencia.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'coherencia-cohesion',
          'Coherencia y Cohesión: El Hilo Conductor del Texto',
          20,
          'Un texto coherente es como un río que fluye: cada oración conecta naturalmente con la siguiente. Los conectores son como puentes que unen las ideas sin que se noten.',
          'Imagina un río: la corriente es la coherencia (fluye natural), y las piedras son los conectores que guían el camino.',
          [
            'Coherencia: relación lógica entre ideas (el hilo)',
            'Cohesión: recursos lingüísticos que unen oraciones (conectores)',
            'Conectores: "porque", "además", "sin embargo", "por otro lado"',
            'Referencias: "este", "que", "lo cual" enlazan elementos',
          ],
          'La coherencia es la relación lógica entre ideas. La cohesión usa recursos lingüísticos (conectores, referencias) para que el texto fluya.',
          'n/a',
          [
            'Coherencia: "Estudié toda la noche. Rindiendo el examen, obtuve 18."',
            'Cohesión: María llegó tarde. Porque el bus no pasó. Además, estaba cansada.',
            'Error: "Llovía. Por lo tanto, salí con paraguas." (cohesión sin coherencia)',
          ],
          [
            'Usar conectores sin relación lógica',
            'Repetir palabras en lugar de usar sinónimos',
            'No mantener la misma voz narrativa',
          ],
          [
            'Redacción académica formal',
            'Textos informativos en medios',
            'Escritura creativa estructurada',
          ],
          'Arregla la coherencia y cohesión: "Me gusta el fútbol. El fútbol es un deporte. Juego fútbol. Mi hermano también juega. Le gusta ganar."',
          'ejercicio_contextualizado',
          ['Identifica repeticiones y falta de conectores', 'Propone sinónimos', 'Añade conectores lógicos'],
          [
            { paso: 1, descripcion: 'Detecta repeticiones: "fútbol" aparece 3 veces', resultadoParcial: 'Falta de cohesión' },
            { paso: 2, descripcion: 'Reemplaza con sinónimos: "deporte", "juego", "competencia"', resultadoParcial: 'Mejora cohesión' },
            { paso: 3, descripcion: 'Añade conectores: "Además", "Asimismo", "En cambio"', resultadoParcial: 'Conecta ideas' },
            { paso: 4, descripcion: 'Resultado: "Me gusta el fútbol, un deporte apasionante. Además, juego fútbol. En cambio, mi hermano prefiere otros deportes pero también compite."', resultadoParcial: 'Texto cohesivo' }
          ],
          '¿Qué diferencia hay entre coherencia y cohesión?',
          ['coherencia', 'cohesión', 'conectores', 'referencia', 'sinónimo'],
          [
            { pregunta: '¿Qué son los conectores en un texto?', respuestaCorrecta: 'Recursos lingüísticos que unen oraciones', explicacion: 'Ej: además, sin embargo, porque.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué sucede si un texto usa conectores pero no tiene coherencia?', respuestaCorrecta: 'Las oraciones no guardan relación lógica', explicacion: 'Cohesión sin coherencia genera texto sin sentido.', tipoMemoria: 'conceptual' },
            { pregunta: '¿Cuál de estos es un conector adversativo?', respuestaCorrecta: 'Sin embargo', explicacion: 'Adversativo contradice: pero, sin embargo, no obstante.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'estrategias-comprension',
          'Estrategias de Comprensión: Herramientas de Lectura',
          23,
          'Leer con estrategias es como usar gafas especiales: ves más allá de las palabras. Predecir, resumir, preguntar y conectar son como filtros que ayudan a entender mejor.',
          'Imagina una biblioteca: cada estrategia es una estantería distinta. Predecir = la portada que adelanta el libro. Preguntar = los índices que muestran secciones. Resumir = el resumen al final. Conectar = las referencias cruzadas.',
          [
            'Predecir: anticipar qué dirá el texto según el título y portada',
            'Preguntar: generar preguntas antes, durante y después de leer',
            'Resumir: sintetizar ideas principales en propias palabras',
            'Conectar: relacionar el texto con tu vida, otros textos y el mundo',
          ],
          'Las estrategias de comprensión son técnicas activas que el lector usa para facilitar la lectura: predicción, cuestionamiento, resumen y conexión.',
          'PRE + PREG + RES + CON = COMPRENSIÓN',
          [
            'Predecir: "Este texto tratará de la fotosíntesis" → anticipas plantas',
            'Preguntar: "¿Por qué el cielo es azul?" → buscas respuesta en el texto',
            'Resumir: "El texto explica que la luz solar se convierte en energía"',
          ],
          [
            'Leer solo una vez sin repaso',
            'No subrayar o marcar ideas claves',
            'Saltar pasos de predicción sin reflexionar',
          ],
          [
            'Comprensión lectora en exámenes',
            'Aprendizaje autónomo y autodidacta',
            'Investigación y lectura académica',
          ],
          'Aplica las 4 estrategias (PRE, PREG, RES, CON) a este texto breve: "La fotosíntesis es el proceso por el cual las plantas convierten luz solar en energía. Las hojas absorben CO₂ y liberan O₂."',
          'ejercicio_contextualizado',
          ['Predice el tema del texto', 'Formula preguntas clave', 'Resume en una frase', 'Conecta con tu experiencia'],
          [
            { paso: 1, descripcion: 'Predicción: Texto sobre cómo las plantas obtienen energía', resultadoParcial: 'Tema: fotosíntesis' },
            { paso: 2, descripcion: 'Preguntas: ¿Qué necesitan las plantas? ¿Qué producen?', resultadoParcial: 'Foco en proceso yResultado' },
            { paso: 3, descripcion: 'Resumen: Las plantas usan luz solar para producir energía y oxígeno', resultadoParcial: 'Idea principal' },
            { paso: 4, descripcion: 'Conexión: Recuerdo cuando vi plantas en mi jardín creciendo', resultadoParcial: 'Vínculo personal' }
          ],
          '¿Por qué es útil preguntar antes de leer?',
          ['estrategia', 'predicción', 'pregunta', 'resumen', 'conexión'],
          [
            { pregunta: '¿Qué orden siguen las estrategias de comprensión?', respuestaCorrecta: 'Predecir → Preguntar → Resumir → Conectar', explicacion: 'PRE+PREG+RES+CON.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué estrategia usas para sintetizar el texto?', respuestaCorrecta: 'Resumir', explicacion: 'Consigna las ideas principales.', tipoMemoria: 'factual' },
            { pregunta: '¿Por qué conectar el texto con tu vida?', respuestaCorrecta: 'Para fijar mejor el aprendizaje', explicacion: 'Las conexiones activan conocimientos previos.', tipoMemoria: 'conceptual' },
          ]
        ),
      ],
      evaluacionFinal: [
        {
          pregunta: '¿Qué diferencia hay entre coherencia y cohesión?',
          respuestaCorrecta: 'Coherencia es la relación lógica entre ideas; cohesión son los recursos lingüísticos que unen oraciones',
          explicacion: 'Coherencia = hilo lógico; cohesión = conectores y referencias.',
          tipoMemoria: 'conceptual',
        },
        {
          pregunta: '¿Cuál es el orden de las estrategias de comprensión?',
          respuestaCorrecta: 'Predecir, Preguntar, Resumir, Conectar',
          explicacion: 'Las siglas son PRE, PREG, RES, CON.',
          tipoMemoria: 'factual',
        },
        {
          pregunta: '¿Cómo identificarías la idea principal de un texto?',
          respuestaCorrecta: 'Buscas el mensaje central en las oraciones temáticas',
          explicacion: 'La idea principal resume el contenido del texto.',
          tipoMemoria: 'procedural',
        },
      ],
    },
    {
      id: 'redaccion-academica',
      titulo: 'Redacción Académica: Tu Voz en el Papel',
      orden: 2,
      spacedReviewSchedule: ['día 2', 'día 5', 'día 13', 'día 26'],
      lecciones: [
        leccion(
          'estructura-texto',
          'La Arquitectura de un Buen Texto',
          28,
          'Escribir es como construir una casa: necesitas una base sólida (introducción), paredes fuertes (desarrollo) y un techo seguro (conclusión). Si falta una parte, todo se cae.',
          'Un texto bien escrito es como una carrera de obstáculos: cada párrafo es una etapa, y debes guiar al lector sin que se pierda ni se rinda.',
          [
            'Introducción: Di qué vas a contar y por qué interesa',
            'Desarrollo: Expón ideas con ejemplos y explicaciones',
            'Conclusión: Resume y deja una idea final que quede grabada',
          ],
          'La estructura de un texto académico sigue una organización lógica: introducción con tesis, desarrollo con argumentos y conclusión con síntesis.',
          'Tesis + Argumentos + Ejemplos + Conclusion = Texto coherente',
          [
            'Introducción: "La contaminación del aire afecta nuestra salud"',
            'Desarrollo: "Estudios recientes demuestran esto también"',
            'Conclusión: "Por lo tanto, promueve transporte público"',
          ],
          [
            'Empezar sin tesis clara',
            'Saltar ideas sin conectarlas',
            'Concluir sin volver a la idea principal',
          ],
          [
            'Redacción de ensayos para exámenes',
            'Trabajos de investigación escolares',
            'Comunicación persuasiva en redes',
          ],
          'Escribe una Introducción-Conclusión para tema: "Las redes sociales conectan o aíslan a las personas"',
          'problema_resuelto',
          [
            'Empieza con una tesis clara',
            'Incluye datos relevantes',
            'Cierra con una reflexión',
          ],
          [
            { paso: 1, descripcion: 'Tesis: Las redes sociales conectan pero también aíslan', resultadoParcial: 'Posición clara' },
            { paso: 2, descripcion: 'Ejemplos: conectan con amigos lejanos vs adicción al scroll', resultadoParcial: 'Contraste presentado' },
            { paso: 3, descripcion: 'Conclusión: El uso responsable es clave', resultadoParcial: 'Reflexión final' },
          ],
          '¿Qué diferencia hay entre una tesis y una simple opinión?',
          ['tesis', 'argumento', 'coherencia', 'introducción', 'conclusión'],
          [
            { pregunta: '¿Qué debe contener la introducción de un texto?', respuestaCorrecta: 'Una tesis clara y contexto del tema', explicacion: 'Presenta el tema y la posición del autor.', tipoMemoria: 'factual' },
            { pregunta: '¿Por qué es importante la coherencia entre párrafos?', respuestaCorrecta: 'Para que el lector siga la idea sin perderse', explicacion: 'La coherencia mantiene el hilo conductor.', tipoMemoria: 'conceptual' },
            { pregunta: '¿Qué función tiene la conclusión?', respuestaCorrecta: 'Sintetizar las ideas y cerrar el texto', explicacion: 'Da cierre y refuerza la tesis.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'parrafo-unidad',
          'El Párrafo: La Unidad de Construcción del Texto',
          23,
          'El párrafo es como una caja: debe contener una sola idea bien organizada. Si intentas meter dos ideas en una, la caja se rompe y el mensaje se confunde.',
          'Imagina una caja de herramientas: cada párrafo es una caja con una herramienta (idea) específica, y cada oración dentro es una parte de esa herramienta.',
          [
            'Oración temática: expresa la idea principal del párrafo',
            'Oraciones de desarrollo: aportan evidencias, ejemplos, explicaciones',
            'Oración de cierre: concluye o transita al siguiente párrafo',
          ],
          'El párrafo es la unidad mínima de redacción. Tiene oración temática, desarrollo y cierre. Cada párrafo trata una sola idea que apoya la tesis.',
          'n/a',
          [
            'Tópico: "El ejercicio mejora la salud" + desarrollo: datos y ejemplos + cierre: "Por eso, haz ejercicio"',
            'Tópico: "La tecnología avanza rápido" + desarrollo: ejemplos + cierre: "Debemos adaptarnos"',
          ],
          [
            'No empezar con oración temática clara',
            'Mezclar ideas distintas en un mismo párrafo',
            'Olvidar la oración de cierre o transición',
          ],
          [
            'Redacción de ensayos estructurados',
            'Artículos de blog y ensayos',
            'Informes académicos',
          ],
          'Escribe un párrafo sobre "El impacto de las redes sociales en la comunicación juvenil". Incluye las 3 partes del párrafo.',
          'ejercicio_contextualizado',
          ['Define la idea central', 'Aporta ejemplos concretos', 'Cierra con conclusión o transición'],
          [
            { paso: 1, descripcion: 'Oración temática: "Las redes sociales transformaron cómo los jóvenes se comunican"', resultadoParcial: 'Idea principal clara' },
            { paso: 2, descripcion: 'Desarrollo: Instagram, TikTok, WhatsApp facilitan interacción', resultadoParcial: 'Ejemplos concretos' },
            { paso: 3, descripcion: 'Cierre: "Sin embargo, esta comunicación requiere equilibrio"', resultadoParcial: 'Transición reflexiva' }
          ],
          '¿Qué sucede si un párrafo tiene dos ideas principales?',
          ['párrafo', 'oración temática', 'desarrollo', 'cierre', 'coherencia'],
          [
            { pregunta: '¿Qué función tiene la oración temática?', respuestaCorrecta: 'Expresar la idea principal del párrafo', explicacion: 'Guía todo el párrafo.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué va en las oraciones de desarrollo?', respuestaCorrecta: 'Evidencias, ejemplos y explicaciones', explicacion: 'Apoyan la oración temática.', tipoMemoria: 'factual' },
            { pregunta: '¿Cómo se llama la última oración del párrafo?', respuestaCorrecta: 'Oración de cierre o transición', explicacion: 'Cierra o enlaza con el siguiente párrafo.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'argumentacion',
          'Argumentación: La Razón Detrás de las Ideas',
          26,
          'Argumentar no es opinar. Es construir un puente entre una afirmación y las pruebas que la sostienen. Como un ingeniero: diseñas tu argumento con bases sólidas.',
          'Un argumento es como una escalera: la base son hechos, los peldaños son explicaciones, y la cima es tu conclusión.',
          [
            'Tesis: la afirmación que defiendes',
            'Argumentos: las razones que sustentan la tesis',
            'Evidencias: hechos, datos, ejemplos que prueban los argumentos',
            'Contracorrientes: anticipar objeciones y refutarlas',
          ],
          'La argumentación es un proceso de razonamiento que defiende una tesis mediante argumentos y evidencias, considerando y respondiendo a objeciones contrarias.',
          'Tesis → Argumento → Evidencia → Refutación',
          [
            'Tesis: "El reciclaje debe ser obligatorio"',
            'Argumento: "Reduce vertederos y contaminación"',
            'Evidencia: "Países con leyes de reciclaje redujeron basura 30%"',
          ],
          [
            'Dar opiniones sin evidencia',
            'No reconocer objeciones contrarias',
            'Usar datos desactualizados',
          ],
          [
            'Debates académicos y científicos',
            'Discursos persuasivos',
            'Redacción de ensayos argumentativos',
          ],
          '¿Es mejor legalizar el trabajo estudiantil? Argumenta con tu posición, 2 argumentos y evidencias, y una posible objeción.',
          'problema_resuelto',
          ['Define tu tesis clara', 'Aporta argumentos con datos', 'Considera lo contrario'],
          [
            { paso: 1, descripcion: 'Tesis: "El trabajo estudiantil NO debe ser obligatorio"', resultadoParcial: 'Posición clara' },
            { paso: 2, descripcion: 'Argumento 1: Afecta estudios (70% trabaja >10 hrs/semana)', resultadoParcial: 'Evidencia cuantitativa' },
            { paso: 3, descripcion: 'Argumento 2: Riesgo de explotación laboral', resultadoParcial: 'Protección social' },
            { paso: 4, descripcion: 'Objeción: "Pero genera independencia"... Respuesta: "Programas de becas son mejores"', resultadoParcial: 'Refutación equilibrada' }
          ],
          '¿Qué diferencia hay entre tesis y argumento?',
          ['argumentación', 'tesis', 'evidencia', 'refutación', 'opinión'],
          [
            { pregunta: '¿Qué es una tesis en un texto argumentativo?', respuestaCorrecta: 'La afirmación central que defiendes', explicacion: 'Es tu posición sobre el tema.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué tipo de evidencia sustenta un argumento?', respuestaCorrecta: 'Datos, estadísticas, ejemplos y experiencias', explicacion: 'Deben ser verificables y relevantes.', tipoMemoria: 'conceptual' },
            { pregunta: '¿Por qué es importante mencionar objeciones?', respuestaCorrecta: 'Refuerza el argumento con anticipación', explicacion: 'Muestra análisis crítico completo.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'coherencia-redaccion',
          'Coherencia y Estilo: El Toque Final del Texto',
          21,
          'Escribir con coherencia es como tejer un mantel: cada punto debe conectar con el otro. El estilo es como el color del hilo: claro y fluido.',
          'Imagina un río: la coherencia es que el agua fluya sin interrupciones; el estilo es si el río es claro (sencillo) o turbulento (complejo).',
          [
            'Usa conectores lógicos: "primero", "además", "sin embargo"',
            'Mantén voz activa: "Yo hice" vs "Se hizo"',
            'Evita repeticiones: usa sinónimos o reestructura',
            'Concordancia: sustantivo y verbo en número y persona',
          ],
          'La coherencia mantiene ideas conectadas lógicamente. El estilo se refiere a la forma de expresarse (voz activa, claridad, variedad léxica).',
          'n/a',
          [
            'Coherente: "Primero llegué, luego comí, finalmente dormí"',
            'Sinónimos: "rápido" → "veloz", "rápido" → "pronto"',
            'Voz activa: "El estudiante presentó el informe"',
          ],
          [
            'Usar voz pasiva innecesariamente',
            'Repetir palabras en cada oración',
            'No revisar la ortografía y puntuación',
          ],
          [
            'Redacción académica formal',
            'Textos de divulgación científica',
            'Ensayos universitarios',
          ],
          'Reescribe este fragmento mejorando coherencia y estilo: "Fui al cine. Ver película fue interesante. La comida estaba mala. La película duró muchas horas."',
          'ejercicio_contextualizado',
          ['Conecta ideas con conectores', 'Evita repeticiones', 'Mantén voz activa'],
          [
            { paso: 1, descripcion: 'Conecta: "Fui al cine para ver una película interesante"', resultadoParcial: 'Coherencia mejorada' },
            { paso: 2, descripcion: 'Reemplaza "ver" con "disfrutar de"', resultadoParcial: 'Estilo mejorado' },
            { paso: 3, descripcion: 'Concorda: "La película duró dos horas, y aunque fue entretenida, la comida estaba mala"', resultadoParcial: 'Texto fluido y cohesivo' }
          ],
          '¿Qué es la voz activa?',
          ['coherencia', 'estilo', 'voz activa', 'sinónimo', 'conector'],
          [
            { pregunta: '¿Qué diferencia hay entre voz activa y pasiva?', respuestaCorrecta: 'Activa: sujeto hace; pasiva: sujeto recibe', explicacion: '"Yo leo" vs "Se lee".', tipoMemoria: 'conceptual' },
            { pregunta: '¿Cuál de estos es un conector adversativo?', respuestaCorrecta: 'Sin embargo', explicacion: 'Conecta ideas opuestas.', tipoMemoria: 'factual' },
            { pregunta: '¿Para qué sirve un sinónimo en la redacción?', respuestaCorrecta: 'Evitar repeticiones y añadir variedad', explicacion: 'Mejora fluidez y estilo.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'escritura-creativa',
          'Escritura Creativa: El Toque Personal de las Palabras',
          24,
          'Escribir creativamente es como pintar con palabras: cada metáfora es un color, cada ritmo una pincelada. El lector debe ver, sentir y vivir lo que describes.',
          'Imagina tu texto como una canción: las palabras tienen ritmo, las frases suben y bajan como melodías.',
          [
            'La narración: quién cuenta (voz), cuándo (tiempo)',
            'La descripción: usar los 5 sentidos, no solo la vista',
            'El diálogo: cada personaje tiene voz distinta',
            'El conflicto: sin tensión no hay historia interesante',
          ],
          'La escritura creativa usa elementos narrativos: voz narrativa, descripción sensorial, diálogo y conflicto para envolver al lector.',
          'n/a',
          [
            'Narración en primera persona: "Yo vi el coche...", intima',
            'Descripción sensorial: "El pan olía a canela y recuerdos"',
            'Diálogo con personalidad: "¡Vamos!" gritó ella, diferente de "¡Apúrate!" dijo él',
          ],
          [
            'Sobrecargar con adjetivos sin sentido',
            'No darle ritmo a las frases',
            'Olvidar el punto de vista narrativo',
          ],
          [
            'Cuentos y microcuentos',
            'Narrativas para redes sociales',
            'Escritura terapéutica (diario, journaling)',
          ],
          'Escribe un microcuento de 50 palabras sobre "El primer día de clases". Usa al menos un sentido y un conflicto.',
          'ejercicio_contextualizado',
          ['Siente el ambiente (¿nervios? ¿emoción?)', 'Incluye un conflicto o decisión', 'Cierra con un gancho'],
          [
            { paso: 1, descripcion: 'Escenario sensorial: "El locker de metal frío chirrió"', resultadoParcial: 'Sensación táctil' },
            { paso: 2, descripcion: 'Conflicto interno: "¿Atrevería a hablar con ella?"', resultadoParcial: 'Tensión dramática' },
            { paso: 3, descripcion: 'Gancho final: "El timbre sonó, y el mundo cambió"', resultadoParcial: 'Cierre memorable' }
          ],
          '¿Qué diferencia hay entre narración y descripción?',
          ['escritura', 'narración', 'descripción', 'diálogo', 'conflicto'],
          [
            { pregunta: '¿Qué sentidos puedes usar para describir?', respuestaCorrecta: 'Vista, oído, gusto, olfato, tacto', explicacion: 'Sensaciones para conectar con el lector.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué es un conflicto en narrativa?', respuestaCorrecta: 'Obstáculo que impulsa la historia', explicacion: 'Sin conflicto, no hay interés.', tipoMemoria: 'conceptual' },
            { pregunta: '¿Qué hace diferente a un diálogo realista?', respuestaCorrecta: 'Cada personaje tiene voz y estilo distintos', explicacion: 'La distinción de voces aporta verosimilitud.', tipoMemoria: 'conceptual' },
          ]
        ),
      ],
      evaluacionFinal: [
        {
          pregunta: '¿Qué diferencia hay entre tesis y argumento?',
          respuestaCorrecta: 'La tesis es la afirmación; el argumento es la razón que la sustenta',
          explicacion: 'Tesis = posición; argumento = justificación.',
          tipoMemoria: 'conceptual',
        },
        {
          pregunta: '¿Qué partes debe tener un párrafo bien estructurado?',
          respuestaCorrecta: 'Oración temática, desarrollo y oración de cierre',
          explicacion: 'Un párrafo necesita estas tres partes.',
          tipoMemoria: 'factual',
        },
        {
          pregunta: '¿Cómo diferenciarías voz activa de voz pasiva?',
          respuestaCorrecta: 'Activa: "Yo leo"; pasiva: "Se lee"',
          explicacion: 'La voz activa es más clara y directa.',
          tipoMemoria: 'factual',
        },
      ],
    },
    {
      id: 'literatura-peruana',
      titulo: 'Literatura Peruana: Voces que Definen el Alma Nacional',
      orden: 3,
      spacedReviewSchedule: ['día 3', 'día 7', 'día 15', 'día 30'],
      lecciones: [
        leccion(
          'clavecera-cervantes',
          'Cumbres Borrascosas: El Amor que Trasciende la Montaña',
          30,
          'Imagina un joven que sube una montaña para morir de amor porque su novia se cree muerta. Pero ella está viva, aunque no pueda ver. Es un cuento sobre cómo el amor puede superar la muerte y la distancia.',
          'Es como una película de ciencia ficción pero escrita en 1950: el protagonista viaja al futuro y descubre que su amor está viva, viviendo en un mundo paralelo.',
          [
            'El protagonista Alberto sube la montaña para morirse',
            'Encuentra una cabaña con un hombre mudo y una mujer hermosa',
            'Descubre que la mujer es su novia, creída muerta',
            'Todo fue un malentendido: el amor trasciende la forma',
          ],
          'Cumbres Borrascosas es una novela de ciencia ficción peruana de Claudio Llona, publicada posumamente en 1984, considerada una obra maestra de la literatura hispanoamericana.',
          'n/a',
          [
            'Tema del amor trascendental vs realidad física',
            'Crítica social: elitismo y marginación en sociedad andina',
            'Narrativa no lineal: múltiples narradores y perspectivas',
          ],
          [
            'Creer que es solo una novela de amor',
            'Sobreprender el final como realista',
            'Ignorar el contexto histórico de publicación',
          ],
          [
            'Influencia en narrativas de género fantástico',
            'Discusión sobre ética del engaño y manipulación',
            'Exploración del concepto de realidad subjetiva',
          ],
          '¿Por qué el final de Cumbres Borrascosas genera tanta controversia?',
          'ejercicio_contextualizado',
          [
            'Considera las intenciones del autor y el protagonista',
            'Reflexiona sobre ética del engaño',
            'Piensa en cómo la realidad supera a la ficción',
          ],
          [
            { paso: 1, descripcion: 'El protagonista engaña a su novia para probar su amor', resultadoParcial: 'Acto romántico o manipulador?' },
            { paso: 2, descripcion: 'La novia sufre creyéndose en una novela de ciencia ficción', resultadoParcial: 'Realidad vs ficción' },
            { paso: 3, descripcion: 'El final resuelve con aceptación mutua', resultadoParcial: 'Amor trasciende forma y tiempo' },
          ],
          '¿Cómo refleja Cumbres Borrascosas la Identidad peruana?',
          ['novela de ciencia ficción', 'Claudio Llona', 'amor trascendental', 'realidad', 'engaño'],
          [
            { pregunta: '¿Qué género literario es Cumbres Borrascosas?', respuestaCorrecta: 'Ciencia ficción', explicacion: 'Aunque presenta elementos realistas, gira en torno a viajes temporales.', tipoMemoria: 'factual' },
            { pregunta: '¿Cuál es el conflicto central de la novela?', respuestaCorrecta: 'Un hombre que cree a su novia por muerta y sube una montaña para morir', explicacion: 'El protagonista vive una crisis de amor que lo impulsa a una acción extrema.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué tema social critica la obra?', respuestaCorrecta: 'El elitismo y marginación social en sociedad andina', explicacion: 'La novela refleja desigualdades históricas en sociedad peruana.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'literatura-contemporanea',
          'Literatura Contemporánea: Voces de la Resistencia',
          26,
          'Imagina una literatura que grita contra la injusticia: escritores que usan metáforas para denunciar la desigualdad. Es como cantar protesta en una canción.',
          'La literatura contemporánea peruana es como un espejo roto: cada fragmento refleja una parte de la realidad que el poder no quiere ver.',
          [
            'Mario Vargas Llosa: El pez en el agua, La ciudad y los perros',
            'Ciro Alegría: Taypi, Lo mejor de mí',
            'Alfredo Jarpa: La sangre de los ángeles',
            'Mario Chingaza: Poesía indigenista',
            'Todos exploran identidad, memoria y resistencia'
          ],
          'La literatura peruana contemporánea (1950-actualidad) aborda temas de identidad, memoria histórica, desigualdad y resistencia cultural, destacando autores como Vargas Llosa y Alegría.',
          'n/a',
          [
            'Mario Vargas Llosa: "La ciudad y los perros" - crítica social',
            'Ciro Alegría: "Taypi" - literatura indigenista',
            'Alfredo Jarpa: "La sangre de los ángeles" - testimonio de resistencia',
          ],
          [
            'Creer que Vargas Llosa es el único escritor relevante',
            'No reconocer la literatura indigenista',
            'Olvidar el contexto social de las obras',
          ],
          [
            'Estudios culturales latinoamericanos',
            'Análisis de poder y literatura',
            'Identidad y literatura comparada',
          ],
          '¿Qué tema recurrente aparece en "La ciudad y los perros" y por qué fue controversial?',
          'problema_resuelto',
          ['Identifica el contexto de publicación', 'Analiza la crítica social', 'Relaciona con controversia política'],
          [
            { paso: 1, descripcion: 'El libro denuncia la violencia en colegios militares', formulaUsada: 'Crítica institucional' },
            { paso: 2, descripcion: 'El estilo no lineal y múltiple choque con la realidad autoritaria', resultadoParcial: 'Estilo = protesta' },
            { paso: 3, descripcion: 'Vargas Llosa fue atacado por el régimen de Fujimori', resultadoParcial: 'Literatura vs poder' }
          ],
          '¿Por qué la literatura indigenista es importante en Perú?',
          ['literatura contemporánea', 'vargas llosa', 'alegría', 'indigenismo', 'memoria'],
          [
            { pregunta: '¿Cuál es la novela más famosa de Mario Vargas Llosa?', respuestaCorrecta: 'La ciudad y los perros', explicacion: 'Su primera novela, aclamada y controversial.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué tema aborda Ciro Alegría en su literatura?', respuestaCorrecta: 'La vida del pueblo indígena andino', explicacion: 'Literatura indigenista con enfoque social.', tipoMemoria: 'factual' },
            { pregunta: '¿Por qué la literatura peruana es un espejo social?', respuestaCorrecta: 'Refleja realidades y críticas de la sociedad', explicacion: 'La literatura documenta y cuestiona la realidad.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'poesia-peruana',
          'Poesía Peruana: La Palabra como Arma',
          23,
          'La poesía es como un diamante: pequeño pero potente. Cada palabra pesa, cada rima canta. Los poetas peruanos usan versos para gritar contra la injusticia.',
          'Imagina un poema como una canción de protesta: los versos son las notas, las rimas son el ritmo, y el mensaje es la revolución silenciosa.',
          [
            'César Vallejo: el poeta más universal del Perú',
            'José María Arguedas: fusión de quechua y español',
            'Martin Chuva: poesía urbana contemporánea',
            'Toda poesía busca emocionar y transformar',
          ],
          'La poesía peruana abarca desde el modernismo de Vallejo hasta el indigenismo de Arguedas, usando versos para explorar identidad, muerte y resistencia cultural.',
          'n/a',
          [
            'Vallejo: "Hay golpes en la vida, tan fuertes... Yo no sé!"',
            'Arguedas: versos que mezclan quechua y español',
            'Chuva: poesía urbana sobre la violencia y el amor',
          ],
          [
            'Creer que la poesía es solo rima bonita',
            'No entender el lenguaje simbólico',
            'Olvidar el contexto social del poeta',
          ],
          [
            'Estudio de literatura comparada',
            'Poesía en lenguas originarias',
            'Movimiento v_actual en redes sociales',
          ],
          'Analiza "Canto a la vida" de César Vallejo. ¿Qué emociones expresa el poeta?',
          'ejercicio_contextualizado',
          ['Lee el poema con atención', 'Identifica imágenes sensoriales', 'Siente el tono emocional'],
          [
            { paso: 1, descripcion: 'Identifica imágenes: vida, muerte, amor', resultadoParcial: 'Temas universales' },
            { paso: 2, descripcion: 'Analiza el tono: mezcla de tristeza y esperanza', resultadoParcial: 'Contraste emocional' },
            { paso: 3, descripcion: 'Conexión con la identidad peruana: lucha por existir', resultadoParcial: 'Poesía como resistencia' }
          ],
          '¿Qué poeta es considerado el "máximo exponente de la poesía universal"?',
          ['poesía', 'vallejo', 'arguedas', 'verso', 'lenga'],
          [
            { pregunta: '¿Qué poeta peruano escribó "Los Heraldos Negros"?', respuestaCorrecta: 'César Vallejo', explicacion: 'Su obra maestra poética.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué caracteriza la poesía de Vallejo?', respuestaCorrecta: 'Lenguaje simbólico y emotivo', explicacion: 'Expresa profundidad emocional.', tipoMemoria: 'conceptual' },
            { pregunta: '¿Por qué José María Arguedas es único?', respuestaCorrecta: 'Mezcla quechua y español en su prosa', explicacion: 'Puente entre lenguas y culturas.', tipoMemoria: 'factual' },
          ]
        ),
        leccion(
          'narrativa-indigena',
          'Narrativa Indígena: La Voz de los Pueblos Originarios',
          27,
          'Imagina una literatura que nace de la tierra, el viento y el agua. No usa metáforas importadas, sino la sabiduría de quienes viven con la naturaleza.',
          'La narrativa indígena es como una raíz: se extiende profundo en la tierra, conecta con la historia del pueblo, y da sustento a toda una tradición oral.',
          [
            'José María Arguedas: el puente entre mundos',
            'Miguel Ángel García: literatura quechua contemporánea',
            'Tradición oral: leyendas, mitos y cantos ceremoniales',
            'Lenguas originarias como base identitaria',
          ],
          'La narrativa indígena peruana expresa identidad y resistencia a través de lenguas originarias y tradición oral, destacando autores que fusionan quechua, aimara y español.',
          'n/a',
          [
            'Arguedas: "Todas las sangres" y "Los ríos profundos"',
            'Leyendas: "La Llorona" versión andina',
            'Canciones ceremoniales: "Kullawada" y "Harawi"',
          ],
          [
            'Creer que solo existe literatura escrita',
            'No respetar la tradición oral como literatura',
            'Olvidar la importancia de las lenguas originarias',
          ],
          [
            'Revitalización lingüística y cultural',
            'Educación intercultural bilingüe',
            'Patrimonio cultural inmaterial de la UNESCO',
          ],
          '¿Por qué es importante la literatura en lenguas originarias para el Perú?',
          'problema_resuelto',
          ['Considera la diversidad cultural', 'Piensa en la identidad', 'Relaciona con la UNESCO'],
          [
            { paso: 1, descripcion: 'Las lenguas originarias son patrimonio cultural viviente', formulaUsada: 'Diversidad lingüística' },
            { paso: 2, descripcion: 'La literatura oral transmite sabiduría ancestral', resultadoParcial: 'Conocimiento tradicional' },
            { paso: 3, descripcion: 'La UNESCO reconoce la importancia de la diversidad lingüística', resultadoParcial: 'Valor universal' }
          ],
          '¿Qué significa "narrativa transtextual"?',
          ['indigenismo', 'arguedas', 'lengua', 'oral', 'tradición'],
          [
            { pregunta: '¿Qué poeta es considerado el "máximo exponente de la poesía universal"?', respuestaCorrecta: 'César Vallejo', explicacion: 'Fue el primer poeta universal peruano.', tipoMemoria: 'factual' },
            { pregunta: '¿Qué lengua mezclaba José María Arguedas en su prosa?', respuestaCorrecta: 'Quechua y español', explicacion: 'Fusionó lenguas originaria y europea.', tipoMemoria: 'factual' },
            { pregunta: '¿Por qué es importante la literatura oral indígena?', respuestaCorrecta: 'Transmite conocimientos ancestrales y culturales', explicacion: 'Es patrimonio viviente de la humanidad.', tipoMemoria: 'conceptual' },
          ]
        ),
        leccion(
          'escritura-academica-peruana',
          'Escritura Académica Peruana: Entre el Idioma y la Identidad',
          25,
          'Escribir en español desde el Perú es como hablar con acento: no cambia la lengua, pero sí da sabor a las palabras. La escritura académica peruana abraza esta riqueza.',
          'Imagina escribir un ensayo: tus palabras llevan el eco de quechua, aimara y el ritmo del ande, pero viajan en español.',
          [
            'El español peruano como variedad lingüística',
            'Influencia de lenguas originarias en la escritura',
            'Términos como "papa", "choclo", "chicha" en textos académicos',
            'La academia y la lengua: norma vs uso real',
          ],
          'La escritura académica peruana se distingue por incorporar términos y razonamientos de lenguas originarias, enriqueciendo el español con expresiones propias de la diversidad cultural peruana.',
          'n/a',
          [
            'Uso de "ch" como sonido andino (chocho, chanka)',
            'Términos de salud: "guayaba" (fruit), "chancaca"',
            'Toponios: "Lima", "Cusco", "Arequipa" con raíces indígenas',
          ],
          [
            'Creer que solo el español "puro" es académico',
            'No reconocer la riqueza léxica del español peruano',
            'Ignorar el papel de las lenguas originarias',
          ],
          [
            'Lenguas y poder en análisis lingüístico',
            'Política lingüística en educación',
            'Identidad y escritura académica',
          ],
          '¿Cómo enriquecerías un texto académico sobre gastronomía usando términos peruanos?',
          'ejercicio_contextualizado',
          ['Identifica conceptos locales', 'Integra sin perder formalidad', 'Mantén coherencia académica'],
          [
            { paso: 1, descripcion: 'Identifica: "pachamanca", "cuy", "chicha morada"', resultadoParcial: 'Términos culturales' },
            { paso: 2, descripcion: 'Define para lector externo: "preparación ancestral de tiero y piedra"', resultadoParcial: 'Contexto claro' },
            { paso: 3, descripcion: 'Integra en marco teórico: influencia culinaria andina en identidad', resultadoParcial: 'Académico y local a la vez' }
          ],
          '¿Qué diferencia hay entre norma culta y lenguaje coloquial en la academia?',
          ['escritura académica', 'español peruano', 'lengua', 'identidad', 'academia'],
          [
            { pregunta: '¿Qué términos de origen indígena se usan en la escritura académica?', respuestaCorrecta: 'Palabras como papa, choclo, chirimoya', explicacion: 'Términos de la quechua e imbabura.', tipoMemoria: 'factual' },
            { pregunta: '¿Cómo influye la diversidad lingüística en la escritura?', respuestaCorrecta: 'Enriquece la expresividad y vocabulario', explicacion: 'Añade matices culturales.', tipoMemoria: 'conceptual' },
            { pregunta: '¿Qué topónimo peruano tiene raíz quechua?', respuestaCorrecta: 'Cusco (Qosqo), Arequipa (Ariquipay)', explicacion: 'Toponios con raíces originarias.', tipoMemoria: 'factual' },
          ]
        ),
      ],
      evaluacionFinal: [
        {
          pregunta: '¿En qué se diferencia la novela Cumbres Borrascosas de una novela realista convencional?',
          respuestaCorrecta: 'Incorpora elementos de ciencia ficción y viajes temporales',
          explicacion: 'Aunque trata temas realistas, usa el género de ciencia ficción.',
          tipoMemoria: 'conceptual',
        },
        {
          pregunta: '¿Qué poeta peruano escribió "Los Heraldos Negros"?',
          respuestaCorrecta: 'César Vallejo',
          explicacion: 'Obra fundamental de la literatura universal.',
          tipoMemoria: 'factual',
        },
        {
          pregunta: '¿Por qué la narrativa indígena es importante para el Perú?',
          respuestaCorrecta: 'Preserva identidad y conocimientos ancestrales',
          explicacion: 'La literatura oral e indígena es patrimonio cultural.',
          tipoMemoria: 'conceptual',
        },
      ],
    },
  ],
};
