import { motion } from "framer-motion";
import {
  BookOpen, Target, Award, Zap, ArrowRight, Play,
  Sparkles, Calendar, Flame, Gem, TrendingUp, Rocket,
} from "lucide-react";
import { StoreState } from "../../lib/store";
import { ALL_COURSES, getTotalLessons } from "../../lib/courseData";
import { getCourseCompletionPct } from "../../lib/store";
import { RevisionDojoTopBar } from "../../components/plataforma/RevisionDojoTopBar";

interface Props {
  state: StoreState;
  onNavigate: (view: string, extra?: string) => void;
}

const SUBJECTS_CONFIG = [
  { id: "matematicas", name: "Matemáticas", color: "from-blue-500 to-cyan-400", icon: "📐" },
  { id: "fisica", name: "Física", color: "from-violet-500 to-purple-400", icon: "⚛️" },
  { id: "quimica", name: "Química", color: "from-rose-500 to-pink-400", icon: "🧪" },
  { id: "biologia", name: "Biología", color: "from-emerald-500 to-teal-400", icon: "🧬" },
  { id: "historia", name: "Historia", color: "from-amber-500 to-orange-400", icon: "📜" },
  { id: "ingles", name: "Inglés", color: "from-sky-500 to-indigo-400", icon: "🌍" },
];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const RING_R = 40;
const RING_CIRC = 2 * Math.PI * RING_R;

