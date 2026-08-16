import type { OnboardingData } from './store';
import { ALL_COURSES } from './courseData';

export interface OnboardingRecommendation {
  summary: string;
  recommendedCourses: { courseId: string; reason: string }[];
  studyPlan: string[];
  examPrep: string[];
  careerSuggestions: string[];
  dailyGoal: string;
  weeklySchedule: string[];
  motivation: string;
}

const courseRecommendations: Record<string, { courseId: string; reason: string }[]> = {
  matematicas: [
    { courseId: 'matematicas', reason: 'Álgebra, geometría y cálculo desde cero' },
  ],
  fisica: [
    { courseId: 'fisica', reason: 'Cinemática, dinámica y energía' },
  ],
  quimica: [
    { courseId: 'quimica', reason: 'Átomo, enlace y reacciones químicas' },
  ],
  historia: [
    { courseId: 'historia', reason: 'Prehistoria andina y república peruana' },
  ],
  comunicacion: [
    { courseId: 'comunicacion', reason: 'Comprensión lectora y redacción' },
  ],
  ingles: [
    { courseId: 'ingles', reason: 'Gramática y vocabulario con historias' },
  ],
  biologia: [
    { courseId: 'biologia', reason: 'Célula, genética y ecosistemas' },
  ],
  computacion: [
    { courseId: 'computacion', reason: 'Lógica, web y ciencia de datos' },
  ],
};

const metaMessages: Record<string, string> = {
  admission: 'Preparación para admisión universitaria',
  exam: 'Preparación para exámenes internacionales',
  grades: 'Mejorar notas y rendimiento académico',
  career: 'Desarrollo profesional y especialización',
  personal: 'Aprendizaje por interés personal',
};

const levelMessages: Record<string, string> = {
  secundaria: 'nivel secundaria',
  preuniversitario: 'nivel preuniversitario',
  universidad: 'nivel universitario',
  egresado: 'nivel avanzado',
  otro: 'nivel personalizado',
};

const styleMessages: Record<string, string> = {
  visual: 'con videos, diagramas y animaciones',
  lectura: 'con textos, resúmenes y apuntes',
  practica: 'con ejercicios, simulacros y problemas',
  mixto: 'combinando lectura, práctica y multimedia',
};

