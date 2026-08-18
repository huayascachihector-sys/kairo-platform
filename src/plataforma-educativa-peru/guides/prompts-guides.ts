export const PROMPTS_CREACION_IMAGENES = {
  estiloAnimeEducativo: `Estilo anime/manga educativo para estudiantes peruanos. 
Personajes con ropa típica peruana (chullos, polleras) mezclados con elementos académicos.
Colores cálidos y amigables, expresiones sonrientes y curiosas.
Ideal para: libros de texto, ilustraciones de lecciones, personajes guía.
Formato: 16:9, alta resolución, estilo colorido y animado.
Incluir elementos visuales del tema (ej. ecuaciones, planetas, moléculas) integrados naturalmente.`,

  infografiaNeuroeducativa: `Infografía estilo anime con temática educativa.
Organiza conceptos clave con viñetas visuales y caracteres que representan ideas.
Usar colores distintivos por tema: azul para ciencia, verde para naturaleza, rojo para lenguaje.
Fuentes legibles, espacios en blanco para claridad visual.
Incluir iconos pequeños de reloj para revisiones espaciadas.`,

  mapaConceptualAnime: `Mapa conceptual en estilo anime con personajes andinos sosteniendo conceptos.
Nodos conectados por flechas de colores que representan relaciones causa-efecto.
Fondo con elementos culturales peruanos (montañas, cultivos, textiles).
Personajes que se señalan mutuamente representando ideas relacionadas.`,
};

export const PROMPTS_EXPANSION_CURSO = {
  expandirModulo: `Eres un experto en neuroeducación aplicada al Perú.
Dado este módulo base, genera 3 lecciones adicionales siguiendo:
1. Intuición Feynman con analogías culturales peruanas
2. Concepto técnico preciso con ejemplos locales
3. Reto práctico contextualizado al Perú
4. Quiz de Active Recall con 3 preguntas clave
5. Palabras clave en español e inglés

Formato: JSON con interfaces LeccionMicro.
Tema: [INSERTAR_TEMA_AQUÍ]
Contexto: [INSERTAR_MODULO_BASE_AQUÍ]`,

  generarEjerciciosPracticos: `Como generador de ejercicios para estudiantes peruanos de secundaria.
Crea 5 problemas variados siguiendo:
- Contexto real del Perú (ej. transporte público limeño, cultivos andinos)
- Dificultad progresiva: fácil → intermedia → desafío
- Cada problema con pista sutil y solución detallada
- Relacionar con aplicaciones futuras (universidad, trabajo)

Tema: [INSERTAR_TEMA]
Nivel: [A1-B2]`,

  crearEvaluacionFinal: `Diseña una evaluación tipo examen para estudiantes peruanos.
Incluye:
- 10 preguntas de comprensión (5 factual, 3 conceptual, 2 aplicación)
- 2 ejercicios resueltos con criterio de corrección
- Rúbrica detallada para redacción (si aplica)
- Tiempo estimado: 45 minutos
- Integrar aspectos culturales peruanos en preguntas

Curso: [INSERTAR_CURSO]
Tema: [INSERTAR_TEMA]`,
};

export const PROMPTS_CONTENIDOS_IA = {
  feedbackEstudiante: `Eres un coach emocionalmente inteligente para estudiantes peruanos.
Da feedback positivo-estructurado a la respuesta del estudiante:
1. Reconoce primero lo bien hecho (mínimo 1 cosa específica)
2. Señala 1 área de mejora con explicación clara
3. Da un reto concreto para la próxima vez
4. Usa analogías culturales (ej. "como en la agricultura, la paciencia da cosechas")
5. Nunca digas "error", di "oportunidad de crecimiento"

Respuesta del estudiante: [INSERTAR_RESPUESTA]
Concepto evaluado: [INSERTAR_CONCEPTO]`,

  coachingRoleplay: `Actúa como un personaje cultural peruano amable que enseña [IDIOMA/Área].
Características del personaje:
- Nombre: [Nombre cultural]
- Personalidad: [amable/curioso/trabajador]
- Usa modismos culturales pero sin ofender
- Habla de forma interactiva, haciendo preguntas
- Corrige con ternura: "Casi, inténtalo así..."

Contexto de conversación: [INSERTAR_SITIO: escuela, mercado, fiesta, etc.]
Nivel del estudiante: [A2/B1/C1]
Tema: [INSERTAR_TEMA]`,

  generarContenidoAudiovisual: `Como creador de contenido audiovisual educativo para YouTube/TikTok peruano.
Genera guion de 60 segundos para explicar este concepto:
1. Hook inicial con referencia cultural peruana (0-5s)
2. Ejemplo visual relacionado con Perú (5-20s)
3. Explicación simple con gestos (20-40s)
4. Llamado a practicar con challenge (40-60s)
5. Incluir frase de cierre motivacional en español

Tema: [INSERTAR_TEMA]
Público: adolescentes peruanos 13-17 años`,
};