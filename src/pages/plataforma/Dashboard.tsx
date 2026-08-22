import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
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
  Award,
  ArrowRight,
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
import { AnimatedProgressRing } from "../../components/plataforma/AnimatedProgressRing";
import { KnowledgeMap } from "../../components/plataforma/KnowledgeMap";
import { ConfettiBurst } from "../../components/plataforma/ConfettiBurst";

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
    recs.push("Establece una rutina diaria: estudia al menos 30 minutos cada día para mantener tu racha.");
  }
  if (stats.totalLessons > 0 && stats.totalLessons < 10) {
    recs.push(`Llevas ${stats.totalLessons} lecciones completadas. ¡Sigue así, tu constancia te acerca a tus metas!`);
  }
  const satSummary = getExamSummary(state, "sat");
  if (satSummary.attempts === 0) {
    recs.push("¿Preparándote para la universidad? Practica con exámenes SAT para conocer tu nivel.");
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

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

  // Build diagnostic data
  const scoresByTopic = buildScoresByTopic(state);
  const topics = Object.keys(scoresByTopic);
  const diagnostics: DiagnosticResult[] = diagnosePerformance(scoresByTopic);
  const weakTopics = diagnostics.filter((d) => d.weakness);
  const knowledgeTopics = diagnostics.map((d) => ({
    topic: d.topic,
    strength: d.strength,
    weakness: d.weakness,
    suggestion: d.suggestion,
    color: d.weakness ? "#ef4444" : "#22c55e",
  }));

  const handleLevelUp = () => {
    setShowLevelUp(true);
    setShowConfetti(true);
    setTimeout(() => setShowLevelUp(false), 1800);
  };

  const handleKnowledgeClick = (topic: any) => {
    onNavigate("banco");
  };

  return (
    <div className="space-y-6 relative">
      <ConfettiBurst 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      {/* Welcome header */}
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
              Tu progreso de hoy • {new Date().toLocaleDateString("es-PE", { weekday: "long", month: "short", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportProgressPDF(state)}
            className="group inline-flex items-center gap-2 bg-white dark:cyber-card-dark border border-surface-200 dark:border-surface-700 hover:border-primary-300 text-surface-700 dark:text-surface-200 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all active:scale-[0.985]"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>

          <button
            onClick={() => onNavigate("repaso-express")}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-lg hover:shadow-primary-200/50 active:shadow-xl text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all active:scale-[0.985]"
          >
            <Zap className="w-4 h-4" />
            Repaso Express
            <Sparkles className="w-3.5 h-3.5 opacity-80 group-hover:rotate-12 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate("plan")}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-lg hover:shadow-primary-200/50 active:shadow-xl text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all active:scale-[0.985]"
          >
            <Wand2 className="w-4 h-4" />
            Plan Inteligente
            <Sparkles className="w-3.5 h-3.5 opacity-80 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Weekly chart - Enhanced */}
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
                  <h2 className="text-base font-bold text-surface-900 dark:text-white flex items-center gap-2">
                    Tu Progreso Semanal
                    <span className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-primary-100 text-primary-600 font-medium">Esta semana</span>
                  </h2>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                    Minutos de estudio (lecciones + exámenes)
                  </p>
                </div>
                {stats.totalLessons > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {stats.totalLessons} lecciones
                  </span>
                )}
              </div>

              <div className="flex items-end gap-3 h-36 relative">
                {combinedWeekData.map((val, i) => {
                  const isToday = i === new Date().getDay() - 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                      <div className="relative w-full flex justify-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(val / maxVal) * 100}%` }}
                          transition={{ delay: i * 0.05, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                          className={`w-full rounded-xl min-h-[6px] relative overflow-hidden transition-all ${
                            val === 0
                              ? "bg-surface-100 dark:bg-white/10"
                              : isToday
                              ? "bg-gradient-to-t from-primary-600 via-primary-500 to-primary-400 shadow-lg shadow-primary-500/30"
                              : "bg-primary-200 dark:bg-primary-900/30"
                          }`}
                        />
                        {isToday && val > 0 && (
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white dark:bg-primary-400 rounded-full ring-2 ring-primary-500" />
                        )}
                      </div>
                      <span className="text-[11px] text-surface-400 dark:text-surface-500 font-medium group-hover/bar:text-primary-600 transition-colors">
                        {days[i]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {stats.totalLessons === 0 && examAttempts === 0 && totalSessions === 0 && (
                <div className="text-center py-4 mt-2">
                  <p className="text-surface-400 dark:text-surface-500 text-sm">Completa tu primera lección para ver tu progreso</p>
                </div>
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
                  className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1 active:text-primary-700"
                >
                  Ver todos <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {coursesWithProgress.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-surface-100 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                    <Play className="w-8 h-8 text-surface-400" />
                  </div>
                  <p className="text-surface-400 dark:text-surface-500 text-sm mb-4">Aún no has empezado ningún curso</p>
                  <button onClick={() => onNavigate("cursos")} className="btn-primary text-sm !py-2.5 !px-6">
                    Explorar cursos
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
                      className="flex items-center gap-4 group/course bg-surface-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 p-3 rounded-2xl border border-transparent hover:border-surface-200 dark:hover:border-white/10 transition-all cursor-pointer active:scale-[0.985]"
                      onClick={() => onNavigate("cursos", c.id)}
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-lg flex-shrink-0 shadow-sm`}>
                        {c.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">
                            {c.title}
                          </p>
                          <span className="text-xs font-bold text-surface-600 dark:text-surface-300 ml-2 tabular-nums">
                            {c.pct}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-surface-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${c.pct}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                            className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                          />
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-white/10 text-surface-400 group-hover/course:text-primary-600 group-hover/course:bg-primary-50 dark:group-hover/course:bg-primary-900/30 transition-all">
                        <Play className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats row - Premium circular rings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Horas estudiadas",
                value: stats.hours > 0 ? stats.hours : 0,
                suffix: "h",
                icon: Clock,
                color: "#6366f1",
                bg: "bg-primary-50 dark:bg-primary-900/30",
              },
              {
                label: "Lecciones completadas",
                value: stats.totalLessons,
                suffix: "",
                icon: CheckCircle2,
                color: "#22c55e",
                bg: "bg-emerald-50 dark:bg-emerald-900/30",
              },
              {
                label: "Nota promedio",
                value: avgNote !== "—" ? parseFloat(avgNote) : 0,
                suffix: "",
                icon: Star,
                color: "#eab308",
                bg: "bg-amber-50 dark:bg-amber-900/30",
              },
            ].map(({ label, value, suffix, icon: Icon, color, bg }, i) => {
              const ringProgress = label.includes("Horas") ? Math.min((value / 60) * 100, 100) : 
                                   label.includes("Lecciones") ? Math.min((value / 50) * 100, 100) :
                                   Math.min(value * 5, 100);

              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  whileHover={hv}
                  className={cardCls + " p-5 flex flex-col items-center text-center"}
                >
                  <div className="mb-4">
                    <AnimatedProgressRing
                      progress={ringProgress}
                      size={92}
                      strokeWidth={7}
                      color={color}
                      showLabel={false}
                    />
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-baseline justify-center gap-px">
                      <span className="text-4xl font-bold tabular-nums text-surface-900 dark:text-white">
                        {value}
                      </span>
                      {suffix && <span className="font-medium text-xl text-surface-400 ml-px">{suffix}</span>}
                    </div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 tracking-wide">{label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Knowledge Map - Premium Feature */}
          {knowledgeTopics.length > 0 && (
            <KnowledgeMap 
              topics={knowledgeTopics} 
              onTopicClick={handleKnowledgeClick} 
            />
          )}

          {/* Weakness Analysis (legacy) */}
          {weakTopics.length > 0 && knowledgeTopics.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={hv}
              className={cardCls}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-orange-400" />
              <div className="relative p-5">
                <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" /> Áreas a Reforzar
                </h3>
                <div className="space-y-2">
                  {weakTopics.slice(0, 3).map((d, i) => (
                    <div key={i} className="flex items-start gap-3 bg-surface-50 dark:bg-white/5 rounded-lg p-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-500" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-surface-800 dark:text-surface-100">{d.topic}</span>
                          <span className="text-xs font-bold text-red-600">{d.strength}%</span>
                        </div>
                        <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5">{d.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick AI Assistant */}
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
              <p className="text-white/80 text-sm mb-4 line-clamp-2">
                {state.chatHistory.slice(-1)[0]?.role === "ai"
                  ? state.chatHistory.slice(-1)[0].text.slice(0, 75) + "..."
                  : "¡Pregúntame cualquier tema! Te ayudo en tiempo real."}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 px-3 py-1.5 rounded-full group-hover:bg-white/30 transition-all">
                Abrir chat <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>

          {/* Repaso Express CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(245,158,11,0.3)" }}
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
                Empezar ahora <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>

          {/* Misiones diarias */}
          <div className="relative">
            <QuestsPanel onClaimed={() => {
              setShowConfetti(true);
            }} />
          </div>

          {/* Streak & XP - Enhanced with level ring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={hv}
            className={cardCls}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />
            <div className="relative p-5">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4">Este mes</h3>
              
              <div className="flex items-center gap-4">
                {/* Streak */}
                <div className="flex-1 bg-orange-50 dark:bg-orange-900/30 rounded-2xl p-4 text-center relative overflow-hidden">
                  <div className="flex justify-center mb-1">
                    <Flame className="w-7 h-7 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-surface-900 dark:text-white tabular-nums">{state.streak}</div>
                  <div className="text-[10px] text-orange-600 dark:text-orange-400 tracking-wider">DÍAS DE RACHA</div>
                  {state.streakFreezes > 0 && (
                    <div className="absolute top-2 right-2 text-[9px] bg-orange-200 text-orange-700 px-1.5 py-px rounded">🧊 {state.streakFreezes}</div>
                  )}
                </div>

                {/* XP + Level ring */}
                <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl p-4 flex items-center gap-4">
                  <div>
                    <div className="text-3xl font-bold text-surface-900 dark:text-white tabular-nums">{state.xp}</div>
                    <div className="text-[10px] text-yellow-600 dark:text-yellow-400 tracking-wider">XP TOTAL</div>
                  </div>
                  <div className="ml-auto">
                    <AnimatedProgressRing 
                      progress={Math.min(((state.xp % 250) / 250) * 100, 100)} 
                      size={54} 
                      strokeWidth={5} 
                      color="#eab308" 
                      showLabel={false} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Smart Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={hv}
            className={cardCls}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
            <div className="relative p-5">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Recomendaciones
              </h3>
              <div className="space-y-2">
                {getRecommendations(state).slice(0, 3).map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-white/5 rounded-lg p-3">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating level-up toast */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-[9999]"
          >
            <Award className="w-5 h-5" />
            <div>
              <div className="font-bold">¡Subiste de nivel!</div>
              <div className="text-xs text-white/80">Sigue así, campeón 🔥</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