export function generateRecommendations(data: OnboardingData): OnboardingRecommendation {
  const intereses = data.intereses || [];
  const metas = data.metasList || [];
  const examenes = data.examenes || [];
  const universidades = data.universidades || [];
  const horas = data.horasDiarias || 2;
  const nivel = data.nivelEducativo || 'preuniversitario';
  const estilo = data.estiloAprendizaje || 'mixto';
  const age = data.age || 17;

  const courses = intereses.flatMap((i) => courseRecommendations[i] || []);
  if (courses.length === 0) {
    ALL_COURSES.slice(0, 4).forEach((c) =>
      courses.push({ courseId: c.id, reason: c.description })
    );
  }

  const studyPlan: string[] = [];
  if (horas >= 1) {
    studyPlan.push(`Estudia ${horas} hora${horas > 1 ? 's' : ''} diarias en bloques de 25-30 min`);
  }
  if (intereses.length > 0) {
    studyPlan.push(`Enfócate en: ${intereses.map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(', ')}`);
  }
  studyPlan.push('Usa la técnica Pomodoro: 25 min estudio, 5 min descanso');
  studyPlan.push('Repasa lo aprendido al día siguiente (repetición espaciada)');

  const examPrep: string[] = [];
  if (examenes.includes('sat')) {
    examPrep.push('SAT: Practica Reading, Writing y Math con simulacros cronometrados');
  }
  if (examenes.includes('toefl')) {
    examPrep.push('TOEFL: Enfócate en Reading, Listening, Speaking y Writing con ejercicios específicos');
  }
  if (examenes.includes('admision')) {
    examPrep.push('Admisión: Resuelve 20 preguntas diarias del banco de preguntas');
  }
  if (universidades.length > 0) {
    examPrep.push(`Investiga los requisitos de admisión de: ${universidades.join(', ')}`);
  }
  if (examPrep.length === 0 && metas.includes('exam')) {
    examPrep.push('Comienza con un diagnóstico para identificar tu nivel actual');
  }

  const careerSuggestions: string[] = [];
  if (intereses.includes('matematicas')) {
    careerSuggestions.push('Ingeniería, Ciencias de la Computación, Física, Economía');
  }
  if (intereses.includes('fisica')) {
    careerSuggestions.push('Ingeniería Física, Astronomía, Ingeniería Mecánica');
  }
  if (intereses.includes('quimica')) {
    careerSuggestions.push('Ingeniería Química, Farmacia, Bioquímica');
  }
  if (intereses.includes('historia')) {
    careerSuggestions.push('Historia, Derecho, Ciencias Políticas, Arqueología');
  }
  if (intereses.includes('comunicacion')) {
    careerSuggestions.push('Comunicaciones, Periodismo, Literatura, Marketing');
  }
  if (intereses.includes('ingles')) {
    careerSuggestions.push('Traducción, Relaciones Internacionales, Turismo');
  }
  if (intereses.includes('biologia')) {
    careerSuggestions.push('Medicina, Biología, Psicología, Ciencias Ambientales');
  }
  if (intereses.includes('computacion')) {
    careerSuggestions.push('Ingeniería de Software, Ciencia de Datos, Ciberseguridad');
  }
  if (careerSuggestions.length === 0) {
    careerSuggestions.push('Explora diferentes áreas con cursos introductorios');
  }

  const dailyGoal = `Completa ${Math.max(1, Math.round(horas / 0.5))} lecciones o ejercicios por día (+${Math.round(horas * 10)} XP)`;

  const weeklySchedule: string[] = [];
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  if (intereses.length > 0) {
    for (let i = 0; i < Math.min(days.length, intereses.length); i++) {
      weeklySchedule.push(`${days[i]}: ${intereses[i].charAt(0).toUpperCase() + intereses[i].slice(1)} (${horas}h)`);
    }
    if (weeklySchedule.length < 5) {
      weeklySchedule.push(`${days[weeklySchedule.length]}: Repaso general (${horas}h)`);
    }
    weeklySchedule.push('Sábado: Simulacro o ejercicios acumulativos');
    weeklySchedule.push('Domingo: Descanso activo (revisión ligera)');
  }

  const motivos = metas.length > 0
    ? metas.map((m) => metaMessages[m] || m).join(', ')
    : 'aprender y crecer académicamente';

  const motivation = `${age > 15 ? '¡Excelente iniciativa!' : '¡Qué bien que empieces joven!'} Estudiarás a ${levelMessages[nivel]} y aprenderás ${styleMessages[estilo]}. ${motivos}. ¡Confiamos en ti!`;

  const summary = `Has completado tu perfil KAIRO. Estudiante de ${levelMessages[nivel]} enfocado en ${motivos}. Dedicarás ${horas}h diarias con un estilo ${styleMessages[estilo]}. ${courses.length > 0 ? 'Comenzaremos con ' + courses.length + ' cursos recomendados.' : ''}`;

  return {
    summary,
    recommendedCourses: courses,
    studyPlan,
    examPrep,
    careerSuggestions,
    dailyGoal,
    weeklySchedule,
    motivation,
  };
}

export function getGreetingMessage(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `¡Buenos días, ${name}!`;
  if (hour < 18) return `¡Buenas tardes, ${name}!`;
  return `¡Buenas noches, ${name}!`;
}

export function getWelcomeMessage(): string {
  return `¡Hola! Soy Kairo, tu asistente de estudio IA. 🧠

Vamos a conocerte mejor para crear una experiencia de aprendizaje 100% personalizada. Te haré algunas preguntas rápidas (solo toma 2 minutos).

¿Listo para empezar?`;
}
