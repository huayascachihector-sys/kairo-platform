import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Gem, Zap, Heart, Shield } from "lucide-react";
import { loadState, ensureGameState, getDailyQuests } from "../../lib/store";
import {
  getEffectiveHearts,
  getHeartRefillMs,
  getLevelFromXp,
  getDailyQuestsDone,
  DAILY_XP_GOAL,
} from "../../lib/gamification";
import { PremiumBadge } from "../../lib/premium";

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
  const [tick, setTick] = useState(0);
  const [, force] = useState(0);

  useEffect(() => {
    ensureGameState();
    const id = setInterval(() => {
      setTick((t) => t + 1);
      force((x) => x + 1);
    }, 15000);
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
  const isPremium = state.plan === "premium";

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
          isPremium
            ? "Corazones ilimitados (Pro)"
            : refillMs
              ? `Siguiente corazón en ${fmtCountdown(refillMs)}`
              : "Corazones llenos"
        }
        className={`${chip} ${
          hearts === 0 && !isPremium
            ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 animate-pulse"
            : "bg-surface-50 dark:bg-white/5 border-surface-100 dark:border-surface-700 text-surface-600 dark:text-surface-300"
        }`}
      >
        <Heart className="w-4 h-4 text-red-500" />
        {isPremium ? "∞" : hearts}
        {!isPremium && refillMs && (
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
        title={`Nivel ${level.level}`}
        className={`${chip} bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300`}
      >
        <Zap className="w-4 h-4 text-violet-500" />
        Nv. {level.level}
      </div>

      {/* XP diario */}
      <button
        onClick={() => onNavigate("practice-hub")}
        title={`${dailyXp}/${DAILY_XP_GOAL} XP hoy`}
        className={`${chip} relative overflow-hidden bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300`}
      >
        <motion.div
          animate={{ width: `${dailyPct}%` }}
          transition={{ duration: 0.5 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400/40 to-rose-400/40"
        />
        <span className="relative flex items-center gap-1">
          {dailyXp}
          <span className="text-[10px] opacity-70">/ {DAILY_XP_GOAL} XP</span>
        </span>
      </button>

      {/* Misiones */}
      <button
        onClick={() => onNavigate("practice-hub")}
        title="Misiones diarias"
        className={`${chip} bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300`}
      >
        🎯 {questsDone}/{questsTotal}
      </button>

      {isPremium && <PremiumBadge />}
    </div>
  );
}
