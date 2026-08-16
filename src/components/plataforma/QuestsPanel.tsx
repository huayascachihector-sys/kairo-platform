import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Check, Gift, Lock } from "lucide-react";
import {
  getDailyQuests,
  claimQuestReward,
  ensureGameState,
  type QuestProgress,
} from "../../lib/store";
import { cn } from "../../lib/utils";

const QUEST_ICONS: Record<string, string> = {
  xp: "⚡",
  lessons: "📚",
  practice: "🎯",
  perfect: "💯",
  streak: "🔥",
};

interface QuestsPanelProps {
  compact?: boolean;
  onClaimed?: () => void;
}

export function QuestsPanel({ compact = false, onClaimed }: QuestsPanelProps) {
  const [quests, setQuests] = useState<QuestProgress[]>(() => ensureGameState().dailyQuests);
  const [claimedId, setClaimedId] = useState<string | null>(null);

  const refresh = () => {
    setQuests(getDailyQuests());
    onClaimed?.();
  };

  const handleClaim = (id: string) => {
    claimQuestReward(id);
    setClaimedId(id);
    setTimeout(refresh, 500);
  };

  const done = quests.filter((q) => q.completed).length;

  return (
    <div className="rounded-2xl border border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-rose-500" />
          <span className="text-sm font-bold text-surface-900 dark:text-white">
            Misiones diarias
          </span>
        </div>
        <span className="text-xs font-bold text-surface-500 dark:text-surface-400">
          {done}/{quests.length}
        </span>
      </div>

      <div className={cn("p-3 space-y-2", compact && "p-2 space-y-1.5")}>
        {quests.length === 0 && (
          <p className="text-xs text-surface-400 text-center py-3">Carga tus misiones de hoy...</p>
        )}
        {quests.map((q) => (
          <div
            key={q.id}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
              q.completed
                ? "bg-emerald-50 dark:bg-emerald-900/20"
                : "bg-surface-50 dark:bg-white/5",
            )}
          >
            <div className="text-lg w-7 h-7 flex items-center justify-center flex-shrink-0">
              {QUEST_ICONS[q.type] ?? "🎯"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    "text-xs font-semibold truncate",
                    q.completed
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-surface-800 dark:text-surface-100",
                  )}
                >
                  {q.title}
                </p>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">
                  +{q.reward} XP
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 bg-surface-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                    transition={{ duration: 0.4 }}
                    className={cn(
                      "h-full rounded-full",
                      q.completed
                        ? "bg-emerald-500"
                        : "bg-gradient-to-r from-rose-500 to-amber-400",
                    )}
                  />
                </div>
                <span className="text-[10px] text-surface-400 dark:text-surface-500 flex-shrink-0">
                  {q.progress}/{q.target}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              {q.completed ? (
                q.claimed ? (
                  <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaim(q.id)}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25 hover:scale-110 transition-transform"
                  >
                    <Gift className="w-4 h-4" />
                  </button>
                )
              ) : (
                <span className="w-7 h-7 rounded-full bg-surface-100 dark:bg-white/10 text-surface-400 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
