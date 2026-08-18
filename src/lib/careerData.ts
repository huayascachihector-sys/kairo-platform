// ─── Vocational Test (RIASEC) + Career Matching ────────────────────────────────

export type RiasecKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface VocationalQuestion {
  id: string;
  text: string;
  dimension: RiasecKey;
}

export const RIASEC_LABELS: Record<RiasecKey, { icon: string; title: string; desc: string }> = {
  R: { icon: '🔧', title: 'Realista', desc: 'Trabajar con manos, herramientas y máquinas.' },
  I: { icon: '🔬', title: 'Investigador', desc: 'Analizar, investigar y resolver problemas.' },
  A: { icon: '🎨', title: 'Artístico', desc: 'Crear, diseñar y expresar ideas.' },
  S: { icon: '🤝', title: 'Social', desc: 'Ayudar, enseñar y cuidar a otras personas.' },
  E: { icon: '💼', title: 'Emprendedor', desc: 'Liderar, persuadir y gestionar proyectos.' },
  C: { icon: '📊', title: 'Convencional', desc: 'Organizar datos, números y procedimientos.' },
};

// 18 preguntas (3 por dimensión) → puntaje 0–15 por dimensión
export const VOCATIONAL_QUESTIONS: VocationalQuestion[] = [
  { id: 'q1', text: 'Me gusta armar y reparar objetos con mis manos.', dimension: 'R' },
  { id: 'q2', text: 'Disfruto usar herramientas, máquinas o equipos técnicos.', dimension: 'R' },
  { id: 'q3', text: 'Me gustaría trabajar al aire libre o en actividades físicas.', dimension: 'R' },
  { id: 'q4', text: 'Me encanta investigar cómo funcionan las cosas.', dimension: 'I' },
  { id: 'q5', text: 'Disfruto resolver problemas matemáticos o científicos.', dimension: 'I' },
  { id: 'q6', text: 'Me interesa analizar datos y encontrar patrones.', dimension: 'I' },
  { id: 'q7', text: 'Me gusta escribir, dibujar o crear contenido artístico.', dimension: 'A' },
  { id: 'q8', text: 'Disfruto diseñar, componer música o expresarme creativamente.', dimension: 'A' },
  { id: 'q9', text: 'Valoro la originalidad y las ideas poco convencionales.', dimension: 'A' },
  { id: 'q10', text: 'Me gusta ayudar y enseñar a otras personas.', dimension: 'S' },
  { id: 'q11', text: 'Disfruto trabajar en equipo y colaborar con otros.', dimension: 'S' },
  { id: 'q12', text: 'Me importan los problemas sociales y el bienestar de la gente.', dimension: 'S' },
  { id: 'q13', text: 'Me gusta liderar y tomar decisiones en un grupo.', dimension: 'E' },
  { id: 'q14', text: 'Disfruto persuadir y convencer a otros con mis ideas.', dimension: 'E' },
  { id: 'q15', text: 'Me motiva iniciar proyectos y asumir riesgos.', dimension: 'E' },
  { id: 'q16', text: 'Me gusta organizar información, archivos o datos.', dimension: 'C' },
  { id: 'q17', text: 'Disfruto seguir procedimientos claros y ordenados.', dimension: 'C' },
  { id: 'q18', text: 'Me interesa trabajar con números, cuentas y presupuestos.', dimension: 'C' },
];

export interface Career {
  id: string;
  title: string;
  icon: string;
  color: string;
  resumen: string;
  materias: string[];
  campoLaboral: string;
  universidadesPeru: string[];
  universidadesExtranjero: string[];
  riasec: RiasecKey[];
}

