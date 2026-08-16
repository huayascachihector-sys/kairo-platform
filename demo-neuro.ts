import {
  METODOLOGIA,
  NIVELES_CEFR,
  CONTEXTOS_BASE,
  contextosDisponibles,
  obtenerContextoPersonalizado,
  SistemaPuntos,
  IAOrchestrator,
  sesionEjemploA2,
  HOJA_DE_RUTA_C2,
  NIVELES_DETALLADOS,
} from './src/curso-ingles-neuro';

console.log('=== NeuroFluent Play - Curso de Inglés para Niños ===\n');
console.log('Método:', METODOLOGIA.nombre);
console.log('Principios:', METODOLOGIA.principios.join(', '), '\n');

console.log('Niveles CEFR:');
Object.entries(NIVELES_DETALLADOS).forEach(([nivel, info]) => {
  console.log(`  ${nivel}: ${info.mesObjetivo} meses | ${info.palabrasObjetivo} palabras`);
});

console.log('\nContextos disponibles:', Object.keys(contextosDisponibles).join(', '));

console.log('\nEjemplo de sesión A2:', sesionEjemploA2.titulo);
sesionEjemploA2.actividades.forEach(a => {
  console.log(`  [${a.duracionMinutos}min] ${a.tipo} - ${a.descripcion}`);
});

console.log('\nHoja de ruta hasta C2:', HOJA_DE_RUTA_C2.etapas.length, 'etapas');
HOJA_DE_RUTA_C2.etapas.forEach((e, i) => {
  console.log(`  ${i + 1}. ${e.nombre} - Humor: ${e.humor}`);
});

const puntos = new SistemaPuntos();
console.log('\n=== Demo Sistema de Puntos ===');
console.log('Puntos por grabación:', puntos.calcularPuntosActividad('grabacion'));
const celebracion = puntos.celebrarError(2);
console.log('Celebración de error:', celebracion.mensaje);
