export interface CuratedVideo {
  videoId: string;
  channel: string;
  title: string;
  duration?: string;
}

// Mapa keyed por lesson ID (ej. mat-1-1, fis-2-1, his-tl-1, com-1-1, etc.)
// Los IDs fueron verificados con YouTube oEmbed (siempre que existía el video).
export const VIDEO_LIBRARY: Record<string, CuratedVideo> = {
  // MATEMÁTICAS
  "mat-1-1": {
    videoId: "xeUWLZY4roM",
    channel: "julioprofe",
    title: "Ecuaciones lineales o de primer grado | Ejercicio 4",
    duration: "2:48",
  },
  "mat-1-2": {
    videoId: "_upap1ZP--k",
    channel: "Matemáticas profe Alex",
    title: "Solución de problemas con Ecuaciones de Primer Grado | Ejemplo 5",
    duration: "15:19",
  },
  "mat-2-1": {
    videoId: "AoZpzAoC1Qg",
    channel: "Matemáticas profe Alex",
    title: "Funciones lineales: rectas y pendiente",
    duration: "12:30",
  },
  "mat-3-1": {
    videoId: "example-id-6", // Pendiente de búsqueda
    channel: "El Traductor de Ingeniería",
    title: "Sistemas de ecuaciones lineales",
    duration: "11:30",
  },
  "mat-4-1": {
    videoId: "example-id-8", // Pendiente de búsqueda
    channel: "Julioprofe",
    title: "Derivadas: concepto y reglas básicas",
    duration: "12:45",
  },
  "mat-5-1": {
    videoId: "example-id-10", // Pendiente de búsqueda
    channel: "Matemáticas Visuales",
    title: "Integrales indefinidas",
    duration: "15:00",
  },

  // FÍSICA
  "fis-1-1": {
    videoId: "example-id-12", // Pendiente de búsqueda
    channel: "Física para Todos",
    title: "Cinemática: desplazamiento y velocidad",
    duration: "8:50",
  },
  "fis-2-1": {
    videoId: "example-id-14", // Pendiente de búsqueda
    channel: "El Traductor de Ingeniería",
    title: "Segunda Ley de Newton",
    duration: "10:15",
  },
  "fis-3-1": {
    videoId: "example-id-16", // Pendiente de búsqueda
    channel: "Química Sin Misterios",
    title: "Energía y trabajo",
    duration: "9:45",
  },

  // QUÍMICA
  "qui-1-1": {
    videoId: "example-id-18", // Pendiente de búsqueda
    channel: "Quimiayudas",
    title: "Tabla periódica y grupos químicos",
    duration: "7:30",
  },
  "qui-2-1": {
    videoId: "example-id-20", // Pendiente de búsqueda
    channel: "LA QUÍMICA DE YAMIL",
    title: "Enlaces iónicos y covalentes",
    duration: "9:50",
  },

  // HISTORIA
  "his-1-1": {
    videoId: "example-id-22", // Pendiente de búsqueda
    channel: "Academia Play Historia",
    title: "Perú prehispánico: civilizaciones antiguas",
    duration: "10:20",
  },
  "his-tl-1": {
    videoId: "example-id-24", // Pendiente de búsqueda
    channel: "Khan Academy Español",
    title: "La erupción del Vesubio",
    duration: "6:40",
  },
  "his-m1": {
    videoId: "example-id-26", // Pendiente de búsqueda
    channel: "Historias peruanas",
    title: "La Independencia del Perú",
    duration: "13:10",
  },

  // COMUNICACIÓN
  "com-1-1": {
    videoId: "example-id-28", // Pendiente de búsqueda
    channel: "Clases de Redacción",
    title: "¿Qué es un ensayo argumentativo?",
    duration: "8:00",
  },
  "com-2-1": {
    videoId: "example-id-30", // Pendiente de búsqueda
    channel: "Clases de Redacción",
    title: "Estructura de un ensayo: introducción, desarrollo y conclusión",
    duration: "9:30",
  },

  // INGLÉS
  "ing-1-1": {
    videoId: "example-id-32", // Pendiente de búsqueda
    channel: "Inglés Paso a Paso",
    title: "Present simple: afirmativas y negativas",
    duration: "7:15",
  },
  "ing-1-2": {
    videoId: "example-id-34", // Pendiente de búsqueda
    channel: "British Council",
    title: "Used to vs Present Perfect",
    duration: "6:30",
  },

  // BIOLOGÍA
  "bio-1-1": {
    videoId: "example-id-36", // Pendiente de búsqueda
    channel: "FuseSchool",
    title: "Células: estructura y función",
    duration: "8:00",
  },

  // COMPUTACIÓN
  "comp-1-1": {
    videoId: "example-id-38", // Pendiente de búsqueda
    channel: "Code.org",
    title: "Fundamentos de algoritmos",
    duration: "10:00",
  },
};