import { motion } from "framer-motion";
import { useState } from "react";
import { 
  BookOpen, Target, Clock, Award, Zap, ArrowRight, 
  Play, TrendingUp, Star, Calendar 
} from "lucide-react";
import { StoreState } from "../../lib/store";
import { ALL_COURSES, getTotalLessons } from "../../lib/courseData";
import { getCourseCompletionPct } from "../../lib/store";
import { RevisionDojoTopBar } from "../../components/plataforma/RevisionDojoTopBar";

interface Props {
  state: StoreState;
  onNavigate: (view: string, extra?: string) => void;
}

const SUBJECTS = [
  { 
    id: "matematicas", 
    name: "Matemáticas", 
    color: "from-blue-500 to-cyan-400", 
    icon: "📐",
    progress: 78 
  },
  { 
    id: "fisica", 
    name: "Física", 
    color: "from-violet-500 to-purple-400", 
    icon: "⚛️",
    progress: 64 
  },
  { 
    id: "quimica", 
    name: "Química", 
    color: "from-rose-500 to-pink-400", 
    icon: "🧪",
    progress: 41 
  },
  { 
    id: "biologia", 
    name: "Biología", 
    color: "from-emerald-500 to-teal-400", 
    icon: "🧬",
    progress: 89 
  },
  { 
    id: "historia", 
    name: "Historia", 
    color: "from-amber-500 to-orange-400", 
    icon: "📜",
    progress: 55 
  },
  { 
    id: "ingles", 
    name: "Inglés", 
    color: "from-sky-500 to-indigo-400", 
    icon: "🌍",
    progress: 92 
  },
];

export default function PremiumDashboard({ state, onNavigate }: Props) {
  const firstName = (state.user?.name || "Hector").split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const activeCourses = ALL_COURSES.slice(0, 6).map((course, index) => {
    const pct = getCourseCompletionPct(course.id, getTotalLessons(course));
    return {
      ...course,
      pct: Math.max(pct, SUBJECTS[index % SUBJECTS.length].progress),
    };
  });

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white">
      {/* Top Bar - RevisionDojo Style */}
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
              <h1 className="text-5xl font-bold tracking-tighter">
                {greeting}, <span className="text-white/90">{firstName}</span>
              </h1>
              <p className="text-lg text-white/60 mt-1">
                Tienes 3 lecciones pendientes hoy • ¡Sigue el ritmo!
              </p>
            </div>
            
            <div className="hidden md:block text-right">
              <div className="text-xs text-white/50">PROGRESO SEMANAL</div>
              <div className="text-4xl font-bold tabular-nums tracking-tighter">74%</div>
            </div>
          </div>
        </div>

        {/* Promo Banner - Very RevisionDojo */}
        <div className="mb-10">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-px">
            <div className="bg-[#0F0F11] rounded-[22px] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="px-4 py-1 bg-emerald-500 text-white text-sm font-bold rounded-2xl flex items-center gap-2">
                  OFERTA DE VERANO
                </div>
                <div>
                  <span className="font-semibold text-lg">50% de descuento</span> en plan anual
                </div>
              </div>
              <button 
                onClick={() => onNavigate("tienda")}
                className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-2xl bg-white text-black hover:bg-white/90 transition"
              >
                Conseguir 50% OFF <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mis Asignaturas - The main section from the screenshot */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-white/70" />
            <h2 className="font-semibold text-xl tracking-tight">Mis asignaturas</h2>
          </div>
          <button 
            onClick={() => onNavigate("cursos")}
            className="text-sm flex items-center gap-1 text-white/60 hover:text-white transition"
          >
            Cambiar asignaturas <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subject Grid - Beautiful cards like RevisionDojo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
          {SUBJECTS.map((subject, index) => (
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Repaso Express", icon: Zap, view: "repaso-express", color: "from-amber-500 to-orange-500" },
            { label: "Plan de Estudio", icon: Calendar, view: "plan", color: "from-indigo-500 to-violet-500" },
            { label: "Banco de Preguntas", icon: Target, view: "banco", color: "from-sky-500 to-blue-500" },
            { label: "Asistente IA", icon: Star, view: "asistente", color: "from-purple-500 to-pink-500" },
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
              <div className="font-semibold flex items-center gap-2">Actividad reciente</div>
              <button onClick={() => onNavigate("cursos")} className="text-xs text-white/60">Ver todo</button>
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
                    <Play className="w-3 h-3" /> Continuar
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-4 bg-[#18181B] border border-white/10 rounded-3xl p-6 flex flex-col">
            <div className="font-semibold mb-4">Esta semana</div>
            
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <div className="text-white/60">Horas estudiadas</div>
                  <div className="font-mono font-bold">14.5h</div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <div className="text-white/60">Lecciones completadas</div>
                  <div className="font-mono font-bold">23</div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[61%] bg-gradient-to-r from-violet-400 to-purple-400 rounded-full" />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => onNavigate("logros")}
                  className="w-full py-3 text-sm font-semibold rounded-2xl border border-white/20 hover:bg-white/5 transition flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" /> Ver logros y ligas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
