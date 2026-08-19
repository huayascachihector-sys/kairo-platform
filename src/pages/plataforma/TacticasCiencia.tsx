import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, Timer, Trophy, RotateCcw, ChevronRight, Star, Brain, FlaskConical, Sigma, BookOpen, Lightbulb, Target, PartyPopper, X } from 'lucide-react';
import { addXP } from '../../lib/store';

// ─── Puzzle data ───────────────────────────────────────────────────────────────
interface Puzzle {
  id: string;
  category: 'algebra' | 'calculo' | 'geometria' | 'fisica';
  difficulty: 'fácil' | 'medio' | 'difícil';
  question: string;
  hint: string;
  options: string[];
  correct: number; // index
  explanation: string;
  xp: number;
}

const PUZZLES: Puzzle[] = [
  // ÁLGEBRA
  {
    id: 'alg-1',
    category: 'algebra',
    difficulty: 'fácil',
    question: '¿Cuál es el valor de x en la ecuación: 3x − 7 = 2x + 5?',
    hint: 'Pasa los términos con x a un lado y los números al otro.',
    options: ['x = 12', 'x = −2', 'x = 2', 'x = −12'],
    correct: 0,
    explanation: 'Restamos 2x a ambos lados: x − 7 = 5. Luego sumamos 7: x = 12. ✓',
    xp: 15,
  },
  {
    id: 'alg-2',
    category: 'algebra',
    difficulty: 'medio',
    question: 'Factoriza: x² − 5x + 6',
    hint: 'Busca dos números cuyo producto sea 6 y cuya suma sea −5.',
    options: ['(x − 2)(x − 3)', '(x + 2)(x + 3)', '(x − 1)(x − 6)', '(x + 1)(x − 6)'],
    correct: 0,
    explanation: '−2 × −3 = 6 y −2 + (−3) = −5. Por lo tanto x² − 5x + 6 = (x − 2)(x − 3). ✓',
    xp: 15,
  },
  {
    id: 'alg-3',
    category: 'algebra',
    difficulty: 'medio',
    question: '¿Cuánto es (a + b)² si a = 3 y b = −2?',
    hint: 'Usa el producto notable: (a + b)² = a² + 2ab + b²',
    options: ['25', '1', '13', '5'],
    correct: 1,
    explanation: 'a + b = 3 + (−2) = 1, entonces (1)² = 1. O directo: 9 − 12 + 4 = 1. ✓',
    xp: 20,
  },
  {
    id: 'alg-4',
    category: 'algebra',
    difficulty: 'difícil',
    question: 'Si el sistema tiene solución única, ¿cuál es x + y?\n  2x + y = 7\n  x − y = 2',
    hint: 'Suma las dos ecuaciones para eliminar y.',
    options: ['3', '5', '4', '6'],
    correct: 2,
    explanation: 'Sumando ambas ecuaciones: 3x = 9 → x = 3. Sustituyendo en x − y = 2: 3 − y = 2 → y = 1. Entonces x + y = 3 + 1 = 4. ✓',
    xp: 25,
  },
  {
    id: 'alg-5',
    category: 'algebra',
    difficulty: 'fácil',
    question: '¿Cuál es el coeficiente de x en la expresión 5x³ − 4x + 9?',
    hint: 'El "coeficiente de x" se refiere al término con x elevado a la primera potencia.',
    options: ['5', '9', '−4', '3'],
    correct: 2,
    explanation: 'El término con x¹ es −4x. Su coeficiente (el número que multiplica) es −4. ✓',
    xp: 15,
  },
  // CÁLCULO
  {
    id: 'calc-1',
    category: 'calculo',
    difficulty: 'fácil',
    question: '¿Cuál es la derivada de f(x) = x³?',
    hint: 'Usa la regla de potencias: d/dx [xⁿ] = n·xⁿ⁻¹',
    options: ['f\'(x) = 3x²', 'f\'(x) = x²', 'f\'(x) = 3x³', 'f\'(x) = 3'],
    correct: 0,
    explanation: 'Regla de potencias: bajamos el exponente y restamos 1. d/dx[x³] = 3x². ✓',
    xp: 15,
  },
  {
    id: 'calc-2',
    category: 'calculo',
    difficulty: 'medio',
    question: '¿Dónde está el ERROR en este despeje de derivada?\n  f(x) = 5x² + 3x\n  f\'(x) = 5x + 3',
    hint: 'Aplica la regla de potencias a cada término.',
    options: [
      'El término 3x debería ser 3',
      'El término 5x² debería derivar a 10x, no 5x',
      'No hay error, está correcto',
      'Falta sumar una constante C',
    ],
    correct: 1,
    explanation: 'd/dx[5x²] = 2·5·x²⁻¹ = 10x. El error es escribir 5x en lugar de 10x. La correcta es f\'(x) = 10x + 3. ✓',
    xp: 20,
  },
  {
    id: 'calc-3',
    category: 'calculo',
    difficulty: 'medio',
    question: '¿Cuánto es lím(x→2) de (x² − 4)/(x − 2)?',
    hint: 'Factoriza el numerador antes de evaluar el límite.',
    options: ['0', '2', '4', 'No existe'],
    correct: 2,
    explanation: 'x² − 4 = (x+2)(x−2). Cancelamos (x−2): lím = x+2. Evaluando en x=2: 2+2 = 4. ✓',
    xp: 20,
  },
  {
    id: 'calc-4',
    category: 'calculo',
    difficulty: 'difícil',
    question: '¿Cuál es la derivada de f(x) = x² · sin(x)?',
    hint: 'Usa la regla del producto: (u·v)\' = u\'v + uv\'',
    options: [
      '2x · cos(x)',
      '2x · sin(x) + x² · cos(x)',
      'x² · cos(x)',
      '2x · sin(x) − x² · cos(x)',
    ],
    correct: 1,
    explanation: 'u = x² → u\' = 2x; v = sin(x) → v\' = cos(x). Regla del producto: 2x·sin(x) + x²·cos(x). ✓',
    xp: 25,
  },
  // GEOMETRÍA
  {
    id: 'geo-1',
    category: 'geometria',
    difficulty: 'fácil',
    question: 'Un triángulo rectángulo tiene catetos de 3 cm y 4 cm. ¿Cuánto mide la hipotenusa?',
    hint: 'Usa el teorema de Pitágoras: c² = a² + b²',
    options: ['5 cm', '7 cm', '√7 cm', '25 cm'],
    correct: 0,
    explanation: 'c² = 3² + 4² = 9 + 16 = 25 → c = √25 = 5 cm. ¡El triángulo 3-4-5 es el más clásico! ✓',
    xp: 15,
  },
  {
    id: 'geo-2',
    category: 'geometria',
    difficulty: 'medio',
    question: '¿Cuál es el área de un círculo de radio 7 cm? (usa π ≈ 3.14)',
    hint: 'Área del círculo = π · r²',
    options: ['43.96 cm²', '153.86 cm²', '21.98 cm²', '78 cm²'],
    correct: 1,
    explanation: 'A = π · 7² = 3.14 × 49 = 153.86 cm². Recuerda: el área usa r², no 2r (eso es circunferencia). ✓',
    xp: 20,
  },
  {
    id: 'geo-3',
    category: 'geometria',
    difficulty: 'difícil',
    question: 'Un ángulo inscrito en una circunferencia mide 40°. ¿Cuánto mide el arco que abarca?',
    hint: 'El ángulo inscrito es la mitad del arco que abarca.',
    options: ['20°', '40°', '80°', '160°'],
    correct: 2,
    explanation: 'Teorema del ángulo inscrito: arco = 2 × ángulo inscrito = 2 × 40° = 80°. ✓',
    xp: 25,
  },
  // FÍSICA
  {
    id: 'fis-1',
    category: 'fisica',
    difficulty: 'fácil',
    question: 'Un auto viaja 120 km en 2 horas. ¿Cuál es su velocidad media?',
    hint: 'Velocidad = Distancia ÷ Tiempo',
    options: ['240 km/h', '60 km/h', '122 km/h', '60 m/s'],
    correct: 1,
    explanation: 'v = d/t = 120 km ÷ 2 h = 60 km/h. Las unidades son km/h porque distancia va en km y tiempo en horas. ✓',
    xp: 15,
  },
  {
    id: 'fis-2',
    category: 'fisica',
    difficulty: 'medio',
    question: 'Un objeto de 5 kg recibe una fuerza neta de 20 N. ¿Cuál es su aceleración?',
    hint: 'Segunda Ley de Newton: F = m · a',
    options: ['100 m/s²', '0.25 m/s²', '4 m/s²', '25 m/s²'],
    correct: 2,
    explanation: 'Despejamos a = F/m = 20 N ÷ 5 kg = 4 m/s². La fuerza en Newtons dividida entre la masa en kg nos da la aceleración en m/s². ✓',
    xp: 20,
  },
  {
    id: 'fis-3',
    category: 'fisica',
    difficulty: 'medio',
    question: '¿Cuánta energía cinética tiene un objeto de 2 kg moviéndose a 10 m/s?',
    hint: 'Ec = ½ · m · v²',
    options: ['20 J', '100 J', '200 J', '10 J'],
    correct: 1,
    explanation: 'Ec = ½ × 2 × 10² = ½ × 2 × 100 = 100 J. El cuadrado de la velocidad hace que el resultado no sea simplemente 20 J. ✓',
    xp: 20,
  },
  {
    id: 'fis-4',
    category: 'fisica',
    difficulty: 'difícil',
    question: 'Dos resistencias de 6 Ω y 3 Ω están en paralelo. ¿Cuál es la resistencia equivalente?',
    hint: '1/Req = 1/R₁ + 1/R₂',
    options: ['9 Ω', '4.5 Ω', '2 Ω', '18 Ω'],
    correct: 2,
    explanation: '1/Req = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 → Req = 2 Ω. En paralelo la resistencia equivalente siempre es MENOR que la menor individual. ✓',
    xp: 25,
  },
  {
    id: 'fis-5',
    category: 'fisica',
    difficulty: 'difícil',
    question: 'Una pelota se lanza verticalmente con v₀ = 20 m/s. ¿Cuánto tarda en llegar a la altura máxima? (g = 10 m/s²)',
    hint: 'En la altura máxima la velocidad es 0. Usa v = v₀ − g·t',
    options: ['1 s', '2 s', '4 s', '10 s'],
    correct: 1,
    explanation: 'En la cima v = 0: 0 = 20 − 10·t → t = 20/10 = 2 s. La gravedad frena la pelota a razón de 10 m/s cada segundo. ✓',
    xp: 25,
  },
];

