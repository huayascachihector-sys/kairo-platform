export const modulosA1 = [
  {
    id: 'a1-inicial-01',
    nombre: '¡Hola, soy un héroe!',
    nivelCEFR: 'A1',
    contexto: 'superheroes',
    palabrasObjetivo: 50,
    sesiones: [
      {
        duracionMinutos: 20,
        faseEmocional: 'calienta',
        actividades: [
          {
            tipo: 'juego',
            duracionMinutos: 3,
            descripcion: 'Selecciona tu superhéroe favorito de imágenes animadas',
          },
          {
            tipo: 'shadowing',
            duracionMinutos: 5,
            descripcion: 'Repite frases como "I am strong!" con sonido de superhéroe',
            usaIA: true,
          },
          {
            tipo: 'grabacion',
            duracionMinutos: 7,
            descripcion: '¡Graba a ti mismo diciendo "I am [nombre]! Yo puedo!"',
            usaIA: true,
          },
          {
            tipo: 'roleplay',
            duracionMinutos: 3,
            descripcion: 'Tu IA Coach te pregunta: "¿Qué poder quieres tener?"',
            usaIA: true,
          },
          {
            tipo: 'reflexion',
            duracionMinutos: 2,
            descripcion: 'Reflexiona: "Hoy aprendí: I am strong, you are brave"',
          },
        ],
        palabrasNuevas: 10,
      },
      {
        duracionMinutos: 20,
        faseEmocional: 'desafio',
        actividades: [
          {
            tipo: 'juego',
            duracionMinutos: 2,
            descripcion: '¡Salva al gato del árbol! (comando ir + ven)',
          },
          {
            tipo: 'shadowing',
            duracionMinutos: 6,
            descripcion: 'Repite órdenes del juego como "Jump high!", "Run fast!"',
            usaIA: true,
          },
          {
            tipo: 'grabacion',
            duracionMinutos: 8,
            descripcion: '¡Graba la misión! Di: "Help the cat down!"',
            usaIA: true,
          },
          {
            tipo: 'reflexion',
            duracionMinutos: 2,
            descripcion: 'Repaso: "Jump, run, help, cat"',
          },
        ],
        palabrasNuevas: 12,
      },
    ],
    hitos: [
      'Dice "I am [nombre]" sin ayuda',
      'Repite 3 frases en voz alta',
      'Participa en un roleplay simple',
    ],
  },
  {
    id: 'a1-inicial-02',
    nombre: 'La Cocina Mágica de los Colores',
    nivelCEFR: 'A1',
    contexto: 'chef',
    palabrasObjetivo: 40,
    sesiones: [
      {
        duracionMinutos: 20,
        faseEmocional: 'calienta',
        actividades: [
          {
            tipo: 'juego',
            duracionMinutos: 3,
            descripcion: 'Arrastra colores a ingredientes mágicos',
          },
          {
            tipo: 'shadowing',
            duracionMinutos: 5,
            descripcion: 'Repite colores: "Red apple! Blue berry!"',
            usaIA: true,
          },
          {
            tipo: 'grabacion',
            duracionMinutos: 7,
            descripcion: '¡Prepara una receta mágica! Graba: "Red + yellow = orange!"',
            usaIA: true,
          },
          {
            tipo: 'roleplay',
            duracionMinutos: 3,
            descripcion: 'Tu IA Coach: "¿Qué color es la sandía?"',
            usaIA: true,
          },
          {
            tipo: 'reflexion',
            duracionMinutos: 2,
            descripcion: 'Colores aprendidos hoy: rojo, azul, amarillo',
          },
        ],
        palabrasNuevas: 15,
      },
    ],
    hitos: [
      'Identifica 5 colores en inglés',
      'Repite combinaciones de colores',
      'Describe su plato favorito',
    ],
  },
];