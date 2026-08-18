import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, Globe, Timer, Sparkles, GraduationCap } from 'lucide-react';
import { getExamSummary, type ExamId, type StoreState } from '../../lib/store';
import SATView from './examenes/SATView';
import ToeflView from './examenes/ToeflView';
import UniView from './examenes/UniView';
import UnmsmView from './examenes/UnmsmView';
import Caminos from './examenes/Caminos';

interface Props {
  state: StoreState;
  onStateChange: () => void;
}

const EXAMS: {
  id: ExamId;
  title: string;
  description: string;
  icon: string;
  color: string;
  parts: number;
  maxScore: number;
  note: string;
}[] = [
  {
    id: 'sat',
    title: 'SAT',
    description: 'Digital SAT: Reading & Writing y Math, con simulacros cronometrados igual que el examen real.',
    icon: '🎓',
    color: 'from-blue-500 to-indigo-600',
    parts: 2,
    maxScore: 1600,
    note: '2 secciones · 134 min',
  },
  {
    id: 'toefl',
    title: 'TOEFL',
    description: 'TOEFL iBT: Reading, Listening, Speaking y Writing, con feedback de IA según la rúbrica oficial.',
    icon: '🗽',
    color: 'from-emerald-500 to-teal-600',
    parts: 4,
    maxScore: 120,
    note: '4 destrezas · ~2 h',
  },
  {
    id: 'uni',
    title: 'UNI',
    description: 'Examen de admisión UNI: Matemática, Física, Química, Aptitud y Comunicación. Preguntas reales 2020–2024.',
    icon: '⚙️',
    color: 'from-blue-500 to-indigo-600',
    parts: 5,
    maxScore: 500,
    note: '5 secciones · dos jornadas',
  },
  {
    id: 'unmsm',
    title: 'UNMSM',
    description: 'Examen de admisión UNMSM: Habilidades Verbal, Matemática y Ciencias/Sociales según tu área.',
    icon: '🏛️',
    color: 'from-amber-500 to-orange-600',
    parts: 5,
    maxScore: 100,
    note: '5 áreas · 100 preguntas',
  },
];

export default function ExamenesInternacionales({ state, onStateChange }: Props) {
  const [open, setOpen] = useState<ExamId | null>(null);
  const [pathOpen, setPathOpen] = useState(false);

  if (open === 'sat') return <SATView state={state} onBack={() => setOpen(null)} onStateChange={onStateChange} />;
  if (open === 'toefl') return <ToeflView state={state} onBack={() => setOpen(null)} onStateChange={onStateChange} />;
  if (open === 'uni') return <UniView state={state} onBack={() => setOpen(null)} onStateChange={onStateChange} />;
  if (open === 'unmsm') return <UnmsmView state={state} onBack={() => setOpen(null)} onStateChange={onStateChange} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary-500" /> Exámenes de Admisión
        </h1>
        <p className="text-surface-500 text-sm mt-1">
          SAT, TOEFL, UNI y UNMSM: bancos de preguntas, simulacros cronometrados y feedback de IA.
        </p>
      </div>

      {!pathOpen && <div className="grid md:grid-cols-2 gap-5">
        {EXAMS.map((exam, i) => {
          const s = getExamSummary(state, exam.id);
          const pct = s.pct;
          return (
            <motion.button
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              onClick={() => setOpen(exam.id)}
              className="text-left bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${exam.color} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                {exam.icon}
              </div>

              <h3 className="text-base font-bold text-surface-900 dark:text-white mb-1">{exam.title}</h3>
              <p className="text-xs text-surface-500 mb-4 leading-relaxed">{exam.description}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-surface-500">
                    {s.attempts} {s.attempts === 1 ? 'práctica' : 'prácticas'} · mejor {s.best || '—'}/{exam.maxScore}
                  </span>
                  <span className="text-xs font-bold text-surface-700 dark:text-surface-300">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                    className={`h-full rounded-full bg-gradient-to-r ${exam.color}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-surface-400">
                  <Timer className="w-3.5 h-3.5" /> {exam.note}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {pct >= 90 ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dominado</>
                  ) : s.attempts > 0 ? (
                    <>Continuar <ChevronRight className="w-3.5 h-3.5" /></>
                  ) : (
                    <>Empezar <ChevronRight className="w-3.5 h-3.5" /></>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>}

      <Caminos state={state} onStateChange={onStateChange} onOpenChange={setPathOpen} />

      {!pathOpen && <div className="rounded-2xl border border-surface-100 bg-white dark:cyber-card-dark p-6">
        <h2 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent-500" /> Cómo se registra tu progreso
        </h2>
        <p className="text-sm text-surface-500 leading-relaxed">
          Cada práctica y simulacro suma minutos de estudio y XP, y aparece en <strong>Tu Progreso Semanal</strong> del
          dashboard. Los puntajes se escalan como en el examen real (200–800 por sección del SAT, 0–30 por destreza del TOEFL,
          porcentaje 0–100 para UNI y UNMSM). También se registran en <strong>Caminos</strong> para planificar tu admisión.
        </p>
      </div>}
    </div>
  );
}