const CATEGORY_META = {
  algebra: { label: 'Álgebra', icon: Sigma, color: 'from-violet-500 to-purple-600', light: 'bg-violet-50 text-violet-700 border-violet-200' },
  calculo: { label: 'Cálculo', icon: Brain, color: 'from-blue-500 to-indigo-600', light: 'bg-blue-50 text-blue-700 border-blue-200' },
  geometria: { label: 'Geometría', icon: Star, color: 'from-cyan-500 to-teal-600', light: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  fisica: { label: 'Física', icon: FlaskConical, color: 'from-orange-500 to-amber-600', light: 'bg-orange-50 text-orange-700 border-orange-200' },
};

const DIFFICULTY_COLOR = {
  fácil: 'bg-emerald-100 text-emerald-700',
  medio: 'bg-yellow-100 text-yellow-700',
  difícil: 'bg-red-100 text-red-700',
};

const TIMER_SECONDS = 60;
const MAX_LIVES = 3;

// Shuffle and pick puzzles for today (deterministic by date)
function getTodaysPuzzles(): Puzzle[] {
  const seed = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  const shuffled = [...PUZZLES].sort((a, b) => {
    const ha = (hash ^ a.id.charCodeAt(0)) % PUZZLES.length;
    const hb = (hash ^ b.id.charCodeAt(0)) % PUZZLES.length;
    return ha - hb;
  });
  return shuffled.slice(0, 5);
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function TacticasCiencia({ onStateChange }: { onStateChange?: () => void }) {
  const puzzles = useMemo(() => getTodaysPuzzles(), []);

  const [phase, setPhase] = useState<'intro' | 'playing' | 'success' | 'fail' | 'finished'>('intro');
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [totalXP, setTotalXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  const puzzle = puzzles[idx];
  const meta = CATEGORY_META[puzzle?.category ?? 'algebra'];
  const CatIcon = meta.icon;

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      setTimedOut(true);
      setPhase('fail');
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const handleAnswer = useCallback((optIdx: number) => {
    if (selected !== null || phase !== 'playing') return;
    setSelected(optIdx);
    if (optIdx === puzzle.correct) {
      const gained = puzzle.xp;
      setTotalXP((x) => x + gained);
      setCorrectCount((c) => c + 1);
      addXP(gained);
      onStateChange?.();
      setPhase('success');
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setPhase('fail');
    }
  }, [selected, phase, puzzle, lives, onStateChange]);

  const nextPuzzle = () => {
    if (lives <= 0) {
      setPhase('finished');
      return;
    }
    const nextIdx = idx + 1;
    if (nextIdx >= puzzles.length) {
      setPhase('finished');
    } else {
      setIdx(nextIdx);
      setSelected(null);
      setPhase('playing');
      setTimeLeft(TIMER_SECONDS);
      setTimedOut(false);
    }
  };

  const retry = () => {
    if (lives <= 0) { setPhase('finished'); return; }
    setSelected(null);
    setPhase('playing');
    setTimeLeft(TIMER_SECONDS);
    setTimedOut(false);
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setPhase('intro');
    setLives(MAX_LIVES);
    setTimeLeft(TIMER_SECONDS);
    setTotalXP(0);
    setCorrectCount(0);
    setTimedOut(false);
  };

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 30 ? '#6366f1' : timeLeft > 15 ? '#f59e0b' : '#ef4444';

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-8 text-white shadow-xl shadow-indigo-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tácticas de Ciencia</h1>
              <p className="text-indigo-200 text-sm">Puzzle diario · 5 desafíos</p>
            </div>
          </div>
          <p className="text-indigo-100 leading-relaxed">
            Pon a prueba tu velocidad mental. Cada puzzle vale hasta <strong className="text-white">+25 XP</strong>. Tienes <strong className="text-white">60 segundos</strong> y <strong className="text-white">3 vidas</strong> para completar los 5 desafíos de hoy.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(CATEGORY_META).map(([key, m]) => {
            const Icon = m.icon;
            return (
              <div key={key} className="flex items-center gap-3 bg-white dark:cyber-card-dark rounded-2xl p-4 border border-surface-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">{m.label}</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500">{PUZZLES.filter((p) => p.category === key).length} puzzles</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rules */}
        <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-surface-900 dark:text-white">¿Cómo funciona?</h3>
          <div className="space-y-2">
            {[
              { icon: Timer, color: 'text-cyan-500', text: '60 segundos por puzzle — ¡la rapidez suma!' },
              { icon: Heart, color: 'text-red-500', text: '3 vidas en total — falla 3 veces y el juego termina' },
              { icon: Zap, color: 'text-amber-500', text: 'Respuesta correcta → +15–25 XP directos a tu cuenta' },
              { icon: BookOpen, color: 'text-indigo-500', text: 'Al fallar, verás la explicación didáctica antes de continuar' },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-surface-600 dark:text-surface-300">
                <r.icon className={`w-5 h-5 ${r.color} flex-shrink-0 mt-0.5`} />
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setPhase('playing')}
          className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 rounded-2xl"
        >
          <Zap className="w-5 h-5" /> Comenzar desafío
        </button>
      </motion.div>
    );
  }

  // ── FINISHED ──
  if (phase === 'finished') {
    const perfect = correctCount === puzzles.length;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
        <div className="bg-white dark:cyber-card-dark rounded-3xl border border-surface-100 shadow-xl overflow-hidden">
          <div className={`p-8 text-center bg-gradient-to-br ${perfect ? 'from-yellow-400 to-orange-500' : 'from-indigo-500 to-violet-600'}`}>
            <div className="mb-3 flex justify-center">
              {perfect ? <Trophy className="w-16 h-16 text-white" /> : correctCount >= 3 ? <Target className="w-16 h-16 text-white" /> : <Star className="w-16 h-16 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {perfect ? '¡Perfecto! Sin errores' : correctCount >= 3 ? '¡Buen trabajo!' : '¡Sigue practicando!'}
            </h2>
            <p className="text-white/80 text-sm">Completaste la sesión de hoy</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-surface-50 dark:bg-surface-800/60 rounded-2xl p-4">
                <p className="text-2xl font-bold text-indigo-600">+{totalXP}</p>
                <p className="text-xs text-surface-500 mt-1">XP ganados</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-800/60 rounded-2xl p-4">
                <p className="text-2xl font-bold text-emerald-600">{correctCount}/{puzzles.length}</p>
                <p className="text-xs text-surface-500 mt-1">Correctas</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-800/60 rounded-2xl p-4">
                <p className="text-2xl font-bold text-orange-500">{lives}</p>
                <p className="text-xs text-surface-500 mt-1">Vidas restantes</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={restart} className="btn-primary py-3.5 flex items-center justify-center gap-2 rounded-2xl">
                <RotateCcw className="w-4 h-4" /> Jugar de nuevo
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── PLAYING / SUCCESS / FAIL ──
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-5">

      {/* Progress bar + lives + timer */}
      <div className="flex items-center justify-between gap-4">
        {/* Lives */}
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i === MAX_LIVES - lives && lives < MAX_LIVES ? [1.3, 1] : 1 }}
            >
              <Heart
                className="w-6 h-6"
                fill={i < lives ? '#ef4444' : 'transparent'}
                stroke={i < lives ? '#ef4444' : '#d1d5db'}
              />
            </motion.div>
          ))}
        </div>

        {/* Puzzle progress dots */}
        <div className="flex gap-2 flex-1 justify-center">
          {puzzles.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < idx ? 'bg-indigo-500 w-6' : i === idx ? 'bg-indigo-400 w-6' : 'bg-surface-200 dark:bg-surface-700 w-4'
              }`}
            />
          ))}
        </div>

        {/* XP counter */}
        <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
          <Zap className="w-4 h-4" /> +{totalXP} XP
        </div>
      </div>

      {/* Main puzzle card */}
      <div className="bg-white dark:cyber-card-dark rounded-3xl border border-surface-100 shadow-lg overflow-hidden">

        {/* Category + difficulty strip */}
        <div className={`bg-gradient-to-r ${meta.color} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <CatIcon className="w-5 h-5" />
              <span className="font-semibold text-sm">{meta.label}</span>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white`}>
              {puzzle.difficulty}
            </span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1.5 bg-surface-100 dark:bg-surface-800">
          <motion.div
            className="h-full rounded-full transition-all"
            style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
            animate={{ width: `${timerPct}%` }}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Timer + puzzle number */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-surface-400 uppercase tracking-wide">
              Puzzle {idx + 1} de {puzzles.length}
            </span>
            <div className={`flex items-center gap-1.5 text-sm font-bold ${timeLeft <= 15 ? 'text-red-500' : 'text-surface-600 dark:text-surface-300'}`}>
              <Timer className="w-4 h-4" /> {timeLeft}s
            </div>
          </div>

          {/* Question */}
          <div>
            <p className="text-surface-900 dark:text-white font-semibold text-lg leading-relaxed whitespace-pre-line">
              {puzzle.question}
            </p>
            <p className="mt-2 text-sm text-surface-400 italic flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-amber-400" /> Pista: {puzzle.hint}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {puzzle.options.map((opt, i) => {
              let style = 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20';
              if (selected !== null) {
                if (i === puzzle.correct) style = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200';
                else if (i === selected && i !== puzzle.correct) style = 'border-red-300 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300';
                else style = 'border-surface-100 dark:border-surface-700 bg-white dark:cyber-card-dark text-surface-400 dark:text-surface-500';
              }
              return (
                <motion.button
                  key={i}
                  whileHover={selected === null ? { scale: 1.01 } : {}}
                  whileTap={selected === null ? { scale: 0.99 } : {}}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all ${style}`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/70 dark:bg-white/10 border border-current/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback panel */}
          <AnimatePresence>
            {phase === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 p-5 space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                  <PartyPopper className="w-6 h-6 text-emerald-500" />
                  <span>¡Correcto! +{puzzle.xp} XP</span>
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">{puzzle.explanation}</p>
                <button
                  onClick={nextPuzzle}
                  className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors"
                >
                  {idx + 1 < puzzles.length ? 'Siguiente puzzle' : 'Ver resultados'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {phase === 'fail' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 p-5 space-y-3"
              >
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold">
                  {timedOut ? <Timer className="w-6 h-6 text-red-500" /> : <X className="w-6 h-6 text-red-500" />}
                  <span>{timedOut ? 'Se acabó el tiempo' : 'Incorrecto'} — {lives} vida{lives !== 1 ? 's' : ''} restante{lives !== 1 ? 's' : ''}</span>
                </div>
                <div className="bg-white dark:bg-surface-800 rounded-xl p-4 border border-red-100 dark:border-red-900/50">
                  <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1.5 uppercase tracking-wide">Explicación</p>
                  <p className="text-sm text-surface-700 dark:text-surface-200 leading-relaxed">{puzzle.explanation}</p>
                </div>
                <div className="flex gap-3">
                  {lives > 0 && (
                    <button
                      onClick={retry}
                      className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> Reintentar
                    </button>
                  )}
                  <button
                    onClick={nextPuzzle}
                    className="flex items-center gap-1.5 text-sm font-semibold text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors ml-auto"
                  >
                    {idx + 1 < puzzles.length ? 'Siguiente' : 'Ver resultados'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* XP earned this session */}
      {totalXP > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl px-5 py-3"
        >
          <Trophy className="w-4 h-4 text-indigo-500" />
          <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
            Llevas <strong>+{totalXP} XP</strong> en esta sesión — ¡sigue así!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
