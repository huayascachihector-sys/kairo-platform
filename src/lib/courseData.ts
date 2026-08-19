// ─── Kairo Course Data ────────────────────────────────────────────────────
import { VIDEO_LIBRARY } from "../../data/videoLibrary";

export interface Exercise {
  question: string;
  hints?: string[];
  options: string[];
  correct: number;
  explanation: string;
}

export interface FillInBlankExercise {
  question: string;
  hints?: string[];
  answer: string;
  acceptableAnswers?: string[];
  explanation: string;
}

export interface OrderingExercise {
  question: string;
  hints?: string[];
  items: string[];
  correctOrder: number[];
  explanation: string;
}

export type ExerciseVariant = {
  type: 'choice';
  data: Exercise;
} | {
  type: 'fill';
  data: FillInBlankExercise;
} | {
  type: 'order';
  data: OrderingExercise;
};

export type LessonType = 'concept' | 'practice' | 'review' | 'exam';

export interface CRAConfig {
  concrete: {
    type: 'scale' | 'geometry' | 'number-line' | 'area-model';
    title: string;
    description: string;
    params: Record<string, any>;
    connectionToAbstract: string;
  };
  representational: {
    type: 'graph' | 'diagram' | 'table';
    title: string;
    description: string;
    params: Record<string, any>;
  };
  abstract: {
    formula: string;
    explanation: string;
    connectionSteps: { label: string; highlight: string }[];
  };
}

