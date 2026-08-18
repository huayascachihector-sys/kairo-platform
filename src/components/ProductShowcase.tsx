import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Monitor, Smartphone, Sparkles, TrendingUp, MessageCircle, BookOpen, Flame, Zap } from 'lucide-react';

export default function ProductShowcase() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="plataforma" ref={ref} className="py-20 md:py-32 bg-gradient-cyber relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-cyber-pattern opacity-25" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-cyan-400 text-sm font-mono tracking-wider mb-6">
            <Monitor className="w-4 h-4" />
            PLATAFORMA_INTELIGENTE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Una experiencia de aprendizaje{' '}
            <span className="text-gradient">que inspira</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            Nuestra plataforma combina lo mejor de la tecnología con pedagogía probada para crear 
            una experiencia educativa sin igual en Latinoamérica.
          </p>
        </motion.div>

        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Main Screen */}
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-cyan-500/20">
            <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-1 text-xs text-slate-400 font-mono">
                  <span className="text-emerald-400">🔒</span>
                  app.kairo.pe
                </div>
              </div>
            </div>
            
            {/* Dashboard content */}
            <div className="bg-slate-950 p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Left panel - Progress */}
                <div className="md:col-span-2 space-y-4">
                  <div className="cyber-card rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white text-sm">Tu Progreso Semanal</h3>
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">+23% vs semana pasada</span>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      {[40, 65, 55, 80, 70, 90, 85].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={isVisible ? { height: `${h}%` } : {}}
                          transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
                          className={`flex-1 rounded-lg ${i === 5 ? 'bg-gradient-to-t from-cyan-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'bg-gradient-to-t from-slate-700 to-slate-600'}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Course cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: 'Cálculo Avanzado', progress: 78, color: 'from-primary-500 to-primary-600' },
                      { title: 'Física Cuántica', progress: 45, color: 'from-cyan-500 to-cyan-600' },
                    ].map((course) => (
                      <div key={course.title} className="cyber-card rounded-xl p-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center mb-3 shadow-lg`}>
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-sm text-white">{course.title}</h4>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Progreso</span>
                            <span className="text-cyan-400">{course.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={isVisible ? { width: `${course.progress}%` } : {}}
                              transition={{ duration: 1, delay: 0.8 }}
                              className={`h-full rounded-full bg-gradient-to-r ${course.color}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right panel */}
                <div className="space-y-4">
                  {/* AI Assistant */}
                  <div className="cyber-card rounded-xl p-5 bg-gradient-to-br from-cyan-950/40 to-slate-900 border-cyan-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-bold text-sm text-cyan-300">Asistente Kairo IA</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      "Basándome en tu rendimiento, te recomiendo repasar derivadas parciales antes del examen del viernes."
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-slate-800 border border-cyan-500/20 rounded-lg px-3 py-2 text-xs text-slate-500">
                        Pregúntame algo...
                      </div>
                      <MessageCircle className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="cyber-card rounded-xl p-4">
                    <h3 className="font-bold text-sm text-white mb-3">Este Mes</h3>
                    {[
                      { label: 'Horas estudiadas', value: '47h', icon: TrendingUp, change: '+12%' },
                      { label: 'Ejercicios resueltos', value: '234', icon: BookOpen, change: '+28%' },
                      { label: 'Nota promedio', value: '17.2', icon: Sparkles, change: '+1.3' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2">
                          <stat.icon className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs text-slate-400">{stat.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">{stat.value}</span>
                          <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60, y: 20 }}
            animate={isVisible ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:block absolute -right-8 -bottom-8 w-52"
          >
            <div className="bg-slate-950 border border-cyan-500/20 rounded-3xl p-2 shadow-2xl shadow-cyan-500/10">
              <div className="bg-slate-900 rounded-2xl p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Kairo Mobile</span>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
                  <p className="text-[10px] text-cyan-400 font-mono flex items-center gap-1"><Monitor className="w-3 h-3" /> Próxima clase en vivo</p>
                  <p className="text-xs font-bold text-white mt-1">Álgebra Lineal</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hoy, 7:00 PM · Prof. García</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-emerald-400">Racha</p>
                    <p className="text-sm font-bold text-white flex items-center justify-center gap-1"><Flame className="w-4 h-4 text-orange-400" /> 14</p>
                  </div>
                  <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-amber-400">XP Hoy</p>
                    <p className="text-sm font-bold text-white flex items-center justify-center gap-1"><Zap className="w-4 h-4 text-amber-400" /> 340</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
