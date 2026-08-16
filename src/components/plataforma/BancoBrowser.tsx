import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, BarChart3, Timer, GraduationCap, School, Search } from 'lucide-react';
import type { SubjectBank, Question } from '../../data/questionBank';
import type { ImportedQuestionBank } from '../../lib/store';
import { getSubjectProgress } from '../../lib/store';

type Level = 'primaria' | 'secundaria';
type Difficulty = 'facil' | 'medio' | 'dificil';

const LEVELS: { key: Level; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'primaria', label: 'Primaria', icon: <School className="w-4 h-4" />, color: 'from-emerald-500 to-teal-600' },
  { key: 'secundaria', label: 'Secundaria', icon: <GraduationCap className="w-4 h-4" />, color: 'from-primary-500 to-accent-600' },
];

const DIFFICULTIES = ['facil', 'medio', 'dificil'] as const;
const DIFF_META: Record<Difficulty, { color: string; label: string }> = {
  facil: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', label: 'Fácil' },
  medio: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', label: 'Medio' },
  dificil: { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', label: 'Difícil' },
};

function getDifficulty(q: Question, _level: Level, index: number): Difficulty {
  if (_level === 'primaria') return index < 4 ? 'facil' : index < 7 ? 'medio' : 'dificil';
  return index < 3 ? 'medio' : 'dificil';
}

interface BancoBrowserProps {
  level: Level;
  diffFilter: Difficulty | null;
  subject: string;
  bank: SubjectBank;
  questions: Question[];
  jsonBank: SubjectBank[];
  bankLoading: boolean;
  onSetLevel: (l: Level) => void;
  onSetDiffFilter: (d: Difficulty | null) => void;
  onSetSubject: (s: string) => void;
  onStartQuiz: (timer?: boolean) => void;
  progress: ReturnType<typeof getSubjectProgress>;
  getProgress?: (subjectId: string) => { correct: number; total: number; pct: number };
}

export default function BancoBrowser({
  level, diffFilter, subject, bank, questions, jsonBank, bankLoading,
  onSetLevel, onSetDiffFilter, onSetSubject, onStartQuiz, progress,
  getProgress = () => ({ correct: 0, total: 0, pct: 0 }),
}: BancoBrowserProps) {
  const [search, setSearch] = useState('');

  const allBanks = jsonBank.length > 0 ? jsonBank : [];
  const filteredBanks = useMemo(() => {
    if (!search.trim()) return allBanks;
    const q = search.toLowerCase();
    return allBanks.filter(b => b.label.toLowerCase().includes(q));
  }, [allBanks, search]);

  return (
    <>
      <div className="flex gap-3">
        {LEVELS.map(l => (
          <button key={l.key} onClick={() => onSetLevel(l.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
              level === l.key
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md'
                : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-500 dark:text-surface-400 hover:border-primary-200 dark:hover:border-primary-800'
            }`}>
            {l.icon} {l.label}
          </button>
        ))}
      </div>

      <motion.div key={level} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          {level === 'primaria' ? <School className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
          <div>
            <h2 className="font-bold text-lg">Nivel {level === 'primaria' ? 'Primaria' : 'Secundaria'}</h2>
            <p className="text-white/70 text-xs mt-0.5">
              {level === 'primaria' ? 'Preguntas de conceptos básicos.' : 'Nivel intermedio-avanzado.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white">{bank[level].length} preguntas</span>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white"><Sparkles className="w-3 h-3 inline mr-0.5" /> Con explicaciones</span>
          {progress.total > 0 && (
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white"><BarChart3 className="w-3 h-3 inline mr-0.5" /> {progress.pct}% aciertos</span>
          )}
        </div>
      </motion.div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-surface-400 dark:text-surface-500 font-medium">Dificultad:</span>
        <button onClick={() => onSetDiffFilter(null)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${diffFilter === null ? 'bg-surface-800 dark:bg-white text-white dark:text-surface-900' : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'}`}>
          Todas
        </button>
        {DIFFICULTIES.map(d => (
          <button key={d} onClick={() => onSetDiffFilter(diffFilter === d ? null : d)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${diffFilter === d ? `${DIFF_META[d].color} ring-2 ring-offset-1 dark:ring-offset-surface-900` : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'}`}>
            {DIFF_META[d].label}
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400">Elige una materia:</h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text" placeholder="Buscar materia..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-40 pl-8 pr-3 py-1.5 text-xs rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-200 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredBanks.map((b) => {
            const sp = getProgress(b.id);
            const questCount = (b as any)[level]?.length || 0;
            return (
              <button key={b.id} onClick={() => onSetSubject(b.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left group ${subject === b.id ? 'border-primary-400 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/30 shadow-md' : 'border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50/30 dark:hover:bg-primary-900/10'}`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform`}>{b.icon}</div>
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-bold block ${subject === b.id ? 'text-primary-700 dark:text-primary-300' : 'text-surface-700 dark:text-surface-200'}`}>{b.label}</span>
                  <span className="text-[10px] text-surface-400 dark:text-surface-500">{questCount} preguntas</span>
                </div>
              </button>
            );
          })}
          {filteredBanks.length === 0 && search && (
            <div className="col-span-full text-center py-8 text-sm text-surface-400">
              No se encontraron materias con "{search}"
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-bold text-surface-900 dark:text-white">{bank.label} · {level === 'primaria' ? 'Primaria' : 'Secundaria'}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{questions.length} preguntas · Con explicaciones{progress.total > 0 && ` · ${progress.pct}% aciertos`}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onStartQuiz(true)} disabled={questions.length === 0}
            className="flex items-center gap-2 text-sm font-semibold bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-primary-300 rounded-xl px-5 py-3 transition-all disabled:opacity-50">
            <Timer className="w-4 h-4" /> Con tiempo
          </button>
          <button onClick={() => onStartQuiz(false)} disabled={questions.length === 0}
            className="flex items-center gap-2 text-sm font-semibold bg-primary-600 text-white rounded-xl px-5 py-3 hover:bg-primary-700 transition-all shadow-md disabled:opacity-50">
            <Sparkles className="w-4 h-4" /> Empezar
          </button>
        </div>
      </div>
    </>
  );
}
