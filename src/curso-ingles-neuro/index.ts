export * from './metodologia';
export * from './modulos/a1-modulos';
export * from './ia-coach/orchestrator';
export * from './sistema-puntos/sistema-puntos';
export * from './modulos/hoja-ruta-c2';
export * from './contextos/contextos';

export interface SesionEjemplo {
  titulo: string;
  nivel: string;
  contexto: string;
  faseEmocional: string;
  actividades: {
    tipo: string;
    duracionMinutos: number;
    descripcion: string;
    usaIA?: boolean;
  }[];
  palabrasNuevas: number;
}

export const sesionEjemploA2: SesionEjemplo = {
  titulo: 'La Gran Carrera de Dragones',
  nivel: 'A2',
  contexto: 'fantasy',
  faseEmocional: 'desafio',
  actividades: [
    {
      tipo: 'juego',
      duracionMinutos: 3,
      descripcion: 'Arrastra alimentos para tu dragón antes de la carrera',
    },
    {
      tipo: 'shadowing',
      duracionMinutos: 5,
      descripcion: 'Imita: I can fly faster than the wind! (¡con sonido de alas!)',
      usaIA: true,
    },
    {
      tipo: 'grabacion',
      duracionMinutos: 7,
      descripcion: 'Graba: My dragon name is Spark! He is the fastest! para competir',
      usaIA: true,
    },
    {
      tipo: 'roleplay',
      duracionMinutos: 3,
      descripcion: 'Tu IA Coach (como Dunker el Dragón) pregunta: ¿Listo para la carrera?',
      usaIA: true,
    },
    {
      tipo: 'reflexion',
      duracionMinutos: 2,
      descripcion: 'Repaso: fly, faster, wind, dragon, name, fastest',
    },
  ],
  palabrasNuevas: 12,
};