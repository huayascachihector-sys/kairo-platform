import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer, PlayCircle, BarChart3, Target } from 'lucide-react';
import { UNI_SECTIONS } from '../../../lib/examData';
import { getExamAttempts, recordExamAttempt, type StoreState } from '../../../lib/store';
import { QuizRunner, ScoreChart } from './ExamShared';

interface Props {
  state: StoreState;
  onBack: () => void;
  onStateChange: () => void;
}

export default function UniView({ state, onBack, onStateChange }: Props) {
  const [tab, setTab] = useState(UNI_SECTIONS[0].id);
  const [running, setRunning] = useState<null | 'practica' | 'simulacro'>(null);

  const section = UNI_SECTIONS.find((s) => s.id === tab)!;
  const attempts = useMemo(() => getExamAttempts(state, 'uni'), [state]);
  const sectionAttempts = attempts.filter((a) => a.section === tab);

  const bestPerSection = UNI_SECTIONS.map((s) => {
    const a = attempts.filter((x) => x.section === s.id);
    return a.length ? Math.max(...a.map((x) => x.scaledScore ?? 0)) : 0;
  });
  const composite = bestPerSection.every((b) => b > 0)
    ? Math.round((bestPerSection.reduce((x, y) => x + y, 0) / (bestPerSection.length * 100)) * 500)
    : null;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-800 dark:hover:text-surface-200">
        <ArrowLeft className="w-4 h-4" /> Exámenes Peruanos
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md">⚙️</div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">UNI</h1>
            <p className="text-surface-500 text-sm">Examen de Admisión UNI — Dos jornadas con preguntas reales 2020–2024</p>
          </div>
        </div>
        <div className="px-5 py-3 rounded-2xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 text-center">
          <p className="text-[11px] text-surface-400 font-semibold uppercase tracking-wide">Puntaje compuesto est.</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white">{composite ?? '—'}<span className="text-sm text-surface-400"> /500</span></p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl w-full sm:w-auto sm:inline-flex">
        {UNI_SECTIONS.map((s) => (
          <button key={s.id} onClick={() => { setTab(s.id); setRunning(null); }}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === s.id ? 'bg-white dark:bg-surface-900 text-primary-700 dark:text-primary-300 shadow-sm'
                           : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {running ? (
        <QuizRunner
          key={`${tab}-${running}`}
          section={section}
          mode={running}
          onExit={() => setRunning(null)}
          onFinish={({ correct, total, minutes }) => {
            const pct = Math.round((correct / total) * 100);
            recordExamAttempt({
              exam: 'uni', section: tab, mode: running,
              score: pct, scaledScore: Math.round(pct * 5),
              correct, total, minutes: running === 'simulacro' ? Math.max(minutes, 5) : minutes,
            });
            onStateChange();
          }}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6">
            <h2 className="text-base font-bold text-surface-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-500" /> Progreso de puntaje — {section.label}
            </h2>
            <div className="mt-4">
              <ScoreChart attempts={sectionAttempts} max={100} label="Porcentaje de aciertos por intento" />
            </div>
          </motion.div>

          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
               className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary-500" /> Banco de preguntas
              </h3>
              <p className="text-xs text-surface-500 mb-4">
                {section.questions.length} preguntas reales UNI 2020–2024 con explicación inmediata.
              </p>
              <button onClick={() => setRunning('practica')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold">
                <PlayCircle className="w-4 h-4" /> Practicar
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
               className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-1 flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-500" /> Simulacro cronometrado
              </h3>
              <p className="text-xs text-surface-500 mb-4">
                Duración real de la sección: <strong>{section.realMinutes} minutos</strong>. Sin explicaciones hasta el final.
              </p>
              <button onClick={() => setRunning('simulacro')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-amber-300 text-amber-700 dark:text-amber-300 dark:border-amber-700 text-sm font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20">
                <Timer className="w-4 h-4" /> Iniciar simulacro
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
