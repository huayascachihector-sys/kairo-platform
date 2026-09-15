export interface CuratedVideo {
  videoId: string;
  channel?: string;
  title: string;
  duration?: string;
  repaso?: CuratedVideo[];
}

// Mapa keyed por lesson ID (ej. mat-1-1, fis-2-1, his-tl-1, com-1-1, etc.)
// Videos de alta calidad de canales educativos en español (julioprofe, Matemáticas profe Alex, CuriosaMente, Unicoos, etc.)
export const VIDEO_LIBRARY: Record<string, CuratedVideo> = {
  // ── MATEMÁTICAS ──────────────────────────────────────────────────────────
  "mat-1-1": {
    videoId: "m9LqL-Z1U_w",
    channel: "Matemáticas profe Alex",
    title: "Términos y Expresiones Algebraicas | Conceptos Básicos",
    duration: "10:15",
  },
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
  "mat-2-1": {
    videoId: "T47q1i_cEzg",
    channel: "Matemáticas profe Alex",
    title: "Clasificación de Triángulos y Propiedades de sus Ángulos",
    duration: "8:50",
  },
  "mat-2-2": {
    videoId: "0nK_kQ_CgP8",
    channel: "Daniel Carreón",
    title: "Circunferencia, Círculo, Radio, Diámetro y Área",
    duration: "6:40",
  },
  "mat-3-1": {
    videoId: "yoPfSeQo_8w",
    channel: "julioprofe",
    title: "Límites trigonométricos",
    duration: "8:45",
  },
  "mat-4-1": {
    videoId: "ulrq_SgSj20",
    channel: "Matemáticas profe Alex",
    title: "Razones Trigonométricas | Seno, Coseno y Tangente",
    duration: "9:20",
  },
  "mat-4-2": {
    videoId: "e2_WDo5yK_Q",
    channel: "julioprofe",
    title: "Ley de Senos y Cosenos | Cuándo y cómo aplicar",
    duration: "11:15",
  },
  "mat-4-3": {
    videoId: "qQ03xP8j4jI",
    channel: "julioprofe",
    title: "Identidades Trigonométricas Fundamentales",
    duration: "14:10",
  },
  "mat-5-1": {
    videoId: "AoZpzAoC1Qg",
    channel: "Matemáticas profe Alex",
    title: "Ecuación de la recta: gráfica y tabla de valores",
    duration: "12:30",
  },
  "mat-5-2": {
    videoId: "fN_u0R83-58",
    channel: "Matemáticas profe Alex",
    title: "Ecuación de la Circunferencia con centro en el origen y fuera de él",
    duration: "10:45",
  },
  "mat-5-3": {
    videoId: "y4v6xP1L_nU",
    channel: "julioprofe",
    title: "Secciones Cónicas: Elipse, Hipérbola y Parábola",
    duration: "16:20",
  },

  // ── FÍSICA ───────────────────────────────────────────────────────────────
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
  "fis-1-2": {
    videoId: "kOmsYmUqZ6Q",
    channel: "julioprofe",
    title: "MRUV: Movimiento Rectilíneo Uniformemente Variado y Caída Libre",
    duration: "9:40",
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
  "fis-3-2": {
    videoId: "uW8W4hT9r-0",
    channel: "Unicoos",
    title: "Fricción, Fuerza de Rozamiento y Plano Inclinado",
    duration: "13:10",
  },
  "fis-3-3": {
    videoId: "rL3u_ZpLd6w",
    channel: "julioprofe",
    title: "Tensión y Poleas | Dinámica del cuerpo libre",
    duration: "12:00",
  },
  "fis-4-1": {
    videoId: "M_v96g_g_g0",
    channel: "Unicoos",
    title: "Trabajo Mecánico y Energía Cinética",
    duration: "10:30",
  },
  "fis-4-2": {
    videoId: "kUq_1X32LgE",
    channel: "julioprofe",
    title: "Energía Potencial y Principio de Conservación de la Energía",
    duration: "14:15",
  },
  "fis-4-3": {
    videoId: "k7X3g4_P12w",
    channel: "Unicoos",
    title: "Potencia Mecánica y Rendimiento / Eficiencia",
    duration: "8:45",
  },

  // ── QUÍMICA ──────────────────────────────────────────────────────────────
  "qui-1-1": {
    videoId: "vP8hX3K7L6w",
    channel: "CuriosaMente",
    title: "¿De qué está hecho el Universo? El Átomo y sus Partículas",
    duration: "6:15",
  },
  "qui-1-2": {
    videoId: "PsW0sGF5EBE",
    channel: "CuriosaMente",
    title: "¿Cómo se organiza la Tabla Periódica?",
    duration: "7:00",
  },
  "qui-1-3": {
    videoId: "8m_8qFpU_cQ",
    channel: "Unicoos",
    title: "Enlace Químico: Iónico, Covalente y Metálico",
    duration: "11:20",
  },
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
  "qui-3-1": {
    videoId: "f4XG_8qN2yE",
    channel: "Unicoos",
    title: "Enlace Iónico: Formación, Redes Cristalinas y Propiedades",
    duration: "9:50",
  },
  "qui-3-2": {
    videoId: "JmP7h_X1tYw",
    channel: "Unicoos",
    title: "Enlace Covalente Polar y Apolar",
    duration: "10:10",
  },
  "qui-3-3": {
    videoId: "8m_8qFpU_cQ",
    channel: "Unicoos",
    title: "Enlace Metálico y Nube de Electrones",
    duration: "8:20",
  },
  "qui-4-1": {
    videoId: "X3p_L9yZ2_0",
    channel: "CuriosaMente",
    title: "Tipos de Reacciones Químicas",
    duration: "6:45",
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
    ],
  },

  // ── HISTORIA DEL PERÚ Y UNIVERSAL ────────────────────────────────────────
  "his-1-1": {
    videoId: "p57w_Xh8kM0",
    channel: "Academia Play",
    title: "Culturas Preincaicas del Perú (Caral, Chavín, Paracas, Moche, Nazca)",
    duration: "11:20",
  },
  "his-1-2": {
    videoId: "i4a7UMUPb-A",
    channel: "CuriosaMente",
    title: "¿Cómo era el Imperio Inca? Tahuantinsuyo y Organización",
    duration: "7:45",
  },
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
  "his-2-1": {
    videoId: "N0g4p7_1l_U",
    channel: "CuriosaMente",
    title: "La Independencia del Perú y las Corrientes Libertadoras",
    duration: "9:15",
  },
  "his-3-1": {
    videoId: "ArkazDQcQF4",
    channel: "Historia del Perú",
    title: "Inicios de la República y la Era del Guano",
    duration: "14:20",
  },
  "his-4-1": {
    videoId: "EhY4CRCljzM",
    channel: "Canal Historia",
    title: "Juan Velasco Alvarado: el gobierno revolucionario y reformas",
    duration: "18:10",
    repaso: [
      {
        videoId: "uNF2k8AUhsI",
        title: "Gobierno de Juan Velasco Alvarado, 1968-1975",
        duration: "20:45",
      },
    ],
  },
  // Cronología his-tl-1 a his-tl-12
  ...Array(12)
    .fill(0)
    .map((_, i) => ({
      [`his-tl-${i + 1}`]: {
        videoId: "ArkazDQcQF4",
        title: "Historia del Perú: Línea de tiempo integral",
        duration: "14:20",
      },
    }))
    .reduce((acc, obj) => ({ ...acc, ...obj }), {}),

  // ── COMUNICACIÓN Y LENGUAJE ──────────────────────────────────────────────
  "com-1-1": {
    videoId: "cW8h5_o8K4A",
    channel: "CuriosaMente",
    title: "Estrategias de Comprensión Lectora y Tipos de Textos",
    duration: "7:30",
  },
  "com-1-2": {
    videoId: "j8P_0lX7G_w",
    channel: "Lengua y Literatura",
    title: "Estructura del Ensayo Argumentativo: Tesis, Argumentos y Conclusión",
    duration: "8:50",
  },
  "com-1-3": {
    videoId: "P5m9xK1L_2w",
    channel: "CuriosaMente",
    title: "Reglas de Acentuación General: Agudas, Llanas, Esdrújulas y Diacrítica",
    duration: "6:40",
  },

  // ── BIOLOGÍA ─────────────────────────────────────────────────────────────
  "bio-1-1": {
    videoId: "JLNokMENF6s",
    channel: "FuseSchool",
    title: "La célula: estructura, organelos y función celular",
    duration: "7:30",
    repaso: [
      {
        videoId: "Q7_-Kw4bpAI",
        title: "La célula y ciencias naturales",
        duration: "6:15",
      },
    ],
  },
  "bio-1-2": {
    videoId: "8m_8qFpU_cQ",
    channel: "CuriosaMente",
    title: "Mitosis y Meiosis: Ciclo Celular y Reproducción",
    duration: "8:20",
  },
  "bio-2-1": {
    videoId: "o_8P5h7K_4E",
    channel: "CuriosaMente",
    title: "Genética Mendeliana y Leyes de la Herencia",
    duration: "9:10",
  },

  // ── INGLÉS (NEUROFLUENT / DAILY) ─────────────────────────────────────────
  "ing-1-1": {
    videoId: "juKd26qkNAw",
    channel: "English with Lucy",
    title: "Basic English Greetings, Introductions and Daily Conversations",
    duration: "9:40",
  },
  "ing-1-2": {
    videoId: "X3p_L9yZ2_0",
    channel: "Learn English with Emma",
    title: "Present Simple vs Present Continuous: Master the Difference",
    duration: "10:15",
  },

  // ── COMPUTACIÓN Y PROGRAMACIÓN ───────────────────────────────────────────
  "comp-1-1": {
    videoId: "OuEd_uxhQTQ",
    channel: "pildorasinformaticas",
    title: "Fundamentos de Programación y Pensamiento Computacional",
    duration: "12:00",
  },
  "comp-1-2": {
    videoId: "OuEd_uxhQTQ",
    channel: "pildorasinformaticas",
    title: "Introducción a Python: variables, listas y diccionarios",
    duration: "10:00",
  },
  "comp-2-1": {
    videoId: "vx2CVaXXfxU",
    channel: "Fazt Code",
    title: "Curso de Python: estructuras de datos y funciones",
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
    channel: "Fazt Code",
    title: "Curso esencial de JavaScript y manipulación del DOM",
    duration: "13:10",
  },
  "comp-3-3": {
    videoId: "JbnkY3V8SUs",
    channel: "Código Facilito",
    title: "Curso React: Componentes, Estado y Props",
    duration: "15:40",
  },
};