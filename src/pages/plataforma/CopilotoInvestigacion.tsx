import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, BookMarked, Sparkles, ChevronRight, Loader2, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { getAIResponse } from '../../lib/aiEngine';
import ReactMarkdown from 'react-markdown';

// ─── Types ────────────────────────────────────────────────────────────────────
type WorkType = 'TI' | 'Monografia';
type Criterion = 'A' | 'B' | 'C' | 'D';

interface CriterionFeedback {
  label: string;
  score: string;
  feedback: string;
}

interface AIFeedback {
  A: CriterionFeedback;
  B: CriterionFeedback;
  C: CriterionFeedback;
  D: CriterionFeedback;
  summary: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const WORK_TYPES: { id: WorkType; label: string; description: string }[] = [
  {
    id: 'TI',
    label: 'Trabajo Interno (T.I.)',
    description: 'Investigación práctica dentro de una asignatura IB',
  },
  {
    id: 'Monografia',
    label: 'Monografía (EE)',
    description: 'Ensayo de investigación independiente de 4,000 palabras',
  },
];

const SUBJECTS_TI = ['Física', 'Química', 'Biología', 'Matemáticas', 'Historia', 'Economía', 'Psicología', 'Geografía', 'Inglés', 'Español'];
const SUBJECTS_EE = ['Física', 'Matemáticas (Ecuaciones Diferenciales)', 'Química', 'Biología', 'Historia', 'Economía', 'Literatura', 'Filosofía', 'Ciencias ambientales', 'Psicología'];

const CRITERIA_META: Record<Criterion, { label: string; description: string; color: string }> = {
  A: { label: 'Criterio A', description: 'Enfoque y método', color: 'text-primary-600 bg-primary-50 border-primary-200 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300' },
  B: { label: 'Criterio B', description: 'Comprensión y aplicación', color: 'text-cyan-600 bg-cyan-50 border-cyan-200 dark:bg-cyan-900/30 dark:border-cyan-700 dark:text-cyan-300' },
  C: { label: 'Criterio C', description: 'Pensamiento crítico', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300' },
  D: { label: 'Criterio D', description: 'Presentación', color: 'text-violet-600 bg-violet-50 border-violet-200 dark:bg-violet-900/30 dark:border-violet-700 dark:text-violet-300' },
};

const QUICK_GUIDES = [
  {
    icon: '📐',
    title: 'Incertidumbres en Física',
    body: 'Incluye incertidumbres absolutas y relativas en todas las mediciones. Propaga errores en ecuaciones usando derivadas parciales. El rango de tu gráfica debe reflejar las barras de error.',
  },
  {
    icon: '∫',
    title: 'Ecuaciones Diferenciales en Monografía',
    body: 'Justifica el modelo EDO con fundamento físico o empírico. Muestra la solución analítica y/o numérica (Euler, Runge-Kutta). Compara predicciones del modelo con datos reales.',
  },
  {
    icon: '🔬',
    title: 'Variable independiente clara',
    body: 'Tu pregunta de investigación debe nombrar la VI y la VD explícitamente. Ejemplo: "¿Cómo afecta X a Y?" — no "¿Qué pasa con Y?"',
  },
  {
    icon: '📊',
    title: 'Análisis estadístico',
    body: 'Usa media, desviación estándar y coeficiente de variación. En relaciones lineales, presenta R² de la regresión. Justifica outliers en lugar de eliminarlos silenciosamente.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildPrompt(workType: WorkType, subject: string, question: string): string {
  const typeName = workType === 'TI' ? 'Trabajo Interno (T.I.)' : 'Monografía (Extended Essay)';
  return `Eres un evaluador experto del Bachillerato Internacional (IB) especializado en ${typeName}.

El estudiante ha presentado la siguiente propuesta:
- Tipo de trabajo: ${typeName}
- Materia: ${subject}
- Pregunta / Metodología:
"""
${question}
"""

Evalúa esta propuesta según las rúbricas oficiales del IB. Responde EXCLUSIVAMENTE en el siguiente formato JSON (sin texto extra antes ni después):

{
  "A": {
    "label": "Criterio A: Enfoque y método",
    "score": "X/X",
    "feedback": "..."
  },
  "B": {
    "label": "Criterio B: Comprensión y aplicación",
    "score": "X/X",
    "feedback": "..."
  },
  "C": {
    "label": "Criterio C: Pensamiento crítico",
    "score": "X/X",
    "feedback": "..."
  },
  "D": {
    "label": "Criterio D: Presentación",
    "score": "X/X",
    "feedback": "..."
  },
  "summary": "Resumen breve (2-3 oraciones) con las acciones más importantes que el estudiante debe tomar."
}

El feedback de cada criterio debe ser concreto, accionable y en español. Incluye sugerencias específicas para mejorar.`;
}

function parseFeedback(raw: string): AIFeedback | null {
  try {
    // Extract JSON block from the response
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]) as AIFeedback;
  } catch {
    return null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CopilotoInvestigacion() {
  const [workType, setWorkType] = useState<WorkType>('TI');
  const [subject, setSubject] = useState('Física');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [rawFallback, setRawFallback] = useState('');
  const [activeCriterion, setActiveCriterion] = useState<Criterion>('A');
  const [error, setError] = useState('');

  const subjects = workType === 'TI' ? SUBJECTS_TI : SUBJECTS_EE;

  const analyze = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setFeedback(null);
    setRawFallback('');
    setError('');

    const prompt = buildPrompt(workType, subject, question);
    const raw = await getAIResponse(prompt);

    if (raw.startsWith('⚠️') || raw.startsWith('⏳')) {
      setError(raw);
    } else {
      const parsed = parseFeedback(raw);
      if (parsed) {
        setFeedback(parsed);
        setActiveCriterion('A');
      } else {
        setRawFallback(raw);
      }
    }
    setLoading(false);
  };

  const CRITERIA: Criterion[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-primary-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <FlaskConical className="w-5 h-5 text-white" />
          </span>
          Copiloto de Investigación IB
        </h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
          Evalúa tu T.I. o Monografía según las rúbricas oficiales del Bachillerato Internacional
        </p>
      </div>

      {/* Config panel */}
      <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6 space-y-5">
        {/* Work type selector */}
        <div>
          <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 block">Tipo de trabajo</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WORK_TYPES.map((wt) => (
              <button
                key={wt.id}
                onClick={() => { setWorkType(wt.id); setSubject(wt.id === 'TI' ? SUBJECTS_TI[0] : SUBJECTS_EE[0]); }}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  workType === wt.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500'
                    : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    workType === wt.id ? 'border-primary-500' : 'border-surface-300 dark:border-surface-600'
                  }`}>
                    {workType === wt.id && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                  <span className={`font-semibold text-sm ${workType === wt.id ? 'text-primary-700 dark:text-primary-300' : 'text-surface-800 dark:text-surface-200'}`}>
                    {wt.label}
                  </span>
                </div>
                <p className="text-xs text-surface-400 dark:text-surface-500 pl-6">{wt.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 block">Materia</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400"
          >
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Research question */}
        <div>
          <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 block">
            Pregunta de investigación o descripción de tu metodología
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            placeholder={
              workType === 'TI'
                ? 'Ej: "¿Cómo afecta la longitud de un péndulo simple al período de oscilación en el rango de 20–80 cm, controlando temperatura y amplitud?"\n\nO describe tu experimento: variables, materiales, procedimiento...'
                : 'Ej: "¿En qué medida puede un modelo de ecuaciones diferenciales de tipo Lotka-Volterra predecir las poblaciones de predador/presa en un ecosistema cerrado?"\n\nO pega el resumen de tu metodología...'
            }
            className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 resize-none placeholder:text-surface-400 dark:placeholder:text-surface-600"
          />
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1.5">
            {question.length} caracteres · Cuanta más información, mejor retroalimentación
          </p>
        </div>

        {/* Analyze button */}
        <button
          onClick={analyze}
          disabled={!question.trim() || loading}
          className="btn-primary w-full justify-center !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analizando con IA...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Evaluar según rúbricas IB</>
            )}
          </span>
        </button>
      </div>

      {/* Loading animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="font-semibold text-surface-900 dark:text-white mb-1">La IA está evaluando tu propuesta…</p>
            <p className="text-sm text-surface-400 dark:text-surface-500">Analizando según las rúbricas oficiales del IB</p>
            <div className="flex justify-center gap-1 mt-4">
              {CRITERIA.map((c, i) => (
                <motion.div
                  key={c}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                  className="w-2 h-2 rounded-full bg-primary-400"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
        </div>
      )}

      {/* Raw fallback (couldn't parse JSON) */}
      {rawFallback && !loading && (
        <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-surface-900 dark:text-white">Retroalimentación de la IA</h2>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-surface-700 dark:text-surface-300">
            <ReactMarkdown>{rawFallback}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Structured feedback */}
      <AnimatePresence>
        {feedback && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Summary card */}
            <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">Resumen General</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{feedback.summary}</p>
            </div>

            {/* Criterion tabs */}
            <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-surface-100 dark:border-surface-800 overflow-x-auto">
                {CRITERIA.map((c) => {
                  const meta = CRITERIA_META[c];
                  const isActive = activeCriterion === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setActiveCriterion(c)}
                      className={`flex-1 min-w-[120px] px-4 py-4 text-left transition-all border-b-2 ${
                        isActive
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
                          : 'border-transparent hover:bg-surface-50 dark:hover:bg-surface-800'
                      }`}
                    >
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border mb-1 ${meta.color}`}>
                        {meta.label}
                      </div>
                      <p className="text-xs text-surface-500 dark:text-surface-400 leading-tight">{meta.description}</p>
                      <p className="text-sm font-bold text-surface-700 dark:text-surface-300 mt-1">
                        {feedback[c].score}
                      </p>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCriterion}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${CRITERIA_META[activeCriterion].color}`}>
                      {feedback[activeCriterion].label}
                    </span>
                    <span className="text-2xl font-bold text-surface-900 dark:text-white">
                      {feedback[activeCriterion].score}
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-surface-700 dark:text-surface-300 leading-relaxed">
                    <ReactMarkdown>{feedback[activeCriterion].feedback}</ReactMarkdown>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Re-analyze hint */}
            <div className="flex items-center gap-2 text-xs text-surface-400 dark:text-surface-500 pl-2">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Refina tu pregunta de investigación y analiza de nuevo para ver la mejora</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick guides */}
      <div>
        <h2 className="font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" /> Guías Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_GUIDES.map((g) => (
            <div
              key={g.title}
              className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{g.icon}</span>
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm mb-1.5">{g.title}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{g.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
