import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ChevronUp, ChevronDown, Zap } from "lucide-react";
import { loadState, type LeagueDivision } from "../../lib/store";
import {
  LEAGUE_DIVISIONS,
  LEAGUE_META,
  getLeagueRanking,
  getLeagueNextDivision,
  getLeaguePrevDivision,
} from "../../lib/gamification";

function DivisionDot({ division, size = 8 }: { division: LeagueDivision; size?: number }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{ width: size, height: size, backgroundColor: LEAGUE_META[division].color }}
    />
  );
}

export default function Ligas() {
  const [state] = useState(loadState);
  const { rows, youPos, total } = getLeagueRanking(state);
  const meta = LEAGUE_META[state.league.division];
  const next = getLeagueNextDivision(state.league.division);
  const prev = getLeaguePrevDivision(state.league.division);

  const leagueContent = (
    <div className="space-y-6">
      {/* Header de división */}
      <div
        className="relative overflow-hidden rounded-2xl border border-surface-100 dark:border-white/10 p-8 text-center"
        style={{ background: `linear-gradient(135deg, ${meta.color}22, transparent 70%)` }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center gap-3 mb-3"
        >
          <Trophy className="w-10 h-10" style={{ color: meta.color }} />
          <span className="text-3xl font-extrabold" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </motion.div>
        <p className="text-surface-400 dark:text-surface-500 text-sm">
          Esta semana ganaste{" "}
          <span className="font-bold text-surface-900 dark:text-white">
            {state.league.weeklyXP} XP
          </span>{" "}
          — posición{" "}
          <span className="font-bold text-surface-900 dark:text-white">#{youPos + 1}</span> de{" "}
          {total}
        </p>
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          {prev && (
            <span className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
              <ChevronDown className="w-3.5 h-3.5" /> <DivisionDot division={prev} />{" "}
              {LEAGUE_META[prev].label}
            </span>
          )}
          <DivisionDot division={state.league.division} size={14} />
          {next && (
            <span className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
              <ChevronUp className="w-3.5 h-3.5" /> <DivisionDot division={next} />{" "}
              {LEAGUE_META[next].label}
            </span>
          )}
        </div>
      </div>

      {/* Ranking */}
      <div className="bg-white dark:bg-white/5 border border-surface-100 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-white/5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-surface-900 dark:text-white">
            Ranking de la semana (XP)
          </h2>
        </div>
        <div className="divide-y divide-surface-100 dark:divide-white/5">
          {rows.map((r, i) => {
            const isYou = r.isYou;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 px-5 py-3 ${
                  isYou
                    ? "bg-gradient-to-r from-primary-500/15 to-transparent border-l-2 border-primary-400"
                    : ""
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i < 3
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-surface-50 dark:bg-white/5 text-surface-500 dark:text-surface-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-lg">{r.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                    {r.name} {isYou && <span className="text-[10px] text-primary-400">(tú)</span>}
                  </p>
                  <div className="w-full h-1.5 mt-1 bg-surface-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (r.xp / (rows[0]?.xp || 1)) * 100)}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: isYou ? "#818cf8" : meta.color }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-amber-400">{r.xp} XP</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progresión de divisiones */}
      <div className="bg-white dark:bg-white/5 border border-surface-100 dark:border-white/10 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-surface-900 dark:text-white mb-4">Todas las ligas</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {LEAGUE_DIVISIONS.map((d, i) => (
            <div key={d} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${
                  d === state.league.division
                    ? "border-surface-300 dark:border-white/40 bg-surface-100 dark:bg-white/10 scale-105"
                    : "border-surface-100 dark:border-white/10"
                }`}
                style={{ color: LEAGUE_META[d].color }}
              >
                <DivisionDot division={d} />
                {LEAGUE_META[d].label}
              </div>
              {i < LEAGUE_DIVISIONS.length - 1 && (
                <ChevronUp className="w-3 h-3 text-surface-400 dark:text-surface-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Ligas semanales</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
          Cada lunes se reinicia la liga. Los mejores suben de división.
        </p>
      </div>
      {leagueContent}
    </div>
  );
}
