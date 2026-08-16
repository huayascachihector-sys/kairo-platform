import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Check, Sparkles, Zap, Crown, ArrowRight, Shield, Star } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    icon: Zap,
    description: 'Perfecto para empezar tu viaje de aprendizaje',
    monthlyPrice: 29,
    yearlyPrice: 19,
    currency: 'S/',
    popular: false,
    color: 'cyan',
    borderGlow: 'border-slate-700 hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/10 border border-cyan-500/30',
    iconColor: 'text-cyan-400',
    checkColor: 'text-cyan-400',
    features: [
      'Acceso a 500+ lecciones',
      'IA personalizada básica',
      '5 horas de clases en vivo/mes',
      'Ejercicios adaptativos',
      'App móvil con modo offline',
      'Comunidad de estudiantes',
      '1 certificación incluida',
    ],
    cta: 'Empezar Gratis',
  },
  {
    name: 'Pro',
    icon: Sparkles,
    description: 'Para estudiantes comprometidos con la excelencia',
    monthlyPrice: 69,
    yearlyPrice: 49,
    currency: 'S/',
    popular: true,
    color: 'gradient',
    borderGlow: 'border-indigo-500/50',
    iconBg: 'bg-gradient-to-br from-primary-500 to-accent-500',
    iconColor: 'text-white',
    checkColor: 'text-primary-400',
    features: [
      'Todo lo del plan Básico',
      'Acceso ilimitado a todo el contenido',
      'IA avanzada con tutor virtual 24/7',
      'Clases en vivo ilimitadas',
      'Tutorías 1-a-1 (4 sesiones/mes)',
      'Preparación SAT/GRE/IELTS',
      'Certificaciones ilimitadas',
      'Analíticas avanzadas',
      'Asesoría de becas',
    ],
    cta: 'Comenzar 14 días gratis',
  },
  {
    name: 'Premium',
    icon: Crown,
    description: 'Máximo potencial con mentoría personalizada',
    monthlyPrice: 129,
    yearlyPrice: 89,
    currency: 'S/',
    popular: false,
    color: 'violet',
    borderGlow: 'border-slate-700 hover:border-violet-500/50',
    iconBg: 'bg-violet-500/10 border border-violet-500/30',
    iconColor: 'text-violet-400',
    checkColor: 'text-violet-400',
    features: [
      'Todo lo del plan Pro',
      'Mentor personal dedicado',
      'Tutorías 1-a-1 ilimitadas',
      'Acceso a red de ex-alumnos global',
      'Preparación para becas internacionales',
      'Revisión de CV y portafolio',
      'Simulacros de entrevistas',
      'Prioridad en soporte',
      'Acceso anticipado a nuevos cursos',
      'Línea directa con tutores europeos',
    ],
    cta: 'Hablar con un Asesor',
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="precios" ref={ref} className="py-20 md:py-32 bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 grid-cyber-pattern opacity-20" />
      
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-500/8 rounded-full blur-[100px] pointer-events-none" />

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
            PRECIOS_ACCESIBLES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Invierte en tu futuro,{' '}
            <span className="text-gradient">al precio justo</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            Educación de clase mundial a precios diseñados para el estudiante peruano. 
            Cada plan incluye 14 días de prueba gratis.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-slate-500'}`}>
            Mensual
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 border ${
              annual ? 'bg-primary-600/30 border-primary-500/50' : 'bg-slate-800 border-slate-700'
            }`}
            aria-label="Toggle annual pricing"
          >
            <motion.div
              layout
              className="absolute top-1 w-5 h-5 bg-gradient-to-br from-cyan-400 to-primary-500 rounded-full shadow-sm shadow-cyan-500/50"
              style={{ left: annual ? 'calc(100% - 24px)' : '4px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-slate-500'}`}>
            Anual
          </span>
          {annual && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full"
            >
              Ahorra 30%
            </motion.span>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => {
            const price = annual ? plan.yearlyPrice : plan.monthlyPrice;
            const isPro = plan.popular;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className={`relative rounded-2xl md:rounded-3xl overflow-hidden group ${
                  isPro ? 'md:scale-105 md:-my-4' : ''
                }`}
              >
                {/* Pro: gradient border wrapper */}
                {isPro ? (
                  <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-b from-primary-400 via-accent-400 to-emerald-400 p-px">
                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-b from-primary-400 via-accent-400 to-emerald-400" />
                  </div>
                ) : null}

                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-primary-500/40">
                      <Star className="w-3.5 h-3.5 fill-white" /> Más Popular
                    </div>
                  </div>
                )}

                <div className={`relative h-full rounded-2xl md:rounded-3xl p-6 md:p-8 border transition-all duration-300 ${
                  isPro
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-transparent shadow-2xl shadow-primary-500/20'
                    : `cyber-card ${plan.borderGlow} group-hover:-translate-y-1`
                }`}>
                  {/* Ambient glow for pro */}
                  {isPro && (
                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-b from-primary-500/5 via-transparent to-transparent pointer-events-none" />
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 relative">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${plan.iconBg}`}>
                      <plan.icon className={`w-5 h-5 ${plan.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-6 relative">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6 relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={annual ? 'yearly' : 'monthly'}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-baseline gap-1"
                      >
                        <span className="text-sm font-medium text-slate-400">{plan.currency}</span>
                        <span className="text-4xl md:text-5xl font-extrabold text-white">{price}</span>
                        <span className="text-sm text-slate-500">/mes</span>
                      </motion.div>
                    </AnimatePresence>
                    {annual && (
                      <p className="text-xs text-slate-500 mt-1">
                        Facturado anualmente ({plan.currency}{price * 12}/año)
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <a href="#/registro" className={`relative w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isPro
                      ? 'btn-primary !rounded-xl'
                      : plan.color === 'violet'
                      ? 'bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/50 hover:text-violet-200'
                      : 'btn-secondary !rounded-xl'
                  }`}>
                    <span className="flex items-center gap-2">
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </a>

                  {/* Features */}
                  <ul className="mt-6 pt-6 border-t border-white/5 space-y-3 relative">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.checkColor}`} />
                        <span className="text-sm text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm">
            <Shield className="w-6 h-6 text-emerald-400" />
            <div className="text-left">
              <p className="text-sm font-bold text-emerald-300">Garantía de satisfacción de 30 días</p>
              <p className="text-xs text-emerald-500">Si no estás satisfecho, te devolvemos el 100% de tu dinero. Sin preguntas.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
