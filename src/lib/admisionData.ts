// ─── Tipos y paths de universidades ──────────────────────────────────────────
// Nota: El banco de preguntas UNI/UNMSM ahora vive en src/lib/examData.ts
// (UNI_SECTIONS, UNMSM_SECTIONS) con explicaciones pulidas y el formato
// ExamSection/ExamQuestion reutilizable por QuizRunner.

export interface AdmissionTask {
  id: string;
  label: string;
}

export interface AdmissionExam {
  name: string;
  detail: string;
}

export interface AdmissionDeadline {
  label: string;
  date: string;
}

export interface UniversityPath {
  id: string;
  name: string;
  short: string;
  country: string;
  icon: string;
  color: string;
  summary: string;
  requisitos: string[];
  examenes: AdmissionExam[];
  fechas: AdmissionDeadline[];
  checklist: AdmissionTask[];
}

export const UNIVERSITY_PATHS: UniversityPath[] = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    short: 'MIT',
    country: 'Estados Unidos',
    icon: '🛠️',
    color: 'from-rose-500 to-red-600',
    summary: 'Admisión altamente selectiva enfocada en STEM, impacto real y curiosidad técnica.',
    requisitos: [
      'Certificado de estudios secundarios completos con notas sobresalientes (especialmente Matemática y Ciencias)',
      'Dos cartas de recomendación: una de profesor de Matemática/Ciencias y otra de Humanidades',
      'Reporte del consejero escolar (Secondary School Report)',
      'Ensayos cortos propios del formulario de MIT (no usa Common App)',
      'Actividades extracurriculares con impacto demostrable (olimpiadas, proyectos, investigación)',
      'Entrevista con un Educational Counselor (cuando está disponible en tu zona)',
      'Solicitud de ayuda financiera: CSS Profile + ISFAA para estudiantes internacionales',
    ],
    examenes: [
      { name: 'SAT o ACT', detail: 'Obligatorio. Rango competitivo del SAT: 1500–1580.' },
      { name: 'TOEFL iBT', detail: 'Recomendado 100+ si tu colegio no enseña en inglés (alternativas: IELTS 7.5, Duolingo 120).' },
      { name: 'AP / IB (opcional)', detail: 'Cálculo, Física y Química refuerzan mucho el perfil.' },
    ],
    fechas: [
      { label: 'Early Action — cierre de postulación', date: '1 de noviembre' },
      { label: 'Resultados Early Action', date: 'mediados de diciembre' },
      { label: 'Regular Action — cierre de postulación', date: '1 de enero' },
      { label: 'Resultados Regular Action', date: 'mediados de marzo (Pi Day)' },
      { label: 'Confirmación de matrícula', date: '1 de mayo' },
    ],
    checklist: [
      { id: 'mit-1', label: 'Alcanzar 1500+ en simulacros de SAT' },
      { id: 'mit-2', label: 'Rendir el TOEFL iBT y superar 100 puntos' },
      { id: 'mit-3', label: 'Solicitar las dos cartas de recomendación' },
      { id: 'mit-4', label: 'Escribir y revisar los ensayos cortos de MIT' },
      { id: 'mit-5', label: 'Documentar 3 proyectos o actividades de impacto' },
      { id: 'mit-6', label: 'Completar el CSS Profile y el ISFAA' },
      { id: 'mit-7', label: 'Enviar la postulación antes del deadline' },
    ],
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    short: 'Stanford',
    country: 'Estados Unidos',
    icon: '🌲',
    color: 'from-red-500 to-rose-700',
    summary: 'Revisión holística: excelencia académica más una historia personal auténtica y liderazgo.',
    requisitos: [
      'Common Application o Coalition Application con los ensayos suplementarios de Stanford',
      'Transcript oficial de secundaria traducido al inglés',
      'Dos cartas de recomendación de profesores + una del consejero',
      'Ensayo personal (650 palabras) y respuestas cortas de Stanford',
      'Portafolio artístico o de investigación opcional',
      'Fee de postulación o solicitud de exoneración',
      'CSS Profile para ayuda financiera internacional',
    ],
    examenes: [
      { name: 'SAT o ACT', detail: 'Requerido. Rango competitivo del SAT: 1490–1570.' },
      { name: 'TOEFL iBT', detail: 'Mínimo recomendado 100 (IELTS 7.0 o Duolingo 115 también aceptados).' },
      { name: 'IB Diploma / AP', detail: 'Muy valorados: HL en Matemática y Ciencias suman al perfil.' },
    ],
    fechas: [
      { label: 'Restrictive Early Action — cierre', date: '1 de noviembre' },
      { label: 'Resultados Early Action', date: 'mediados de diciembre' },
      { label: 'Regular Decision — cierre', date: '5 de enero' },
      { label: 'Resultados Regular Decision', date: 'finales de marzo' },
      { label: 'Confirmación de matrícula', date: '1 de mayo' },
    ],
    checklist: [
      { id: 'stan-1', label: 'Crear la cuenta en Common App' },
      { id: 'stan-2', label: 'Alcanzar 1490+ en simulacros de SAT' },
      { id: 'stan-3', label: 'Rendir el TOEFL iBT (meta 100+)' },
      { id: 'stan-4', label: 'Redactar el ensayo personal de 650 palabras' },
      { id: 'stan-5', label: 'Responder los ensayos suplementarios de Stanford' },
      { id: 'stan-6', label: 'Pedir cartas de recomendación con 1 mes de anticipación' },
      { id: 'stan-7', label: 'Completar el CSS Profile' },
    ],
  },
  {
    id: 'uni',
    name: 'Universidad Nacional de Ingeniería',
    short: 'UNI',
    country: 'Perú',
    icon: '⚙️',
    color: 'from-blue-500 to-indigo-600',
    summary: 'Examen de admisión propio, fuertemente matemático y físico, con dos jornadas de evaluación.',
    requisitos: [
      'Certificado de estudios de 1° a 5° de secundaria',
      'DNI vigente y partida de nacimiento',
      'Constancia de egresado o certificado de conclusión de secundaria',
      'Inscripción en línea en el portal de admisión y pago del derecho',
      'Elegir facultad y especialidad al momento de la inscripción',
      'Certificado médico según la modalidad de ingreso',
    ],
    examenes: [
      { name: 'Examen de Admisión UNI', detail: 'Prueba propia en dos días: Matemática (peso alto), Física y Química; y Aptitud Académica, Comunicación e Historia/Geografía/Economía.' },
      { name: 'Modalidades especiales', detail: 'Ingreso Escolar Nacional (dos primeros puestos), CEPRE-UNI y traslados.' },
      { name: 'CEPRE-UNI', detail: 'Ciclo preuniversitario oficial: aprobar los tres ciclos permite el ingreso directo.' },
    ],
    fechas: [
      { label: 'Inscripciones admisión ordinaria', date: 'enero y julio (según proceso)' },
      { label: 'Primera jornada del examen', date: 'febrero / agosto' },
      { label: 'Segunda jornada del examen', date: 'día siguiente a la primera jornada' },
      { label: 'Resultados y vacantes', date: '48 horas después del examen' },
      { label: 'Matrícula de ingresantes', date: 'marzo / septiembre' },
    ],
    checklist: [
      { id: 'uni-1', label: 'Reunir certificados de estudios y DNI' },
      { id: 'uni-2', label: 'Elegir facultad y especialidad' },
      { id: 'uni-3', label: 'Inscribirme en el portal de admisión y pagar el derecho' },
      { id: 'uni-4', label: 'Dominar Álgebra, Trigonometría y Geometría del temario' },
      { id: 'uni-5', label: 'Resolver 5 exámenes de admisión de años anteriores' },
      { id: 'uni-6', label: 'Practicar Física y Química con tiempo cronometrado' },
      { id: 'uni-7', label: 'Repasar Aptitud Académica y Comunicación' },
    ],
  },
  {
    id: 'unmsm',
    name: 'Universidad Nacional Mayor de San Marcos',
    short: 'UNMSM',
    country: 'Perú',
    icon: '🏛️',
    color: 'from-amber-500 to-orange-600',
    summary: 'La universidad decana de América: examen propio por áreas, con alta competencia por vacante.',
    requisitos: [
      'Certificado de estudios de secundaria completo',
      'DNI vigente del postulante',
      'Inscripción en línea en el sistema de admisión SUM y pago del derecho',
      'Elegir un área (A: Ciencias de la Salud, B: Ciencias Básicas e Ingenierías, C: Ciencias Económicas y Gestión, D: Humanidades y Ciencias Jurídicas y Sociales)',
      'Ficha de inscripción y foto reciente',
      'Declaración jurada de datos y de no tener antecedentes',
    ],
    examenes: [
      { name: 'Examen de Admisión UNMSM', detail: 'Prueba propia de 100 preguntas: Habilidad Verbal y Matemática, más Ciencias o Letras según el área elegida.' },
      { name: 'Modalidades especiales', detail: 'Primeros puestos, CEPREUNMSM, traslados internos/externos y deportistas calificados.' },
      { name: 'CEPREUNMSM', detail: 'Ciclo preuniversitario propio con vacantes por rendimiento.' },
    ],
    fechas: [
      { label: 'Inscripciones proceso ordinario', date: 'enero y julio (según proceso)' },
      { label: 'Examen áreas A y B', date: 'primer día del proceso (marzo / septiembre)' },
      { label: 'Examen áreas C y D', date: 'segundo día del proceso' },
      { label: 'Publicación de resultados', date: 'el mismo día del examen' },
      { label: 'Matrícula de ingresantes', date: 'según cronograma de la facultad' },
    ],
    checklist: [
      { id: 'sm-1', label: 'Definir el área y la carrera a la que postularé' },
      { id: 'sm-2', label: 'Reunir certificado de estudios y DNI' },
      { id: 'sm-3', label: 'Inscribirme en el sistema SUM y pagar el derecho' },
      { id: 'sm-4', label: 'Practicar Habilidad Verbal y Comprensión Lectora' },
      { id: 'sm-5', label: 'Practicar Habilidad Matemática y Aritmética' },
      { id: 'sm-6', label: 'Repasar los cursos específicos de mi área' },
      { id: 'sm-7', label: 'Resolver 5 simulacros completos de 100 preguntas' },
    ],
  },
];

export function getUniversityPath(id: string): UniversityPath | undefined {
  return UNIVERSITY_PATHS.find((u) => u.id === id);
}