export const CAREERS: Career[] = [
  {
    id: 'ing-mecanica',
    title: 'Ingeniería Mecánica',
    icon: '⚙️',
    color: 'from-orange-500 to-amber-600',
    resumen: 'Diseña, construye y mantiene máquinas, motores y sistemas mecánicos. Combina creatividad técnica con trabajo manual y precisión.',
    materias: ['Física', 'Cálculo', 'Mecánica', 'Dibujo técnico', 'Termodinámica'],
    campoLaboral: 'Industria automotriz, manufactura, energía, mantenimiento industrial, consultoría técnica.',
    universidadesPeru: ['UNI', 'PUCP', 'UNMSM', 'UTEC'],
    universidadesExtranjero: ['MIT (EEUU)', 'TU München (Alemania)', 'ETH Zürich (Suiza)'],
    riasec: ['R', 'I'],
  },
  {
    id: 'medicina',
    title: 'Medicina',
    icon: '🩺',
    color: 'from-rose-500 to-pink-600',
    resumen: 'Diagnostica, trata y cuida la salud de las personas. Requiere vocación de servicio, empatía y rigor científico.',
    materias: ['Biología', 'Química', 'Anatomía', 'Fisiología', 'Bioética'],
    campoLaboral: 'Hospitales, clínicas, atención primaria, investigación médica, salud pública.',
    universidadesPeru: ['UNMSM', 'Cayetano Heredia', 'PUCP', 'UPCH'],
    universidadesExtranjero: ['Harvard (EEUU)', 'Oxford (UK)', 'Karolinska (Suecia)'],
    riasec: ['I', 'S'],
  },
  {
    id: 'arquitectura',
    title: 'Arquitectura',
    icon: '🏛️',
    color: 'from-violet-500 to-purple-600',
    resumen: 'Diseña espacios y edificios que combinan estética, función y sostenibilidad. Une creatividad artística con cálculo técnico.',
    materias: ['Dibujo', 'Geometría', 'Física', 'Historia del arte', 'Diseño'],
    campoLaboral: 'Estudios de arquitectura, construcción, urbanismo, diseño interior, restauración.',
    universidadesPeru: ['PUCP', 'UPC', 'Toulouse Lautrec', 'Ricardo Palma'],
    universidadesExtranjero: ['Polytechnic Milan (Italia)', 'UCL (UK)', 'ETSAB Barcelona (España)'],
    riasec: ['A', 'R'],
  },
  {
    id: 'psicologia',
    title: 'Psicología',
    icon: '🧠',
    color: 'from-cyan-500 to-blue-600',
    resumen: 'Estudia el comportamiento y la salud mental. Acompaña a las personas en sus procesos emocionales y cognitivos.',
    materias: ['Biología', 'Estadística', 'Filosofía', 'Sociología', 'Neurociencia'],
    campoLaboral: 'Clínicas, escuelas, recursos humanos, terapia, investigación social.',
    universidadesPeru: ['PUCP', 'UPCH', 'UNMSM', 'Adolfo Ibáñez'],
    universidadesExtranjero: ['Stanford (EEUU)', 'UvA (Países Bajos)', 'Sorbonne (Francia)'],
    riasec: ['S', 'I'],
  },
  {
    id: 'administracion',
    title: 'Administración y Negocios',
    icon: '💼',
    color: 'from-emerald-500 to-teal-600',
    resumen: 'Gestiona organizaciones, lidera equipos y toma decisiones estratégicas. Ideal para emprendedores con visión.',
    materias: ['Economía', 'Matemática', 'Estadística', 'Marketing', 'Contabilidad'],
    campoLaboral: 'Empresas, consultoría, banca, emprendimiento, gestión pública.',
    universidadesPeru: ['ESAN', 'UP', 'PUCP', 'UPC'],
    universidadesExtranjero: ['Wharton (EEUU)', 'LSE (UK)', 'IE Business School (España)'],
    riasec: ['E', 'C'],
  },
  {
    id: 'derecho',
    title: 'Derecho',
    icon: '⚖️',
    color: 'from-amber-500 to-yellow-600',
    resumen: 'Interpreta y aplica las leyes para defender derechos y resolver conflictos. Combina argumentación, ética y liderazgo social.',
    materias: ['Historia', 'Filosofía', 'Comunicación', 'Economía', 'Lógica'],
    campoLaboral: 'Bufetes, judiciary, empresas, consultoría legal, política.',
    universidadesPeru: ['PUCP', 'UNMSM', 'UP', 'USIL'],
    universidadesExtranjero: ['Yale (EEUU)', 'Oxford (UK)', 'Sciences Po (Francia)'],
    riasec: ['S', 'E'],
  },
  {
    id: 'diseno-grafico',
    title: 'Diseño Gráfico',
    icon: '🎨',
    color: 'from-pink-500 to-rose-600',
    resumen: 'Crea identidad visual, ilustraciones y contenido digital. Expresa ideas a través del color, la tipografía y la composición.',
    materias: ['Arte', 'Dibujo', 'Comunicación', 'Tecnología', 'Historia del arte'],
    campoLaboral: 'Agencias, estudios creativos, marketing digital, freelance, editorial.',
    universidadesPeru: ['Toulouse Lautrec', 'UPC', 'Corriente Alterna', 'ISIL'],
    universidadesExtranjero: ['RISD (EEUU)', 'Central Saint Martins (UK)', 'Bauhaus (Alemania)'],
    riasec: ['A', 'E'],
  },
  {
    id: 'contabilidad',
    title: 'Contabilidad y Finanzas',
    icon: '📊',
    color: 'from-blue-500 to-indigo-600',
    resumen: 'Organiza, registra y analiza la información financiera. Trabaja con precisión, orden y datos para la toma de decisiones.',
    materias: ['Matemática', 'Estadística', 'Economía', 'Contabilidad', 'Auditoría'],
    campoLaboral: 'Empresas, auditoría, bancos, consultoría fiscal, finanzas corporativas.',
    universidadesPeru: ['UP', 'PUCP', 'USIL', 'ESAN'],
    universidadesExtranjero: ['LSE (UK)', 'NYU Stern (EEUU)', 'NUS (Singapur)'],
    riasec: ['C', 'I'],
  },
  {
    id: 'ing-sistemas',
    title: 'Ingeniería de Sistemas',
    icon: '💻',
    color: 'from-indigo-500 to-blue-600',
    resumen: 'Diseña software, gestiona redes y resuelve problemas con tecnología. Combina lógica, creatividad y análisis de datos.',
    materias: ['Matemática', 'Lógica', 'Programación', 'Algoritmos', 'Estadística'],
    campoLaboral: 'Desarrollo de software, ciberseguridad, datos, consultoría tech, IA.',
    universidadesPeru: ['UNI', 'PUCP', 'UTEC', 'UPC'],
    universidadesExtranjero: ['MIT (EEUU)', 'Stanford (EEUU)', 'Carnegie Mellon (EEUU)'],
    riasec: ['I', 'R'],
  },
  {
    id: 'educacion',
    title: 'Educación',
    icon: '📚',
    color: 'from-teal-500 to-emerald-600',
    resumen: 'Enseña, forma y acompaña el aprendizaje de niños y jóvenes. Vocación de servicio con impacto social profundo.',
    materias: ['Comunicación', 'Psicología', 'Historia', 'Pedagogía', 'Sociología'],
    campoLaboral: 'Colegios, ministerio, ONGs, formación docente, edición educativa.',
    universidadesPeru: ['PUCP', 'UNMSM', 'UNE', 'USIL'],
    universidadesExtranjero: ['Harvard (EEUU)', 'Oxford (UK)', 'Jyväskylä (Finlandia)'],
    riasec: ['S', 'A'],
  },
  {
    id: 'biologia',
    title: 'Biología',
    icon: '🧬',
    color: 'from-green-500 to-emerald-600',
    resumen: 'Investiga la vida: desde células hasta ecosistemas. Observa, experimenta y descubre patrones en la naturaleza.',
    materias: ['Biología', 'Química', 'Matemática', 'Estadística', 'Ecología'],
    campoLaboral: 'Investigación, laboratorios, medio ambiente, biotecnología, salud.',
    universidadesPeru: ['UNMSM', 'Cayetano Heredia', 'PUCP', 'UNALM'],
    universidadesExtranjero: ['Cambridge (UK)', 'Max Planck (Alemania)', 'Stanford (EEUU)'],
    riasec: ['I', 'R'],
  },
  {
    id: 'marketing',
    title: 'Marketing y Publicidad',
    icon: '📣',
    color: 'from-fuchsia-500 to-pink-600',
    resumen: 'Crea campañas, conecta marcas con personas y genera impacto. Mezcla creatividad, persuasión y análisis de mercado.',
    materias: ['Comunicación', 'Economía', 'Estadística', 'Psicología', 'Diseño'],
    campoLaboral: 'Agencias, marcas, digital, medios, emprendimiento propio.',
    universidadesPeru: ['UPC', 'USIL', 'PUCP', 'Toulouse Lautrec'],
    universidadesExtranjero: ['Columbia (EEUU)', 'ESADE (España)', 'Bocconi (Italia)'],
    riasec: ['E', 'A'],
  },
];

// ─── Scoring ──────────────────────────────────────────────────────────────────
export type RiasecScores = Record<RiasecKey, number>;

export function scoreVocationalTest(answers: Record<string, number>): RiasecScores {
  const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const q of VOCATIONAL_QUESTIONS) {
    const v = answers[q.id];
    if (typeof v === 'number') {
      // Escala 1–5 → 0–5 (restamos 1 para que "Nada" no sume)
      scores[q.dimension] += Math.max(0, v - 1);
    }
  }
  return scores;
}

export function getTopCode(scores: RiasecScores, length = 3): string {
  return (Object.entries(scores) as [RiasecKey, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, length)
    .map(([k]) => k)
    .join('');
}

export function matchCareers(scores: RiasecScores, n = 5): Career[] {
  const top = (Object.entries(scores) as [RiasecKey, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  return [...CAREERS]
    .map((career) => {
      let score = 0;
      top.forEach((dim, idx) => {
        if (career.riasec.includes(dim)) {
          score += (top.length - idx) * (scores[dim] || 0);
        }
      });
      return { career, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.career);
}

export function getCareerById(id: string): Career | undefined {
  return CAREERS.find((c) => c.id === id);
}
