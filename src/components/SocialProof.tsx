import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Zap } from 'lucide-react';

const logos = [
  { name: 'Universidad de Lima', abbr: 'ULima' },
  { name: 'PUCP', abbr: 'PUCP' },
  { name: 'UNI', abbr: 'UNI' },
  { name: 'UNMSM', abbr: 'UNMSM' },
  { name: 'ESAN', abbr: 'ESAN' },
  { name: 'UP', abbr: 'UPacífico' },
  { name: 'USIL', abbr: 'USIL' },
  { name: 'UPC', abbr: 'UPC' },
];

export default function SocialProof() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-20 bg-gradient-dark relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-cyber-pattern opacity-20" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Comunidad Kairo</span>
          </div>
          <p className="text-sm font-semibold text-slate-400 tracking-wider">
            Estudiantes de las mejores universidades del Perú confían en <span className="text-cyan-400">Kairo</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-5"
        >
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-center justify-center px-5 py-2.5 rounded-xl cyber-card cursor-default"
            >
              <span className="text-sm md:text-base font-bold text-slate-400 hover:text-cyan-400 transition-colors tracking-wide font-mono">
                {logo.abbr}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-6 md:gap-8 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[
                'bg-gradient-to-br from-primary-400 to-primary-600',
                'bg-gradient-to-br from-accent-400 to-accent-600',
                'bg-gradient-to-br from-emerald-400 to-emerald-600',
                'bg-gradient-to-br from-amber-400 to-amber-500',
              ].map((bg, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {['MR', 'AC', 'LG', 'JP'][i]}
                </div>
              ))}
            </div>
            <span className="text-sm text-slate-400">
              <span className="font-semibold text-slate-200">+2,847</span> se unieron este mes
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm font-semibold text-slate-200 ml-1">4.9</span>
            <span className="text-sm text-slate-500">(3,200+ reseñas)</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
