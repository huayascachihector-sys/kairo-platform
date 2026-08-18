export interface Modulo {
  id: string;
  nombre: string;
  nivelCEFR: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  contexto: 'fantasy' | 'chef' | 'gamer' | 'superheroes';
  sesiones: Sesion[];
  hitos: string[];
}

export interface Sesion {
  duracionMinutos: 20;
  faseEmocional: 'calienta' | 'desafio' | 'refuerza' | 'reflexiona';
  actividades: Actividad[];
  palabrasNuevas: number;
}

export interface Actividad {
  tipo: 'shadowing' | 'grabacion' | 'roleplay' | 'juego' | 'reflexion';
  duracionMinutos: number;
  descripcion: string;
  usaIA?: boolean;
}

export const METODOLOGIA: {
  nombre: string;
  principios: string[];
  reglas: string[];
} = {
  nombre: 'NeuroFluent Play',
  principios: [
    'Triángulo de Retención: Emoción + Contexto + Repetición Espaciada',
    'Cero Gramática Inicial - Aprendizaje Intuitivo',
    'Entrenamiento de Habilidad como Deporte',
    'Error Celebrado como parte del Proceso Creativo',
    'Personalización por Intereses del Niño',
  ],
  reglas: [
    'Sesiones máximas 20 minutos (ciclo atención cerebral)',
    'Mínimo 4 sesiones/semana',
    'Revisión espaciada: día 1, 3, 7, 21',
    'IA como compañero de conversación, nunca como juez',
    'Progresión gradual: A1 → A2 → B1 → B2 → C1 → C2 (36 meses)',
  ],
};

export const NIVELES_CEFR: Record<string, {
  mesesEstimados: number;
  palabrasObjetivo: number;
  hitosVictoriaTemprana: string[];
}> = {
  A1_Inicial: {
    mesesEstimados: 0,
    palabrasObjetivo: 50,
    hitosVictoriaTemprana: [
      'Dice su nombre y edad!',
      'Entiende comandos simples!',
      'Puede pedir ayuda!',
    ],
  },
  A1_Activo: {
    mesesEstimados: 2,
    palabrasObjetivo: 300,
    hitosVictoriaTemprana: [
      'Cuenta su día en 5 frases!',
      'Juega a juegos con instrucciones!',
      'Le pide a su amigo algo en inglés!',
    ],
  },
  A2_Narrativo: {
    mesesEstimados: 5,
    palabrasObjetivo: 1000,
    hitosVictoriaTemprana: [
      'Cuenta su primera historia!',
      'Entiende chistes simples!',
      'Puede describir su día!',
    ],
  },
  B1_Social: {
    mesesEstimados: 9,
    palabrasObjetivo: 2000,
    hitosVictoriaTemprana: [
      'Participa en roleplays!',
      'Usa el humor básico!',
      'Puede expresar opiniones!',
    ],
  },
  B1_Expresivo: {
    mesesEstimados: 14,
    palabrasObjetivo: 4000,
    hitosVictoriaTemprana: [
      'Cuenta chistes propios!',
      'Entiende sarcasmo leve!',
      'Puede debatir sobre temas simples!',
    ],
  },
};

export const CONTEXTOS_BASE = {
  fantasy: {
    nombre: 'Fantasy Quest',
    descripcion: 'Mundo de dragones, mazmorras y criaturas mágicas',
    elementos: ['dragones', 'armas', 'pociones', 'mapas', 'tesoros'],
    tono: 'aventurero',
  },
  chef: {
    nombre: 'MiniChef Academy',
    descripcion: 'Cocina creativa con recetas colores y sabores',
    elementos: ['ingredientes', 'utensilios', 'sabores', 'recetas', 'colores'],
    tono: 'divertido',
  },
  gamer: {
    nombre: 'Gamer English',
    descripcion: 'Tutoriales y misiones de videojuegos',
    elementos: ['personajes', 'niveles', 'poderes', 'misiones', 'logros'],
    tono: 'competitivo',
  },
  superheroes: {
    nombre: 'Hero Academy',
    descripcion: 'Universo de superhéroes y villanos',
    elementos: ['villanos', 'poderes', 'ciudades', 'misiones', 'aliados'],
    tono: 'heroico',
  },
} as const;