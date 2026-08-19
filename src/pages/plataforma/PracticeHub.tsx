import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Brain, AlertCircle, GraduationCap, ChevronRight } from "lucide-react";
import {
  loadState,
  recordPracticeAction,
  getUnresolvedErrorBank,
  markErrorResolved,
  getSubjectProgress,
  getGameSummary,
  type ErrorEntry,
} from "../../lib/store";
import {
  getDueCards,
  updateCardData,
  parseCardId,
  getStats,
  type SRSReview,
} from "../../lib/srsEngine";
import { ALL_COURSES } from "../../lib/courseData";
import { DAILY_XP_GOAL } from "../../lib/gamification";
import { QuestsPanel } from "../../components/plataforma/QuestsPanel";
import SRSRating from "../../components/plataforma/SRSRating";

interface Props {
  onNavigate: (view: string, extra?: string) => void;
}

export default function PracticeHub({ onNavigate }: Props) {
  const [state, setState] = useState(loadState);
  const [, setTick] = useState(0);
  const refresh = () => {
    setState(loadState());
    setTick((t) => t + 1);
  };

  const dueCards = getDueCards();
  const srsStats = getStats();
  const errorBank = getUnresolvedErrorBank();
  const summary = getGameSummary(state);
  const dailyPct = Math.min(100, (summary.dailyXp / DAILY_XP_GOAL) * 100);

  const subjectById = (id: string) => ALL_COURSES.find((c) => c.id === id);
  const errorById = (id: string): ErrorEntry | undefined =>
    [...errorBank, ...loadState().errorBank].find((e) => e.id === id);

  const handleRate = (review: SRSReview, action: Parameters<typeof updateCardData>[1]) => {
    updateCardData(review.cardId, action);
    recordPracticeAction();
    refresh();
  };

  const handleResolveError = (id: string) => {
    markErrorResolved(id);
    recordPracticeAction();
    refresh();
  };

  const weakSubjects = ALL_COURSES.map((c) => ({
    course: c,
    ...getSubjectProgress(loadState(), c.id),
  }))
    .filter((s) => s.total > 0)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Centro de práctica</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
          Tu repaso personalizado: lo que la ciencia dice que olvidarás, justo a tiempo.
        </p>
      </div>

      {/* Daily XP ring */}
      <div className="flex items-center gap-5 bg-white dark:bg-white/5 border border-surface-100 dark:border-white/10 rounded-2xl p-6">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              strokeWidth="8"
              className="stroke-surface-100 dark:stroke-white/10"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="url(#xpGrad)"
              strokeDasharray={`${(dailyPct / 100) * 213.6} 213.6`}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.6 }}
            />
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-surface-900 dark:text-white">
              {summary.dailyXp}
            </span>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-surface-900 dark:text-white">Meta de hoy</h2>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
            {summary.dailyXp}/{DAILY_XP_GOAL} XP · {srsStats.due} repasos pendientes ·{" "}
            {errorBank.length} errores por revisar
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => onNavigate("cursos")}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-rose-500/25 transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5" /> Nueva lección
            </button>
            <button
              onClick={() => onNavigate("tienda")}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-surface-50 dark:bg-white/10 text-surface-900 dark:text-white px-4 py-2 rounded-xl hover:bg-surface-100 dark:hover:bg-white/15 transition-all"
            >
              💎 {summary.gems} gemas
            </button>
          </div>
        </div>
      </div>

      {/* Quests */}
      <QuestsPanel onClaimed={refresh} />

      {/* SRS repaso */}
      <div className="bg-white dark:bg-white/5 border border-surface-100 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-surface-100 dark:border-white/5">
          <Brain className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-bold text-surface-900 dark:text-white">Repaso espaciado</h2>
          <span className="ml-auto text-xs font-bold text-violet-400">
            {srsStats.due} pendientes
          </span>
        </div>
        <div className="p-5 space-y-4">
          {dueCards.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-surface-400 dark:text-surface-500 text-sm mb-3">
                No tienes repasos pendientes 🎉
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Completa lecciones para generar tarjetas de repaso espaciado.
              </p>
            </div>
          ) : (
            dueCards.slice(0, 6).map((review) => {
              const { source, parts } = parseCardId(review.cardId);
              const isError = source === "error";
              const error = isError ? errorById(parts[1]) : undefined;
              const subject = subjectById(review.subjectId);
              const label = isError
                ? error
                  ? `${error.studentText} → ${error.correctedText}`
                  : `Error #${parts[1]}`
                : subject
                  ? `${subject.title}${parts[2] ? ` — ${parts[2]}` : ""}`
                  : `Tarjeta ${review.cardId}`;
              return (
                <div
                  key={review.cardId}
                  className="rounded-xl border border-surface-100 dark:border-white/10 p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isError
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-violet-500/20 text-violet-300"
                        }`}
                      >
                        {isError ? "ERROR" : "REPASO"}
                      </span>
                      <p className="text-sm text-surface-900 dark:text-white mt-2 font-medium break-words">
                        {label}
                      </p>
                      {error && (
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                          {error.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                  <SRSRating onRate={(action) => handleRate(review, action)} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Banco de errores */}
      <div className="bg-white dark:bg-white/5 border border-surface-100 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-surface-100 dark:border-white/5">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-bold text-surface-900 dark:text-white">
            Tus errores de inglés
          </h2>
          <span className="ml-auto text-xs font-bold text-rose-400">
            {errorBank.length} por revisar
          </span>
        </div>
        <div className="p-5 space-y-3">
          {errorBank.length === 0 ? (
            <p className="text-sm text-surface-400 dark:text-surface-500 text-center py-4">
              Sin errores pendientes. ¡Buen trabajo! 🎉
            </p>
          ) : (
            errorBank.slice(0, 6).map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-3 rounded-xl bg-surface-50 dark:bg-white/5 p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-red-400 line-through">{e.studentText}</p>
                  <p className="text-xs text-emerald-400">→ {e.correctedText}</p>
                </div>
                <button
                  onClick={() => handleResolveError(e.id)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex-shrink-0"
                >
                  ✓ Superado
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Temas débiles */}
      {weakSubjects.length > 0 && (
        <div className="bg-white dark:bg-white/5 border border-surface-100 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-surface-100 dark:border-white/5">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-surface-900 dark:text-white">Temas a reforzar</h2>
          </div>
          <div className="p-5 space-y-3">
            {weakSubjects.map((s) => (
              <button
                key={s.course.id}
                onClick={() => onNavigate("cursos", s.course.id)}
                className="w-full flex items-center gap-3 rounded-xl bg-surface-50 dark:bg-white/5 p-3 hover:bg-white/10 transition-colors text-left"
              >
                <span className="text-xl">{s.course.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    {s.course.title}
                  </p>
                  <div className="w-full h-1.5 mt-1 bg-surface-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-surface-400 dark:text-surface-500">
                  {s.pct}%
                </span>
                <ChevronRight className="w-4 h-4 text-surface-500 dark:text-surface-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
