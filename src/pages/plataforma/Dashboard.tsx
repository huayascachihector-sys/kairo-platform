import { motion } from "framer-motion";
import { useRef } from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Star,
  ChevronRight,
  Play,
  Flame,
  Zap,
  Wand2,
  Sparkles,
  Target,
  Lightbulb,
  Download,
} from "lucide-react";
import {
  StoreState,
  getTotalStats,
  getCourseCompletionPct,
  getExamSummary,
  getWeeklyStudyMinutes as getWeeklyStudyMin,
  getDailyStudyHistory,
  getGameSummary,
  markFlag,
} from "../../lib/store";
import { exportProgressPDF } from "../../lib/pdfExport";
import { ALL_COURSES, getTotalLessons } from "../../lib/courseData";
import { diagnosePerformance, type DiagnosticResult } from "../../lib/aiEngine";
import { QuestsPanel } from "../../components/plataforma/QuestsPanel";
import { Mascot } from "../../components/plataforma/Mascot";

interface Props {
  state: StoreState;
  onNavigate: (view: string, extra?: string) => void;
}

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function buildScoresByTopic(state: StoreState): Record<string, number[]> {
  const scores: Record<string, number[]> = {};
  for (const [courseId, lessons] of Object.entries(state.progress)) {
    for (const [lessonId, data] of Object.entries(lessons)) {
      if (data.score !== undefined && data.score > 0) {
        const course = ALL_COURSES.find((c) => c.id === courseId);
        const topic = course?.title || courseId;
        if (!scores[topic]) scores[topic] = [];
        scores[topic].push(data.score);
      }
    }
  }
  return scores;
}

function getRecommendations(state: StoreState): string[] {
  const recs: string[] = [];
  const stats = getTotalStats(state);
  if (state.streak < 3 && stats.totalLessons < 5) {
    recs.push(
      "Establece una rutina diaria: estudia al menos 30 minutos cada día para mantener tu racha.",
    );
  }
  if (stats.totalLessons > 0 && stats.totalLessons < 10) {
    recs.push(
      "Llevas " +
        stats.totalLessons +
        " lecciones completadas. ¡Sigue así, tu constancia te acerca a tus metas!",
    );
  }
  const satSummary = getExamSummary(state, "sat");
  if (satSummary.attempts === 0) {
    recs.push(
      "¿Preparándote para la universidad? Practica con exámenes SAT para conocer tu nivel.",
    );
  }
  if (state.chatHistory.length < 5) {
    recs.push("Usa el Asistente IA para resolver dudas y recibir recomendaciones personalizadas.");
  }
  return recs;
}

const cardCls =
  "relative bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 overflow-hidden group transition-all duration-300";
const stripCls =
  "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-amber-400";
const dotBg = {
  backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
  backgroundSize: "24px 24px",
};

