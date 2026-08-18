import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, Trophy, Zap, Flame, Star } from 'lucide-react';
import { StoreState, getCourseCompletionPct } from '../../lib/store';
import { ALL_COURSES, getTotalLessons } from '../../lib/courseData';
import SubjectIllustration from '../../components/courses/SubjectIllustration';

const DAILY_XP_GOAL = 100;

interface Props {
  state: StoreState;
  onSelectCourse: (courseId: string) => void;
}

function getCrownLevel(pct: number): number {
  if (pct >= 100) return 3;
  if (pct >= 50) return 2;
  if (pct >= 25) return 1;
  return 0;
}

const patternStyles: Record<string, string> = {
  dots: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.06) 1px, transparent 1px)',
  grid: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
  waves: 'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.04) 8px, rgba(255,255,255,0.04) 16px)',
  none: 'none',
};

const cardGradients: Record<string, string> = {
  matematicas: 'from-indigo-950 via-indigo-900 to-purple-950',
  fisica: 'from-slate-950 via-cyan-950 to-blue-950',
  quimica: 'from-emerald-950 via-teal-950 to-green-950',
  historia: 'from-amber-950 via-yellow-950 to-orange-950',
  comunicacion: 'from-violet-950 via-purple-950 to-fuchsia-950',
  ingles: 'from-rose-950 via-pink-950 to-red-950',
  biologia: 'from-green-950 via-lime-950 to-emerald-950',
  computacion: 'from-indigo-950 via-blue-950 to-sky-950',
};

const cardBorderColors: Record<string, string> = {
  matematicas: 'border-indigo-500/30 hover:border-indigo-400/60',
  fisica: 'border-cyan-500/30 hover:border-cyan-400/60',
  quimica: 'border-emerald-500/30 hover:border-emerald-400/60',
  historia: 'border-amber-500/30 hover:border-amber-400/60',
  comunicacion: 'border-violet-500/30 hover:border-violet-400/60',
  ingles: 'border-rose-500/30 hover:border-rose-400/60',
  biologia: 'border-green-500/30 hover:border-green-400/60',
  computacion: 'border-indigo-500/30 hover:border-indigo-400/60',
};

const glowColors: Record<string, string> = {
  matematicas: 'rgba(139,92,246,0.25)',
  fisica: 'rgba(34,211,238,0.25)',
  quimica: 'rgba(52,211,153,0.25)',
  historia: 'rgba(251,191,36,0.25)',
  comunicacion: 'rgba(167,139,250,0.25)',
  ingles: 'rgba(251,113,133,0.25)',
  biologia: 'rgba(74,222,128,0.25)',
  computacion: 'rgba(99,102,241,0.25)',
};

const stripColors: Record<string, string> = {
  matematicas: 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500',
  fisica: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500',
  quimica: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500',
  historia: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500',
  comunicacion: 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
  ingles: 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-500',
  biologia: 'bg-gradient-to-r from-green-500 via-lime-500 to-emerald-500',
  computacion: 'bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500',
};

export default function MisCursos({ state, onSelectCourse }: Props) {
  const todayXP = 0;
  const xpPct = Math.min(100, (todayXP / DAILY_XP_GOAL) * 100);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mis Cursos</h1>
          <p className="text-surface-400 text-sm mt-1">6 materias completas para dominar</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20">
            <Flame size={18} className="text-orange-400" />
            <span>{state.streak} días</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-400 bg-primary-500/10 px-3.5 py-2 rounded-xl border border-primary-500/20">
            <Zap size={18} className="text-primary-400" />
            <span>{state.xp} XP</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-surface-400">Meta diaria: {DAILY_XP_GOAL} XP</span>
          <span className="text-xs font-semibold text-primary-400">{todayXP} / {DAILY_XP_GOAL}</span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-accent-400 to-amber-400 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
          </motion.div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ALL_COURSES.map((course, i) => {
          const total = getTotalLessons(course);
          const pct = getCourseCompletionPct(course.id, total);
          const done = Math.round((pct / 100) * total);
          const crown = getCrownLevel(pct);
          const pattern = patternStyles[course.pattern] || patternStyles.none;
          const cardBg = cardGradients[course.illustration] || 'from-surface-900 to-surface-800';
          const borderColor = cardBorderColors[course.illustration] || 'border-white/10 hover:border-primary-500/60';
          const glowColor = glowColors[course.illustration] || 'rgba(99,102,241,0.25)';
          const stripGradient = stripColors[course.illustration] || 'bg-primary-500';

          return (
            <motion.button
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: `0 24px 48px -12px ${glowColor}, 0 0 0 1px ${glowColor.replace('0.25', '0.5')}`,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              onClick={() => onSelectCourse(course.id)}
              className={`relative text-left rounded-2xl border ${borderColor} overflow-hidden transition-all duration-300 group`}
              style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))`, backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cardBg} transition-opacity duration-500`}>
                <div className="absolute inset-0" style={{ backgroundImage: pattern, backgroundSize: pattern === patternStyles.none ? undefined : patternStyles.dots === pattern ? '40px 40px' : patternStyles.grid === pattern ? '40px 40px' : '24px 24px' }} />
              </div>

              <div className={`absolute top-0 left-0 right-0 h-1.5 ${stripGradient}`} />

              <div className="relative z-10 p-5">
                <div className="-mx-5 -mt-5 mb-4">
                  <SubjectIllustration subject={course.illustration} animating={false} />
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
                    <p className="text-xs text-surface-400 mb-4 leading-relaxed line-clamp-2">{course.description}</p>
                  </div>
                  {crown > 0 && (
                    <div className="flex gap-0.5 mt-1 shrink-0">
                      {Array.from({ length: crown }).map((_, ci) => (
                        <Trophy key={ci} size={14} className="text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-surface-500">{done}/{total} lecciones</span>
                    <span className="text-xs font-bold text-white">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full relative overflow-hidden"
                      style={{ background: `linear-gradient(90deg, var(--tw-gradient-stops))` }}
                    >
                      <div className={`h-full w-full rounded-full bg-gradient-to-r ${course.gradientProgress}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent shimmer" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <Star className="w-3.5 h-3.5" />
                    {course.modules.length} módulos
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-white/80">
                    {pct === 100 ? (
                      <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completado</>
                    ) : pct > 0 ? (
                      <>Continuar <ChevronRight className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Empezar <ChevronRight className="w-3.5 h-3.5" /></>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
