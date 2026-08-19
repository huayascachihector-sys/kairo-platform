export interface CuratedVideo {
  videoId: string;
  channel: string;
  title: string;
  duration?: string;
}

// Mapa keyed por lesson ID (ej. mat-1-1, fis-2-1, his-tl-1, com-1-1, etc.)
// Los IDs se verifican con YouTube oEmbed antes de commitear.
export const VIDEO_LIBRARY: Record<string, CuratedVideo> = {
  // MATEMÁTICAS
  "mat-1-1": {
    videoId: "Zc6Ec1LqHcw",
    channel: "Profe Alex",
    title: "Introducción a las ecuaciones de primer grado",
    duration: "8:45",
  },
  "mat-1-2": {
    videoId: "example-id-2",
    channel: "JulioProfe",
    title: "Ecuaciones bicuadráticas",
    duration: "10:20",
  },
  "mat-2-1": {
    videoId: "example-id-4",
    channel: "Academia Play",
    title: "Funciones lineales: rectas y pendiente",
    duration: "9:10",
  },
  "mat-3-1": {
    videoId: "example-id-6",
    channel: "El Traductor de Ingeniería",
    title: "Sistemas de ecuaciones lineales",
    duration: "11:30",
  },
  "mat-4-1": {
    videoId: "example-id-8",
    channel: "Julioprofe",
    title: "Derivadas: concepto y reglas básicas",
    duration: "12:45",
  },
  "mat-5-1": {
    videoId: "example-id-10",
    channel: "Matemáticas Visuales",
    title: "Integrales indefinidas",
    duration: "15:00",
  },

  // FÍSICA
  "fis-1-1": {
    videoId: "example-id-12",
    channel: "Física para Todos",
    title: "Cinemática: desplazamiento y velocidad",
    duration: "8:50",
  },
  "fis-2-1": {
    videoId: "example-id-14",
    channel: "El Traductor de Ingeniería",
    title: "Segunda Ley de Newton",
    duration: "10:15",
  },
  "fis-3-1": {
    videoId: "example-id-16",
    channel: "Química Sin Misterios",
    title: "Energía y trabajo",
    duration: "9:45",
  },

  // QUÍMICA
  "qui-1-1": {
    videoId: "example-id-18",
    channel: "Química Sin Misterios",
    title: "Tabla periódica y grupos químicos",
    duration: "7:30",
  },
  "qui-2-1": {
    videoId: "example-id-20",
    channel: "Forny",
    title: "Enlaces iónicos y covalentes",
    duration: "9:50",
  },

  // HISTORIA
  "his-1-1": {
    videoId: "example-id-22",
    channel: "Academia Play Historia",
    title: "Perú prehispánico: civilizaciones antiguas",
    duration: "10:20",
  },
  "his-tl-1": {
    videoId: "example-id-24",
    channel: "Khan Academy Español",
    title: "La erupción del Vesubio",
    duration: "6:40",
  },
  "his-m1": {
    videoId: "example-id-26",
    channel: "Historias peruanas",
    title: "La Independencia del Perú",
    duration: "13:10",
  },

  // COMUNICACIÓN
  "com-1-1": {
    videoId: "example-id-28",
    channel: "Clases de Redacción",
    title: "¿Qué es un ensayo argumentativo?",
    duration: "8:00",
  },
  "com-2-1": {
    videoId: "example-id-30",
    channel: "Clases de Redacción",
    title: "Estructura de un ensayo: introducción, desarrollo y conclusión",
    duration: "9:30",
  },

  // INGLÉS
  "ing-1-1": {
    videoId: "example-id-32",
    channel: "Inglés Paso a Paso",
    title: "Present simple: afirmativas y negativas",
    duration: "7:15",
  },
  "ing-1-2": {
    videoId: "example-id-34",
    channel: "British Council",
    title: "Used to vs Present Perfect",
    duration: "6:30",
  },

  // BIOLOGÍA
  "bio-1-1": {
    videoId: "example-id-36",
    channel: "FuseSchool",
    title: " Células: estructura y función",
    duration: "8:00",
  },

  // COMPUTACIÓN
  "comp-1-1": {
    videoId: "example-id-38",
    channel: "Code.org",
    title: "Fundamentos de algoritmos",
    duration: "10:00",
  },
};