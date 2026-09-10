import { motion } from "framer-motion";
import { 
  BookOpen, Target, Award, Zap, ArrowRight, 
  Play, Sparkles, Calendar, Heart, Gem
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
  { 
    id: "matematicas", 
    name: "Matemáticas", 
    color: "from-blue-500 to-cyan-400", 
    icon: "📐",
  },
  { 
    id: "fisica", 
    name: "Física", 
    color: "from-violet-500 to-purple-400", 
    icon: "⚛️",
  },
  { 
    id: "quimica", 
    name: "Química", 
    color: "from-rose-500 to-pink-400", 
    icon: "🧪",
  },
  { 
    id: "biologia", 
    name: "Biología", 
    color: "from-emerald-500 to-teal-400", 
    icon: "🧬",
  },
  { 
    id: "historia", 
    name: "Historia", 
    color: "from-amber-500 to-orange-400", 
    icon: "📜",
  },
  { 
    id: "ingles", 
    name: "Inglés", 
    color: "from-sky-500 to-indigo-400", 
    icon: "🌍",
  },
];

export default function PremiumDashboard({ state, onNavigate }: Props) {
  const firstName = (state.user?.name || "Estudiante").split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  // Calculate real progress for each subject (starts at 0% for new users)
  const subjects = SUBJECTS_CONFIG.map((subj) => {
    const course = ALL_COURSES.find((c) => c.id === subj.id);
    const total = course ? getTotalLessons(course) : 1;
    const progress = getCourseCompletionPct(subj.id, total);
    return { ...subj, progress };
  });

  const activeCourses = ALL_COURSES.slice(0, 6).map((course) => {
    const pct = getCourseCompletionPct(course.id, getTotalLessons(course));
    return {
      ...course,
      pct,
    };
  });

  // Real statistics computed from state
  const totalCompletedLessons = Object.values(state.progress || {}).reduce(
    (sum, cp) => sum + Object.keys(cp || {}).length,
    0
  );

  const weeklyMinutes = (state.studySessions || []).reduce((sum, s) => sum + (s.duration || 0), 0);
  const weeklyHours = (weeklyMinutes / 60).toFixed(1);

  const totalAvailableLessons = ALL_COURSES.reduce((sum, c) => sum + getTotalLessons(c), 0);
  const overallPct = totalAvailableLessons > 0 ? Math.round((totalCompletedLessons / totalAvailableLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white">
      {/* Top Bar */}
      <RevisionDojoTopBar 
        onNavigate={onNavigate}
        userName={state.user?.name}
        xp={state.xp}
        gems={state.gems}
        streak={state.streak}
        avatar={state.user?.avatar}
      />

      <div className="max-w-[1280px] mx-auto px-6 pt-8 pb-20">
        {/* Hero Greeting */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
                {greeting}, <span className="text-white/90">{firstName}</span>
              </h1>
              <p className="text-sm sm:text-base text-white/60 mt-1">
                {totalCompletedLessons === 0 
                  ? "¡Bienvenido a Kairo! Elige un curso o practica en el banco de preguntas para comenzar."
                  : "Continúa avanzando en tus cursos y repasos diarios • ¡Sigue el ritmo!"}
              </p>
            </div>
            
            <div className="hidden md:block text-right">
              <div className="text-xs text-white/50 uppercase tracking-wider">Progreso Global</div>
              <div className="text-4xl font-bold tabular-nums tracking-tighter text-cyan-400">{overallPct}%</div>
            </div>
          </div>
        </div>

        {/* 100% Free Platform Banner */}
        <div className="mb-10">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600 p-px shadow-lg shadow-cyan-950/20">
            <div className="bg-[#0F0F11] rounded-[22px] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> PLATAFORMA 100% LIBRE Y GRATUITA
                </div>
                <div className="text-white/90 text-sm">
                  Acceso ilimitado a <span className="font-semibold text-white">cursos, banco de preguntas y tutores IA</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate("plan")}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-2xl bg-white text-black hover:bg-white/90 active:scale-95 transition"
              >
                Crear Plan con IA <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mis Asignaturas */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-white/70" />
            <h2 className="font-semibold text-xl tracking-tight">Mis asignaturas</h2>
          </div>
          <button 
            onClick={() => onNavigate("cursos")}
            className="text-sm flex items-center gap-1 text-white/60 hover:text-white transition"
          >
            Ver todos los cursos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onNavigate("cursos", subject.id)}
              className="group cursor-pointer rounded-3xl overflow-hidden border border-white/10 bg-[#18181B] hover:border-white/20 transition-all active:bg-[#222225]"
            >
              <div className={`h-[138px] bg-gradient-to-br ${subject.color} p-5 relative flex flex-col justify-between`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl mb-1 opacity-90">{subject.icon}</div>
                    <div className="font-bold text-xl tracking-tight leading-none text-white drop-shadow">
                      {subject.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-xs text-white/70">Progreso</div>
                    <div className="font-mono text-3xl font-bold tracking-[-1.5px] text-white">
                      {subject.progress}
                      <span className="text-sm align-super font-medium">%</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-xs font-semibold px-4 py-1 rounded-2xl flex items-center justify-center transition">
                    Abrir
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Repaso Express", icon: Zap, view: "repaso-express", color: "from-amber-500 to-orange-500" },
            { label: "Plan de Estudio", icon: Calendar, view: "plan", color: "from-indigo-500 to-violet-500" },
            { label: "Banco de Preguntas", icon: Target, view: "banco", color: "from-sky-500 to-blue-500" },
            { label: "Asistente IA", icon: Sparkles, view: "asistente", color: "from-purple-500 to-pink-500" },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => onNavigate(action.view)}
              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-3xl bg-gradient-to-r ${action.color} hover:brightness-110 active:brightness-95 text-white font-semibold transition-all text-sm tracking-wide shadow-lg`}
            >
              <action.icon className="w-5 h-5" />
              {action.label}
            </button>
          ))}
        </div>

        {/* Recent Activity + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Recent Courses */}
          <div className="lg:col-span-8 bg-[#18181B] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="font-semibold flex items-center gap-2">Explorar cursos</div>
              <button onClick={() => onNavigate("cursos")} className="text-xs text-white/60 hover:text-white">Ver todos</button>
            </div>

            <div className="space-y-3">
              {activeCourses.slice(0, 4).map((course, index) => (
                <div 
                  key={index}
                  onClick={() => onNavigate("cursos", course.id)}
                  className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition group"
                >
                  <div className={`w-9 h-9 rounded-2xl flex-shrink-0 bg-gradient-to-br ${course.color || "from-primary-500 to-accent-500"} flex items-center justify-center text-white text-xl`}>
                    {course.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{course.title}</div>
                    <div className="text-xs text-white/50">{course.pct}% completado</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/70 group-hover:text-white">
                    <Play className="w-3 h-3" /> Abrir lección
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real Stats */}
          <div className="lg:col-span-4 bg-[#18181B] border border-white/10 rounded-3xl p-6 flex flex-col">
            <div className="font-semibold mb-4">Tu Actividad</div>
            
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <div className="text-white/60">Tiempo estudiado</div>
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
                    style={{ width: `${Math.min(100, (totalCompletedLessons / 20) * 100)}%` }}
                  />
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
        </div>
      </div>
    </div>
  );
}
