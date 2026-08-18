import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CTA() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 md:py-32 bg-gradient-cta relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] border border-white/5 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] border border-white/5 rounded-full"
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/90 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Únete a +25,000 estudiantes peruanos
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Empieza hoy y transforma
            <br />
            <span className="bg-gradient-to-r from-accent-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              tu futuro educativo
            </span>
          </h2>

          <p className="mt-6 text-lg md:text-xl text-primary-100/80 max-w-2xl mx-auto leading-relaxed">
            No dejes que la geografía determine tu educación. 
            Con Kairo, la mejor educación del mundo está a un clic de distancia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a
              href="#/matematicas"
              className="group relative bg-white text-primary-700 font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/15 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Practicar Matemáticas Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#/recursos"
              className="text-white/80 hover:text-white font-medium text-base transition-colors flex items-center gap-2 py-4"
            >
              Explorar Recursos Educativos
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {['14 días gratis', 'Sin tarjeta requerida', 'Cancela cuando quieras'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-primary-100/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
