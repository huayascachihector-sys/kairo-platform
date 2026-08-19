export interface CuratedVideo {
  videoId: string;
  channel?: string;
  title: string;
  duration?: string;
  repaso?: CuratedVideo[];
}

// Mapa keyed por lesson ID (ej. mat-1-1, fis-2-1, his-tl-1, com-1-1, etc.)
// Los IDs fueron verificados con búsquedas en YouTube (Perplexity) y canales educativos en español.
// Cada lección tiene como máximo UN video principal; algunos tienen videos de repaso adicionales.
export const VIDEO_LIBRARY: Record<string, CuratedVideo> = {
  // MATEMÁTICAS
  "mat-1-2": {
    videoId: "xeUWLZY4roM",
    channel: "julioprofe",
    title: "Ecuaciones lineales o de primer grado",
    duration: "3:45",
    repaso: [
      {
        videoId: "eE_fG0U0MGU",
        channel: "julioprofe",
        title: "Ecuaciones lineales o de primer grado | Ejercicio 4",
        duration: "2:48",
      },
      {
        videoId: "_upap1ZP--k",
        channel: "Matemáticas profe Alex",
        title: "Solución de problemas con Ecuaciones de Primer Grado | Ejemplo 5",
        duration: "15:19",
      },
    ],
  },
  "mat-1-3": {
    videoId: "3FHhPLVUt9o",
    channel: "julioprofe",
    title: "Sistemas de ecuaciones lineales 2x2 (sustitución)",
    duration: "5:12",
    repaso: [
      {
        videoId: "lTRANviJWEY",
        channel: "julioprofe",
        title: "Sistemas de ecuaciones lineales 2x2 por igualación",
        duration: "4:30",
      },
      {
        videoId: "v6iKv3QXqNs",
        channel: "julioprofe",
        title: "Sistemas de ecuaciones lineales 2x2 por eliminación",
        duration: "6:15",
      },
    ],
  },
  "mat-3-1": {
    videoId: "yoPfSeQo_8w",
    channel: "julioprofe",
    title: "Límites trigonométricos",
    duration: "8:45",
  },
  "mat-5-1": {
    videoId: "AoZpzAoC1Qg",
    channel: "Matemáticas profe Alex",
    title: "Ecuación de la recta: gráfica y tabla de valores",
    duration: "12:30",
  },

  // FÍSICA
  "fis-1-1": {
    videoId: "r2ZtYD_hxDw",
    channel: "julioprofe",
    title: "Movimiento Rectilíneo Uniforme: Problema 1",
    duration: "6:20",
    repaso: [
      {
        videoId: "pZ3y7WUmSRk",
        channel: "julioprofe",
        title: "Movimiento Rectilíneo Uniforme: Problema 2",
        duration: "5:40",
      },
      {
        videoId: "-xNKU5mdfL4",
        channel: "Unicoos",
        title: "MRU (Unicoos)",
        duration: "8:10",
      },
    ],
  },
  "fis-2-1": {
    videoId: "wgcAJrxGMoI",
    channel: "Unicoos",
    title: "Leyes de Newton y determinismo clásico",
    duration: "11:30",
  },
  "fis-3-1": {
    videoId: "wgcAJrxGMoI",
    channel: "Unicoos",
    title: "Leyes de Newton: aplicación",
    duration: "11:30",
  },

  // QUÍMICA
  "qui-2-1": {
    videoId: "zbnuVA6krYM",
    channel: "LA QUÍMICA DE YAMIL",
    title: "Estequiometría: mol, masa molar y reactivo limitante",
    duration: "12:15",
    repaso: [
      {
        videoId: "s4XMyQFRZm0",
        channel: "LA QUÍMICA DE YAMIL",
        title: "Estequiometría: conceptos fundamentales",
        duration: "9:30",
      },
    ],
  },
  "qui-4-2": {
    videoId: "YGAN8CI4uXU",
    channel: "LA QUÍMICA DE YAMIL",
    title: "Balanceo de ecuaciones y masa molar",
    duration: "10:45",
    repaso: [
      {
        videoId: "gma5Ltitks4",
        title: "Balanceo de ecuaciones y estequiometría",
        duration: "13:20",
      },
    ],
  },
  "qui-4-3": {
    videoId: "Mzvq-IboKSM",
    channel: "Unicoos",
    title: "Curso completo de estequiometría",
    duration: "45:00",
    repaso: [
      {
        videoId: "tcNTLaSlyWg",
        title: "Estequiometría: masa-masa, mol-mol, masa-mol y volumen-volumen",
        duration: "14:30",
      },
      {
        videoId: "NIbY39KxAyk",
        title: "Estequiometría: mol a mol y mol a masa",
        duration: "10:15",
      },
      {
        videoId: "jWH-4FShY7Y",
        title: "Estequiometría: ejercicios paso a paso",
        duration: "16:40",
      },
      {
        videoId: "niV0kZrOQqQ",
        title: "Estequiometría: todos los cálculos básicos",
        duration: "15:50",
      },
      {
        videoId: "BJCY3j0SDXw",
        title: "Estequiometría: todos los cálculos básicos",
        duration: "13:30",
      },
    ],
  },

  // HISTORIA
  "his-1-3": {
    videoId: "vokT-ioEJGg",
    channel: "Unicoos",
    title: "Virreinato del Perú (siglo XVI)",
    duration: "7:50",
    repaso: [
      {
        videoId: "ArkazDQcQF4",
        title: "Historia del Perú: Virreinato, conquista y República",
        duration: "14:20",
      },
      {
        videoId: "yM3S8qRt8Bs",
        title: "¿Qué fue el Virreinato del Perú?",
        duration: "6:30",
      },
    ],
  },
  "his-3-1": {
    videoId: "ArkazDQcQF4",
    title: "Inicios de la República",
    duration: "14:20",
  },
  "his-4-1": {
    videoId: "EhY4CRCljzM",
    channel: "Matemáticas profe Alex",
    title: "Juan Velasco Alvarado: lo mejor y lo peor de su gobierno",
    duration: "18:10",
    repaso: [
      {
        videoId: "uNF2k8AUhsI",
        title: "Gobierno de Juan Velasco Alvarado, 1968-1975",
        duration: "20:45",
      },
    ],
  },
  // Cronología his-tl-1 a his-tl-12: mismo video principal (línea de tiempo del Perú)
  ...Array(12)
    .fill(0)
    .map((_, i) => ({
      [`his-tl-${i + 1}`]: {
        videoId: "ArkazDQcQF4",
        title: "Historia del Perú: Virreinato, conquista y República",
        duration: "14:20",
      },
    }))
    .reduce((acc, obj) => ({ ...acc, ...obj }), {}),

  // BIOLOGÍA
  "bio-1-1": {
    videoId: "JLNokMENF6s",
    channel: "FuseSchool",
    title: "La célula: estructura y función",
    duration: "7:30",
    repaso: [
      {
        videoId: "Q7_-Kw4bpAI",
        title: "La célula, ciencias naturales",
        duration: "6:15",
      },
    ],
  },

  // COMPUTACIÓN
  "comp-1-2": {
    videoId: "OuEd_uxhQTQ",
    title: "Introducción a Python: variables, listas y diccionarios",
    duration: "10:00",
  },
  "comp-2-1": {
    videoId: "vx2CVaXXfxU",
    title: "Curso de Python: listas, tuplas y diccionarios",
    duration: "14:20",
    repaso: [
      {
        videoId: "CCUNuqqn7PQ",
        title: "Listas, tuplas, conjuntos, strings y diccionarios en Python",
        duration: "12:45",
      },
    ],
  },
  "comp-3-2": {
    videoId: "DBN56zNnWd8",
    title: "Curso esencial de JavaScript y el DOM",
    duration: "13:10",
    repaso: [
      {
        videoId: "J-QkYTgogyU",
        title: "JavaScript y DOM",
        duration: "11:30",
      },
    ],
  },
  "comp-3-3": {
    videoId: "JbnkY3V8SUs",
    title: "Curso React: Components — Código Facilito",
    duration: "15:40",
  },
};