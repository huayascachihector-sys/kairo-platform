import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, PenLine, Sparkles, Timer, PlayCircle, BarChart3, Loader2, RotateCcw } from 'lucide-react';
import { TOEFL_QUIZ_SECTIONS, TOEFL_TASKS, type ProductiveTask } from '../../../lib/examData';
import { getExamAttempts, recordExamAttempt, type StoreState } from '../../../lib/store';
import { getAIResponse } from '../../../lib/aiEngine';
import { QuizRunner, ScoreChart, Countdown, fmtTime } from './ExamShared';

interface Props {
  state: StoreState;
  onBack: () => void;
  onStateChange: () => void;
}

const TABS = [
  { id: 'reading', label: 'Reading' },
  { id: 'listening', label: 'Listening' },
  { id: 'speaking', label: 'Speaking' },
  { id: 'writing', label: 'Writing' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ToeflView({ state, onBack, onStateChange }: Props) {
  const [tab, setTab] = useState<TabId>('reading');
  const [running, setRunning] = useState<null | 'practica' | 'simulacro'>(null);

  const quizSection = TOEFL_QUIZ_SECTIONS.find((s) => s.id === tab);
  const attempts = useMemo(() => getExamAttempts(state, 'toefl'), [state]);
  const tabAttempts = attempts.filter((a) => a.section === tab);

  const bestPerSkill = TABS.map((t) => {
    const a = attempts.filter((x) => x.section === t.id);
    return a.length ? Math.max(...a.map((x) => x.scaledScore ?? 0)) : 0;
  });
  const totalEst = bestPerSkill.reduce((x, y) => x + y, 0);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-800 dark:hover:text-surface-200">
        <ArrowLeft className="w-4 h-4" /> Exámenes Internacionales
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-md">🗽</div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">TOEFL iBT</h1>
            <p className="text-surface-500 text-sm">Reading · Listening · Speaking · Writing</p>
          </div>
        </div>
        <div className="px-5 py-3 rounded-2xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 text-center">
          <p className="text-[11px] text-surface-400 font-semibold uppercase tracking-wide">Puntaje estimado</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white">{totalEst || '—'}<span className="text-sm text-surface-400"> /120</span></p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:flex gap-2 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl sm:inline-flex">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setRunning(null); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id ? 'bg-white dark:bg-surface-900 text-primary-700 dark:text-primary-300 shadow-sm'
                           : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {quizSection ? (
        running ? (
          <QuizRunner
            key={`${tab}-${running}`}
            section={quizSection}
            mode={running}
            onExit={() => setRunning(null)}
            onFinish={({ correct, total, minutes }) => {
              const pct = Math.round((correct / total) * 100);
              recordExamAttempt({
                exam: 'toefl', section: tab, mode: running,
                score: pct, scaledScore: Math.round(pct * 0.3),
                correct, total, minutes,
              });
              onStateChange();
            }}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6">
              <h2 className="text-base font-bold text-surface-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-500" /> Progreso — {quizSection.label}
              </h2>
              <div className="mt-4">
                <ScoreChart attempts={tabAttempts} max={30} label="Puntaje por destreza (0–30)" />
              </div>
            </div>
            <div className="space-y-5">
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6">
                <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-1">Banco de preguntas</h3>
                <p className="text-xs text-surface-500 mb-4">{quizSection.questions.length} preguntas con explicación.</p>
                <button onClick={() => setRunning('practica')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold">
                  <PlayCircle className="w-4 h-4" /> Practicar
                </button>
              </div>
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6">
                <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-1 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-amber-500" /> Simulacro cronometrado
                </h3>
                <p className="text-xs text-surface-500 mb-4">Duración real: <strong>{quizSection.realMinutes} minutos</strong>.</p>
                <button onClick={() => setRunning('simulacro')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-sm font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20">
                  <Timer className="w-4 h-4" /> Iniciar simulacro
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        <ProductiveSkill
          skill={tab as 'speaking' | 'writing'}
          attempts={tabAttempts}
          onStateChange={onStateChange}
        />
      )}
    </div>
  );
}

// ─── Speaking / Writing con cronómetro + feedback IA ─────────────────────────
function ProductiveSkill({
  skill,
  attempts,
  onStateChange,
}: {
  skill: 'speaking' | 'writing';
  attempts: ReturnType<typeof getExamAttempts>;
  onStateChange: () => void;
}) {
  const tasks = TOEFL_TASKS.filter((t) => t.skill === skill);
  const [task, setTask] = useState<ProductiveTask>(tasks[0]);
  const [phase, setPhase] = useState<'idle' | 'prep' | 'respond'>('idle');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const start = () => {
    setFeedback(null); setError(null); setText('');
    setElapsed(0);
    setPhase(task.prepSeconds > 0 ? 'prep' : 'respond');
  };

  const sendToAI = async () => {
    if (!text.trim()) { setError('Escribe tu respuesta (o la transcripción de lo que dijiste) antes de enviar.'); return; }
    setLoading(true); setError(null); setFeedback(null);
    const rubric = skill === 'speaking'
      ? 'Delivery, Language Use y Topic Development (rúbrica oficial TOEFL iBT Speaking, 0–4 puntos que se escalan a 0–30).'
      : 'Development, Organization, y Language Use / Sentence Variety (rúbrica oficial TOEFL iBT Writing, 0–5 puntos que se escalan a 0–30).';
    const message = `Actúa como evaluador certificado de TOEFL iBT. Evalúa la siguiente respuesta de ${skill === 'speaking' ? 'Speaking' : 'Writing'}.

TAREA (${task.type}): ${task.prompt}
LÍMITE: ${skill === 'speaking' ? `${task.responseSeconds} segundos` : `${Math.round(task.responseSeconds / 60)} minutos`}${task.minWords ? `, mínimo ${task.minWords} palabras` : ''}
PALABRAS ENVIADAS: ${words}

RESPUESTA DEL ESTUDIANTE:
"""${text.trim()}"""

Evalúa usando los criterios oficiales: ${rubric}
Responde en español con este formato exacto:
PUNTAJE: X/30
Luego, para cada criterio, un párrafo corto con fortalezas y errores concretos citando frases del estudiante.
Termina con "3 acciones para subir de puntaje" en lista numerada.`;

    try {
      const out = await getAIResponse(message);
      setFeedback(out);
      const m = out.match(/PUNTAJE:\s*(\d+(?:\.\d+)?)\s*\/\s*30/i);
      const scaled = m ? Math.round(parseFloat(m[1])) : Math.min(30, Math.round(words / 8));
      recordExamAttempt({
        exam: 'toefl', section: skill, mode: 'practica',
        score: Math.round((scaled / 30) * 100), scaledScore: scaled,
        minutes: Math.max(1, Math.round(elapsed / 60) || Math.round(task.responseSeconds / 60)),
      });
      onStateChange();
      setPhase('idle');
    } catch {
      setError('Error al obtener el feedback del asistente IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        {/* Selector de tarea */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            {skill === 'speaking' ? <Mic className="w-4 h-4 text-primary-500" /> : <PenLine className="w-4 h-4 text-primary-500" />}
            <h2 className="text-base font-bold text-surface-900 dark:text-white">
              {skill === 'speaking' ? 'Speaking — práctica cronometrada' : 'Writing — práctica cronometrada'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {tasks.map((t) => (
              <button key={t.id} onClick={() => { setTask(t); setPhase('idle'); setFeedback(null); setText(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  task.id === t.id ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                   : 'border-surface-200 dark:border-surface-700 text-surface-500'}`}>
                {t.type}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800 mb-4">
            <p className="text-xs font-bold text-surface-400 uppercase tracking-wide mb-1">{task.title}</p>
            <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{task.prompt}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap mb-4">
            {phase === 'idle' && (
              <button onClick={start}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold">
                <Timer className="w-4 h-4" /> Iniciar cronómetro
                {task.prepSeconds > 0 && ` (prep ${task.prepSeconds}s)`}
              </button>
            )}
            {phase === 'prep' && (
              <>
                <span className="text-xs font-bold text-surface-500">Preparación</span>
                <Countdown seconds={task.prepSeconds} running onEnd={() => setPhase('respond')} />
                <button onClick={() => setPhase('respond')} className="text-xs text-primary-600 font-semibold">Saltar</button>
              </>
            )}
            {phase === 'respond' && (
              <>
                <span className="text-xs font-bold text-surface-500">
                  {skill === 'speaking' ? 'Habla y transcribe tu respuesta' : 'Escribe tu respuesta'}
                </span>
                <Countdown
                  seconds={task.responseSeconds}
                  running
                  onEnd={() => setElapsed(task.responseSeconds)}
                />
                <button onClick={() => setPhase('idle')} className="text-xs text-surface-400 inline-flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Reiniciar
                </button>
              </>
            )}
            <span className="ml-auto text-[11px] text-surface-400">
              Límite oficial: {skill === 'speaking' ? fmtTime(task.responseSeconds) : `${Math.round(task.responseSeconds / 60)} min`}
              {task.minWords ? ` · mín. ${task.minWords} palabras` : ''}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={skill === 'speaking'
              ? 'Transcribe aquí lo que dijiste (o escribe tu guion) para que la IA lo evalúe…'
              : 'Escribe aquí tu respuesta…'}
            rows={skill === 'speaking' ? 6 : 12}
            className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-950 p-4 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-y"
          />
          <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
            <span className="text-xs text-surface-400">
              {words} palabras{task.minWords && words < task.minWords ? ` · faltan ${task.minWords - words}` : ''}
            </span>
            <button onClick={sendToAI} disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Evaluando…' : 'Enviar a IA para feedback'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        </div>

        {feedback && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6">
            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-500" /> Feedback con criterios TOEFL iBT
            </h3>
            <div className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap leading-relaxed">
              {feedback}
            </div>
          </motion.div>
        )}
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6 h-fit">
        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary-500" /> Tu progreso
        </h3>
        <ScoreChart attempts={attempts} max={30} label="Puntaje por destreza (0–30)" />
      </div>
    </div>
  );
}