export default function Dashboard({ state, onNavigate }: Props) {
  const diagFlagged = useRef(false);
  const firstName = (state.user?.name || "Estudiante").split(" ")[0];
  const stats = getTotalStats(state);
  const combinedWeekData = getWeeklyStudyMin(state);
  const maxVal = Math.max(...combinedWeekData, 10);

  const dailyHistory = getDailyStudyHistory(state);
  const totalStudyMinutes = state.studySessions.reduce((s, ss) => s + ss.duration, 0);
  const totalSessions = state.studySessions.length;

  const coursesWithProgress = ALL_COURSES.map((c) => ({
    ...c,
    pct: getCourseCompletionPct(c.id, getTotalLessons(c)),
  }))
    .filter((c) => c.pct > 0)
    .slice(0, 3);

  const satSummary = getExamSummary(state, "sat");
  const toeflSummary = getExamSummary(state, "toefl");
  const examAttempts = satSummary.attempts + toeflSummary.attempts;

  const avgNote = stats.avgScore > 0 ? ((stats.avgScore / 100) * 20).toFixed(1) : "—";
  const game = getGameSummary(state);
  const mascotMsg =
    game.streak >= 3
      ? `¡${game.streak} días de racha! Sigue así 🔥`
      : "¡Hola! ¿Listo para estudiar hoy?";

  const hv = { y: -4, boxShadow: "0 12px 40px rgba(99,102,241,0.15)" };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Mascot
            outfit={state.mascotOutfit}
            reaction={game.streak >= 3 ? "streak" : "happy"}
            message={mascotMsg}
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
              ¡Hola, {firstName}!
            </h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
              Aquí está tu progreso de hoy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportProgressPDF(state)}
            className="group inline-flex items-center gap-2 bg-white dark:cyber-card-dark border border-surface-200 dark:border-surface-700 hover:border-primary-300 text-surface-700 dark:text-surface-200 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
          <button
            onClick={() => onNavigate("repaso-express")}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-lg hover:shadow-primary-200/50 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all"
          >
            <Zap className="w-4 h-4" />
            Repaso Express
            <Sparkles className="w-3.5 h-3.5 opacity-80 group-hover:rotate-12 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate("plan")}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-lg hover:shadow-primary-200/50 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all"
          >
            <Wand2 className="w-4 h-4" />
            Crear Plan de Estudio Inteligente
            <Sparkles className="w-3.5 h-3.5 opacity-80 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Weekly chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hv}
            className={cardCls}
          >
            <div className={stripCls} />
            <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-surface-900 dark:text-white">
                    Tu Progreso Semanal
                  </h2>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                    Minutos de estudio (lecciones + exámenes internacionales)
                  </p>
                </div>
                {stats.totalLessons > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {stats.totalLessons} lecciones
                  </span>
                )}
              </div>
              <div className="flex items-end gap-3 h-36">
                {combinedWeekData.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / maxVal) * 100}%` }}
                      transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                      className={`w-full rounded-lg min-h-[4px] ${
                        val === 0
                          ? "bg-surface-100 dark:bg-white/10"
                          : i === new Date().getDay() - 1
                            ? "bg-gradient-to-t from-primary-600 to-primary-400"
                            : "bg-primary-200 dark:bg-primary-900/30"
                      }`}
                    />
                    <span className="text-[11px] text-surface-400 dark:text-surface-500 font-medium">
                      {days[i]}
                    </span>
                  </div>
                ))}
              </div>
              {stats.totalLessons === 0 && examAttempts === 0 && totalSessions === 0 && (
                <p className="text-center text-surface-400 dark:text-surface-500 text-sm mt-4">
                  Completa tu primera lección o sesión de estudio para ver tu progreso aquí
                </p>
              )}
            </div>
          </motion.div>

          {/* Active courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={hv}
            className={cardCls}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-violet-400 to-indigo-400" />
            <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-surface-900 dark:text-white">Mis Cursos</h2>
                <button
                  onClick={() => onNavigate("cursos")}
                  className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
                >
                  Ver todos <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {coursesWithProgress.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-surface-400 dark:text-surface-500 text-sm mb-4">
                    Aún no has empezado ningún curso
                  </p>
                  <button
                    onClick={() => onNavigate("cursos")}
                    className="btn-primary text-sm !py-2.5 !px-6"
                  >
                    <span className="flex items-center gap-2">Explorar cursos</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {coursesWithProgress.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="flex items-center gap-4 group/course"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-lg flex-shrink-0 shadow-sm`}
                      >
                        {c.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">
                            {c.title}
                          </p>
                          <span className="text-xs font-bold text-surface-600 dark:text-surface-300 ml-2">
                            {c.pct}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-surface-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${c.pct}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate("cursos", c.id)}
                        className="p-2 rounded-lg bg-surface-50 dark:bg-white/10 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-surface-400 dark:text-surface-500 hover:text-primary-600 transition-all flex-shrink-0"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Horas estudiadas",
                value: stats.hours > 0 ? `${stats.hours}h` : "0h",
                icon: Clock,
                color: "text-primary-600",
                bg: "bg-primary-50 dark:bg-primary-900/30",
              },
              {
                label: "Lecciones completadas",
                value: String(stats.totalLessons),
                icon: CheckCircle2,
                color: "text-emerald-600",
                bg: "bg-emerald-50 dark:bg-emerald-900/30",
              },
              {
                label: "Nota promedio",
                value: avgNote,
                icon: Star,
                color: "text-amber-600",
                bg: "bg-amber-50 dark:bg-amber-900/30",
              },
            ].map(({ label, value, icon: Icon, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                whileHover={hv}
                className={cardCls}
              >
                <div className={`absolute inset-0 opacity-[0.03]`} style={dotBg} />
                <div className="relative p-5 text-center">
                  <div
                    className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className={`w-[18px] h-[18px] ${color}`} />
                  </div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">{value}</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Weakness Analysis */}
{(() => {
             const scoresByTopic = getScoresByTopic(state);
             const topics = Object.keys(scoresByTopic);
             if (topics.length === 0) return null;
             const diagnostics: DiagnosticResult[] = diagnosePerformance(scoresByTopic);
             const weakTopics = diagnostics.filter((d) => d.weakness);
             if (weakTopics.length === 0 && diagnostics.length === 0) return null;
             if (!diagFlagged.current) {
               diagFlagged.current = true;
               markFlag("diag_complete");
             }
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={hv}
                className={cardCls}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-orange-400" />
                <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
                <div className="relative p-5">
                  <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    {weakTopics.length > 0 ? "Areas a Reforzar" : "Rendimiento por Tema"}
                  </h3>
                  <div className="space-y-2">
                    {(weakTopics.length > 0 ? weakTopics : diagnostics.slice(0, 3)).map((d, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-surface-50 dark:bg-white/5 rounded-lg p-3"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${d.weakness ? "bg-red-500" : "bg-emerald-500"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-surface-800 dark:text-surface-100">
                              {d.topic}
                            </span>
                            <span
                              className={`text-xs font-bold ${d.weakness ? "text-red-600" : "text-emerald-600"}`}
                            >
                              {d.strength}%
                            </span>
                          </div>
                          <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5">
                            {d.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* Quick AI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(99,102,241,0.3)" }}
            className="relative bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => onNavigate("asistente")}
          >
            <div className="absolute inset-0 opacity-[0.05]" style={dotBg} />
            <div className="relative p-5">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Asistente IA
              </h3>
              <p className="text-white/80 text-sm mb-4">
                "
                {state.chatHistory.slice(-1)[0]?.role === "ai"
                  ? state.chatHistory.slice(-1)[0].text.slice(0, 80) + "..."
                  : "¡Pregúntame cualquier tema!"}
                "
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 px-3 py-1.5 rounded-full group-hover:bg-white/30 transition-all">
                Abrir chat →
              </span>
            </div>
          </motion.div>

          {/* Repaso Express */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(99,102,241,0.3)" }}
            className="relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => onNavigate("repaso-express")}
          >
            <div className="absolute inset-0 opacity-[0.05]" style={dotBg} />
            <div className="relative p-5">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Repaso Express
              </h3>
              <p className="text-white/80 text-sm mb-4">
                5 minutos para repasar tus temas más débiles. ¡No dejes que el olvido te gane!
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 px-3 py-1.5 rounded-full group-hover:bg-white/30 transition-all">
                Empezar →
              </span>
            </div>
          </motion.div>

          {/* Misiones diarias */}
          <QuestsPanel />

          {/* Streak & XP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={hv}
            className={cardCls}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />
            <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
            <div className="relative p-5">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4">Este mes</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4 text-center">
                  <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">
                    {state.streak}
                  </p>
                  <p className="text-xs text-surface-400 dark:text-surface-500">Racha de días</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-4 text-center">
                  <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">{state.xp}</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500">XP ganados</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={hv}
            className={cardCls}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
            <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
            <div className="relative p-5">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-2">
                ¿Listo para estudiar?
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-4">
                Elige un curso y empieza una lección ahora
              </p>
              <button
                onClick={() => onNavigate("cursos")}
                className="btn-primary w-full justify-center text-sm !py-3 shadow-lg shadow-primary-500/20"
              >
                <span className="flex items-center justify-center gap-2">Ir a mis cursos</span>
              </button>
            </div>
          </motion.div>

          {/* Smart Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={hv}
            className={cardCls}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
            <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
            <div className="relative p-5">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Recomendaciones
              </h3>
              <div className="space-y-2">
                {getRecommendations(state).map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-white/5 rounded-lg p-3"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
