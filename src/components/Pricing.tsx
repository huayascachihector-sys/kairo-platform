import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Check, Sparkles, Heart, Infinity as InfinityIcon, GraduationCap, ArrowRight } from 'lucide-react';

const benefits = [
  'Todos los cursos completos: Matemática, Física, Química, Historia, Comunicación e Inglés',
  'IA personalizada: asistente, tutor de inglés, copiloto de investigación y más',
  'Banco de preguntas y exámenes de admisión UNI / UNMSM / SAT / TOEFL',
  'Plan de estudio inteligente, repaso con repetición espaciada y flashcards',
  'Preparación para carreras, becas, ensayos y entrevistas',
  'Gamificación completa: XP, ligas, logros, rachas y tienda',
  'App instalable (Android APK y Windows EXE) con modo offline',
];

export default function Pricing() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="precios" ref={ref} className="py-20 md:py-32 bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 grid-cyber-pattern opacity-20" />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-mono tracking-wider mb-6">
            <Sparkles className="w-4 h-4" />
            GRATIS_PARA_SIEMPRE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            100% gratis,{' '}
            <span className="text-gradient">sin letra pequeña</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            KAIRO es completamente gratuito. Todos los cursos, la IA, los exámenes de
            admisión y la gamificación están disponibles para cada estudiante peruano,
            sin tarjetas ni suscripciones.
          </p>
        </motion.div>

        {/* Free card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden group"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-emerald-400 via-primary-400 to-cyan-400 p-px">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-emerald-400 via-primary-400 to-cyan-400" />
          </div>
          <div className="relative h-full rounded-3xl p-6 md:p-10 bg-gradient-to-b from-slate-900 to-slate-950 border-transparent">
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">KAIRO Completo</h3>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 mt-0.5">
                      <InfinityIcon className="w-4 h-4" /> Gratis para siempre
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {benefits.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:w-64 flex-shrink-0 flex flex-col items-center gap-4 md:border-l md:border-white/10 md:pl-8">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-1">Precio para el estudiante</p>
                  <p className="text-5xl font-extrabold text-emerald-400">S/ 0</p>
                  <p className="text-xs text-slate-500 mt-1">No pedimos tu tarjeta</p>
                </div>
                <a
                  href="#/registro"
                  className="btn-primary w-full !rounded-xl flex items-center justify-center gap-2"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Empezar gratis
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-slate-400">
            Nuestra misión: que ningún estudiante peruano deje de aprender por su presupuesto.
            Si algún día esto cambia, los primeros estudiantes serán los primeros en saberlo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}