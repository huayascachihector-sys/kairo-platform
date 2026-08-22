import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Gem, Zap, Heart, Shield } from "lucide-react";
import { loadState, ensureGameState, getDailyQuests } from "../../lib/store";
import { getEffectiveHearts,
  getHeartRefillMs,
  getLevelFromXp,
  getDailyQuestsDone,
  DAILY_XP_GOAL,
} from "../../lib/gamification";

interface GameBarProps {
  onNavigate: (view: string) => void;
}

function fmtCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${totalSec % 60}s`;
}

export function GameBar({ onNavigate }: GameBarProps) {
  const [, force] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(0);

  useEffect(() => {
    ensureGameState();
    const id = setInterval(() => force((x) => x + 1), 15000);
    return () => clearInterval(id);
  }, []);

  const state = loadState();
  const hearts = getEffectiveHearts(state);
  const refillMs = getHeartRefillMs(state);
  const level = getLevelFromXp(state.xp);
  const dailyXp = state.dailyXp.xp;
  const dailyPct = Math.min(100, (dailyXp / DAILY_XP_GOAL) * 100);
  const questsDone = getDailyQuestsDone(state.dailyQuests);
  const questsTotal = state.dailyQuests.length;

  // Detect level up
  useEffect(() => {
    if (prevLevel > 0 && level.level > prevLevel) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2200);
    }
    setPrevLevel(level.level);
  }, [level.level]);

  const chip =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Racha */}
      <button
        onClick={() => onNavigate("dashboard")}
        title="Tu racha de días"
        className={`${chip} bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-300 hover:shadow-md`}
      >
        <Flame className="w-4 h-4 text-orange-500" />
        {state.streak}
        {state.streakFreezes > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-orange-400">
            <Shield className="w-3 h-3" />×{state.streakFreezes}
          </span>
        )}
      </button>

      {/* Corazones */}
      <button
        onClick={() => onNavigate("tienda")}
        title={
          refillMs
            ? `Siguiente corazón en ${fmtCountdown(refillMs)}`
            : "Corazones llenos"
        }
        className={`${chip} ${
          hearts === 0
            ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 animate-pulse"
            : "bg-surface-50 dark:bg-white/5 border-surface-100 dark:border-surface-700 text-surface-600 dark:text-surface-300"
        }`}
      >
        <Heart className="w-4 h-4 text-red-500" />
        {hearts}
        {refillMs && (
          <span className="text-[10px] font-semibold text-surface-400 dark:text-surface-500">
            {fmtCountdown(refillMs)}
          </span>
        )}
      </button>

      {/* Gemas */}
      <button
        onClick={() => onNavigate("tienda")}
        title="Gemas: úsalas en la tienda"
        className={`${chip} bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300`}
      >
        <Gem className="w-4 h-4 text-cyan-500" />
        {state.gems}
      </button>

      {/* Nivel */}
      <div
        title={`Nivel ${level.level} • ${level.current}/${level.next} XP`}
        onClick={() => onNavigate("logros")}
        className={`${chip} bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 relative overflow-hidden cursor-pointer active:scale-95 transition-transform`}
      >
        <Zap className="w-4 h-4 text-violet-500" />
        Nv. {level.level}
        
        {/* Subtle level progress ring */}
        <div className="absolute -right-px -top-px w-3 h-3">
          <svg width="12" height="12" className="-rotate-90">
            <circle cx="6" cy="6" r="5" fill="none" stroke="#c4b5fd" strokeWidth="1.5" />
            <motion.circle 
              cx="6" cy="6" r="5" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"
              strokeDasharray={`${level.pct * 0.314} 31.4`}
              initial={{ strokeDashoffset: 31.4 }}
              animate={{ strokeDashoffset: 31.4 * (1 - level.pct / 100) }}
            />
          </svg>
        </div>

        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: -10 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[9px] px-2 py-px rounded-full font-bold whitespace-nowrap shadow-lg"
            >
              ¡LEVEL UP!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* XP diario */}
      <button
        onClick={() => onNavigate("practice-hub")}
        title={`${dailyXp}/${DAILY_XP_GOAL} XP hoy`}
        className={`${chip} relative overflow-hidden bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 group`}
      >
        <motion.div
          animate={{ width: `${dailyPct}%` }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400/50 to-orange-400/50"
        />
        <span className="relative flex items-center gap-1 font-semibold">
          {dailyXp}
          <span className="text-[10px] opacity-70 group-hover:opacity-100 transition">/ {DAILY_XP_GOAL}</span>
        </span>
        
        {/* Pulse effect when near goal */}
        {dailyPct > 75 && (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent animate-pulse rounded-xl" />
        )}
      </button>

      {/* Misiones */}
      <button
        onClick={() => onNavigate("practice-hub")}
        title="Misiones diarias"
        className={`${chip} bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300`}
      >
        🎯 {questsDone}/{questsTotal}
      </button>
    </div>
  );
}
