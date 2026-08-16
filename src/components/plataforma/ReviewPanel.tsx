import { useMemo } from 'react';
import { Brain } from 'lucide-react';
import type { SubjectBank, Question } from '../../data/questionBank';
import { getDueCards, getStats as getSRSStats, parseCardId } from '../../lib/srsEngine';

type Level = 'primaria' | 'secundaria';

interface ReviewPanelProps {
  srsVersion: number;
  jsonBank: SubjectBank[];
  fallbackBank: SubjectBank[];
  level: Level;
  onStartReview: (questions: Question[]) => void;
}

export default function ReviewPanel({ srsVersion, jsonBank, fallbackBank, level, onStartReview }: ReviewPanelProps) {
  const stats = getSRSStats();
  const dueCards = getDueCards();

  const bySubject = useMemo(() => {
    const map = new Map<string, { subjectId: string; level: string; count: number }>();
    for (const card of dueCards) {
      const parts = parseCardId(card.cardId);
      if (parts.source !== 'bank') continue;
      const [, subjectId, lvl] = parts.parts;
      if (lvl !== level) continue;
      const key = `${subjectId}:${lvl}`;
      const existing = map.get(key);
      if (existing) existing.count++;
      else map.set(key, { subjectId, level: lvl, count: 1 });
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [srsVersion, dueCards, level]);

  const bankLookup = useMemo(() => {
    return jsonBank.length > 0 ? jsonBank : fallbackBank;
  }, [jsonBank, fallbackBank]);

  const handleReview = (subjectId: string) => {
    const bank = bankLookup.find(b => b.id === subjectId);
    if (!bank) return;
    const questions = bank[level];
    const dueSet = new Set<string>();
    for (const card of dueCards) {
      const parts = parseCardId(card.cardId);
      if (parts.source === 'bank' && parts.parts[1] === subjectId && parts.parts[2] === level) {
        dueSet.add(parts.parts[3]);
      }
    }
    const filtered = questions.filter((_, i) => dueSet.has(String(i)));
    if (filtered.length > 0) onStartReview(filtered);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.due}</p>
          <p className="text-[10px] text-surface-400 font-medium mt-0.5">Pendientes hoy</p>
        </div>
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.learned}</p>
          <p className="text-[10px] text-surface-400 font-medium mt-0.5">Aprendidas</p>
        </div>
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 text-center">
          <p className={`text-2xl font-bold ${stats.retention >= 70 ? 'text-emerald-600' : stats.retention >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
            {stats.retention}%
          </p>
          <p className="text-[10px] text-surface-400 font-medium mt-0.5">Retención</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-3">
          Materias con repaso pendiente ({level === 'primaria' ? 'Primaria' : 'Secundaria'})
        </h3>
        {bySubject.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
            <p className="text-sm text-surface-500 dark:text-surface-400">No hay tarjetas pendientes. ¡Sigue así!</p>
            {stats.total === 0 && (
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">Practica en la pestaña "Banco" para empezar.</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {bySubject.map(({ subjectId, count }) => {
              const bank = bankLookup.find(b => b.id === subjectId);
              return (
                <div key={subjectId}
                  className="bg-white dark:bg-surface-900 rounded-xl border border-surface-100 dark:border-surface-800 shadow-sm p-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${bank?.color || 'from-primary-500 to-accent-600'} flex items-center justify-center text-base shadow-sm flex-shrink-0`}>
                    {bank?.icon || '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-surface-900 dark:text-white truncate">{bank?.label || subjectId}</p>
                    <p className="text-[11px] text-surface-400">{count} tarjetas por repasar</p>
                  </div>
                  <button onClick={() => handleReview(subjectId)}
                    className="text-xs font-semibold bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-all flex-shrink-0">
                    Repasar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4">
        <h4 className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2">Sobre el repaso espaciado</h4>
        <p className="text-xs text-surface-400 dark:text-surface-500 leading-relaxed">
          Cada pregunta que respondes se agenda automáticamente. Las que te resultaron difíciles vuelven a aparecer pronto;
          las que sabes bien, aparecen después de varios días. Este método (SM-2) duplica la retención a largo plazo.
        </p>
      </div>
    </div>
  );
}
