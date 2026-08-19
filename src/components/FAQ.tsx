import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    q: '¿Qué hace diferente a Kairo de otras plataformas educativas?',
    a: 'Kairo es la única plataforma diseñada específicamente para estudiantes peruanos que combina IA personalizada, tutores de universidades europeas y contenido adaptado al currículo local con estándares internacionales. Además, funciona offline y es accesible desde cualquier dispositivo.',
  },
  {
    q: '¿Realmente puedo acceder a la misma educación que en Europa?',
    a: 'Kairo es la única plataforma diseñada específicamente para estudiantes peruanos que combina IA personalizada, contenido adaptado al currículo local con estándares internacionales y funciona en cualquier dispositivo.',
  },
  {
    q: '¿Funciona en zonas con internet limitado?',
    a: 'Absolutamente. Kairo tiene un modo offline robusto que te permite descargar lecciones, ejercicios y materiales para estudiar sin conexión. Cuando recuperas la conexión, tu progreso se sincroniza automáticamente.',
  },
  {
    q: '¿Los certificados son reconocidos?',
    a: 'Sí, nuestros certificados son reconocidos por empresas e instituciones educativas tanto en Perú como internacionalmente. Además, contamos con alianzas con universidades para que tus créditos puedan ser validados en ciertos programas.',
  },
  {
    q: '¿Cuánto cuesta KAIRO?',
    a: 'Nada. KAIRO es 100% gratuito para todos los estudiantes: cursos completos, IA personalizada, banco de preguntas, exámenes de admisión y gamificación. No pedimos tarjeta ni hay suscripciones.',
  },
  {
    q: '¿Cómo funciona la IA personalizada?',
    a: 'Nuestro motor de IA analiza tu rendimiento en ejercicios, tu velocidad de aprendizaje, patrones de error y preferencias de estudio para crear un plan completamente personalizado. Identifica tus áreas débiles y prioriza el contenido que más necesitas.',
  },
  {
    q: '¿Por qué es gratis?',
    a: 'Porque creemos que la educación de calidad no debería depender del presupuesto. KAIRO existe para que cualquier estudiante peruano, esté donde esté, acceda a las mejores herramientas de aprendizaje sin barreras.',
  },
  {
    q: '¿Habrá planes pagos en el futuro?',
    a: 'Por ahora no. Todo el contenido es y seguirá siendo gratuito. Si algún día lanzamos funciones adicionales, los primeros estudiantes serán los primeros en enterarse y siempre tendrás acceso a lo esencial sin costo.',
  },
];

function FAQItem({ faq, index, isOpen, onToggle }: {
  faq: typeof faqs[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-2xl transition-all duration-300 ${
        isOpen
          ? 'border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
          : 'border-white/5 bg-slate-900/40 hover:border-white/10'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
        aria-expanded={isOpen}
      >
        <span className={`text-base md:text-lg font-semibold transition-colors ${
          isOpen ? 'text-cyan-300' : 'text-white'
        }`}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-slate-400 leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="faq" ref={ref} className="py-20 md:py-32 bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 grid-cyber-pattern opacity-15" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-mono tracking-wider mb-6">
            <HelpCircle className="w-4 h-4" />
            PREGUNTAS_FRECUENTES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            ¿Tienes <span className="text-gradient">preguntas</span>?
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            Aquí encontrarás las respuestas a las dudas más comunes de nuestros estudiantes.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-4">¿No encuentras tu respuesta?</p>
          <a
            href="#/plataforma"
            className="inline-flex items-center gap-2 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chatea con nuestro equipo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
