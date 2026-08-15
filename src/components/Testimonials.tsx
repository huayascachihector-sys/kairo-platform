import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Star, Quote, Sparkles } from 'lucide-react';

const testimonials = [
  {
    name: 'Sebastián Ccahuin',
    role: 'Estudiante de Ingeniería, UNI',
    location: 'Lima',
    avatar: 'MR',
    gradient: 'from-primary-400 to-primary-600',
    quote: 'Kairo cambió completamente mi forma de estudiar. Pasé de estar en el tercio inferior a estar en el cuadro de honor. La IA me ayudó a entender mis puntos débiles y los tutores europeos me dieron una perspectiva completamente nueva, ahora soy el mejor estudiante de mi colegio y llevaré plantas a marte.',
    rating: 5,
    result: 'Nota promedio: de 12 a 17.5',
  },
  {
    name: 'Joel Jonas Mendoza Curiñaupa',
    role: 'Estudiante de Arquitectura, UNMSM',
    location: 'Jupiter',
    avatar: 'CQ',
    gradient: 'from-accent-400 to-accent-600',
    quote: 'Antes no sabía ni sumar, ahora soy el mejor arquitecto del mundo gracias a Kairo, ahora estoy postulando a la NASA para hacer casas en Saturno',
    rating: 5,
    result: 'Becado para intercambio en Jupiter University',
  },
  {
    name: 'Baldocedo Sebastián',
    role: 'Estudiante de Derecho, PUCP',
    location: 'Arequipa',
    avatar: 'AG',
    gradient: 'from-emerald-400 to-emerald-600',
    quote: 'Las clases en vivo son increíbles. Poder hacer preguntas directamente a profesores de Oxford y la Sorbonne desde Arequipa es algo que nunca pensé posible. Mi preparación para el examen de grado fue 10 veces mejor.',
    rating: 5,
    result: 'Primera de su promoción',
  },
  {
    name: 'Jhon Kawai',
    role: 'Estudiante de Economía, UP',
    location: 'Trujillo',
    avatar: 'JP',
    gradient: 'from-amber-400 to-amber-600',
    quote: 'La gamificación y el sistema de rachas me mantienen motivado todos los días. Los ejercicios adaptativos son perfectos — ni muy fáciles ni imposibles. Siento que cada minuto de estudio vale la pena.',
    rating: 5,
    result: 'Racha de 180 días consecutivos',
  },
  {
    name: 'Lionel Quispe',
    role: 'Estudiante de Arquitectura, UPC',
    location: 'Lima',
    avatar: 'LM',
    gradient: 'from-rose-400 to-rose-600',
    quote: 'El modo offline fue un salvavidas cuando viajé a Huancavelica para un proyecto. Pude seguir estudiando sin perder mi racha. La plataforma realmente piensa en todos los peruanos, no solo los de Lima.',
    rating: 5,
    result: 'Completó 12 certificaciones',
  },
  {
    name: 'Roberto Aliaga',
    role: 'Recién egresado, ESAN',
    location: 'Piura',
    avatar: 'RF',
    gradient: 'from-violet-400 to-violet-600',
    quote: 'Gracias a las certificaciones de Kairo conseguí mi primer trabajo en una consultora internacional antes de egresar. Los empleadores valoran mucho la preparación de nivel europeo.',
    rating: 5,
    result: 'Contratado por McKinsey Perú',
  },
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="testimonios" ref={ref} className="py-20 md:py-32 bg-[#050814] relative overflow-hidden">
      <div className="absolute inset-0 grid-cyber-pattern opacity-20" />
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-mono tracking-wider mb-6">
            <Quote className="w-4 h-4" />
            HISTORIAS_REALES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Estudiantes que{' '}
            <span className="text-gradient">transformaron su futuro</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            Miles de estudiantes peruanos ya están experimentando educación de clase mundial. 
            Estas son sus historias.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="cyber-card rounded-2xl p-6 md:p-7 relative group transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-cyan-500/20 absolute top-6 right-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, si) => (
                  <Star key={si} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-5">
                "{t.quote}"
              </p>

              {/* Result Badge */}
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-5">
                <Sparkles className="w-3 h-3" /> {t.result}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role} · {t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