export default function PremiumDashboard({ state, onNavigate }: Props) {
  const firstName = (state.user?.name || "Estudiante").split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const subjects = SUBJECTS_CONFIG.map((subj) => {
    const course = ALL_COURSES.find((c) => c.id === subj.id);
    const total = course ? getTotalLessons(course) : 1;
    const progress = getCourseCompletionPct(subj.id, total);
    return { ...subj, progress };
  });

  const activeCourses = ALL_COURSES.slice(0, 6).map((course) => {
    const pct = getCourseCompletionPct(course.id, getTotalLessons(course));
    return { ...course, pct };
  });

  const totalCompletedLessons = Object.values(state.progress || {}).reduce(
    (sum, cp) => sum + Object.keys(cp || {}).length,
    0
  );

  const weeklyMinutes = (state.studySessions || []).reduce((sum, s) => sum + (s.duration || 0), 0);
  const weeklyHours = (weeklyMinutes / 60).toFixed(1);

  const totalAvailableLessons = ALL_COURSES.reduce((sum, c) => sum + getTotalLessons(c), 0);
  const overallPct = totalAvailableLessons > 0 ? Math.round((totalCompletedLessons / totalAvailableLessons) * 100) : 0;

  const ringOffset = RING_CIRC * (1 - overallPct / 100);

  return (
    <div className="min-h-screen text-white bg-gradient-hero relative overflow-hidden">
      {/* Capa de rejilla + orbes de luz de fondo */}
      <div className="pointer-events-none absolute inset-0 grid-cyber-pattern" />
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl float" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl float" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10">
        <RevisionDojoTopBar
          onNavigate={onNavigate}
          userName={state.user?.name}
          xp={state.xp}
          gems={state.gems}
          streak={state.streak}
          avatar={state.user?.avatar}
        />

        <div className="max-w-[1280px] mx-auto px-6 pt-8 pb-20">
          {/* ─── Portada (hero) ─────────────────────────────────────── */}
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-8">
            <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden glow-border-indigo">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-cyan-500/10" />

              <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Plataforma educativa KAIRO
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mt-3">
                    {greeting},{" "}
                    <span className="text-gradient-hero">{firstName}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-white/60 mt-2 leading-relaxed">
                    {totalCompletedLessons === 0
                      ? "¡Bienvenido a Kairo! Elige un curso o practica en el banco de preguntas para comenzar tu camino."
                      : "Continúa avanzando en tus cursos y repasos diarios. ¡Sigue el ritmo!"}
                  </p>

                  {/* Chips de estadísticas */}
                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-semibold">{state.streak || 0}</span>
                      <span className="text-xs text-white/50">días de racha</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-semibold">{state.xp || 0}</span>
                      <span className="text-xs text-white/50">XP</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <Gem className="w-4 h-4 text-fuchsia-400" />
                      <span className="text-sm font-semibold">{state.gems || 0}</span>
                      <span className="text-xs text-white/50">gemas</span>
                    </div>
                    <button
                      onClick={() => onNavigate("asistente")}
                      className="btn-primary !py-2.5 !px-5 text-xs sm:text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Rocket className="w-4 h-4" /> Crear Plan con IA
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Progreso global (anillo) */}
                <div className="hidden lg:flex flex-col items-center gap-3 shrink-0">
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <defs>
                        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
                      <circle
                        cx="50" cy="50" r={RING_R} fill="none"
                        stroke="url(#ringGrad)" strokeWidth="9" strokeLinecap="round"
                        strokeDasharray={RING_CIRC} strokeDashoffset={ringOffset}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold tabular-nums tracking-tighter text-gradient-cyan text-center leading-none">
                        {overallPct}
                        <span className="text-sm align-super">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">Progreso global</p>
                  <p className="text-xs text-white/40 text-center -mt-2">{totalCompletedLessons} lecciones</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Banner libertad de la plataforma ───────────────────── */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }} className="mb-10">
            <div className="cyber-card rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10" />
              <div className="relative flex items-center gap-4">
                <div className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> 100% LIBRE Y GRATUITA
                </div>
                <div className="text-white/90 text-sm">
                  Acceso ilimitado a <span className="font-semibold text-white">cursos, banco de preguntas y tutores IA</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate("plan")}
                className="relative flex items-center gap-2 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-2xl bg-white text-black hover:bg-white/90 active:scale-95 transition"
              >
                Plan de estudio <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* ─── Mis asignaturas ────────────────────────────────────── */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.14 }} className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-cyan-300" />
              </div>
              <h2 className="font-semibold text-xl tracking-tight">Mis asignaturas</h2>
            </div>
            <button
              onClick={() => onNavigate("cursos")}
              className="text-sm flex items-center gap-1 text-white/60 hover:text-white transition"
            >
              Ver todos los cursos <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Grid de asignaturas */}
          <motion.div
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10"
          >
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onNavigate("cursos", subject.id)}
                className="group cursor-pointer cyber-card rounded-3xl overflow-hidden"
              >
                <div className={`h-[140px] bg-gradient-to-br ${subject.color} p-5 relative flex flex-col justify-between`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
                  <div className="relative flex items-start justify-between">
                    <div className="text-4xl mb-1 opacity-90 drop-shadow">{subject.icon}</div>
                  </div>
                  <div className="relative flex items-end justify-between mt-auto">
                    <div>
                      <div className="font-bold text-lg tracking-tight leading-tight text-white drop-shadow">
                        {subject.name}
                      </div>
                      <div className="text-xs text-white/80 font-medium">
                        {subject.progress}% completado
                      </div>
                    </div>
                    <div className="bg-white/25 hover:bg-white/40 active:bg-white/50 text-white text-xs font-semibold px-3.5 py-1 rounded-xl flex items-center justify-center transition">
                      Abrir
                    </div>
                  </div>
                </div>
                {/* Barra de progreso inferior */}
                <div className="h-1.5 bg-white/10">
                  <div
                    className={`h-full bg-gradient-to-r ${subject.color} transition-all duration-700`}
                    style={{ width: `${Math.max(2, subject.progress)}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ─── Acciones rápidas ───────────────────────────────────── */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.18 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Repaso Express", icon: Zap, view: "repaso-express", color: "from-amber-500 to-orange-500" },
              { label: "Plan de Estudio", icon: Calendar, view: "plan", color: "from-indigo-500 to-violet-500" },
              { label: "Banco de Preguntas", icon: Target, view: "banco", color: "from-sky-500 to-blue-500" },
              { label: "Asistente IA", icon: Sparkles, view: "asistente", color: "from-purple-500 to-pink-500" },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => onNavigate(action.view)}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${action.color} hover:brightness-110 active:brightness-95 text-white font-semibold transition-all text-sm tracking-wide shadow-lg card-hover`}
              >
                <action.icon className="w-5 h-5" />
                {action.label}
              </button>
            ))}
          </motion.div>

          {/* ─── Explorar cursos + actividad ────────────────────────── */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.22 }} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Explorar cursos
                </div>
                <button onClick={() => onNavigate("cursos")} className="text-xs text-white/60 hover:text-white">Ver todos</button>
              </div>

              <div className="space-y-3">
                {activeCourses.slice(0, 4).map((course, index) => {
                  const color = SUBJECTS_CONFIG.find((s) => s.id === course.id)?.color || "from-primary-500 to-accent-500";
                  return (
                    <div
                      key={index}
                      onClick={() => onNavigate("cursos", course.id)}
                      className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition group"
                    >
                      <div className={`w-10 h-10 rounded-2xl flex-shrink-0 bg-gradient-to-br ${color} flex items-center justify-center text-white text-xl shadow-md`}>
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{course.title}</div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2 max-w-xs">
                          <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${course.pct}%` }} />
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 text-xs text-white/70 group-hover:text-white shrink-0">
                        <Play size={12} /> Abrir
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 glass-card rounded-3xl p-6 flex flex-col">
              <div className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Tu Actividad
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <div className="text-white/60">Tiempo estudiado (semana)</div>
                    <div className="font-mono font-bold">{weeklyHours}h</div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, weeklyMinutes > 0 ? (weeklyMinutes / 300) * 100 : 0))}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <div className="text-white/60">Lecciones completadas</div>
                    <div className="font-mono font-bold">{totalCompletedLessons}</div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (totalCompletedLessons / Math.max(20, totalAvailableLessons)) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-white/40 mt-1">
                    <span>0</span>
                    <span>{totalAvailableLessons} lecciones totales</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate("logros")}
                    className="w-full py-3 text-sm font-semibold rounded-2xl border border-white/20 hover:bg-white/5 transition flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" /> Ver logros y nivel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}