export interface StoryConfig {
  title: string;
  context: string;
  dialogue: { speaker: string; text: string; translation?: string }[];
  vocabulary: { word: string; definition: string; example: string }[];
  grammarFocus: { pattern: string; explanation: string; example: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  xpReward: number;
  lessonType: LessonType;
  content: string;
  exercises: Exercise[];
  variants?: ExerciseVariant[];
  requiredLessons?: string[];
  craConfig?: CRAConfig;
  storyConfig?: StoryConfig;
  videoUrl?: string;
  videoQuiz?: { question: string; options: string[]; correct: number; explanation: string }[];
}

export interface PruebaModulo {
  aprobarCon: number; // nota mínima 0-100 para aprobar el módulo
  preguntas: Exercise[]; // preguntas para la Fase 4 (si vacío, se derivan)
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  timelineEvents?: TimelineEventData[];
  // ── KAIRO 4 fases ─────────────────────────────────────────────
  teoria?: {
    titulo: string;
    videoUrl?: string; // ruta a /videos/<curso>/<modulo>.mp4 generado localmente
    markdown?: string; // si no se provee, se concatena el content de las lessons
  };
  practica?: { titulo: string }; // defaults: ejercicios de las lessons
  iaTutor?: {
    titulo: string;
    problema: string;
    formula: string;
    answer: number;
    tolerancia: number;
    hints: string[];
  };
  prueba?: PruebaModulo;
}

export interface TimelineEventData {
  id: string;
  date: string;
  title: string;
  description: string;
  cause: string;
  consequence: string;
  nextConnection: string;
  icon: string;
}

export interface Unit {
  id: string;
  title: string;
  description?: string;
  modules: Module[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  gradientProgress: string;
  illustration: string;
  pattern: 'dots' | 'grid' | 'waves' | 'none';
  modules: Module[];
  units?: Unit[];
}

export function getTotalLessons(course: Course): number {
  if (course.units) {
    return course.units.reduce((s, u) => s + u.modules.reduce((s2, m) => s2 + m.lessons.length, 0), 0);
  }
  return course.modules.reduce((s, m) => s + m.lessons.length, 0);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = ALL_COURSES.find(c => c.id === courseId);
  if (!course) return;
  const allLessons = course.units
    ? course.units.flatMap(u => u.modules.flatMap(m => m.lessons))
    : course.modules.flatMap(m => m.lessons);
  return allLessons.find(l => l.id === lessonId);
}

export function getCourse(id: string): Course | undefined {
  return ALL_COURSES.find(c => c.id === id);
}

// ─── KAIRO 4 fases — derivación desde el data actual ─────────────────────────

export type Fase = "teoria" | "practica" | "ia" | "prueba";

export const FASES: { id: Fase; titulo: string; descripcion: string; icono: string }[] = [
  { id: "teoria", titulo: "Teoría y video", descripcion: "Aprende el concepto", icono: "📺" },
  { id: "practica", titulo: "Práctica", descripcion: "Ejercicios guiados", icono: "✍️" },
  { id: "ia", titulo: "La IA te enseña", descripcion: "Resuelve con pistas del tutor", icono: "🧠" },
  { id: "prueba", titulo: "Prueba final", descripcion: "Aprobar el módulo", icono: "🏆" },
];

export function getModules(course: Course): Module[] {
  if (course.units) {
    return course.units.flatMap((u) => u.modules);
  }
  return course.modules;
}

export function getTheoryMarkdown(modulo: Module): string {
  if (modulo.teoria?.markdown) return modulo.teoria.markdown;
  return modulo.lessons
    .filter((l) => l.content && l.content.trim().length > 0)
    .map((l) => l.content.trim())
    .join("\n\n---\n\n");
}

export function getModuloVideo(courseId: string, modulo: Module): string | undefined {
  // Sobrescribe con la ruta explícita si se indica; si no, deriva la convención
  // /videos/<curso>/<módulo>.mp4 (el MP4 lo genera el admin localmente y se
  // coloca en public/videos/ para servirlo estático).
  const explicito = modulo.teoria?.videoUrl;
  if (explicito && explicito.trim().length > 0) return explicito;
  const idLimpio = courseId.replace(/[^a-zA-Z0-9-]/g, "") || "curso";
  const modLimpio = modulo.id.replace(/[^a-zA-Z0-9-]/g, "");
  return `/videos/${idLimpio}/${modLimpio}.mp4`;
}

export function getLessonVideoUrl(courseId: string, lesson: Lesson): string | undefined {
  // 1. Consultar biblioteca curada de YouTube (videolibrary.ts)
  const curated = VIDEO_LIBRARY[lesson.id];
  if (curated?.videoId) return `https://www.youtube.com/watch?v=${curated.videoId}`;

  // 2. Fallback: deriva la ruta al MP4 local (/videos/<curso>/<lección>.mp4)
  const explicito = lesson.videoUrl;
  if (explicito && explicito.trim().length > 0) return explicito;

  const idLimpio = courseId.replace(/[^a-zA-Z0-9-]/g, "") || "curso";
  const lecLimpio = lesson.id.replace(/[^a-zA-Z0-9-]/g, "");
  return `/videos/${idLimpio}/${lecLimpio}.mp4`;
}

export function getLessonRepasoVideos(lesson: Lesson): CuratedVideo[] | undefined {
  return VIDEO_LIBRARY[lesson.id]?.repaso;
}

export function getPracticaExercises(modulo: Module): Exercise[] {
  const fromLessons = modulo.lessons.flatMap((l) => l.exercises || []);
  return fromLessons;
}

export function getPruebaQuestions(modulo: Module): Exercise[] {
  if (modulo.prueba && modulo.prueba.preguntas.length > 0) return modulo.prueba.preguntas;
  // derivar: tomar 1 ejercicio por lección, priorizando review/exam lessons
  const all = getPracticaExercises(modulo);
  const examLike = modulo.lessons
    .filter((l) => l.lessonType === "exam" || l.lessonType === "review")
    .flatMap((l) => l.exercises);
  const pool = examLike.length >= 3 ? examLike : all;
  const out: Exercise[] = [];
  const used = new Set<number>();
  const count = Math.max(3, Math.min(6, pool.length));
  while (out.length < count && out.length < pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    if (!used.has(i)) {
      used.add(i);
      out.push(pool[i]);
    }
  }
  return out;
}

export function getPruebaAprobarCon(modulo: Module): number {
  return modulo.prueba?.aprobarCon ?? 60;
}

// ─── Matemáticas ──────────────────────────────────────────────────────────────
const matematicas: Course = {
  id: 'matematicas',
  title: 'Matemáticas',
  description: 'Álgebra, Geometría y Cálculo diferencial para nivel universitario.',
  icon: '∫',
  color: 'from-primary-500 to-primary-700',
  bgColor: 'bg-primary-50',
  gradientProgress: 'from-violet-400 via-fuchsia-400 to-orange-300',
  illustration: 'matematicas',
  pattern: 'grid',
  modules: [
    {
      id: 'mat-m1',
      title: 'Módulo 1: Álgebra',
      lessons: [
        {
          id: 'mat-1-1',
          title: 'Expresiones Algebraicas',
          duration: '12 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Expresiones Algebraicas

Una **expresión algebraica** combina números, variables y operaciones matemáticas.

### Componentes
- **Variable**: letra que representa un valor desconocido (x, y, z)
- **Coeficiente**: número que multiplica a la variable (en 3x, el coeficiente es 3)
- **Término independiente**: número sin variable (en 2x + 5, el 5 es el término independiente)

### Tipos de expresiones
| Tipo | Ejemplo |
|------|---------|
| Monomio | 4x² |
| Binomio | 3x + 2 |
| Trinomio | x² + 5x - 6 |
| Polinomio | x³ + 2x² - x + 1 |

### Operaciones básicas
**Suma de monomios semejantes** (misma variable y grado):
> 3x + 5x = 8x
> 4y² + 2y² = 6y²

**Multiplicación** (suma de exponentes):
> x³ · x² = x⁵
> (2x)(3x²) = 6x³

### Productos notables memoriza estos:
- **(a + b)² = a² + 2ab + b²**
- **(a - b)² = a² - 2ab + b²**
- **(a + b)(a - b) = a² - b²**`,
          exercises: [
            {
              question: '¿Cuál es el resultado de (3x + 2)²?',
              options: ['9x² + 4', '9x² + 6x + 4', '9x² + 12x + 4', '6x² + 12x + 4'],
              correct: 2,
              explanation: 'Usando (a+b)² = a² + 2ab + b²: (3x)² + 2(3x)(2) + 2² = 9x² + 12x + 4',
            },
            {
              question: '¿Cuánto es 5x² + 3x² - 2x²?',
              options: ['6x²', '10x²', '8x⁶', '6x⁶'],
              correct: 0,
              explanation: 'Se suman/restan solo los monomios semejantes: 5 + 3 - 2 = 6, entonces 6x²',
            },
            {
              question: '¿Cuál es el coeficiente de x en la expresión 7x³ - 4x + 9?',
              options: ['7', '9', '-4', '3'],
              correct: 2,
              explanation: 'El término con x (sin exponente mayor) es -4x, cuyo coeficiente es -4',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'mat-1-2',
          title: 'Ecuaciones Lineales',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          craConfig: {
            concrete: {
              type: 'scale',
              title: 'La Balanza Algebraica',
              description: 'Imagina una balanza de platillos. Cada lado debe estar equilibrado, como una ecuación.',
              params: { defaultExpression: '2x + 3 = 7', steps: [
                { action: 'restar 3', from: '2x + 3 = 7', to: '2x = 4' },
                { action: 'dividir entre 2', from: '2x = 4', to: 'x = 2' },
              ]},
              connectionToAbstract: 'Cada操作 en la balanza corresponde exactamente a una operación algebraica: lo que haces a un lado, debes hacerlo al otro.',
            },
            representational: {
              type: 'graph',
              title: 'La Recta en el Plano',
              description: 'Cada ecuación lineal se representa como una recta. La solución es donde la recta cruza el eje X.',
              params: { equation: 'y = 2x - 4', solutionX: 2 },
            },
            abstract: {
              formula: 'ax + b = c → x = (c - b) / a',
              explanation: 'La fórmula general para resolver ecuaciones lineales: aisla la variable x usando operaciones inversas, igual que en la balanza.',
              connectionSteps: [
                { label: 'Balanza con pesas', highlight: '2x + 3 = 7' },
                { label: 'Quitar 3 de ambos lados', highlight: '2x = 4' },
                { label: 'Dividir entre 2', highlight: 'x = 2' },
                { label: 'Fórmula general', highlight: 'x = (7 - 3) / 2' },
              ],
            },
          },
          content: `## Ecuaciones Lineales

Una **ecuación lineal** tiene la forma ax + b = c, donde la variable tiene grado 1.

### Principio de equivalencia
Podemos realizar la **misma operación en ambos lados** sin alterar la solución:
- Sumar/restar el mismo número
- Multiplicar/dividir por el mismo número ≠ 0

### Método de resolución paso a paso
**Ejemplo**: Resolver 3x - 7 = 2x + 5

1. Agrupar variables a la izquierda: 3x - 2x = 5 + 7
2. Simplificar: x = 12
3. **Verificar**: 3(12) - 7 = 29 ✓ y 2(12) + 5 = 29 ✓

### Ecuaciones con fracciones
**Ejemplo**: x/2 + x/3 = 5

1. Mínimo común múltiplo = 6
2. Multiplicar todo por 6: 3x + 2x = 30
3. 5x = 30 → **x = 6**

### Ecuaciones con paréntesis
**Ejemplo**: 2(3x - 4) = 3(x + 2)

1. Distribuir: 6x - 8 = 3x + 6
2. Agrupar: 6x - 3x = 6 + 8
3. 3x = 14 → **x = 14/3**`,
          exercises: [
            {
              question: 'Resuelve: 4x - 8 = 2x + 6',
              options: ['x = 7', 'x = 1', 'x = -1', 'x = 14'],
              correct: 0,
              explanation: '4x - 2x = 6 + 8 → 2x = 14 → x = 7',
            },
            {
              question: 'Resuelve: 3(2x + 1) = 2(x + 7)',
              options: ['x = 2', 'x = 11/4', 'x = 3', 'x = 11/2'],
              correct: 1,
              explanation: '6x + 3 = 2x + 14 → 4x = 11 → x = 11/4',
            },
            {
              question: '¿Cuál es la solución de x/3 - 2 = x/6 + 1?',
              options: ['x = 12', 'x = 18', 'x = 6', 'x = 9'],
              correct: 1,
              explanation: 'Multiplicar por 6: 2x - 12 = x + 6 → x = 18',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'mat-1-3',
          title: 'Sistemas de Ecuaciones',
          duration: '18 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Sistemas de Ecuaciones

Un **sistema de ecuaciones** es un conjunto de dos o más ecuaciones con las mismas variables.

### Método de Sustitución
**Ejemplo**: { 2x + y = 7 ; x - y = 2 }

1. De la 2ª ecuación: x = y + 2
2. Sustituir en la 1ª: 2(y + 2) + y = 7
3. 2y + 4 + y = 7 → 3y = 3 → **y = 1**
4. x = 1 + 2 = **x = 3**

### Método de Eliminación (Suma/Resta)
**Ejemplo**: { 3x + 2y = 12 ; x - 2y = 4 }

1. Sumar ambas ecuaciones: 4x = 16 → **x = 4**
2. Sustituir: 3(4) + 2y = 12 → 2y = 0 → **y = 0**

### Tipos de sistemas
| Tipo | Descripción | Soluciones |
|------|-------------|------------|
| Compatible determinado | Las rectas se cruzan | Una solución |
| Compatible indeterminado | Las rectas son la misma | Infinitas |
| Incompatible | Las rectas son paralelas | Sin solución |`,
          exercises: [
            {
              question: 'Resuelve el sistema: 2x + y = 5 ; x - y = 1',
              options: ['x=2, y=1', 'x=3, y=-1', 'x=1, y=3', 'x=2, y=-1'],
              correct: 0,
              explanation: 'Sumando: 3x = 6 → x = 2; sustituyendo: 2+y=5 → y=1',
            },
            {
              question: 'En el sistema { x + 2y = 8 ; 3x - 2y = 4 }, ¿cuánto vale x?',
              options: ['3', '4', '5', '2'],
              correct: 0,
              explanation: 'Sumando: 4x = 12 → x = 3',
            },
            {
              question: '¿Qué tipo de sistema es { 2x + y = 4 ; 4x + 2y = 9 }?',
              options: ['Compatible determinado', 'Compatible indeterminado', 'Incompatible', 'Ninguno'],
              correct: 2,
              explanation: 'La 2ª ecuación es 2 veces la 1ª pero con distinto término independiente (4≠4.5), son paralelas → incompatible',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'mat-m2',
      title: 'Módulo 2: Geometría',
      lessons: [
        {
          id: 'mat-2-1',
          title: 'Triángulos y Ángulos',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Triángulos y Ángulos

### Tipos de ángulos
- **Agudo**: 0° < α < 90°
- **Recto**: α = 90°
- **Obtuso**: 90° < α < 180°
- **Llano**: α = 180°

### Triángulos por lados
| Tipo | Características |
|------|----------------|
| Equilátero | 3 lados iguales, 3 ángulos de 60° |
| Isósceles | 2 lados iguales |
| Escaleno | 3 lados distintos |

### Teorema de Pitágoras
En un triángulo rectángulo: **a² + b² = c²**
donde c es la hipotenusa (lado opuesto al ángulo recto).

**Ejemplo**: catetos a=3, b=4 → c = √(9+16) = √25 = **5**

### Suma de ángulos interiores
La suma de los ángulos interiores de cualquier triángulo es **180°**.`,
          exercises: [
            {
              question: 'En un triángulo rectángulo con catetos 5 y 12, ¿cuánto mide la hipotenusa?',
              options: ['13', '17', '√17', '15'],
              correct: 0,
              explanation: '5² + 12² = 25 + 144 = 169 = 13²',
            },
            {
              question: 'Un triángulo tiene ángulos de 45° y 65°. ¿Cuánto mide el tercer ángulo?',
              options: ['70°', '80°', '90°', '60°'],
              correct: 0,
              explanation: '180° - 45° - 65° = 70°',
            },
            {
              question: '¿Qué tipo de triángulo tiene todos sus lados distintos?',
              options: ['Equilátero', 'Isósceles', 'Escaleno', 'Rectángulo'],
              correct: 2,
              explanation: 'El triángulo escaleno tiene los 3 lados de longitudes diferentes',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'mat-2-2',
          title: 'Circunferencia y Área',
          duration: '13 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Circunferencia y Área

### La circunferencia
- **Radio (r)**: distancia del centro a cualquier punto
- **Diámetro (d)**: d = 2r
- **Longitud** = 2πr
- **Área** = πr²

**Ejemplo**: r = 5 cm → Área = π(25) ≈ 78.54 cm²

### Áreas de figuras planas
| Figura | Fórmula |
|--------|---------|
| Cuadrado | l² |
| Rectángulo | b × h |
| Triángulo | (b × h) / 2 |
| Trapecio | ((B + b) × h) / 2 |
| Círculo | πr² |

### Perímetros
| Figura | Fórmula |
|--------|---------|
| Cuadrado | 4l |
| Rectángulo | 2(b + h) |
| Triángulo | a + b + c |
| Círculo | 2πr |`,
          exercises: [
            {
              question: '¿Cuál es el área de un círculo con radio 6 cm? (usa π ≈ 3.14)',
              options: ['113.04 cm²', '37.68 cm²', '18.84 cm²', '226.08 cm²'],
              correct: 0,
              explanation: 'A = πr² = 3.14 × 36 = 113.04 cm²',
            },
            {
              question: '¿Cuál es el área de un trapecio con bases 8 y 5, y altura 4?',
              options: ['26', '13', '20', '52'],
              correct: 0,
              explanation: 'A = ((8 + 5) × 4) / 2 = (13 × 4) / 2 = 26',
            },
            {
              question: 'Un cuadrado tiene perímetro 36 cm. ¿Cuánto mide su área?',
              options: ['81 cm²', '36 cm²', '144 cm²', '9 cm²'],
              correct: 0,
              explanation: 'Lado = 36/4 = 9 cm → Área = 9² = 81 cm²',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'mat-m3',
      title: 'Módulo 3: Cálculo',
      lessons: [
        {
          id: 'mat-3-1',
          title: 'Límites y Continuidad',
          duration: '20 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Límites y Continuidad

### Concepto de Límite
**lim(x→a) f(x) = L** significa que cuando x se acerca a a, f(x) se acerca a L.

### Cálculo directo
Si la función es continua en a, simplemente sustituye:
> lim(x→2) (x² + 3) = 4 + 3 = **7**

### Indeterminaciones
Si obtienes 0/0, factoriza y simplifica:
> lim(x→3) (x² - 9)/(x - 3) = lim(x→3) (x+3)(x-3)/(x-3) = lim(x→3) (x+3) = **6**

### Límites al infinito
Para fracciones racionales, el comportamiento depende del grado:
- Grado numerador < denominador → límite = 0
- Grados iguales → límite = cociente de coeficientes líderes
- Grado numerador > denominador → límite = ±∞`,
          exercises: [
            {
              question: '¿Cuánto es lim(x→4) (x² - 16)/(x - 4)?',
              options: ['8', '0', '4', 'No existe'],
              correct: 0,
              explanation: 'Factor: (x-4)(x+4)/(x-4) = x+4 → cuando x→4: 4+4 = 8',
            },
            {
              question: '¿Cuánto es lim(x→∞) (3x² + 2)/(5x²)?',
              options: ['3/5', '0', '∞', '2/5'],
              correct: 0,
              explanation: 'Mismos grados: cociente de coeficientes líderes = 3/5',
            },
            {
              question: '¿Cuánto es lim(x→2) (x³ - 8)/(x - 2)?',
              options: ['12', '0', '4', '8'],
              correct: 0,
              explanation: 'x³-8 = (x-2)(x²+2x+4), simplificamos → x²+2x+4 con x=2: 4+4+4=12',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'mat-m4',
      title: 'Módulo 4: Trigonometría',
      lessons: [
         {
          id: 'mat-4-1',
          title: 'Razones Trigonométricas',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Razones Trigonométricas

Contenido didáctico para razones trigonométricas.`,
          exercises: [
            {
              question: "En un triángulo rectángulo, si el cateto opuesto a θ mide 3 y la hipotenusa mide 5, ¿cuánto vale sen θ?",
              options: ["3/5","4/5","3/4","5/3"],
              correct: 0,
              explanation: "sen θ = cateto opuesto / hipotenusa = 3/5",
            },
            {
              question: "¿Cuál es el valor de cos 60°?",
              options: ["1/2","√3/2","√2/2","1"],
              correct: 0,
              explanation: "cos 60° = 1/2",
            },
            {
              question: "Si tan θ = 1, ¿cuánto mide θ?",
              options: ["30°","45°","60°","90°"],
              correct: 1,
              explanation: "tan 45° = 1",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'mat-4-2',
          title: 'Ley de Senos y Cosenos',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Ley de Senos y Cosenos

Contenido didáctico para ley de senos y cosenos.`,
          exercises: [
            {
              question: "En un triángulo ABC, a=7, b=8, c=9. ¿Cuál es el valor de cos A?",
              options: ["2/3","1/3","4/7","5/7"],
              correct: 0,
              explanation: "cos A = (b²+c²-a²)/(2bc) = (64+81-49)/(144) = 96/144 = 2/3",
            },
            {
              question: "¿Para qué tipo de triángulo se usa la Ley de Senos?",
              options: ["Acutángulo","Rectángulo","Cualquiera","Obtusángulo"],
              correct: 2,
              explanation: "La Ley de Senos aplica a cualquier triángulo",
            },
            {
              question: "Si A=30°, b=10, c=12, ¿cuál es el área?",
              options: ["60","30","50","40"],
              correct: 1,
              explanation: "Área = (1/2)bc·sen A = (1/2)(10)(12)(0.5) = 30",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'mat-4-3',
          title: 'Identidades Trigonométricas',
          duration: '18 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Identidades Trigonométricas

Contenido didáctico para identidades trigonométricas.`,
          exercises: [
            {
              question: "Simplifica: sen²x + cos²x",
              options: ["1","0","-1","sen x"],
              correct: 0,
              explanation: "Identidad pitagórica fundamental: sen²x + cos²x = 1",
            },
            {
              question: "¿A qué es igual sen(2x)?",
              options: ["2 sen x cos x","sen²x","cos²x","sen x + cos x"],
              correct: 0,
              explanation: "Identidad del ángulo doble: sen(2x) = 2 sen x cos x",
            },
            {
              question: "Simplifica: 1 - sen²x",
              options: ["cos²x","sen²x","cos x","tan²x"],
              correct: 0,
              explanation: "1 - sen²x = cos²x (por la identidad pitagórica)",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
    {
      id: 'mat-m5',
      title: 'Módulo 5: Geometría Analítica',
      lessons: [
{
          id: 'mat-5-1',
          title: 'Ecuación de la Recta',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Ecuación de la Recta

Contenido didáctico para ecuación de la recta.`,
          exercises: [
            {
              question: "¿Cuál es la pendiente de la recta que pasa por (1,2) y (3,6)?",
              options: ["2","3","4","1"],
              correct: 0,
              explanation: "m = (6-2)/(3-1) = 4/2 = 2",
            },
            {
              question: "La ecuación y = 2x + 3, ¿cuál es la ordenada al origen?",
              options: ["2","3","-3","-2"],
              correct: 1,
              explanation: "En y = mx + b, b = 3 es la ordenada al origen",
            },
            {
              question: "¿Cuál es la ecuación de la recta horizontal que pasa por (4,5)?",
              options: ["y = 5","x = 4","y = 4","x = 5"],
              correct: 0,
              explanation: "Recta horizontal: pendiente 0, ecuación y = constante = 5",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'mat-5-2',
          title: 'Circunferencia y Parábola',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Circunferencia y Parábola

Contenido didáctico para circunferencia y parábola.`,
          exercises: [
            {
              question: "¿Cuál es el radio de x² + y² = 25?",
              options: ["25","5","10","√25"],
              correct: 1,
              explanation: "r = √25 = 5",
            },
            {
              question: "El vértice de y = x² - 4 está en:",
              options: ["(0,-4)","(0,4)","(4,0)","(-4,0)"],
              correct: 0,
              explanation: "Vértice en (h,k) = (0,-4) para y = x² - 4",
            },
            {
              question: "¿Cuál es el centro de (x-3)² + (y+2)² = 16?",
              options: ["(3,-2)","(-3,2)","(3,2)","(-3,-2)"],
              correct: 0,
              explanation: "Centro (h,k) = (3,-2)",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'mat-5-3',
          title: 'Secciones Cónicas',
          duration: '18 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## Secciones Cónicas

Contenido didáctico para secciones cónicas.`,
          exercises: [
            {
              question: "¿Qué cónica tiene excentricidad e=0?",
              options: ["Circunferencia","Elipse","Parábola","Hipérbola"],
              correct: 0,
              explanation: "e=0 para circunferencia",
            },
            {
              question: "La ecuación x²/a² - y²/b² = 1 representa:",
              options: ["Elipse","Hipérbola","Parábola","Circunferencia"],
              correct: 1,
              explanation: "Es la forma canónica de la hipérbola horizontal",
            },
            {
              question: "¿Cuántos focos tiene una elipse?",
              options: ["1","2","3","4"],
              correct: 1,
              explanation: "La elipse tiene 2 focos",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
  ],
};

// ─── Física ───────────────────────────────────────────────────────────────────
const fisica: Course = {
  id: 'fisica',
  title: 'Física',
  description: 'Cinemática, Dinámica y Termodinámica con problemas resueltos.',
  icon: '⚡',
  color: 'from-cyan-500 to-cyan-700',
  bgColor: 'bg-cyan-50',
  gradientProgress: 'from-cyan-400 via-blue-400 to-indigo-300',
  illustration: 'fisica',
  pattern: 'dots',
  modules: [
    {
      id: 'fis-m1',
      title: 'Módulo 1: Cinemática',
      lessons: [
        {
          id: 'fis-1-1',
          title: 'Movimiento Rectilíneo Uniforme (MRU)',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Movimiento Rectilíneo Uniforme

El **MRU** es el movimiento en línea recta con velocidad constante (aceleración = 0).

### Características
- Velocidad constante (v = constante)
- Aceleración = 0
- La gráfica x(t) es una línea recta

### Ecuación fundamental
> **x = x₀ + v · t**

Donde:
- x = posición final (m)
- x₀ = posición inicial (m)
- v = velocidad (m/s)
- t = tiempo (s)

### Ejemplo resuelto
Un auto viaja a 20 m/s. ¿Qué distancia recorre en 15 segundos?

x = x₀ + v·t = 0 + 20 × 15 = **300 m**

### Velocidad media
> v_media = Δx / Δt = (x_final - x_inicial) / (t_final - t_inicial)`,
          exercises: [
            {
              question: 'Un ciclista viaja a 5 m/s durante 60 segundos. ¿Cuántos metros recorre?',
              options: ['300 m', '12 m', '65 m', '55 m'],
              correct: 0,
              explanation: 'x = v·t = 5 × 60 = 300 m',
            },
            {
              question: 'Un tren viaja 1 km en 50 s. ¿Cuál es su velocidad en m/s?',
              options: ['20 m/s', '50 m/s', '0.02 m/s', '100 m/s'],
              correct: 0,
              explanation: 'v = x/t = 1000/50 = 20 m/s',
            },
            {
              question: '¿Qué caracteriza al MRU?',
              options: ['Velocidad variable', 'Aceleración constante', 'Velocidad constante y aceleración cero', 'Movimiento curvilíneo'],
              correct: 2,
              explanation: 'En el MRU la velocidad es constante y la aceleración es cero',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'fis-1-2',
          title: 'MRUA y Caída Libre',
          duration: '18 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Movimiento Uniformemente Acelerado (MRUA)

En el MRUA la aceleración es **constante y diferente de cero**.

### Ecuaciones del MRUA
| Ecuación | Uso |
|----------|-----|
| v = v₀ + at | Hallar velocidad final |
| x = v₀t + ½at² | Hallar posición |
| v² = v₀² + 2ax | Sin tiempo |
| x = (v + v₀)/2 · t | Con velocidades |

### Caída Libre
Caso especial de MRUA con a = g = 9.8 m/s² (hacia abajo)
- Velocidad inicial vertical = 0
- **v = g·t**
- **h = ½g·t²**

### Ejemplo: caída libre
Se suelta una piedra desde 80 m de altura. ¿En cuánto tiempo llega al suelo?

h = ½g·t² → 80 = ½(10)t² → t² = 16 → **t = 4 s**`,
          exercises: [
            {
              question: 'Un auto parte del reposo con a = 3 m/s². ¿Qué velocidad tiene a los 8 s?',
              options: ['24 m/s', '11 m/s', '5 m/s', '3 m/s'],
              correct: 0,
              explanation: 'v = v₀ + at = 0 + 3×8 = 24 m/s',
            },
            {
              question: 'Se deja caer una pelota desde 45 m. ¿Cuántos segundos tarda en llegar? (g=10 m/s²)',
              options: ['3 s', '4.5 s', '9 s', '6 s'],
              correct: 0,
              explanation: '45 = ½(10)t² → t² = 9 → t = 3 s',
            },
            {
              question: 'Un vehículo a 20 m/s frena con a = -4 m/s². ¿Cuánto recorre hasta detenerse?',
              options: ['50 m', '40 m', '25 m', '100 m'],
              correct: 0,
              explanation: 'v²= v₀²+ 2ax → 0 = 400 - 8x → x = 50 m',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'fis-m2',
      title: 'Módulo 2: Dinámica',
      lessons: [
        {
          id: 'fis-2-1',
          title: 'Leyes de Newton',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Las 3 Leyes de Newton

### 1ª Ley: Inercia
"Un objeto en reposo permanece en reposo, y uno en movimiento continúa en movimiento rectilíneo uniforme, **a menos que actúe una fuerza neta sobre él**."

### 2ª Ley: Fuerza y Aceleración
> **F = m · a**

- F: fuerza neta (Newton, N)
- m: masa (kilogramos, kg)
- a: aceleración (m/s²)

**Ejemplo**: m = 10 kg, a = 5 m/s² → F = 50 N

### 3ª Ley: Acción y Reacción
"Por cada acción existe una **reacción igual y opuesta**."
- Siempre se presentan en pares
- Actúan sobre objetos distintos
- El suelo te empuja hacia arriba con la misma fuerza que tú lo pisas

### Peso vs Masa
- **Masa**: cantidad de materia (kg) — constante
- **Peso**: fuerza gravitacional W = mg (N) — varía según g`,
          exercises: [
            {
              question: 'Aplicas una fuerza de 60 N a un objeto de 12 kg. ¿Cuál es su aceleración?',
              options: ['5 m/s²', '720 m/s²', '0.2 m/s²', '48 m/s²'],
              correct: 0,
              explanation: 'a = F/m = 60/12 = 5 m/s²',
            },
            {
              question: '¿Cuál es el peso de un objeto de 8 kg en la Tierra? (g = 10 m/s²)',
              options: ['80 N', '8 N', '80 kg', '0.8 N'],
              correct: 0,
              explanation: 'W = mg = 8 × 10 = 80 N',
            },
            {
              question: '¿Qué ley de Newton explica por qué un cohete se impulsa hacia arriba expulsando gases hacia abajo?',
              options: ['1ª Ley', '2ª Ley', '3ª Ley', 'Ley de Gravedad'],
              correct: 2,
              explanation: 'La 3ª ley (acción-reacción): los gases salen hacia abajo y el cohete sube',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'fis-m3',
      title: 'Módulo 3: Dinámica',
      lessons: [
{
          id: 'fis-3-1',
          title: 'Leyes de Newton',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Leyes de Newton

Contenido didáctico para leyes de newton.`,
          exercises: [
            {
              question: "¿Qué ley dice F = ma?",
              options: ["1ra Ley","2da Ley","3ra Ley","Ley de Gravitación"],
              correct: 1,
              explanation: "La 2da Ley de Newton establece F = ma",
            },
            {
              question: "Si la masa es 5 kg y la aceleración 4 m/s², ¿cuál es la fuerza?",
              options: ["9 N","20 N","1.25 N","0.8 N"],
              correct: 1,
              explanation: "F = ma = 5 × 4 = 20 N",
            },
            {
              question: "Acción y reacción son:",
              options: ["Igual dirección","Sentido opuesto","Misma magnitud","Todas"],
              correct: 3,
              explanation: "Pares acción-reacción: igual magnitud, misma dirección, sentido opuesto",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'fis-3-2',
          title: 'Fricción y Plano Inclinado',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Fricción y Plano Inclinado

Contenido didáctico para fricción y plano inclinado.`,
          exercises: [
            {
              question: "¿Cuál es la fórmula de fricción cinética?",
              options: ["μN","μmg","μma","N/μ"],
              correct: 0,
              explanation: "f_k = μ_k · N, donde N es la fuerza normal",
            },
            {
              question: "En un plano inclinado sin fricción, la aceleración es:",
              options: ["g","g senθ","g cosθ","g tanθ"],
              correct: 1,
              explanation: "a = g senθ para plano inclinado sin fricción",
            },
            {
              question: "Si μ = 0.3, N = 50 N, ¿cuál es la fuerza de fricción?",
              options: ["15 N","150 N","167 N","5 N"],
              correct: 0,
              explanation: "f = μN = 0.3 × 50 = 15 N",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'fis-3-3',
          title: 'Tensión y Poleas',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Tensión y Poleas

Contenido didáctico para tensión y poleas.`,
          exercises: [
            {
              question: "En una polea ideal, la tensión es:",
              options: ["Constante en toda la cuerda","Mayor en un extremo","Cero","Variable"],
              correct: 0,
              explanation: "En polea ideal sin masa, la tensión es constante",
            },
            {
              question: "Dos masas de 3 kg y 5 kg cuelgan de una polea. La aceleración es:",
              options: ["2.45 m/s²","9.8 m/s²","4.9 m/s²","0"],
              correct: 0,
              explanation: "a = (m₂-m₁)g/(m₁+m₂) = (5-3)(9.8)/8 = 2.45 m/s²",
            },
            {
              question: "La ventaja mecánica de una polea fija es:",
              options: ["1","2","3","0.5"],
              correct: 0,
              explanation: "Polea fija: VM = 1 (solo cambia dirección)",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
    {
      id: 'fis-m4',
      title: 'Módulo 4: Energía',
      lessons: [
{
          id: 'fis-4-1',
          title: 'Trabajo y Energía Cinética',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Trabajo y Energía Cinética

Contenido didáctico para trabajo y energía cinética.`,
          exercises: [
            {
              question: "W = F·d·cos θ. Si θ = 90°, el trabajo es:",
              options: ["Cero","F·d","Máximo","Negativo"],
              correct: 0,
              explanation: "cos 90° = 0, por lo tanto W = 0",
            },
            {
              question: "Energía cinética: ¿cuál es la fórmula?",
              options: ["mv²/2","mv","m²v/2","mv²"],
              correct: 0,
              explanation: "Ec = ½ mv²",
            },
            {
              question: "Si la velocidad se duplica, la energía cinética:",
              options: ["Se duplica","Se cuadruplica","Se mantiene","Se reduce a la mitad"],
              correct: 1,
              explanation: "Ec ∝ v², si v → 2v, entonces Ec → 4Ec",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'fis-4-2',
          title: 'Energía Potencial y Conservación',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Energía Potencial y Conservación

Contenido didáctico para energía potencial y conservación.`,
          exercises: [
            {
              question: "Energía potencial gravitatoria:",
              options: ["mgh","mv²/2","kx²/2","mgh/2"],
              correct: 0,
              explanation: "Ep = mgh",
            },
            {
              question: "Un objeto de 2 kg a 10 m de altura. Ep = ?",
              options: ["196 J","20 J","98 J","200 J"],
              correct: 0,
              explanation: "Ep = 2 × 9.8 × 10 = 196 J",
            },
            {
              question: "En caída libre sin fricción, se conserva:",
              options: ["Energía mecánica","Energía cinética","Energía potencial","Cantidad de movimiento"],
              correct: 0,
              explanation: "Se conserva la energía mecánica total (Ec + Ep)",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'fis-4-3',
          title: 'Potencia y Rendimiento',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Potencia y Rendimiento

Contenido didáctico para potencia y rendimiento.`,
          exercises: [
            {
              question: "Potencia = ?",
              options: ["W/t","F·d","m·a","W·t"],
              correct: 0,
              explanation: "Potencia = Trabajo / tiempo",
            },
            {
              question: "Si se realizan 500 J en 10 s, la potencia es:",
              options: ["50 W","500 W","5000 W","5 W"],
              correct: 0,
              explanation: "P = 500/10 = 50 W",
            },
            {
              question: "Rendimiento = ?",
              options: ["E útil / E total","E total / E útil","E útil × E total","E útil - E total"],
              correct: 0,
              explanation: "Rendimiento = Energía útil / Energía total",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
  ],
};

// ─── Química ──────────────────────────────────────────────────────────────────
const quimica: Course = {
  id: 'quimica',
  title: 'Química',
  description: 'Átomo, enlace, estequiometría y química orgánica desde cero.',
  icon: '⚗️',
  color: 'from-emerald-500 to-emerald-700',
  bgColor: 'bg-emerald-50',
  gradientProgress: 'from-emerald-400 via-teal-400 to-cyan-300',
  illustration: 'quimica',
  pattern: 'waves',
  modules: [
    {
      id: 'qui-m1',
      title: 'Módulo 1: Estructura Atómica',
      lessons: [
        {
          id: 'qui-1-1',
          title: 'El Átomo y sus Partículas',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## El Átomo

El **átomo** es la unidad mínima que conserva las propiedades de un elemento.

### Partículas subatómicas
| Partícula | Símbolo | Carga | Masa relativa | Ubicación |
|-----------|---------|-------|---------------|-----------|
| Protón | p⁺ | +1 | 1 | Núcleo |
| Neutrón | n⁰ | 0 | 1 | Núcleo |
| Electrón | e⁻ | -1 | ~0 | Orbitales |

### Números atómicos
- **Número atómico (Z)**: número de protones → identifica al elemento
- **Número másico (A)**: protones + neutrones → A = Z + N
- **Neutrones**: N = A - Z

### Notación atómica
> ᴬ_Z Símbolo

**Ejemplo**: ¹²_6 C → 6 protones, 6 neutrones, 6 electrones (átomo neutro)

### Isótopos
Átomos del mismo elemento con diferente número de neutrones.
¹H, ²H (deuterio), ³H (tritio) → mismo Z=1, distinto A`,
          exercises: [
            {
              question: 'Un átomo tiene Z=17 y A=35. ¿Cuántos neutrones tiene?',
              options: ['18', '17', '35', '52'],
              correct: 0,
              explanation: 'N = A - Z = 35 - 17 = 18 neutrones',
            },
            {
              question: '¿Qué partícula determina la identidad de un elemento?',
              options: ['Neutrón', 'Electrón', 'Protón', 'Ninguna'],
              correct: 2,
              explanation: 'El número de protones (número atómico Z) identifica al elemento',
            },
            {
              question: 'Dos átomos son isótopos si tienen el mismo número de:',
              options: ['Neutrones', 'Protones y neutrones', 'Protones pero diferente número de neutrones', 'Electrones y neutrones'],
              correct: 2,
              explanation: 'Los isótopos tienen el mismo Z (protones) pero diferente N (neutrones)',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'qui-1-2',
          title: 'Tabla Periódica',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Tabla Periódica

### Organización
- **Periodos** (filas): 7 filas horizontales. Los elementos en el mismo periodo tienen el mismo número de capas de electrones.
- **Grupos** (columnas): 18 columnas. Los elementos en el mismo grupo tienen la misma configuración de electrones de valencia.

### Grupos importantes
| Grupo | Nombre | Ejemplo |
|-------|--------|---------|
| 1 | Metales alcalinos | Na, K |
| 2 | Metales alcalinotérreos | Ca, Mg |
| 17 | Halógenos | F, Cl |
| 18 | Gases nobles | He, Ne |

### Tendencias periódicas
| Propiedad | Aumenta en periodo → | Aumenta en grupo ↑ |
|-----------|---------------------|---------------------|
| Radio atómico | Disminuye | Aumenta |
| Electronegatividad | Aumenta | Disminuye |
| Energía de ionización | Aumenta | Disminuye |`,
          exercises: [
            {
              question: '¿En qué grupo están los gases nobles?',
              options: ['Grupo 1', 'Grupo 17', 'Grupo 18', 'Grupo 2'],
              correct: 2,
              explanation: 'Los gases nobles (He, Ne, Ar, Kr, Xe) están en el Grupo 18 (VIIIA)',
            },
            {
              question: '¿Qué propiedad aumenta de izquierda a derecha en un periodo?',
              options: ['Radio atómico', 'Electronegatividad', 'Carácter metálico', 'Número de capas'],
              correct: 1,
              explanation: 'La electronegatividad aumenta hacia la derecha en un periodo',
            },
            {
              question: 'El cloro (Cl) pertenece al grupo de los:',
              options: ['Metales alcalinos', 'Gases nobles', 'Halógenos', 'Metales de transición'],
              correct: 2,
              explanation: 'El cloro (Z=17) es un halógeno, grupo 17',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'qui-1-3',
          title: 'Enlace Químico',
          duration: '17 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## Tipos de Enlace Químico

### Enlace Iónico
Transferencia de electrones entre **metal y no metal**.
- El metal pierde electrones → catión (+)
- El no metal gana electrones → anión (-)
- **Ejemplo**: Na⁺ + Cl⁻ → NaCl (sal de mesa)

### Enlace Covalente
Compartición de electrones entre **no metales**.
- **Simple**: 1 par compartido (H-H)
- **Doble**: 2 pares (O=O)
- **Triple**: 3 pares (N≡N)
- **Ejemplo**: H₂O, CO₂, CH₄

### Enlace Metálico
Entre **metales**: electrones forman una "nube" que fluye libremente.
- Explica la conductividad eléctrica y térmica de los metales

### Regla del Octeto
Los átomos tienden a tener **8 electrones** en su capa de valencia (como los gases nobles).`,
          exercises: [
            {
              question: '¿Qué tipo de enlace se forma entre Na y Cl?',
              options: ['Covalente polar', 'Iónico', 'Metálico', 'Covalente apolar'],
              correct: 1,
              explanation: 'Na es metal y Cl es no metal → transfieren electrones → enlace iónico',
            },
            {
              question: '¿Cuántos pares de electrones comparte el triple enlace del N₂?',
              options: ['1', '2', '3', '6'],
              correct: 2,
              explanation: 'El triple enlace (N≡N) comparte 3 pares de electrones (6 electrones)',
            },
            {
              question: '¿Qué propiedad explica el enlace metálico?',
              options: ['Fragilidad', 'Conductividad eléctrica', 'Alta electronegatividad', 'Carácter no metálico'],
              correct: 1,
              explanation: 'La nube de electrones libres en el enlace metálico permite conducir electricidad',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'qui-m2',
      title: 'Módulo 2: Estequiometría',
      lessons: [
        {
          id: 'qui-2-1',
          title: 'La Mole y Masa Molar',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## La Mole

### Definición
**1 mole = 6.022 × 10²³ partículas** (Número de Avogadro)

La mole es simplemente un número, como "una docena = 12".

### Masa Molar
La masa molar (M) es la masa de 1 mol de sustancia en **g/mol**.
Equivale al peso atómico o molecular de la tabla periódica.

**Ejemplos**:
- H₂: M = 2(1) = 2 g/mol
- H₂O: M = 2(1) + 16 = 18 g/mol
- NaCl: M = 23 + 35.5 = 58.5 g/mol
- CO₂: M = 12 + 2(16) = 44 g/mol

### Conversiones
> **n = m / M** (moles = masa / masa molar)
> **m = n × M** (masa = moles × masa molar)

**Ejemplo**: ¿Cuántos moles hay en 36 g de H₂O?
n = 36 / 18 = **2 moles**`,
          exercises: [
            {
              question: '¿Cuántos moles hay en 44 g de CO₂? (M=44 g/mol)',
              options: ['1 mol', '2 mol', '0.5 mol', '44 mol'],
              correct: 0,
              explanation: 'n = m/M = 44/44 = 1 mol',
            },
            {
              question: '¿Qué masa tiene 3 moles de H₂O? (M=18 g/mol)',
              options: ['54 g', '18 g', '6 g', '21 g'],
              correct: 0,
              explanation: 'm = n×M = 3×18 = 54 g',
            },
            {
              question: '¿Cuántas moléculas hay en 2 moles de O₂?',
              options: ['1.2×10²⁴', '6×10²³', '3×10²³', '2×10²³'],
              correct: 0,
              explanation: '2 × 6.022×10²³ = 1.2044×10²⁴ moléculas',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'qui-m3',
      title: 'Módulo 3: Enlace Químico',
      lessons: [
{
          id: 'qui-3-1',
          title: 'Enlace Iónico',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Enlace Iónico

Contenido didáctico para enlace iónico.`,
          exercises: [
            {
              question: "¿Qué tipo de elementos forman enlaces iónicos?",
              options: ["Metal + No metal","No metal + No metal","Metal + Metal","Metaloide + Metaloide"],
              correct: 0,
              explanation: "Metal cede electrones, No metal acepta → enlace iónico",
            },
            {
              question: "¿Cuál de los siguientes es un compuesto iónico?",
              options: ["NaCl","CO₂","H₂O","CH₄"],
              correct: 0,
              explanation: "NaCl es iónico (Na⁺Cl⁻)",
            },
            {
              question: "Los compuestos iónicos en agua:",
              options: ["Conducen electricidad","No se disuelven","Son gases","Son ácidos"],
              correct: 0,
              explanation: "Los iones se disocian en agua y conducen electricidad",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'qui-3-2',
          title: 'Enlace Covalente',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Enlace Covalente

Contenido didáctico para enlace covalente.`,
          exercises: [
            {
              question: "En el enlace covalente los átomos:",
              options: ["Comparten electrones","Transfieren electrones","Pierden electrones","Ganan electrones"],
              correct: 0,
              explanation: "Covalente = compartición de electrones",
            },
            {
              question: "¿Cuántos enlaces forma el carbono?",
              options: ["4","2","3","1"],
              correct: 0,
              explanation: "C tiene 4 electrones de valencia, forma 4 enlaces",
            },
            {
              question: "El enlace covalente doble tiene:",
              options: ["2 pares de electrones","1 par de electrones","3 pares de electrones","4 pares de electrones"],
              correct: 0,
              explanation: "Enlace doble = 2 pares (4 electrones) compartidos",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'qui-3-3',
          title: 'Enlace Metálico',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Enlace Metálico

Contenido didáctico para enlace metálico.`,
          exercises: [
            {
              question: "El modelo del enlace metálico se llama:",
              options: ["Mar de electrones","Nube de electrones","Par solitario","Puente de hidrógeno"],
              correct: 0,
              explanation: "Modelo del \"mar de electrones\" deslocalizados",
            },
            {
              question: "Los metales conducen electricidad porque:",
              options: ["Tienen electrones libres","Son duros","Son brillantes","Tienen baja densidad"],
              correct: 0,
              explanation: "Los electrones deslocalizados permiten la conducción",
            },
            {
              question: "¿Cuál es el metal más conductor?",
              options: ["Plata","Oro","Cobre","Aluminio"],
              correct: 0,
              explanation: "La plata (Ag) es el mejor conductor",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
    {
      id: 'qui-m4',
      title: 'Módulo 4: Reacciones Químicas',
      lessons: [
{
          id: 'qui-4-1',
          title: 'Tipos de Reacciones',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Tipos de Reacciones

Contenido didáctico para tipos de reacciones.`,
          exercises: [
            {
              question: "Síntesis: A + B → ?",
              options: ["AB","A + B","A","B"],
              correct: 0,
              explanation: "Reacción de síntesis: A + B → AB",
            },
            {
              question: "¿Qué tipo de reacción es AB → A + B?",
              options: ["Descomposición","Síntesis","Sustitución","Combustión"],
              correct: 0,
              explanation: "Descomposición: un compuesto se divide en sus elementos",
            },
            {
              question: "La combustión requiere:",
              options: ["Oxígeno","Agua","Nitrógeno","Hidrógeno"],
              correct: 0,
              explanation: "Combustión = reacción con O₂, produce CO₂ + H₂O + energía",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'qui-4-2',
          title: 'Balanceo de Ecuaciones',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Balanceo de Ecuaciones

Contenido didáctico para balanceo de ecuaciones.`,
          exercises: [
            {
              question: "Balancea: H₂ + O₂ → H₂O. Coeficiente del H₂O:",
              options: ["2","1","3","4"],
              correct: 0,
              explanation: "2H₂ + O₂ → 2H₂O",
            },
            {
              question: "En 2H₂ + O₂ → 2H₂O, ¿cuántos átomos de H hay?",
              options: ["4","2","1","6"],
              correct: 0,
              explanation: "2H₂ = 4 átomos de hidrógeno",
            },
            {
              question: "¿Qué se conserva en una reacción química?",
              options: ["Masa","Volumen","Densidad","Temperatura"],
              correct: 0,
              explanation: "Ley de conservación de la masa (Lavoisier)",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'qui-4-3',
          title: 'Estequiometría',
          duration: '18 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Estequiometría

Contenido didáctico para estequiometría.`,
          exercises: [
            {
              question: "¿Qué permite la estequiometría?",
              options: ["Calcular cantidades","Medir pH","Identificar gases","Medir temperatura"],
              correct: 0,
              explanation: "Estequiometría: cálculos cuantitativos de masa/mol en reacciones",
            },
            {
              question: "1 mol de cualquier gas en CNTP ocupa:",
              options: ["22.4 L","1 L","100 L","6.02 L"],
              correct: 0,
              explanation: "Volumen molar = 22.4 L en CNTP",
            },
            {
              question: "1 mol = ? partículas",
              options: ["6.02×10²³","6.02×10²²","6.02×10²⁴","6.02×10²¹"],
              correct: 0,
              explanation: "Número de Avogadro = 6.02×10²³",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
  ],
};

// ─── Historia ─────────────────────────────────────────────────────────────────
const historia: Course = {
  id: 'historia',
  title: 'Historia',
  description: 'Historia del Perú y Universal desde los orígenes hasta el siglo XX.',
  icon: '🏛️',
  color: 'from-amber-500 to-amber-700',
  bgColor: 'bg-amber-50',
  gradientProgress: 'from-amber-400 via-yellow-400 to-orange-300',
  illustration: 'historia',
  pattern: 'grid',
  modules: [
    {
      id: 'his-m1',
      title: 'Módulo 1: Perú Prehispánico',
      lessons: [
        {
          id: 'his-1-1',
          title: 'Culturas Preincaicas',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Culturas Preincaicas del Perú

### Horizonte Temprano (1000 a.C. – 100 d.C.)
**Chavín de Huántar** (900-200 a.C.)
- Primera gran civilización andina
- Centro ceremonial en la sierra de Áncash
- Arte caracterizado por figuras zoomorfas (felinos, serpientes)

### Período Intermedio Temprano (100 – 700 d.C.)
**Paracas**: Costa sur. Famosos por sus textiles de colores y trepanaciones craneanas.

**Nasca**: Costa sur. Famosas **Líneas de Nazca** — geoglifos gigantes visibles solo desde el aire.

**Mochica (Moche)**: Costa norte. Maestros de la cerámica retrato. Huacas del Sol y de la Luna.

### Horizonte Medio (600 – 1000 d.C.)
**Tiahuanaco**: Altiplano boliviano. Monolitos y la Puerta del Sol.

**Wari**: Sierra ayacuchana. Primer estado expansivo, precursor del Tawantinsuyu.

### Período Intermedio Tardío (1000 – 1400 d.C.)
**Chimú**: Norte. Capital Chan Chan (ciudad de adobe más grande del mundo precolombino).`,
          exercises: [
            {
              question: '¿Cuál es la cultura conocida por las Líneas de Nazca?',
              options: ['Chavín', 'Mochica', 'Nasca', 'Chimú'],
              correct: 2,
              explanation: 'La cultura Nasca (costa sur) creó los famosos geoglifos conocidos como Líneas de Nazca',
            },
            {
              question: '¿Cuál fue el primer gran estado expansivo que antecedió al Imperio Inca?',
              options: ['Chavín', 'Wari', 'Paracas', 'Tiahuanaco'],
              correct: 1,
              explanation: 'La cultura Wari (Horizonte Medio) fue el primer estado expansivo andino',
            },
            {
              question: '¿Por qué fue famosa la cultura Paracas?',
              options: ['Por sus líneas gigantes', 'Por sus textiles y trepanaciones', 'Por la cerámica retrato', 'Por Chan Chan'],
              correct: 1,
              explanation: 'Paracas destacó por sus textiles de colores brillantes y las prácticas de trepanación craneana',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'his-1-2',
          title: 'El Imperio Inca',
          duration: '18 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## El Imperio Inca (Tawantinsuyu)

### Fundación y expansión
- Fundado hacia 1438 por **Pachacútec**, el gran reformador
- En náhuatl: "Tawantinsuyu" = Las Cuatro Regiones
- Cuatro suyos: Chinchaysuyo (norte), Antisuyo (este), Collasuyo (sur), Contisuyo (oeste)

### Organización política
- **Sapa Inca**: gobernante máximo, hijo del Sol (Inti)
- **Auqui**: heredero del Sapa Inca
- **Apu**: gobernador de cada suyo
- **Curaca**: jefe local

### Sistema económico
| Sistema | Descripción |
|---------|-------------|
| Mita | Trabajo obligatorio para el Estado |
| Ayni | Trabajo colectivo comunitario |
| Minka | Trabajo para la comunidad |

### Logros e innovaciones
- **Red de caminos (Qhapaq Ñan)**: 40,000 km de caminos
- **Quipus**: sistema de registro con cuerdas anudadas
- **Terrazas (andenes)**: agricultura en zonas montañosas
- Capital: **Cusco** (ombligo del mundo)`,
          exercises: [
            {
              question: '¿Qué significa "Tawantinsuyu"?',
              options: ['La Ciudad del Sol', 'Las Cuatro Regiones', 'El Gran Imperio', 'Tierra de los Incas'],
              correct: 1,
              explanation: 'Tawantinsuyu significa "Las Cuatro Regiones" en quechua',
            },
            {
              question: '¿Qué Inca fue conocido como el gran reformador que consolidó el Tawantinsuyu?',
              options: ['Manco Cápac', 'Huayna Cápac', 'Pachacútec', 'Atahualpa'],
              correct: 2,
              explanation: 'Pachacútec (1438-1471) fue el gran reformador que transformó Cusco y expandió el imperio',
            },
            {
              question: '¿Para qué servían los quipus?',
              options: ['Para construir caminos', 'Como sistema de registro y contabilidad', 'Para comunicarse con el sol', 'Como armas de guerra'],
              correct: 1,
              explanation: 'Los quipus eran cuerdas anudadas usadas como sistema de registro numérico y administrativo',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'his-1-3',
          title: 'Conquista y Virreinato',
          duration: '20 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## La Conquista Española del Perú

### Antecedentes
- Guerra civil entre **Huáscar y Atahualpa** debilitó al Imperio
- Llegada de **Francisco Pizarro** en 1532

### La Conquista (1532-1535)
1. **Captura de Atahualpa** en Cajamarca (noviembre 1532)
2. El Inca ofreció llenar un cuarto de oro y dos de plata como rescate
3. A pesar del rescate, Atahualpa fue ejecutado en 1533
4. **Fundación de Lima**: 18 de enero de 1535 (Ciudad de los Reyes)

## El Virreinato del Perú (1542-1821)

### Organización
- **Virrey**: máxima autoridad en nombre del Rey de España
- **Audiencia**: tribunal de justicia
- **Cabildos**: gobierno municipal

### Mita minera
Sistema de trabajo forzado. Las minas de **Potosí** (plata) y **Huancavelica** (mercurio) fueron las más importantes.

### Sociedad colonial
| Estamento | Descripción |
|-----------|-------------|
| Peninsulares | Españoles nacidos en España |
| Criollos | Españoles nacidos en América |
| Mestizos | Hijos de español e indígena |
| Indígenas | Pueblos originarios |
| Esclavos | Africanos traídos forzosamente |`,
          exercises: [
            {
              question: '¿Dónde fue capturado Atahualpa por los españoles?',
              options: ['Lima', 'Cusco', 'Cajamarca', 'Potosí'],
              correct: 2,
              explanation: 'La captura de Atahualpa ocurrió en Cajamarca en noviembre de 1532',
            },
            {
              question: '¿En qué año se fundó Lima?',
              options: ['1532', '1535', '1542', '1521'],
              correct: 1,
              explanation: 'Lima fue fundada el 18 de enero de 1535 por Francisco Pizarro como "Ciudad de los Reyes"',
            },
            {
              question: '¿Cómo se llamaba la máxima autoridad española en el Virreinato?',
              options: ['Curaca', 'Sapa Inca', 'Virrey', 'Peninsular'],
              correct: 2,
              explanation: 'El Virrey era el representante del Rey de España y la máxima autoridad en el Virreinato',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
      timelineEvents: [
        {
          id: 'his-tl-1',
          date: '900 a.C.',
          title: 'Chavín de Huántar',
          description: 'Primera gran civilización andina. Centro ceremonial en la sierra de Áncash con arte zoomorfo (felinos, serpientes). Considerada la "cultura matriz" del Perú antiguo.',
          cause: 'Fusión de tradiciones selváticas y costeñas. Necesidad de un centro ceremonial unificador en los Andes.',
          consequence: 'Estableció patrones artísticos y religiosos que influyeron en todas las culturas andinas posteriores.',
          nextConnection: 'Chavín sentó las bases culturales que florecerían en las civilizaciones regionales como Paracas y Nasca.',
          icon: '🏛️',
        },
        {
          id: 'his-tl-2',
          date: '700 a.C.',
          title: 'Cultura Paracas',
          description: 'Costa sur del Perú. Famosos por sus textiles de colores brillantes y avanzadas trepanaciones craneanas (cirugía ritual).',
          cause: 'Influencia chavín combinada con recursos marinos y algodón nativo de la costa para desarrollar textiles únicos.',
          consequence: 'Perfeccionamiento de técnicas textiles (500+ colores) y médicas que superaban a sus contemporáneos.',
          nextConnection: 'La tradición textil Paracas influiría en la cultura Nasca, su vecina y sucesora.',
          icon: '🧵',
        },
        {
          id: 'his-tl-3',
          date: '100 d.C.',
          title: 'Nasca y las Líneas',
          description: 'Costa sur. Creación de los geoglifos gigantes (Líneas de Nazca), visibles solo desde el aire. Maestros de la cerámica policromada.',
          cause: 'Necesidad de marcar ciclos astronómicos y rituales de agua en una región desértica extrema.',
          consequence: 'Legado de 300+ geoglifos que siguen siendo un misterio arqueológico. Declive por sequía extrema (600 d.C.).',
          nextConnection: 'Mientras Nasca declinaba, en el norte florecía la cultura Mochica, contemporánea pero distinta.',
          icon: '🔺',
        },
        {
          id: 'his-tl-4',
          date: '100 d.C.',
          title: 'Cultura Mochica',
          description: 'Costa norte. Maestros de la cerámica retrato. Constructores de las Huacas del Sol y de la Luna. Primer sistema de irrigación a gran escala.',
          cause: 'Fértiles valles costeros del norte. Organización política teocrática-militar que permitió obras hidráulicas monumentales.',
          consequence: 'Crearon el primer sistema de canales de irrigación de Sudamérica. Su cerámica documenta la vida cotidiana con realismo único.',
          nextConnection: 'La tradición hidráulica mochica sería heredada por los Chimú, que construirían la ciudad de barro más grande del mundo.',
          icon: '🏺',
        },
        {
          id: 'his-tl-5',
          date: '600 d.C.',
          title: 'Tiahuanaco-Wari',
          description: 'Horizonte Medio. Wari (Ayacucho) creó el primer estado expansivo andino. Tiahuanaco (altiplano) construyó la Puerta del Sol.',
          cause: 'Necesidad de integrar regiones productivas diversas (costa, sierra, selva) para gestionar recursos complementarios.',
          consequence: 'Primera unificación política del mundo andino. Wari expandió su modelo administrativo a regiones distantes.',
          nextConnection: 'El modelo de Estado expansivo Wari fue el antecedente directo del sistema administrativo inca.',
          icon: '🗿',
        },
        {
          id: 'his-tl-6',
          date: '1000 d.C.',
          title: 'Reino Chimú',
          description: 'Capital: Chan Chan (ciudad de adobe más grande de América precolombina). Máxima expresión de la ingeniería hidráulica prehispánica.',
          cause: 'Colapso Wari permitió el surgimiento de reinos regionales. Chimú consolidó el norte con una red de ciudades.',
          consequence: 'Crearon el imperio más grande del Perú preinca (1,000 km de costa). Su red de caminos y almacenes fue adoptada por los incas.',
          nextConnection: 'Los incas conquistarían Chimú en 1470, incorporando su infraestructura y conocimientos hidráulicos al Tawantinsuyu.',
          icon: '🏯',
        },
      ],
    },
    {
      id: 'his-m2',
      title: 'Módulo 2: República',
      lessons: [
        {
          id: 'his-2-1',
          title: 'Independencia del Perú',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## Independencia del Perú

### Causas
**Externas**: Revolución Francesa (1789), Independencia de EE.UU. (1776), Invasión de Napoleón a España (1808)
**Internas**: Desigualdad social, monopolio comercial, rebeliones previas (Túpac Amaru II, 1780)

### La Independencia
- **Llegada de San Martín**: Desembarco en Paracas, 1820
- **Proclamación**: 28 de julio de 1821 en Lima
- **Consolidación**: Batalla de Ayacucho, 9 de diciembre de 1824 (Sucre vs Laserna)

### Simón Bolívar
Libertador de Venezuela, Colombia, Ecuador, Perú y Bolivia.
Convocó el **Congreso de Panamá** (1826) para unir América Latina.`,
          exercises: [
            {
              question: '¿Cuándo se proclamó la Independencia del Perú?',
              options: ['9 de diciembre de 1824', '28 de julio de 1821', '18 de enero de 1535', '8 de noviembre de 1820'],
              correct: 1,
              explanation: 'La Independencia del Perú fue proclamada el 28 de julio de 1821 por José de San Martín',
            },
            {
              question: '¿Qué batalla consolidó la Independencia de Perú?',
              options: ['Batalla de Junín', 'Batalla de Cajamarca', 'Batalla de Ayacucho', 'Batalla de Boyacá'],
              correct: 2,
              explanation: 'La Batalla de Ayacucho (9 de diciembre de 1824) fue la última gran batalla de la Independencia sudamericana',
            },
            {
              question: '¿Cuál fue una causa interna de la Independencia?',
              options: ['Invasión napoleónica', 'Revolución Francesa', 'Rebelión de Túpac Amaru II', 'Independencia de EE.UU.'],
              correct: 2,
              explanation: 'La rebelión de Túpac Amaru II (1780) fue una importante causa interna de la Independencia del Perú',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
      timelineEvents: [
        {
          id: 'his-tl-7',
          date: '1780',
          title: 'Rebelión de Túpac Amaru II',
          description: 'José Gabriel Condorcanqui lideró la mayor rebelión indígena del Virreinato. Exigía el fin de la mita, el reparto y los abusos coloniales.',
          cause: 'Siglos de explotación indígena. Las reformas borbónicas aumentaron impuestos y recortaron privilegios de la élite criolla.',
          consequence: 'La rebelión fue derrotada y Túpac Amaru ejecutado brutalmente, pero sembró la semilla de la Independencia.',
          nextConnection: '40 años después, el descontento criollo e indígena estallaría con la llegada de San Martín.',
          icon: '⚔️',
        },
        {
          id: 'his-tl-8',
          date: '28 jul 1821',
          title: 'Proclamación de la Independencia',
          description: 'José de San Martín proclamó la Independencia del Perú en la Plaza Mayor de Lima. Nacía la República Peruana.',
          cause: 'Crisis del Imperio Español tras la invasión napoleónica. Las guerras de Independencia en América del Sur debilitaron el control virreinal.',
          consequence: 'Inicio de la República. Sin embargo, el virrey seguía controlando la sierra. La independencia no estaba asegurada.',
          nextConnection: 'San Martín se retiró y dejó el camino libre para que Bolívar culminara la liberación.',
          icon: '📜',
        },
        {
          id: 'his-tl-9',
          date: '9 dic 1824',
          title: 'Batalla de Ayacucho',
          description: 'Antonio José de Sucre derrotó al último virrey La Serna. Fue la batalla decisiva que consolidó la Independencia de Perú y Sudamérica.',
          cause: 'La guerra continuaba pese a la proclamación de 1821. Las fuerzas realistas controlaban la sierra. Simón Bolívar asumió el liderazgo.',
          consequence: 'Fin del dominio español en Sudamérica. Se firmó la Capitulación de Ayacucho, que puso fin a 300 años de virreinato.',
          nextConnection: 'El Perú independiente enfrentó el desafío de construir una república estable entre caudillismos y guerras.',
          icon: '🎯',
        },
        {
          id: 'his-tl-10',
          date: '1840-1879',
          title: 'Era del Guano',
          description: 'Perú vivió un boom económico gracias a la exportación de guano (fertilizante natural). Se construyeron ferrocarriles y modernizó Lima.',
          cause: 'Descubrimiento del guano como fertilizante. Demanda europea por alimentos. Perú tenía el monopolio mundial.',
          consequence: 'Modernización acelerada pero dependencia económica. El Estado se endeudó y malgastó la riqueza. Base del "problema del guano".',
          nextConnection: 'La ilusión del guano terminó abruptamente con la Guerra del Pacífico, que expuso la fragilidad del país.',
          icon: '💰',
        },
        {
          id: 'his-tl-11',
          date: '1879-1883',
          title: 'Guerra del Pacífico',
          description: 'Conflicto entre Perú y Bolivia contra Chile por el salitre. Chile ocupó Lima y Perú perdió Tarapacá y Arica.',
          cause: 'Disputa territorial por riquezas salitreras en el desierto de Atacama. Tratado secreto Perú-Bolivia. Crisis diplomática.',
          consequence: 'Pérdida de territorios del sur. Destrucción de la infraestructura. Ocupación de Lima. Inicio de la Reconstrucción Nacional.',
          nextConnection: 'La derrota generó un movimiento de reconstrucción y modernización del Estado que caracterizaría la República Aristocrática.',
          icon: '⚡',
        },
        {
          id: 'his-tl-12',
          date: '1895-1919',
          title: 'República Aristocrática',
          description: 'Período de estabilidad política bajo el Partido Civil. Gobiernos civiles, crecimiento económico basado en exportaciones (azúcar, algodón, caucho) y modernización de Lima.',
          cause: 'Cansancio de la guerra y el caudillismo militar. Élite civil organizada en el Partido Civil buscó estabilidad y progreso.',
          consequence: 'Modernización urbana (Lima se transformó), crecimiento de la clase media, pero persistencia de la desigualdad y el gamonalismo rural.',
          nextConnection: 'Las tensiones sociales acumuladas estallarían en el Oncenio de Leguía y el surgimiento de movimientos populares como el APRA.',
          icon: '🏛️',
        },
      ],
      },
  ],
};

// ─── Comunicación ─────────────────────────────────────────────────────────────
const comunicacion: Course = {
  id: 'comunicacion',
  title: 'Comunicación',
  description: 'Comprensión lectora, redacción académica y literatura peruana.',
  icon: '📝',
  color: 'from-violet-500 to-violet-700',
  bgColor: 'bg-violet-50',
  gradientProgress: 'from-violet-400 via-purple-400 to-pink-300',
  illustration: 'comunicacion',
  pattern: 'waves',
  modules: [
    {
      id: 'com-m1',
      title: 'Módulo 1: Comprensión Lectora',
      lessons: [
        {
          id: 'com-1-1',
          title: 'Tipos de Texto y Estructura',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Tipos de Texto

### Según la intención comunicativa
| Tipo | Propósito | Ejemplo |
|------|-----------|---------|
| **Narrativo** | Contar hechos o historia | Novela, cuento |
| **Descriptivo** | Caracterizar objetos/personas | Retrato, paisaje |
| **Expositivo** | Informar/explicar | Artículo científico |
| **Argumentativo** | Convencer con razones | Ensayo, editorial |
| **Instructivo** | Guiar acciones | Manual, receta |

### Estructura del texto expositivo
1. **Introducción**: presenta el tema
2. **Desarrollo**: explica con datos, ejemplos, comparaciones
3. **Conclusión**: sintetiza las ideas principales

### Propiedades del texto
- **Coherencia**: unidad temática (todas las ideas sobre el mismo tema)
- **Cohesión**: conectores y referencias que unen las oraciones
- **Adecuación**: lenguaje apropiado al receptor y contexto`,
          exercises: [
            {
              question: '¿Qué tipo de texto tiene como propósito convencer al lector?',
              options: ['Narrativo', 'Descriptivo', 'Argumentativo', 'Instructivo'],
              correct: 2,
              explanation: 'El texto argumentativo busca persuadir al lector mediante razones y evidencias',
            },
            {
              question: '¿Cuál es la propiedad textual que se refiere a la unidad temática?',
              options: ['Cohesión', 'Adecuación', 'Coherencia', 'Corrección'],
              correct: 2,
              explanation: 'La coherencia es la propiedad que garantiza que todas las ideas del texto giren en torno al mismo tema',
            },
            {
              question: 'Una receta de cocina es un ejemplo de texto:',
              options: ['Narrativo', 'Argumentativo', 'Expositivo', 'Instructivo'],
              correct: 3,
              explanation: 'La receta de cocina es un texto instructivo porque guía paso a paso las acciones a realizar',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'com-1-2',
          title: 'Idea Principal e Inferencias',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Idea Principal e Inferencias

### Idea principal
Es el mensaje más importante del texto, aquello de lo que trata fundamentalmente.

**¿Cómo identificarla?**
1. Pregúntate: "¿De qué trata este texto?"
2. Suele estar en la primera o última oración del párrafo
3. Todas las demás ideas (secundarias) la apoyan o desarrollan

### Ideas secundarias
Son las que dan detalles, ejemplos o argumentos que sustentan la idea principal.

### Tipos de inferencias
| Tipo | Descripción |
|------|-------------|
| **Deductiva** | De lo general a lo particular |
| **Inductiva** | De lo particular a lo general |
| **Por analogía** | Basada en semejanzas |
| **Causal** | Causa-efecto |

### Estrategia para preguntas de comprensión
1. Lee el texto completo una vez
2. Identifica el tema general
3. Para cada pregunta, regresa al texto y localiza la evidencia
4. Nunca respondas desde tu opinión personal, solo desde el texto`,
          exercises: [
            {
              question: 'La idea principal de un párrafo se puede encontrar principalmente:',
              options: ['Solo en el título', 'En la primera o última oración', 'En los ejemplos', 'Solo en los conectores'],
              correct: 1,
              explanation: 'La idea principal suele ubicarse en la oración temática, generalmente al inicio o al final del párrafo',
            },
            {
              question: '¿Qué es una inferencia?',
              options: ['Copiar literalmente el texto', 'Una conclusión obtenida implícitamente del texto', 'Una opinión personal', 'Un tipo de conector'],
              correct: 1,
              explanation: 'Una inferencia es información que no está expresada directamente pero que se puede deducir del contenido del texto',
            },
            {
              question: 'Las ideas secundarias sirven para:',
              options: ['Contradecir la idea principal', 'Desarrollar y apoyar la idea principal', 'Introducir un nuevo tema', 'Cerrar el texto'],
              correct: 1,
              explanation: 'Las ideas secundarias aportan detalles, ejemplos y argumentos que desarrollan la idea principal',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'com-m2',
      title: 'Módulo 2: Redacción',
      lessons: [
        {
          id: 'com-2-1',
          title: 'El Párrafo y sus Partes',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## El Párrafo

### Definición
El **párrafo** es la unidad básica de la redacción. Agrupa oraciones relacionadas con una misma idea.

### Partes del párrafo
1. **Oración tópica** (oración temática): expresa la idea principal del párrafo
2. **Oraciones de desarrollo**: aportan evidencias, ejemplos, explicaciones
3. **Oración de cierre**: concluye la idea o hace transición al siguiente párrafo

### Ejemplo:
> "La lectura es el pilar del conocimiento." ← Oración tópica
> "Diversos estudios demuestran que leer 30 minutos al día mejora la comprensión y el vocabulario." ← Desarrollo
> "Por ello, cultivar el hábito lector desde temprana edad es fundamental para el éxito académico." ← Cierre

### Extensión ideal
Un párrafo de 5 a 10 oraciones es lo más adecuado para el texto académico.

### Tipos de párrafos
- **De introducción**: presenta el tema
- **De desarrollo**: explora el tema con argumentos
- **De conclusión**: sintetiza y cierra`,
          exercises: [
            {
              question: '¿Qué función tiene la oración tópica?',
              options: ['Dar ejemplos', 'Expresar la idea principal del párrafo', 'Cerrar el párrafo', 'Conectar párrafos'],
              correct: 1,
              explanation: 'La oración tópica enuncia la idea central del párrafo y orienta el contenido de las demás oraciones',
            },
            {
              question: 'Un párrafo académico bien escrito tiene aproximadamente:',
              options: ['1-2 oraciones', '3-4 oraciones', '5-10 oraciones', 'Más de 15 oraciones'],
              correct: 2,
              explanation: 'El párrafo académico ideal tiene entre 5 y 10 oraciones, suficientes para desarrollar la idea sin excederse',
            },
            {
              question: '¿Qué aportan las oraciones de desarrollo al párrafo?',
              options: ['Introducen el tema nuevo', 'Presentan la idea principal', 'Dan evidencias y ejemplos que sustentan la idea tópica', 'Resumen el texto'],
              correct: 2,
              explanation: 'Las oraciones de desarrollo argumentan, ejemplifican y profundizan en la idea expresada por la oración tópica',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'his-m3',
      title: 'Módulo 3: La República Peruana',
      lessons: [
{
          id: 'his-3-1',
          title: 'Inicios de la República',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Inicios de la República

Contenido didáctico para inicios de la república.`,
          exercises: [
            {
              question: "¿Quién fue el primer presidente del Perú?",
              options: ["José de la Riva-Agüero","Simón Bolívar","José de San Martín","Andrés de Santa Cruz"],
              correct: 0,
              explanation: "Riva-Agüero fue el primer presidente en 1823",
            },
            {
              question: "¿Qué país invadió Perú en 1879?",
              options: ["Chile","Ecuador","Colombia","Bolivia"],
              correct: 0,
              explanation: "Guerra del Pacífico: Chile vs Perú y Bolivia",
            },
            {
              question: "¿Quién gobernó durante la reconstrucción nacional?",
              options: ["Andrés Avelino Cáceres","Ramón Castilla","Manuel Pardo","Nicolás de Piérola"],
              correct: 0,
              explanation: "Cáceres lideró la reconstrucción tras la Guerra del Pacífico",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'his-3-2',
          title: 'El Oncenio de Leguía',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## El Oncenio de Leguía

Contenido didáctico para el oncenio de leguía.`,
          exercises: [
            {
              question: "¿Qué presidente gobernó 11 años (1919-1930)?",
              options: ["Augusto B. Leguía","Óscar R. Benavides","Manuel Prado","José Luis Bustamante"],
              correct: 0,
              explanation: "Oncenio de Leguía: 1919-1930",
            },
            {
              question: "¿Qué gran obra se realizó en el Oncenio?",
              options: ["Carretera Central","Ferrocarril Central","Puerto del Callao","Palacio de Gobierno"],
              correct: 0,
              explanation: "Carretera Central conectó la sierra con la costa",
            },
            {
              question: "Leguía conmemoró el centenario de:",
              options: ["La Independencia","La conquista","La república","El incanato"],
              correct: 0,
              explanation: "Centenario de la Independencia (1921-1924)",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'his-3-3',
          title: 'La Guerra con Ecuador 1941',
          duration: '12 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## La Guerra con Ecuador 1941

Contenido didáctico para la guerra con ecuador 1941.`,
          exercises: [
            {
              question: "¿En qué año fue la guerra Perú-Ecuador?",
              options: ["1941","1939","1945","1935"],
              correct: 0,
              explanation: "Guerra de 1941, finalizada con el Protocolo de Río",
            },
            {
              question: "¿Qué Protocolo puso fin al conflicto?",
              options: ["Protocolo de Río de Janeiro","Tratado de Lima","Acuerdo de Brasilia","Pacto de Cartagena"],
              correct: 0,
              explanation: "Protocolo de Río de Janeiro (1942)",
            },
            {
              question: "¿Qué río fue parte de la disputa?",
              options: ["Río Cenepa","Río Amazonas","Río Ucayali","Río Marañón"],
              correct: 0,
              explanation: "Río Cenepa fue escenario del conflicto de 1995",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
    {
      id: 'his-m4',
      title: 'Módulo 4: Perú Contemporáneo',
      lessons: [
{
          id: 'his-4-1',
          title: 'Gobierno de Velasco',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Gobierno de Velasco

Contenido didáctico para gobierno de velasco.`,
          exercises: [
            {
              question: "¿Qué tipo de gobierno fue el de Velasco?",
              options: ["Reforma radical","Democracia liberal","Dictadura militar","Monarquía"],
              correct: 2,
              explanation: "Velasco lideró un gobierno militar revolucionario (1968-1975)",
            },
            {
              question: "¿Qué reforma agraria hizo Velasco?",
              options: ["Expropió latifundios","Privatizó tierras","Creó minifundios","Importó alimentos"],
              correct: 0,
              explanation: "Reforma agraria: expropiación de grandes haciendas",
            },
            {
              question: "¿Qué medio de comunicación estatizó Velasco?",
              options: ["Periódicos","Radio","Televisión","Teléfono"],
              correct: 0,
              explanation: "Estatizó la prensa escrita en 1974",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'his-4-2',
          title: 'Conflicto Armado Interno',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Conflicto Armado Interno

Contenido didáctico para conflicto armado interno.`,
          exercises: [
            {
              question: "¿Qué grupo inició la lucha armada en 1980?",
              options: ["Sendero Luminoso","MRTA","Túpac Amaru","FARC"],
              correct: 0,
              explanation: "Sendero Luminoso inició en 1980 en Ayacucho",
            },
            {
              question: "¿Qué presidente capturó a Abimael Guzmán?",
              options: ["Alberto Fujimori","Alan García","Fernando Belaúnde","Alejandro Toledo"],
              correct: 0,
              explanation: "Captura de Guzmán en 1992 durante el gobierno de Fujimori",
            },
            {
              question: "¿Cuántas víctimas dejó el conflicto?",
              options: ["~70,000","~10,000","~200,000","~5,000"],
              correct: 0,
              explanation: "CVR estima ~70,000 víctimas entre 1980-2000",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'his-4-3',
          title: 'Perú en el Siglo XXI',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## Perú en el Siglo XXI

Contenido didáctico para perú en el siglo xxi.`,
          exercises: [
            {
              question: "¿Qué presidente peruano renunció en 2020?",
              options: ["Vizcarra","Kuczynski","Humala","Toledo"],
              correct: 0,
              explanation: "Vizcarra fue vacado en 2020",
            },
            {
              question: "¿Cuál es el principal socio comercial del Perú?",
              options: ["China","EE.UU.","Brasil","Japón"],
              correct: 0,
              explanation: "China es el principal socio comercial del Perú desde 2010",
            },
            {
              question: "¿Qué tratado impulsó la educación en Perú?",
              options: ["Acuerdo de Libre Comercio","Declaración de los Derechos Humanos","Convenio Andrés Bello","Tratado de Maastricht"],
              correct: 2,
              explanation: "Convenio Andrés Bello impulsa integración educativa",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
    {
      id: 'com-m3',
      title: 'Módulo 3: Redacción Académica',
      lessons: [
{
          id: 'com-3-1',
          title: 'Estructura del Párrafo',
          duration: '12 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Estructura del Párrafo

Contenido didáctico para estructura del párrafo.`,
          exercises: [
            {
              question: "¿Qué oración inicia el párrafo?",
              options: ["Oración temática","Oración conclusiva","Oración secundaria","Oración final"],
              correct: 0,
              explanation: "Oración temática: introduce la idea principal",
            },
            {
              question: "¿Cuántas oraciones tiene un párrafo ideal?",
              options: ["3-5","1-2","10-15","Solo 1"],
              correct: 0,
              explanation: "Párrafo ideal: 3-5 oraciones",
            },
            {
              question: "¿Qué conecta las ideas en un texto?",
              options: ["Conectores","Puntos","Títulos","Subtítulos"],
              correct: 0,
              explanation: "Conectores lógicos unen y organizan las ideas",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'com-3-2',
          title: 'Tipos de Ensayo',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Tipos de Ensayo

Contenido didáctico para tipos de ensayo.`,
          exercises: [
            {
              question: "¿Qué es un ensayo argumentativo?",
              options: ["Defiende una tesis","Narra una historia","Describe un objeto","Explica un proceso"],
              correct: 0,
              explanation: "Ensayo argumentativo: defiende una postura con razones",
            },
            {
              question: "Partes del ensayo:",
              options: ["Introducción, desarrollo, conclusión","Inicio, nudo, desenlace","Planteamiento, clímax, final","Título, cuerpo, notas"],
              correct: 0,
              explanation: "Estructura clásica del ensayo",
            },
            {
              question: "¿Qué debe tener la introducción?",
              options: ["Tesis","Resumen","Conclusión","Bibliografía"],
              correct: 0,
              explanation: "La introducción presenta la tesis o propósito",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'com-3-3',
          title: 'Citación y Referencias',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Citación y Referencias

Contenido didáctico para citación y referencias.`,
          exercises: [
            {
              question: "¿Qué estilo de citas usamos?",
              options: ["APA","MLA","Chicago","Vancouver"],
              correct: 0,
              explanation: "APA es el estilo más usado en ciencias sociales",
            },
            {
              question: "¿Cómo se cita a un autor en APA?",
              options: ["(Apellido, año)","(Año, apellido)","Apellido (año)","Año, Apellido"],
              correct: 0,
              explanation: "Formato APA: (Apellido, año)",
            },
            {
              question: "Las referencias bibliográficas van al:",
              options: ["Final","Inicio","Medio","Pie de página"],
              correct: 0,
              explanation: "Referencias al final del documento en APA",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
    {
      id: 'com-m4',
      title: 'Módulo 4: Literatura Peruana',
      lessons: [
{
          id: 'com-4-1',
          title: 'Literatura Prehispánica',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Literatura Prehispánica

Contenido didáctico para literatura prehispánica.`,
          exercises: [
            {
              question: "¿Cuál es la forma poética quechua más importante?",
              options: ["El Harawi","El Haiku","El Soneto","La Décima"],
              correct: 0,
              explanation: "Harawi: poesía lírica quechua de tema amoroso/religioso",
            },
            {
              question: "¿Qué obra del quechua se conserva?",
              options: ["Ollantay","Popol Vuh","Cantar del Mío Cid","La Ilíada"],
              correct: 0,
              explanation: "Ollantay: drama quechua colonial de origen prehispánico",
            },
            {
              question: "La literatura inca era:",
              options: ["Oral","Escrita","Jeroglífica","Simbólica"],
              correct: 0,
              explanation: "Transmisión oral en el Incanato, sin escritura fonética",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'com-4-2',
          title: 'Literatura Republicana',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Literatura Republicana

Contenido didáctico para literatura republicana.`,
          exercises: [
            {
              question: "¿Quién es el mayor exponente del realismo peruano?",
              options: ["Clorinda Matto de Turner","Ricardo Palma","Manuel González Prada","José Santos Chocano"],
              correct: 0,
              explanation: "\"Aves sin nido\" de Matto de Turner es fundacional del realismo",
            },
            {
              question: "Ricardo Palma escribió:",
              options: ["Tradiciones Peruanas","Los heraldos negros","La ciudad y los perros","Siete ensayos"],
              correct: 0,
              explanation: "Tradiciones Peruanas: mezcla de historia y ficción",
            },
            {
              question: "¿Qué obra de Ciro Alegría es emblemática?",
              options: ["El mundo es ancho y ajeno","Los ríos profundos","Yawar Fiesta","La casa de cartón"],
              correct: 0,
              explanation: "Novela indigenista sobre comunidades andinas",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'com-4-3',
          title: 'Boom Latinoamericano',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## Boom Latinoamericano

Contenido didáctico para boom latinoamericano.`,
          exercises: [
            {
              question: "¿Quién peruano ganó el Nobel de Literatura?",
              options: ["Mario Vargas Llosa","César Vallejo","José María Arguedas","Alfredo Bryce Echenique"],
              correct: 0,
              explanation: "Vargas Llosa, Nobel 2010",
            },
            {
              question: "Vargas Llosa escribió:",
              options: ["La ciudad y los perros","Los heraldos negros","El zorro de arriba","Aves sin nido"],
              correct: 0,
              explanation: "Primera novela de Vargas Llosa (1963)",
            },
            {
              question: "¿Qué corriente sigue la obra de Vargas Llosa?",
              options: ["Realismo","Indigenismo","Naturalismo","Surrealismo"],
              correct: 0,
              explanation: "Realismo con influencia de Faulkner y Flaubert",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
  ],
};

// ─── Inglés ───────────────────────────────────────────────────────────────────
const ingles: Course = {
  id: 'ingles',
  title: 'Inglés',
  description: 'Grammar, vocabulary and writing skills for academic English.',
  icon: '🇬🇧',
  color: 'from-rose-500 to-rose-700',
  bgColor: 'bg-rose-50',
  gradientProgress: 'from-rose-400 via-pink-400 to-red-300',
  illustration: 'ingles',
  pattern: 'dots',
  modules: [
    {
      id: 'ing-m1',
      title: 'Module 1: Grammar',
      lessons: [
        {
          id: 'ing-1-1',
          title: 'Present Tenses',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          storyConfig: {
            title: 'A Day in London',
            context: 'Sarah is a student from Peru visiting her friend Tom in London. It\'s her first time in the UK.',
            dialogue: [
              { speaker: 'A', text: 'Hi Sarah! Welcome to London. How was your flight?', translation: '¡Hola Sarah! Bienvenida a Londres. ¿Cómo estuvo tu vuelo?' },
              { speaker: 'B', text: 'It was long but I\'m so excited! I have never visited England before.', translation: 'Fue largo pero ¡estoy tan emocionada! Nunca he visitado Inglaterra antes.' },
              { speaker: 'narrator', text: 'Tom smiles and picks up her suitcase. They walk out of the airport.' },
              { speaker: 'A', text: 'You look tired. Do you want to rest at my flat first?', translation: 'Te ves cansada. ¿Quieres descansar en mi departamento primero?' },
              { speaker: 'B', text: 'No, I\'m fine! I really want to see Big Ben. I have seen it in photos but never in real life!', translation: '¡No, estoy bien! De verdad quiero ver el Big Ben. Lo he visto en fotos pero nunca en la vida real.' },
              { speaker: 'narrator', text: 'Tom laughs. He takes the Tube every day and never gets tired of it.' },
              { speaker: 'A', text: 'OK then! The Tube is waiting for us. I usually take the Central Line.', translation: '¡Ok entonces! El metro nos espera. Usualmente tomo la Línea Central.' },
              { speaker: 'B', text: 'How long does it take to get there?', translation: '¿Cuánto tiempo toma llegar?' },
              { speaker: 'A', text: 'About 20 minutes. While we travel, I am teaching you some British slang!', translation: 'Como 20 minutos. Mientras viajamos, ¡te enseño algo de slang británico!' },
            ],
            vocabulary: [
              { word: 'have never visited', definition: 'Present Perfect — experiencia de no haber hecho algo antes', example: 'I have never visited England before.' },
              { word: 'want to see', definition: 'querer ver — expresión de deseo', example: 'I really want to see Big Ben.' },
              { word: 'take the Tube', definition: 'tomar el metro (Tube = metro de Londres)', example: 'He takes the Tube every day.' },
              { word: 'usually', definition: 'usualmente — adverbio de frecuencia', example: 'I usually take the Central Line.' },
              { word: 'does it take', definition: '¿cuánto tiempo toma? — pregunta sobre duración', example: 'How long does it take to get there?' },
            ],
            grammarFocus: [
              { pattern: 'Simple Present: Subject + verb (+s/es)', explanation: 'Se usa para hábitos, rutinas y hechos generales. "He takes the Tube every day."', example: 'I usually take the Central Line.' },
              { pattern: 'Present Continuous: Subject + am/is/are + verb-ing', explanation: 'Se usa para acciones que están ocurriendo ahora. "I am teaching you some British slang!"', example: 'While we travel, I am teaching you some British slang!' },
              { pattern: 'Present Perfect: Subject + have/has + past participle', explanation: 'Se usa para experiencias pasadas sin tiempo específico. "I have never visited England before."', example: 'I have seen it in photos but never in real life.' },
            ],
          },
          content: `## Present Tenses in English

### Simple Present
**Form**: Subject + base verb (add -s/-es for he/she/it)
**Use**: habits, routines, general truths, facts

✅ Examples:
- She **studies** every day.
- Water **boils** at 100°C.
- I **don't** like coffee.

### Present Continuous
**Form**: Subject + am/is/are + verb-ing
**Use**: actions happening now, temporary situations

✅ Examples:
- He **is studying** right now.
- They **are working** on a new project.

### Present Perfect
**Form**: Subject + have/has + past participle
**Use**: experiences, recent actions, actions with present results

✅ Examples:
- I **have visited** Paris twice.
- She **has just finished** her homework.

### Key signal words
| Tense | Signal Words |
|-------|-------------|
| Simple Present | always, usually, every day, never |
| Present Continuous | now, at the moment, currently |
| Present Perfect | already, yet, ever, never, just, since, for |`,
          exercises: [
            {
              question: 'Which sentence uses Present Perfect correctly?',
              options: [
                'She visit Paris last year.',
                'She has visited Paris twice.',
                'She is visiting Paris now.',
                'She visits Paris every year.',
              ],
              correct: 1,
              explanation: 'Present Perfect = have/has + past participle. "has visited" is correct for experiences.',
            },
            {
              question: 'Choose the correct form: "They ___ (study) for the exam right now."',
              options: ['study', 'studied', 'are studying', 'have studied'],
              correct: 2,
              explanation: '"Right now" signals an action in progress → Present Continuous: are studying',
            },
            {
              question: 'Which signal word is used with Present Perfect?',
              options: ['yesterday', 'last week', 'already', 'ago'],
              correct: 2,
              explanation: '"Already" is a Present Perfect signal word. "yesterday", "last week", "ago" signal Simple Past.',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'ing-1-2',
          title: 'Past Tenses',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          storyConfig: {
            title: 'Yesterday in London',
            context: 'It\'s the next day. Sarah calls her mom in Peru to tell her about everything she did and saw in London.',
            dialogue: [
              { speaker: 'A', text: 'Hi Mom! Sorry I didn\'t call yesterday. I was having so much fun!', translation: '¡Hola mamá! Perdón que no llamé ayer. ¡Estaba divirtiéndome tanto!' },
              { speaker: 'B', text: 'Don\'t worry, honey! What did you do?', translation: '¡No te preocupes, hija! ¿Qué hiciste?' },
              { speaker: 'A', text: 'We visited the Tower of London in the morning. I had never seen anything like it!', translation: 'Visitamos la Torre de Londres en la mañana. ¡Nunca había visto algo así!' },
              { speaker: 'narrator', text: 'Sarah\'s mom listens excitedly as Sarah continues.' },
              { speaker: 'A', text: 'After that, we walked along the Thames. It was raining but we didn\'t care.', translation: 'Después de eso, caminamos por el Támesis. Estaba lloviendo pero no nos importó.' },
              { speaker: 'A', text: 'Tom had already booked a table at a nice restaurant. The food was amazing!', translation: 'Tom ya había reservado una mesa en un restaurante lindo. ¡La comida estaba increíble!' },
              { speaker: 'B', text: 'That sounds wonderful! Had you tried fish and chips before?', translation: '¡Suena maravilloso! ¿Habías probado fish and chips antes?' },
              { speaker: 'A', text: 'No, I hadn\'t! But I loved it. Oh, and guess what — while we were eating, we saw a famous actor!', translation: '¡No! ¡Pero me encantó! Oh, y adivina qué — mientras estábamos comiendo, ¡vimos a un actor famoso!' },
              { speaker: 'narrator', text: 'Sarah spent two hours telling her mom about every detail of her incredible day.' },
            ],
            vocabulary: [
              { word: 'didn\'t call', definition: 'no llamé — Simple Past negativo', example: 'I didn\'t call yesterday.' },
              { word: 'was having / was raining', definition: 'Past Continuous — acción en progreso en el pasado', example: 'I was having so much fun! / It was raining.' },
              { word: 'had never seen', definition: 'Past Perfect — acción pasada antes de otra acción pasada', example: 'I had never seen anything like it.' },
              { word: 'had already booked', definition: 'Past Perfect — acción completada antes de otro momento en el pasado', example: 'Tom had already booked a table.' },
              { word: 'hadn\'t tried...before', definition: 'Past Perfect negativo — experiencia no realizada antes de un momento pasado', example: 'No, I hadn\'t tried fish and chips before.' },
            ],
            grammarFocus: [
              { pattern: 'Simple Past: Subject + verb-ed / irregular form', explanation: 'Se usa para acciones completadas en un momento específico del pasado. "We visited the Tower of London."', example: 'I didn\'t call yesterday.' },
              { pattern: 'Past Continuous: Subject + was/were + verb-ing', explanation: 'Se usa para acciones en progreso en un momento del pasado. "While we were eating, we saw a famous actor."', example: 'I was having so much fun!' },
              { pattern: 'Past Perfect: Subject + had + past participle', explanation: 'Se usa para una acción que ocurrió antes de otra acción en el pasado. "Tom had already booked a table."', example: 'I had never seen anything like it.' },
            ],
          },
          content: `## Past Tenses in English

### Simple Past
**Form**: Subject + verb-ed (regular) / irregular past form
**Use**: completed actions at a specific time in the past

✅ Examples:
- She **studied** all night.
- They **went** to the cinema yesterday.
- I **didn't see** the movie.

### Past Continuous
**Form**: Subject + was/were + verb-ing
**Use**: action in progress at a specific moment in the past; background action

✅ Examples:
- He **was reading** when the phone rang.
- We **were playing** football at 5 pm.

### Past Perfect
**Form**: Subject + had + past participle
**Use**: action completed before another past action

✅ Examples:
- She **had already left** when I arrived.
- They **had finished** dinner before the movie started.

### Irregular verbs (essential list)
| Base | Past Simple | Past Participle |
|------|-------------|-----------------|
| go | went | gone |
| write | wrote | written |
| take | took | taken |
| speak | spoke | spoken |
| see | saw | seen |`,
          exercises: [
            {
              question: 'She ___ (read) when the lights went out.',
              options: ['read', 'was reading', 'has read', 'had read'],
              correct: 1,
              explanation: 'Background action interrupted by another → Past Continuous: was reading',
            },
            {
              question: 'By the time he arrived, we ___ (already/eat) dinner.',
              options: ['already ate', 'were eating', 'had already eaten', 'have already eaten'],
              correct: 2,
              explanation: 'Action completed before another past action → Past Perfect: had already eaten',
            },
            {
              question: 'What is the Past Simple of "write"?',
              options: ['writed', 'written', 'wrote', 'writ'],
              correct: 2,
              explanation: '"Write" is irregular: write → wrote → written',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'ing-1-3',
          title: 'Conditionals',
          duration: '17 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## Conditional Sentences

### Zero Conditional (General Truths)
**Form**: If + Simple Present, Simple Present
**Use**: facts, scientific truths

✅ If you heat water to 100°C, it **boils**.

### First Conditional (Real Future)
**Form**: If + Simple Present, will + base verb
**Use**: possible/likely future situations

✅ If it **rains** tomorrow, I **will stay** home.

### Second Conditional (Hypothetical Present/Future)
**Form**: If + Simple Past, would + base verb
**Use**: imaginary, unlikely, or impossible present/future

✅ If I **had** a million dollars, I **would travel** the world.
✅ If I **were** you, I **would study** more. (use WERE for all subjects)

### Third Conditional (Impossible Past)
**Form**: If + Past Perfect, would have + past participle
**Use**: imagining a different past

✅ If she **had studied**, she **would have passed** the exam.

### Mixed Conditionals
Combining second and third for mixed time references:
✅ If I **had studied** medicine (past), I **would be** a doctor now (present).`,
          exercises: [
            {
              question: '"If I were rich, I would travel the world." This is a ___ conditional.',
              options: ['Zero', 'First', 'Second', 'Third'],
              correct: 2,
              explanation: 'If + Simple Past (were) + would + base verb = Second Conditional (hypothetical present)',
            },
            {
              question: 'Complete: "If you ___ (heat) ice, it melts."',
              options: ['heated', 'would heat', 'heat', 'had heated'],
              correct: 2,
              explanation: 'Zero conditional (general truth): If + Simple Present, Simple Present → "heat"',
            },
            {
              question: '"If she had studied, she would have passed." What time does this refer to?',
              options: ['Present', 'Future', 'Impossible past situation', 'General truth'],
              correct: 2,
              explanation: 'Third conditional refers to an impossible past situation (she did not study, so she did not pass)',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'ing-m2',
      title: 'Module 2: Vocabulary & Writing',
      lessons: [
        {
          id: 'ing-2-1',
          title: 'Phrasal Verbs',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Phrasal Verbs

A **phrasal verb** = verb + preposition/adverb particle. Its meaning is different from the individual words.

### Essential Phrasal Verbs
| Phrasal Verb | Meaning | Example |
|---|---|---|
| give up | rendirse/dejar | Don't give up! |
| look forward to | esperar ansiosamente | I look forward to the weekend. |
| run out of | quedarse sin | We ran out of milk. |
| put off | postponer | Don't put off your homework. |
| take up | empezar un hobby | She took up painting. |
| bring up | criar / mencionar | He was brought up in Lima. |
| call off | cancelar | They called off the meeting. |
| carry out | llevar a cabo | We will carry out the plan. |
| come across | encontrar por casualidad | I came across an old friend. |
| figure out | entender/resolver | Can you figure out this problem? |

### Tips
- Learn phrasal verbs in context (not isolated)
- Many phrasal verbs are separable: "pick up the book" = "pick the book up"
- Some are inseparable: "look after the children" (NOT "look the children after")`,
          exercises: [
            {
              question: 'What does "run out of" mean?',
              options: ['correr afuera', 'quedarse sin', 'escapar', 'terminar tarde'],
              correct: 1,
              explanation: '"Run out of" significa quedarse sin algo. Ej: "We ran out of time" = Se nos acabó el tiempo',
            },
            {
              question: 'Choose the correct meaning of "put off":',
              options: ['Apagar', 'Ponerse', 'Posponer', 'Cancelar definitivamente'],
              correct: 2,
              explanation: '"Put off" = postpone (posponer). Ej: "Don\'t put off until tomorrow what you can do today"',
            },
            {
              question: '"She _______ painting last year." (started as a hobby)',
              options: ['took off', 'took up', 'gave up', 'put off'],
              correct: 1,
              explanation: '"Take up" = empezar un hobby o actividad. "She took up painting" = empezó a pintar',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'ing-m3',
      title: 'Módulo 3: Futuro y Condicionales',
      lessons: [
{
          id: 'ing-3-1',
          title: 'Future Tenses',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          storyConfig: {
            title: 'A Trip to Machu Picchu',
            context: 'Pedro is planning a trip to Machu Picchu with his cousin María. They are deciding what to do, making promises and predictions about the trip.',
            dialogue: [
              { speaker: 'A', text: 'What are you going to do this summer?', translation: '¿Qué vas a hacer este verano?' },
              { speaker: 'B', text: 'I am going to visit Machu Picchu with my cousin! We bought the tickets last week.', translation: '¡Voy a visitar Machu Picchu con mi primo! Compramos los boletos la semana pasada.' },
              { speaker: 'A', text: 'That sounds amazing. When are you going to travel?', translation: 'Eso suena increíble. ¿Cuándo van a viajar?' },
              { speaker: 'B', text: 'We are leaving on the 15th. The train departs at 8 in the morning.', translation: 'Nos vamos el 15. El tren sale a las 8 de la mañana.' },
              { speaker: 'A', text: 'I will help you pack! I promise I will bring my camera too.', translation: '¡Te ayudaré a empacar! Prometo que también traeré mi cámara.' },
              { speaker: 'B', text: 'Great! I think the weather will be sunny, so we are going to have an amazing view.', translation: '¡Genial! Creo que el clima estará soleado, así que vamos a tener una vista increíble.' },
            ],
            vocabulary: [
              { word: 'am going to travel', definition: 'be going to — planes e intenciones futuras', example: 'We are going to travel to Machu Picchu.' },
              { word: 'departs', definition: 'sale (horarios fijos → present simple)', example: 'The train departs at 8 am.' },
              { word: 'will help', definition: 'will — oferta o promesa espontánea', example: 'I will help you pack.' },
              { word: 'will be sunny', definition: 'predicción sin evidencia con will', example: 'The weather will be sunny.' },
            ],
            grammarFocus: [
              { pattern: 'Be going to + verb', explanation: 'Planes e intenciones decididas antes de hablar, y predicciones con evidencia.', example: 'I am going to visit Machu Picchu.' },
              { pattern: 'Will + verb', explanation: 'Decisiones espontáneas, promesas, ofertas y predicciones sin evidencia.', example: 'I will help you pack!' },
              { pattern: 'Present simple para horarios', explanation: 'Horarios fijos de transportes, eventos y rutinas futuras.', example: 'The train departs at 8 am.' },
            ],
          },
          content: `## Future Tenses

In English there are **four main ways** to talk about the future. Choosing the right one depends on the meaning.

### 1. be going to + verb
**Form**: subject + am/is/are + going to + base verb
**Use**: plans and intentions decided BEFORE speaking, and predictions with evidence.

✅ Examples:
- I **am going to visit** Machu Picchu. (plan)
- Look at those clouds! It **is going to rain**. (evidence)

### 2. will + verb
**Form**: subject + will + base verb
**Use**: spontaneous decisions made NOW, promises, offers, and predictions without evidence.

✅ Examples:
- The phone is ringing. I **will answer** it. (spontaneous)
- I promise I **will help** you. (promise)
- I think it **will be** a great trip. (prediction, no evidence)

### 3. Present continuous for future
**Form**: subject + am/is/are + verb-ing
**Use**: fixed arrangements with a time and place (personal plans already organized).

✅ Examples:
- We **are leaving** on the 15th.
- She **is meeting** the manager tomorrow.

### 4. Present simple for schedules
**Use**: timetables, schedules, programs (trains, buses, classes, events).

✅ Examples:
- The train **departs** at 8 am.
- The course **starts** next Monday.

### Key signal words
| Form | Signal Words |
|------|-------------|
| be going to | tomorrow, next week, soon (plans) |
| will | probably, I promise, I think, I'm sure |
| present continuous | tonight, this weekend (arranged) |
| present simple | at 8 am, at 5 pm (schedules) |

### Decision chart
Ask yourself: Is it a **plan decided earlier**? → going to. Is it a **decision made now / promise**? → will. Is it **arranged with a time**? → present continuous. Is it a **fixed timetable**? → present simple.`,
          exercises: [
            {
              question: "\"I ___ (go) to the store tomorrow.\" (plan)",
              options: ["am going","will go","go","went"],
              correct: 0,
              explanation: "\"Be going to\" para planes y predicciones con evidencia",
            },
            {
              question: "\"She ___ (call) you later.\" (promise)",
              options: ["will call","is calling","calls","called"],
              correct: 0,
              explanation: "\"Will\" para promesas, decisiones espontáneas, predicciones",
            },
            {
              question: "\"The train ___ (leave) at 8 PM.\" (schedule)",
              options: ["leaves","will leave","is leaving","left"],
              correct: 0,
              explanation: "Present simple para horarios fijos",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'ing-3-2',
          title: 'First Conditional',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## First Conditional

The **first conditional** is used for **real or possible situations** in the present or future.

### Structure
\`\`\`
If + present simple, ... will + base verb
\`\`\`

✅ Examples:
- **If it rains**, I **will stay** home.
- **If you study hard**, you **will pass** the exam.
- **If she arrives early**, we **will start** without her.

### Order
You can change the order. When "if" comes first, use a comma:
- *If you study, you will pass.*
- *You will pass if you study.* (no comma)

### Alternatives to "will" in the result
| Expression | Meaning | Example |
|---|---|---|
| can | posibilidad | If you finish early, you **can** leave. |
| might / may | posibilidad menos segura | If it's cheap, I **might** buy it. |
| must / should | obligación / recomendación | If you feel sick, you **should** rest. |
| Imperative | instrucción | If you have a question, **raise your hand**. |

### Unless = If not
- *Unless you hurry, we will be late.* = *If you don't hurry, we will be late.*

### Common mistake
✗ If I will have time, I will call you. (never use "will" in the if-clause)
✓ If I **have** time, I **will** call you.

### Practice pattern
1. Condition (real situation) + 2. Probable result. Both parts are real, so the result is very likely if the condition happens.`,
          exercises: [
            {
              question: "If it rains, I ___ (stay) home.",
              options: ["will stay","stay","would stay","stayed"],
              correct: 0,
              explanation: "1st conditional: If + present, will + base verb",
            },
            {
              question: "If you study hard, you ___ the exam.",
              options: ["will pass","pass","would pass","passed"],
              correct: 0,
              explanation: "Resultado probable en el futuro si se cumple la condición",
            },
            {
              question: "\"Unless\" significa lo mismo que:",
              options: ["If not","If","When","Because"],
              correct: 0,
              explanation: "Unless = If not. \"Unless you hurry, we will be late\"",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'ing-3-3',
          title: 'Second Conditional',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Second Conditional

The **second conditional** talks about **unreal, hypothetical or unlikely** situations in the present or future.

### Structure
\`\`\`
If + past simple, ... would + base verb
\`\`\`

✅ Examples:
- **If I were rich**, I **would travel** the world. (I am not rich)
- **If I had** more time, **I would learn** piano. (I don't have more time)
- **If she studied** harder, **she would get** better grades.

### Important: use "were" for all subjects
- *If I **were** you, I would apologize.* ✓
- If I was you... (informal, common but not grammatically standard)

### Alternatives to "would" in the result
| Expression | Example |
|---|---|
| could | If I had money, I **could** buy a car. (ability) |
| might | If she invited me, I **might** go. (possibility) |

### Second vs First Conditional
| | First Conditional | Second Conditional |
|---|---|---|
| Situation | Real / possible | Unreal / hypothetical |
| If-clause | present simple | past simple |
| Result | will + verb | would + verb |
| Example | If it rains, I will stay home. | If I won the lottery, I would travel. |

### Common use: giving advice
- **If I were you**, I would study more.
- I wouldn't do that if I were you.

### Remember
The second conditional is about **imagining**, not about what actually is. It's the language of dreams, advice and hypothetical questions.`,
          exercises: [
            {
              question: "If I ___ (be) rich, I would travel the world.",
              options: ["were","was","am","will be"],
              correct: 0,
              explanation: "2nd conditional: If + past, would + base. \"Were\" para todos",
            },
            {
              question: "\"I would buy a house if I ___ more money.\"",
              options: ["had","have","will have","would have"],
              correct: 0,
              explanation: "Situación hipotética/improbable en presente/futuro",
            },
            {
              question: "Third conditional habla de:",
              options: ["Pasado hipotético","Futuro probable","Presente irreal","Hechos ciertos"],
              correct: 0,
              explanation: "3rd: If + had + PP, would have + PP (pasado imposible)",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
    {
      id: 'ing-m4',
      title: 'Módulo 4: Vocabulario Temático',
      lessons: [
{
          id: 'ing-4-1',
          title: 'Work & Business',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          storyConfig: {
            title: 'First Week at Work',
            context: 'Valeria just started her first job at a tech startup in Lima. Her manager shows her around the office and explains how things work.',
            dialogue: [
              { speaker: 'A', text: 'Welcome to the team, Valeria! I\'m so glad you joined us.', translation: '¡Bienvenida al equipo, Valeria! Me alegra mucho que te hayas unido.' },
              { speaker: 'B', text: 'Thank you! I\'m really excited to start working here.', translation: '¡Gracias! Estoy muy emocionada de empezar a trabajar aquí.' },
              { speaker: 'A', text: 'Let me show you around. This is your desk and here you will meet your colleagues.', translation: 'Déjame mostrarte el lugar. Este es tu escritorio y aquí conocerás a tus colegas.' },
              { speaker: 'B', text: 'Great! When is the deadline for the new project?', translation: '¡Genial! ¿Cuál es la fecha límite para el nuevo proyecto?' },
              { speaker: 'A', text: 'We have to submit the report by Friday. Don\'t worry, I will help you arrange a meeting with the client.', translation: 'Tenemos que entregar el informe el viernes. No te preocupes, te ayudaré a organizar una reunión con el cliente.' },
              { speaker: 'B', text: 'Perfect. I promise I won\'t miss the deadline.', translation: 'Perfecto. Prometo que no faltaré a la fecha límite.' },
            ],
            vocabulary: [
              { word: 'start working', definition: 'empezar a trabajar', example: 'I\'m excited to start working here.' },
              { word: 'colleagues', definition: 'compañeros de trabajo', example: 'You will meet your colleagues.' },
              { word: 'deadline', definition: 'fecha límite de entrega', example: 'When is the deadline?' },
              { word: 'submit the report', definition: 'presentar / entregar el informe', example: 'We have to submit the report by Friday.' },
              { word: 'arrange a meeting', definition: 'organizar una reunión', example: 'I will arrange a meeting with the client.' },
              { word: 'miss the deadline', definition: 'no cumplir con la fecha límite', example: 'I won\'t miss the deadline.' },
            ],
            grammarFocus: [
              { pattern: 'Collocations: submit a report, arrange a meeting, miss a deadline', explanation: 'Las colocaciones son combinaciones naturales de palabras que los nativos usan juntas.', example: 'Submit the report / arrange a meeting.' },
              { pattern: 'Future with will for promises', explanation: 'Will se usa para promesas en el trabajo.', example: 'I will help you arrange a meeting.' },
              { pattern: 'Present continuous for future plans', explanation: 'Planes ya organizados con hora.', example: 'We are meeting the client on Monday.' },
            ],
          },
          content: `## Work & Business Vocabulary

Learning **collocations** (natural word combinations) is the fastest way to sound professional and natural at work.

### Essential work collocations
| Collocation | Meaning | Example |
|---|---|---|
| get a job / find a job | conseguir trabajo | She found a great job. |
| apply for a job | postular a un trabajo | I applied for a new position. |
| go to work | ir al trabajo | I go to work by bus. |
| start / finish work | empezar / terminar el trabajo | We finish work at 6. |
| work overtime | trabajar horas extra | I worked overtime this week. |
| get paid | cobrar / recibir pago | You get paid on the 15th. |
| make money | ganar dinero (en general) | He makes a lot of money. |
| earn a salary | percibir un sueldo | She earns a good salary. |

### Meetings and projects
| Collocation | Meaning | Example |
|---|---|---|
| arrange / schedule a meeting | organizar una reunión | I'll schedule a meeting. |
| attend a meeting | asistir a una reunión | She attended all meetings. |
| miss a meeting | faltar a una reunión | Don't miss the meeting! |
| set a deadline | establecer una fecha límite | We set a deadline for Friday. |
| meet a deadline | cumplir la fecha límite | We met the deadline on time. |
| miss a deadline | no cumplir | We missed the deadline. |
| submit / hand in a report | entregar un informe | Submit the report by Friday. |
| give a presentation | hacer una presentación | He gave a great presentation. |

### Company roles
| Word | Meaning |
|---|---|
| boss / manager | jefe / gerente |
| employee | empleado |
| colleague / coworker | compañero de trabajo |
| client / customer | cliente |
| staff / team | personal / equipo |
| candidate | candidato (a un puesto) |

### Tips
- Learn these as **whole phrases**, not single words: "meet a deadline", not "meet + deadline".
- Phrasal verbs in the office: **take on** a project (asumir), **carry out** a plan (llevar a cabo), **call off** a meeting (cancelar), **put off** a task (aplazar).`,
          exercises: [
            {
              question: "\"Colleague\" significa:",
              options: ["Compañero de trabajo","Cliente","Jefe","Proveedor"],
              correct: 0,
              explanation: "Colleague = persona con la que trabajas",
            },
            {
              question: "\"I need to ___ a meeting.\" (schedule)",
              options: ["arrange","make","do","create"],
              correct: 0,
              explanation: "Arrange a meeting = organizar una reunión",
            },
            {
              question: "\"Deadline\" es:",
              options: ["Fecha límite","Salario","Contrato","Entrevista"],
              correct: 0,
              explanation: "Deadline = fecha tope de entrega",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'ing-4-2',
          title: 'Travel & Tourism',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Travel & Tourism Vocabulary

### At the airport
| Word | Meaning |
|---|---|
| flight | vuelo |
| gate | puerta de embarque |
| boarding pass | tarjeta de embarque |
| luggage / baggage | equipaje |
| hand luggage | equipaje de mano |
| departure / arrival | salida / llegada |
| passport | pasaporte |
| customs | aduana |

### At the hotel
| Collocation | Meaning | Example |
|---|---|---|
| book / reserve a room | reservar una habitación | I'd like to book a room. |
| check in / check out | registrarse / hacer checkout | We check out on Sunday. |
| single / double room | habitación individual / doble | A double room, please. |
| room service | servicio a la habitación | I'll order room service. |

### Getting around
| Phrase | Meaning |
|---|---|
| How much does it cost? | ¿Cuánto cuesta? |
| It's cheap / expensive | Es barato / caro |
| It's far / near | Está lejos / cerca |
| Turn left / right | Gira a la izquierda / derecha |
| Go straight ahead | Sigue todo recto |
| Can I get a refund? | ¿Puedo obtener un reembolso? |

### Useful travel expressions
- **I'd like to** book a room. (Me gustaría...)
- **Do you have** any availability for tonight?
- **What time does** the bus **leave**?
- **Where can I** exchange money?
- **Could you recommend** a good restaurant?

### Phrasal verbs for travel
| Phrasal Verb | Meaning |
|---|---|
| set off | partir / salir de viaje |
| check in | registrarse (hotel/aerolínea) |
| take off | despegar (avión) |
| land | aterrizar |
| get around | moverse por una ciudad |
| see off | despedir a alguien |

### Tips
- At a hotel, use polite forms: **"I'd like to..."** and **"Could you...?"**
- **Book** is the natural verb for reserving travel (not "make" or "do").`,
          exercises: [
            {
              question: "\"I'd like to ___ a room.\" (reserve)",
              options: ["book","take","make","do"],
              correct: 0,
              explanation: "Book a room = reservar una habitación",
            },
            {
              question: "\"Departure\" es opuesto de:",
              options: ["Arrival","Luggage","Flight","Gate"],
              correct: 0,
              explanation: "Departure = salida, Arrival = llegada",
            },
            {
              question: "\"It's ___ .\" (no es caro)",
              options: ["cheap","expensive","far","near"],
              correct: 0,
              explanation: "Cheap = barato / asequible",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'ing-4-3',
          title: 'Technology & Internet',
          duration: '12 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## Technology & Internet Vocabulary

### Basic tech verbs
| Verb | Meaning | Past form |
|---|---|---|
| download / upload | descargar / subir | downloaded / uploaded |
| send / receive | enviar / recibir | sent / received |
| save | guardar | saved |
| delete | eliminar | deleted |
| click | hacer clic | clicked |
| search | buscar | searched |
| log in / log out | iniciar / cerrar sesión | logged in / out |
| install | instalar | installed |
| update | actualizar | updated |
| reset | restablecer | reset |

### Devices and internet
| Word | Meaning |
|---|---|
| screen / keyboard | pantalla / teclado |
| charger / battery | cargador / batería |
| Wi-Fi connection | conexión inalámbrica |
| username / password | usuario / contraseña |
| social media | redes sociales |
| app (application) | aplicación |
| website | sitio web |

### Common collocations
| Collocation | Meaning | Example |
|---|---|---|
| browse the internet | navegar por internet | I browsed the internet for hours. |
| scroll through | desplazarse por | She scrolled through her feed. |
| post a photo | publicar una foto | He posted a photo on Instagram. |
| reply to a message | responder un mensaje | I replied to his message. |
| share a link | compartir un enlace | Share the link with me. |
| crash / freeze | colgarse (un dispositivo) | My laptop crashed again. |

### Tech problems (useful for support)
- **My computer is not working.** → *Turn it off and on again.*
- **The Wi-Fi is not connecting.** → *Restart the router.*
- **The app is crashing.** → *Update the app.*
- **I forgot my password.** → *Reset your password.*

### Tips
- Use **irregular pasts**: send → **sent**, buy → **bought**, meet → **met**.
- "Install", "update" and "delete" are regular verbs: **installed, updated, deleted**.`,
          exercises: [
            {
              question: "\"I need to ___ my password.\" (change)",
              options: ["reset","break","open","close"],
              correct: 0,
              explanation: "Reset password = restablecer contraseña",
            },
            {
              question: "\"Download\" es opuesto de:",
              options: ["Upload","Delete","Save","Edit"],
              correct: 0,
              explanation: "Download = descargar, Upload = subir",
            },
            {
              question: "\"I ___ an email yesterday.\"",
              options: ["sent","sended","send","sending"],
              correct: 0,
              explanation: "Send → Sent (irregular en pasado)",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
  ],
};

// ─── Biología ───────────────────────────────────────────────────────────
const biologia: Course = {
  id: 'biologia',
  title: 'Biología',
  description: 'Biología celular, genética, ecología y evolución desde cero.',
  icon: '🧬',
  color: 'from-green-500 to-emerald-600',
  bgColor: 'bg-green-50',
  gradientProgress: 'from-lime-400 via-green-400 to-emerald-300',
  illustration: 'biologia',
  pattern: 'grid',
  modules: [
    {
      id: 'bio-m1',
      title: 'Módulo 1: Biología Celular',
      lessons: [
        {
          id: 'bio-1-1',
          title: 'La Célula: Estructura y Función',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## La Célula: Estructura y Función

### Descubrimiento
- **Robert Hooke** (1665): observó corcho y nombró las "células"
- **Anton van Leeuwenhoek**: primeras observaciones de células vivas

### Teoría Celular
1. Todo ser vivo está formado por una o más células
2. La célula es la unidad básica de la vida
3. Toda célula proviene de otra célula preexistente

### Tipos de Células
| Característica | Procariota | Eucariota |
|----------------|------------|-----------|
| Núcleo | No tiene (ADN libre) | Tiene núcleo envuelto en membrana |
| Tamaño | 1-10 μm | 10-100 μm |
| Organelos | Pocos | Muchos (mitocondrias, retículo, etc.) |
| Ejemplo | Bacterias | Animales, plantas, hongos |

### Organelos clave
| Organelo | Función |
|----------|---------|
| Núcleo | Controla la actividad celular, contiene el ADN |
| Mitocondria | Produce energía (ATP) — "la central energética" |
| Ribosoma | Síntesis de proteínas |
| Aparato de Golgi | Modifica, clasifica y empaqueta proteínas |
| Retículo endoplásmico | Síntesis de lípidos y proteínas |
| Lisosoma | Digestión celular |
| Membrana plasmática | Controla el paso de sustancias (selectivamente permeable) |

### Membrana plasmática
- Modelo de **mosaico fluido**: lípidos + proteínas + colesterol
- **Permeable selectivamente**: deja pasar algunas sustancias y bloquea otras
- Difusión osmótica y transporte activo

### Transporte de membrana
| Tipo | ¿Necesita energía? | Ejemplo |
|------|--------------------|----|
| Difusión simple | No | Oxígeno entra a la célula |
| Ósmosis | No | Agua cruza la membrana |
| Difusión facilitada | No | Glucosa con ayuda de proteínas |
| Transporte activo | Sí (ATP) | Bomba de sodio-potasio |
| Endocitosis | Sí | Célula engulle partículas grandes |
| Exocitosis | Sí | Célula expulsa sustancias |`,
          exercises: [
            {
              question: '¿Quién descubrió las células al observar corcho?',
              options: ['Anton van Leeuwenhoek', 'Robert Hooke', 'Rudolf Virchow', 'Schleiden'],
              correct: 1,
              explanation: 'Robert Hooke en 1665 observó corcho al microscopio y las llamó "cells" (células).',
            },
            {
              question: '¿Qué organelo es conocido como "la central energética" de la célula?',
              options: ['Núcleo', 'Ribosoma', 'Mitocondria', 'Aparato de Golgi'],
              correct: 2,
              explanation: 'Las mitocondrias producen ATP (energía) mediante la respiración celular.',
            },
            {
              question: '¿Qué tipo de transporte requiere ATP?',
              options: ['Difusión simple', 'Ósmosis', 'Transporte activo', 'Difusión facilitada'],
              correct: 2,
              explanation: 'El transporte activo usa energía (ATP) para mover sustancias contra su gradiente de concentración.',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'bio-1-2',
          title: 'DNA, ARN y Síntesis de Proteínas',
          duration: '18 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## DNA, ARN y Síntesis de Proteínas

### ADN (Ácido Desoxirribonucleico)
- Molícula que almacena la información genética
- Forma de doble hélice (descubierta por Watson y Crick en 1953)
- Ubicado principalmente en el **núcleo**
- Compuesto por **nitrogenados + desoxirribosa + fosfato**

### Nitrogenados del ADN
- **Purinas**: Adenina (A) y Guanina (G)
- **Pirimidinas**: Timina (T) y Citosina (C)

### Regla de Chargaff
- A se empareja con T (**A=T**)
- G se empareja con C (**G≡C**)

### ARN mensajero (ARNm)
- Copia del ADN que lleva la instrucción del gen al ribosoma
- Del núcleo al citoplasma

### Traducción (Síntesis de proteínas)
1. El ARNm se une al ribosoma
2. El ribosoma lee los **codones** (tripletas de bases)
3. Cada codón codifica un **aminoácido**
4. Los aminoácidos se unen formando una **cadena polipeptídica**
5. La cadena se pliega en una **proteína funcional**

### El Código Genético
- 4 bases → 64 combinaciones posibles (codones)
- Codifican 20 aminoácidos + señales de inicio/parada
- Es **degenerado**: varios codones pueden codificar el mismo aminoácido

### Mutaciones
- Cambios en la secuencia de ADN
- **Silenciosas**: no afectan la proteína
- **Sentido erróneo**: producen un aminoácido diferente (ej: anemia falciforme)
- **Sin sentido**: generan un codón de parada prematuro`,
          exercises: [
            {
              question: '¿Quién descubrió la estructura de doble hélice del ADN?',
              options: ['Mendel y Darwin', 'Watson y Crick', 'Hooke y Leeuwenhoek', 'Chargaff'],
              correct: 1,
              explanation: 'James Watson y Francis Crick descubrieron la estructura del ADN en 1953.',
            },
            {
              question: 'Según la regla de Chargaff, ¿con qué se empareja la Adenina en el ADN?',
              options: ['Guanina', 'Citosina', 'Timina', 'Uracilo'],
              correct: 2,
              explanation: 'A se empareja con T (Adenina con Timina) mediante 2 enlaces de hidrógeno.',
            },
            {
              question: '¿Qué tipo de ARN lleva la información genética del núcleo al ribosoma?',
              options: ['ARNt', 'ARNr', 'ARNm', 'ARNsn'],
              correct: 2,
              explanation: 'El ARNm (ARN mensajero) transporta la copia de la información genética del ADN al ribosoma para la traducción.',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'bio-m2',
      title: 'Módulo 2: Genética',
      lessons: [
        {
          id: 'bio-2-1',
          title: 'Mendel y las Leyes de la Herencia',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Gregor Mendel y la Genética

### Gregor Mendel (1822-1884)
- Monje agustino austríaco
- Cruzó plantas de guisante (Pisum sativum) durante 8 años
- Considerado el **padre de la genética**

### Rasgos que estudió Mendel
- Color de semilla (amarillo vs. verde)
- Forma de semilla (redonda vs. arrugada)
- Color de la flor (violeta vs. blanca)
- Posición de la flor (axial vs. terminal)
- Altura del tallo (alta vs. enana)
- Forma de la vaina (lisa vs. hinchada)
- Color de la vaina (verde vs. amarilla)

### Conceptos clave
| Término | Significado |
|---------|-------------|
| **Gen** | Unidad de herencia (segmento de ADN) |
| **Alelo** | Forma alternativa de un gen (ej: A y a) |
| **Genotipo** | Composición genética (ej: Aa, AA, aa) |
| **Fenotipo** | Característica observable (ej: color violeta) |
| **Heterocigoto** | Dos alelos diferentes (Aa) |
| **Homocigoto** | Dos alelos iguales (AA o aa) |
| **Dominante** | Alelo que se expresa en heterocigotos |
| **Recesivo** | Alelo que solo se expresa en homocigotos |

### Primera Ley de Mendel (Ley de la Separación)
Cada individuo tiene **dos alelos** para cada rasgo que se separan durante la formación de los gametos, de modo que cada gameto lleva **solo un alelo**.

### Segunda Ley de Mendel (Ley de la Independencia)
Los alelos de diferentes genes se distribuyen **independientemente** durante la formación de los gametos (si los genes están en cromosomas distintos).

### Cruce monohíbrido (Ejemplo)
**Cruzamiento**: Aa × Aa

|        | **A** | **a** |
|--------|-------|-------|
| **A**  | AA    | Aa    |
| **a**  | Aa    | aa    |

**Proporción genotípica**: 1 AA : 2 Aa : 1 aa
**Proporción fenotípica**: 3 dominante : 1 recesivo

### Cruzamiento dihíbrido
AaBb × AaBb → 16 combinaciones posibles → proporción fenotípica 9:3:3:1`,
          exercises: [
            {
              question: 'Un cruce Aa × Aa produce ¿qué proporción fenotípica?',
              options: ['1:1', '3:1', '9:3:3:1', '1:2:1'],
              correct: 1,
              explanation: 'En un cruce monohíbrido heterocigoto × heterocigoto: 3 dominante : 1 recesivo.',
            },
            {
              question: 'Un organismo con genotipo Aa es:',
              options: ['Homocigoto dominante', 'Heterocigoto', 'Homocigoto recesivo', 'Nullizigoto'],
              correct: 1,
              explanation: 'Heterocigoto = dos alelos diferentes (Aa). Homocigoto = dos iguales (AA o aa).',
            },
            {
              question: '¿Qué genotipo producirá el fenotipo recesivo?',
              options: ['AA o Aa', 'A solo', 'aa', 'Aa o aa'],
              correct: 2,
              explanation: 'Solo el genotipo homocigoto recesivo (aa) expresa el fenotipo recesivo.',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'bio-2-2',
          title: 'Herencia ligada al sexo y mutaciones',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Herencia Ligada al Sexo

### Cromosomas Sexuales
- Mujeres: **XX**
- Hombres: **XY**
- La herencia de los genes en el cromosoma X se llama **ligada al X**

### Hemizigosidad
- Los hombres tienen **una sola copia** del cromosoma X → un solo alelo para genes ligados al X
- Si el alelo es recesivo y no hay copia dominante, el hombre **expresa el rasgo**

### Enfermedades ligadas al X
- **Daltonismo** (ciegamiento al rojo-verde)
- **Hemofilia** (dificultad para coagular sangre)
- **Distrofia muscular de Duchenne**

### Genética del padre: X^a Y → hijas portadoras, hijos normales o afectados
**Mujer portadora (X^AX^a) × hombre normal (X^AY):**

|        | X^A  | X^a  |
|--------|------|------|
| X^A    | X^AX^A (normal) | X^AX^a (portadora) |
| Y      | X^AY (normal) | X^aY (afectado) |

**50% hijos normales, 50% hijas portadoras y 50% hijos afectados** (condicional al sexo).

### Mutaciones
- **Causas**: radiación UV, rayos X, sustancias químicas, errores en la replicación
- **Tipos**: puntuales (un par de bases), cromosómicas (deleciones, duplicaciones), mutaciones en número de cromosomas (trisomía)
- **Síndrome de Down**: trisomía del cromosoma 21 (3 copias en vez de 2)
- **Mutaciones beneficiosas**: fuente de variabilidad y evolución
- **Mutaciones perjudiciales**: causan enfermedades genéticas`,
          exercises: [
            {
              question: 'Un hombre con hemofilia (X^aY) y una mujer normal (X^AX^A), ¿qué hijos tendrán hemofilia?',
              options: ['Todos los hijos', 'Todos los hijos', 'Ninguno', 'La mitad de los hijos'],
              correct: 2,
              explanation: 'X^AX^A × X^aY: hijas X^AX^a (portadoras, sanas), hijos X^AY (sanos). Ningún hijo tendrá hemofilia.',
            },
            {
              question: 'El síndrome de Down es causado por:',
              options: ['Una deleción del cromosoma 21', 'Trisomía del cromosoma 21', 'Una duplicación del cromosoma X', 'Trisomía del cromosoma 18'],
              correct: 1,
              explanation: 'El síndrome de Down se debe a tener tres copias del cromosoma 21 (trisomía 21).',
            },
            {
              question: '¿Cuál de las siguientes enfermedades es ligada al X?',
              options: ['Diabetes', 'Daltonismo', 'Asma', 'Anemia por déficit de hierro'],
              correct: 1,
              explanation: 'El daltonismo (ciegamiento cromático) es un rasgo recesivo ligado al cromosoma X.',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'bio-m3',
      title: 'Módulo 3: Genética',
      lessons: [
{
          id: 'bio-3-1',
          title: 'Leyes de Mendel',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Leyes de Mendel

Contenido didáctico para leyes de mendel.`,
          exercises: [
            {
              question: "1ra Ley de Mendel:",
              options: ["Ley de la Segregación","Ley de la Distribución","Ley de la Dominancia","Ley de la Gravedad"],
              correct: 0,
              explanation: "1ra Ley: los alelos se separan durante la formación de gametos",
            },
            {
              question: "¿Qué significa homocigoto?",
              options: ["Alelos iguales","Alelos diferentes","Alelos dominantes","Alelos recesivos"],
              correct: 0,
              explanation: "Homocigoto: dos alelos iguales (AA o aa)",
            },
            {
              question: "Cruzar AA × aa produce:",
              options: ["Todos Aa","50% AA, 50% aa","Todos AA","75% Aa, 25% aa"],
              correct: 0,
              explanation: "100% heterocigotos Aa en primera generación filial",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'bio-3-2',
          title: 'ADN y ARN',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## ADN y ARN

Contenido didáctico para adn y arn.`,
          exercises: [
            {
              question: "¿Qué bases tiene el ADN?",
              options: ["A, G, C, T","A, G, C, U","A, T, C, U","G, C, T, U"],
              correct: 0,
              explanation: "ADN: Adenina, Guanina, Citosina, Timina",
            },
            {
              question: "¿Qué reemplaza a la Timina en el ARN?",
              options: ["Uracilo","Adenina","Guanina","Citosina"],
              correct: 0,
              explanation: "ARN tiene Uracilo (U) en lugar de Timina (T)",
            },
            {
              question: "¿Qué enzima replica el ADN?",
              options: ["ADN polimerasa","ARN polimerasa","Ligasa","Helicasa"],
              correct: 0,
              explanation: "ADN polimerasa sintetiza la nueva cadena de ADN",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'bio-3-3',
          title: 'Ingeniería Genética',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Ingeniería Genética

Contenido didáctico para ingeniería genética.`,
          exercises: [
            {
              question: "¿Qué técnica edita genes con precisión?",
              options: ["CRISPR-Cas9","PCR","Clonación","Electroforesis"],
              correct: 0,
              explanation: "CRISPR-Cas9 permite edición genética precisa",
            },
            {
              question: "¿Qué enzima corta ADN en sitios específicos?",
              options: ["Endonucleasa","Ligasa","Polimerasa","Helicasa"],
              correct: 0,
              explanation: "Endonucleasas de restricción cortan ADN en secuencias específicas",
            },
            {
              question: "Un organismo transgénico tiene:",
              options: ["Gen de otra especie","Genes duplicados","Genes eliminados","Solo genes propios"],
              correct: 0,
              explanation: "Transgénico: contiene ADN de otra especie",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
    {
      id: 'bio-m4',
      title: 'Módulo 4: Ecología',
      lessons: [
{
          id: 'bio-4-1',
          title: 'Ecosistemas y Cadenas Tróficas',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Ecosistemas y Cadenas Tróficas

Contenido didáctico para ecosistemas y cadenas tróficas.`,
          exercises: [
            {
              question: "¿Qué nivel trófico produce su propio alimento?",
              options: ["Productor","Consumidor primario","Consumidor secundario","Descomponedor"],
              correct: 0,
              explanation: "Productores: plantas y algas (autótrofos)",
            },
            {
              question: "¿Cuánta energía pasa de un nivel al siguiente?",
              options: ["10%","50%","90%","100%"],
              correct: 0,
              explanation: "Aprox. 10% de la energía pasa al siguiente nivel trófico",
            },
            {
              question: "¿Qué son los descomponedores?",
              options: ["Bacterias y hongos","Plantas","Herbívoros","Carnívoros"],
              correct: 0,
              explanation: "Descomponedores: reciclan materia orgánica",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'bio-4-2',
          title: 'Ciclos Biogeoquímicos',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Ciclos Biogeoquímicos

Contenido didáctico para ciclos biogeoquímicos.`,
          exercises: [
            {
              question: "¿Qué ciclo incluye la fotosíntesis?",
              options: ["Ciclo del carbono","Ciclo del nitrógeno","Ciclo del agua","Ciclo del fósforo"],
              correct: 0,
              explanation: "Fotosíntesis: plantas fijan CO₂ en carbono orgánico",
            },
            {
              question: "¿Qué bacteria fija nitrógeno atmosférico?",
              options: ["Rhizobium","E. coli","Lactobacillus","Bacillus"],
              correct: 0,
              explanation: "Rhizobium simbiosis con leguminosas",
            },
            {
              question: "¿Dónde se almacena más carbono?",
              options: ["Océanos","Atmósfera","Suelo","Bosques"],
              correct: 0,
              explanation: "Océanos son el mayor sumidero de carbono",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'bio-4-3',
          title: 'Cambio Climático',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Cambio Climático

Contenido didáctico para cambio climático.`,
          exercises: [
            {
              question: "¿Cuál es el principal gas de efecto invernadero?",
              options: ["CO₂","O₂","N₂","H₂"],
              correct: 0,
              explanation: "Dióxido de carbono es el principal GEI antropogénico",
            },
            {
              question: "¿Qué causa el aumento del nivel del mar?",
              options: ["Derretimiento de glaciares","Lluvias","Vientos","Terremotos"],
              correct: 0,
              explanation: "El calentamiento global derrite glaciares y expande el agua",
            },
            {
              question: "¿Qué acuerdo global busca reducir emisiones?",
              options: ["Acuerdo de París","Protocolo de Kyoto","Convenio de Río","Tratado de Montreal"],
              correct: 0,
              explanation: "Acuerdo de París (2015) para limitar el calentamiento global",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
  ],
};

// ─── Computación / Programación ────────────────────────────────────────
const computacion: Course = {
  id: 'computacion',
  title: 'Computación y Programación',
  description: 'Algoritmos, Python, estructuras de datos y fundamentos de desarrollo de software.',
  icon: '💻',
  color: 'from-indigo-500 to-blue-600',
  bgColor: 'bg-indigo-50',
  gradientProgress: 'from-indigo-400 via-blue-400 to-sky-300',
  illustration: 'computacion',
  pattern: 'dots',
  modules: [
    {
      id: 'comp-m1',
      title: 'Módulo 1: Fundamentos de Programación',
      lessons: [
        {
          id: 'comp-1-1',
          title: '¿Qué es un algoritmo?',
          duration: '12 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Algoritmos

### Definición
Un **algoritmo** es un conjunto finito de instrucciones bien definidas que resuelve un problema específico.

### Características de un algoritmo
1. **Finito**: debe terminar después de un número determinado de pasos
2. **Definido**: cada paso debe ser claro y sin ambigüedad
3. **Entrada**: tiene cero o más datos de entrada
4. **Salida**: produce al menos un resultado
5. **Efectivo**: cada paso debe ser suficientemente básico para realizarse

### Pseudocódigo
El pseudocódigo es una forma de representar algoritmos usando lenguaje natural mezclado con estructuras de programación:

\`\`\`
INICIO
  LEER num1, num2
  SI num1 > num2 ENTONCES
    ESCRIBIR "El mayor es: " + num1
  SINO
    ESCRIBIR "El mayor es: " + num2
  FIN SI
FIN
\`\`\`

### Estructuras básicas
| Estructura | Descripción | Ejemplo de uso |
|------------|-------------|----------------|
| **Secuencia** | Ejecutar instrucciones en orden | Leer dos números y sumarlos |
| **Condicional** | Tomar decisiones según una condición | IF/ELSE |
| **Iteración** | Repetir un bloque de código | FOR, WHILE |

### Notación Big O (complejidad)
| Notación | Nombre | Ejemplo |
|----------|--------|---------|
| O(1) | Constante | Acceder a un elemento de un array |
| O(log n) | Logarítmica | Búsqueda binaria |
| O(n) | Lineal | Recorrer una lista |
| O(n²) | Cuadrática | Burbuja (Bubble Sort) |
| O(n!) | Factorial | Problema del viajante (fuerza bruta) |`,
          exercises: [
            {
              question: '¿Cuál de las siguientes NO es una característica de un algoritmo?',
              options: ['Finito', 'Ambiguo', 'Efectivo', 'Con salida'],
              correct: 1,
              explanation: 'Un algoritmo debe ser definido, no ambiguo. Cada paso debe ser claro.',
            },
            {
              question: '¿Qué estructura repite un bloque de código?',
              options: ['Secuencia', 'Condicional', 'Iteración', 'Entrada'],
              correct: 2,
              explanation: 'La iteración (loops) repite un bloque de código. Ej: FOR, WHILE.',
            },
            {
              question: 'O(n²) representa:',
              options: ['Complejidad constante', 'Complejidad logarítmica', 'Complejidad cuadrática', 'Complejidad lineal'],
              correct: 2,
              explanation: 'O(n²) es complejidad cuadrática, típica de algoritmos con bucles anidados como el Bubble Sort.',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
        {
          id: 'comp-1-2',
          title: 'Introducción a Python',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Introducción a Python

### ¿Por qué Python?
- Lenguaje fácil de leer y aprender
- Amplia comunidad y bibliotecas
- Usado en ciencia de datos, IA, desarrollo web y más
- Ideal para principiantes

### Variables y Tipos de Datos
\`\`\`python
# Cadenas (strings)
nombre = "KAIRO"

# Enteros
edad = 16

# Decimales (floats)
promedio = 15.5

# Booleanos
aprobado = True

# Listas (arrays)
notas = [12, 15, 18, 10]

# Diccionarios
estudiante = {"nombre": "Carlos", "edad": 16}
\`\`\`

### Operadores básicos
| Operador | Descripción | Ejemplo | Resultado |
|----------|-------------|---------|-----------|
| + | Suma | 5 + 3 | 8 |
| - | Resta | 5 - 3 | 2 |
| * | Multiplicación | 5 * 3 | 15 |
| / | División | 7 / 2 | 3.5 |
| // | División entera | 7 // 2 | 3 |
| % | Módulo (residuo) | 7 % 2 | 1 |
| ** | Potencia | 2 ** 3 | 8 |

### Condicionales IF/ELIF/ELSE
\`\`\`python
nota = 16
if nota >= 18:
    print("Distinción")
elif nota >= 14:
    print("Bueno")
elif nota >= 11:
    print("Regular")
else:
    print("Deficiente")
# Resultado: "Bueno"
\`\`\`

### Bucles
\`\`\`python
# Bucle FOR
for i in range(5):
    print(i)  # Imprime 0, 1, 2, 3, 4

# Bucle WHILE
n = 10
while n > 0:
    print(n)
    n -= 1
# Imprime 10, 9, 8, ..., 1
\`\`\`

### Funciones
\`\`\`python
def suma(a, b):
    return a + b

resultado = suma(3, 5)
print(resultado)  # Imprime 8
\`\`\``,
          exercises: [
            {
              question: '¿Qué imprime print(type(16)) en Python?',
              options: ['<class "float">', '<class "int">', '<class "str">', '<class "bool">'],
              correct: 1,
              explanation: '16 es un número entero → <class "int">.',
            },
            {
              question: '¿Qué imprime el siguiente código?\nnota = 20\nif nota >= 18:\n    print("Distinción")\nelif nota >= 14:\n    print("Bueno")',
              options: ['Bueno', 'Distinción', 'Regular', 'No imprime nada'],
              correct: 1,
              explanation: 'nota=20 cumple la primera condición (>=18) → imprime "Distinción" y no entra al elif.',
            },
            {
              question: '¿Qué retorna range(3)?',
              options: ['[0, 1, 2]', '[1, 2, 3]', '[3]', '0, 1, 2 (generador)'],
              correct: 0,
              explanation: 'range(3) genera secuencia 0, 1, 2 (equivalentes a [0, 1, 2]).',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'comp-m2',
      title: 'Módulo 2: Estructuras de Datos',
      lessons: [
        {
          id: 'comp-2-1',
          title: 'Listas, Tuplas y Diccionarios',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## Listas, Tuplas y Diccionarios en Python

### Listas (mutable, ordenada)
- Colección ordenada y **modificable**
- Permite elementos repetidos
- Se declaran con corchetes \`[]\`
\`\`\`python
frutas = ["manzana", "banana", "cereza"]
frutas.append("durazno")    # Añadir elemento
frutas[0]          # "manzana" (índice 0)
frutas[-1]         # "durazno" (último)
len(frutas)        # 4
\`\`\`

### Tuplas (inmutable, ordenada)
- Colección ordenada pero **no modificable**
- Se declaran con paréntesis \`()\`
\`\`\`python
coordenadas = (10, 20)
# coordenadas[0] = 30  ← ERROR: no se puede modificar
\`\`\`

### Diccionarios (clave-valor)
- Colección de pares clave-valor
- **No ordenados** (en Python < 3.7), luego ordenados por inserción
- Se declaran con llaves \`{}\`
\`\`\`python
estudiante = {
    "nombre": "Ana",
    "edad": 16,
    "nota": 17.5
}
estudiante["nombre"]     # "Ana"
estudiante["edad"] = 17  # Modificar valor
estudiante["grado"] = "5to"  # Añadir nuevo par

# Iterar sobre claves y valores
for clave, valor in estudiante.items():
    print(clave, valor)
\`\`\`

### Métodos importantes
| Método | Uso |
|--------|-----|
| list.append(x) | Añade x al final de la lista |
| list.sort() | Ordena la lista |
| dict.keys() | Lista todas las claves |
| dict.values() | Lista todos los valores |
| dict.items() | Lista pares (clave, valor) |
| len() | Cuenta elementos de lista, dict, string |`,
          exercises: [
            {
              question: '¿Qué es una tupla en Python?',
              options: ['Una lista ordenada y modificable', 'Una colección ordenada e inmutable', 'Un diccionario', 'Un bucle'],
              correct: 1,
              explanation: 'Una tupla es una colección ordenada e inmutable (no se puede modificar después de crearse).',
            },
            {
              question: 'Dado d = {"a": 1, "b": 2}, ¿qué retorna d["c"]?',
              options: ['None', '0', 'KeyError', 'False'],
              correct: 2,
              explanation: 'Acceder a una clave inexistente en un diccionario lanza un KeyError.',
            },
            {
              question: '¿Cuál es el índice del último elemento de la lista [10, 20, 30, 40]?',
              options: ['4', '3', '-1', 'Tanto 3 como -1'],
              correct: 3,
              explanation: 'En Python, los índices van de 0 a 3. También se puede usar índice negativo: -1 es el último elemento.',
            },
          ],
          videoUrl: '',
          videoQuiz: [],
        },
      ],
    },
    {
      id: 'comp-m3',
      title: 'Módulo 3: Desarrollo Web',
      lessons: [
{
          id: 'comp-3-1',
          title: 'HTML y CSS Avanzado',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## HTML y CSS Avanzado

Contenido didáctico para html y css avanzado.`,
          exercises: [
            {
              question: "¿Qué etiqueta HTML define un enlace?",
              options: ["<a>","<link>","<href>","<url>"],
              correct: 0,
              explanation: "<a href=\"...\"> crea un hipervínculo",
            },
            {
              question: "¿Qué propiedad CSS hace un layout flexible?",
              options: ["display: flex","display: block","display: inline","position: absolute"],
              correct: 0,
              explanation: "Flexbox: display: flex para layouts flexibles",
            },
            {
              question: "¿Qué unidad es relativa al tamaño de fuente?",
              options: ["rem","px","cm","%"],
              correct: 0,
              explanation: "rem es relativa al font-size del elemento raíz",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'comp-3-2',
          title: 'JavaScript y DOM',
          duration: '16 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## JavaScript y DOM

Contenido didáctico para javascript y dom.`,
          exercises: [
            {
              question: "¿Qué método selecciona un elemento por ID?",
              options: ["getElementById","querySelector","getElementsByClass","findElement"],
              correct: 0,
              explanation: "document.getElementById(\"id\")",
            },
            {
              question: "¿Qué evento ocurre al hacer clic?",
              options: ["click","hover","change","submit"],
              correct: 0,
              explanation: "Evento click: onclick o addEventListener(\"click\")",
            },
            {
              question: "¿Cómo se declara una variable en JS moderno?",
              options: ["let","var","int","string"],
              correct: 0,
              explanation: "let y const son las formas modernas (ES6+)",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'comp-3-3',
          title: 'React y Componentes',
          duration: '18 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## React y Componentes

Contenido didáctico para react y componentes.`,
          exercises: [
            {
              question: "¿Qué función de React crea un estado?",
              options: ["useState","useEffect","useRef","useContext"],
              correct: 0,
              explanation: "useState hook para manejar estado en componentes funcionales",
            },
            {
              question: "¿Cómo se pasan datos a un componente hijo?",
              options: ["Props","State","Refs","Events"],
              correct: 0,
              explanation: "Props: propiedades que el padre pasa al hijo",
            },
            {
              question: "¿Qué hook ejecuta código al montar?",
              options: ["useEffect","useState","useCallback","useMemo"],
              correct: 0,
              explanation: "useEffect con [] de dependencias ejecuta al montar",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
    {
      id: 'comp-m4',
      title: 'Módulo 4: Ciencia de Datos',
      lessons: [
{
          id: 'comp-4-1',
          title: 'Python para Datos',
          duration: '15 min',
          xpReward: 20,
          lessonType: 'concept',
          content: `## Python para Datos

Contenido didáctico para python para datos.`,
          exercises: [
            {
              question: "¿Qué librería usamos para dataframes?",
              options: ["Pandas","NumPy","Matplotlib","Scikit-learn"],
              correct: 0,
              explanation: "Pandas: DataFrame y Series para datos tabulares",
            },
            {
              question: "¿Qué función lee un CSV en Pandas?",
              options: ["pd.read_csv()","pd.load_csv()","pd.open_csv()","pd.import_csv()"],
              correct: 0,
              explanation: "read_csv(\"archivo.csv\")",
            },
            {
              question: "¿Cómo se filtra una columna en Pandas?",
              options: ["df[columna]","df.get(columna)","df.filter(columna)","df.select(columna)"],
              correct: 0,
              explanation: "df[\"columna\"] o df.columna",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'comp-4-2',
          title: 'Visualización de Datos',
          duration: '14 min',
          xpReward: 20,
          lessonType: 'practice',
          content: `## Visualización de Datos

Contenido didáctico para visualización de datos.`,
          exercises: [
            {
              question: "¿Qué librería crea gráficos en Python?",
              options: ["Matplotlib","Pandas","NumPy","Requests"],
              correct: 0,
              explanation: "Matplotlib: librería estándar de visualización",
            },
            {
              question: "¿Qué gráfico muestra distribución de datos?",
              options: ["Histograma","Gráfico de barras","Gráfico de líneas","Gráfico de pastel"],
              correct: 0,
              explanation: "Histograma: distribución de frecuencias de una variable",
            },
            {
              question: "¿Qué tipo de gráfico para correlación?",
              options: ["Scatter plot","Bar chart","Pie chart","Line chart"],
              correct: 0,
              explanation: "Scatter plot (diagrama de dispersión) para correlación",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        },
{
          id: 'comp-4-3',
          title: 'Machine Learning Básico',
          duration: '18 min',
          xpReward: 20,
          lessonType: 'review',
          content: `## Machine Learning Básico

Contenido didáctico para machine learning básico.`,
          exercises: [
            {
              question: "¿Qué tipo de aprendizaje usa datos etiquetados?",
              options: ["Supervisado","No supervisado","Refuerzo","No paramétrico"],
              correct: 0,
              explanation: "Aprendizaje supervisado: datos con etiquetas",
            },
            {
              question: "¿Qué algoritmo se usa para clasificación?",
              options: ["Random Forest","K-Means","PCA","Apriori"],
              correct: 0,
              explanation: "Random Forest: algoritmo de clasificación supervisada",
            },
            {
              question: "¿Qué métrica mide precisión del modelo?",
              options: ["Accuracy","Mean","Sum","Distance"],
              correct: 0,
              explanation: "Accuracy = predicciones correctas / total de predicciones",
            }
          ],
          videoUrl: '',
          videoQuiz: [],
        }
      ],
    },
  ],
};

// ─── All courses ──────────────────────────────────────────────────────────────
export const ALL_COURSES: Course[] = [
  matematicas,
  fisica,
  quimica,
  historia,
  comunicacion,
  ingles,
  biologia,
  computacion,
];


