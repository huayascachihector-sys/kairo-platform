import {
  cursosDisponibles,
  METODOLOGIA_BASE,
} from './src/plataforma-educativa-peru';

console.log('=== Plataforma Educativa Neuro-Educativa para el Perú ===\n');

const cursos = Object.values(cursosDisponibles);

cursos.forEach(curso => {
  console.log(`\n${curso.nombre}`);
  console.log(`  ID: ${curso.id}`);
  console.log(`  Nivel: ${curso.nivelEducativo} | Duración: ${curso.duracionEstimada}`);
  console.log(`  Módulos: ${curso.modulos.length}`);
  console.log(`  Competencias: ${curso.competencias.length}`);
  console.log(`  Estrategias: ${curso.metodologia.estrategiasTransversales.join(', ')}`);
  
  const primeraLeccion = curso.modulos[0]?.lecciones[0];
  if (primeraLeccion) {
    console.log(`\n  Ejemplo primera lección: "${primeraLeccion.titulo}"`);
    console.log(`  Duración: ${primeraLeccion.duracionAproximada} min`);
    console.log(`  Intuición Feynman: "${primeraLeccion.explicacionFeynman.intuicionInicial.substring(0, 80)}..."`);
    console.log(`  Actividades Active Recall: ${primeraLeccion.quizActiveRecall.length}`);
    console.log(`  Palabras clave: ${primeraLeccion.palabrasClave.join(', ')}`);
  }
});

console.log('\n=== Metodología Base Aplicada ===');
console.log('Método Feynman:', METODOLOGIA_BASE.metodoFeynman);
console.log('Active Recall:', METODOLOGIA_BASE.activeRecall);
console.log('Spaced Repetition:', METODOLOGIA_BASE.spacedRepetition);
console.log('Intuición antes de fórmula:', METODOLOGIA_BASE.intuicionAntesFormula);
console.log('\nEstrategias:', METODOLOGIA_BASE.estrategiasTransversales);

console.log('\n=== Rutas de Revisión Espaciada (ejemplo A1.1) ===');
console.log('Revisión día 1, 3, 7, 21 - combate la curva del olvido');
console.log('\n¡Plataforma lista para implementación frontend!');