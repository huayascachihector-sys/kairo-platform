export const contextosDisponibles = {
  fantasy: {
    nombre: 'Fantasy Quest',
    descripcion: 'Mundo de dragones, mazmorras y criaturas mágicas',
    elementos: [
      'dragon', 'wizard', 'sword', 'shield', 'potion',
      'castle', 'forest', 'treasure', 'spell', 'quest'
    ],
    personajesIA: [
      'Dunker the Dragon',
      'Wizzle the Wizard',
      'Sir Gallop the Brave'
    ],
    tono: 'aventurero',
    colores: ['#8A2BE2', '#FFD700', '#4169E1'],
    sonidosAmbientales: ['magic-chime', 'dragon-roar', 'quest-complete'],
  },

  chef: {
    nombre: 'MiniChef Academy',
    descripcion: 'Cocina creativa con recetas colores y sabores',
    elementos: [
      'recipe', 'ingredient', 'mix', 'stir', 'delicious',
      'chef', 'flavor', 'yum', 'bake', 'taste'
    ],
    personajesIA: [
      'Chef Gourmet',
      'Bella the Food Critic',
      'Paco the Penguin Cook'
    ],
    tono: 'divertido',
    colores: ['#FF6B35', '#F7931E', '#FFF5E1'],
    sonidosAmbientales: ['kitchen-sizzle', 'chopping', 'yum-sound'],
  },

  gamer: {
    nombre: 'Gamer English',
    descripcion: 'Tutoriales y misiones de videojuegos',
    elementos: [
      'level', 'power-up', 'boss', 'mission', 'character',
      'weapon', 'score', 'win', 'retry', 'spawn'
    ],
    personajesIA: [
      'Pixel the Gamer Guide',
      'Level Up Larry',
      'Game Master GX'
    ],
    tono: 'competitivo',
    colores: ['#00FF00', '#FF0000', '#FFFF00'],
    sonidosAmbientales: ['8-bit-jump', 'level-up', 'game-start'],
  },

  superheroes: {
    nombre: 'Hero Academy',
    descripcion: 'Universo de superhéroes y villanos',
    elementos: [
      'hero', 'power', 'fight', 'save', 'villain',
      'city', 'rescue', 'team', 'battle', 'victory'
    ],
    personajesIA: [
      'Coach Spark',
      'Captain Vocabulary',
      'The Grammar Guardian'
    ],
    tono: 'heroico',
    colores: ['#FF0000', '#0000FF', '#FFD700'],
    sonidosAmbientales: ['hero-whoosh', 'power-up', 'victory-fanfare'],
  },
};

export function obtenerContextoPersonalizado(intereses: string[]): string {
  let mejorCoincidencia = '';
  let maxCoincidencias = 0;

  for (const [clave, contexto] of Object.entries(contextosDisponibles)) {
    const coincidencias = intereses.filter(interes =>
      contexto.elementos.some(elemento =>
        elemento.toLowerCase().includes(interes.toLowerCase().slice(0, 4))
      )
    ).length;

    if (coincidencias > maxCoincidencias) {
      maxCoincidencias = coincidencias;
      mejorCoincidencia = clave;
    }
  }

  return mejorCoincidencia || 'fantasy';
}

export function generarSesionContextualizada(
  contextoId: string,
  nivel: 'A1' | 'A2' | 'B1',
  fase: 'calienta' | 'desafio' | 'refuerza' | 'reflexiona'
): string[] {
  const contexto = contextosDisponibles[contextoId as keyof typeof contextosDisponibles];
  if (!contexto) return [];

  const plantillasFase: Record<string, string[]> = {
    calienta: [
      `¡${contexto.nombre} te necesita!`,
      `¡Preparado para tu ${fase} del día?`,
      `¡Tu misión en ${contexto.nombre} comienza ahora!`,
    ],
    desafio: [
      `¡Reto ${contexto.personajesIA[0]} te reta!`,
      `¡Nueva misión en el ${contexto.nombre}!`,
      `¡El ${contexto.elementos[0]} te espera!`,
    ],
    refuerza: [
      `¡${contexto.nombre} celebra tu progreso!`,
      `¡Tu ${contexto.personajesIA[1]} está orgulloso!`,
      `¡Has ganado ${contexto.colores[0]} puntos de experiencia!`,
    ],
    reflexiona: [
      `¿Qué aprendiste hoy en ${contexto.nombre}?`,
      `Tu ${contexto.personajesIA[2]} quiere saber: ¿Te divertiste?`,
      `¡${contexto.nombre} te espera mañana!`,
    ],
  };

  return plantillasFase[fase];
}