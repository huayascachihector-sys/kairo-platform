import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CheckCircle2, ArrowRight, GraduationCap, Globe, Lightbulb, MapPin, BookOpen, PenTool, Brain, Trophy } from 'lucide-react';

const benefitBlocks = [
  {
    tag: 'Accesibilidad',
    tagIcon: Globe,
    tagColor: 'bg-accent-500/10 text-accent-600',
    title: 'La misma educación que Europa, desde cualquier rincón del Perú',
    description: 'No importa si estás en Lima, Cusco, Arequipa o Iquitos. Con Kairo accedes a contenido, metodologías y estándares educativos europeos sin moverte de tu ciudad.',
    points: [
      'Contenido adaptado al currículo peruano con estándares europeos',
      'Acceso offline para zonas con conectividad limitada',
      'Interfaz en español con soporte en quechua y aimara',
      'Compatible con cualquier dispositivo, incluso de gama baja',
    ],
    visual: 'map' as const,
    link: '#/recursos',
    linkText: 'Ver todos los recursos',
  },
  {
    tag: 'Metodología',
    tagIcon: Lightbulb,
    tagColor: 'bg-amber-500/10 text-amber-600',
    title: 'Aprendizaje activo respaldado por ciencia cognitiva',
    description: 'Nuestra metodología está basada en las últimas investigaciones en neurociencia del aprendizaje, combinando repetición espaciada, práctica deliberada y feedback inmediato.',
    points: [
      'Repetición espaciada inteligente para máxima retención',
      'Práctica con problemas adaptativos según tu nivel',
      'Feedback inmediato con explicaciones paso a paso',
      'Gamificación que mantiene tu motivación al máximo',
    ],
    visual: 'method' as const,
    link: '#/matematicas',
    linkText: 'Practicar ahora',
  },
  {
    tag: 'Oportunidades',
    tagIcon: GraduationCap,
    tagColor: 'bg-emerald-500/10 text-emerald-600',
    title: 'Abre puertas a universidades y becas internacionales',
    description: 'Kairo no solo mejora tus notas, te prepara para competir a nivel global. Accede a programas de becas, intercambios y oportunidades laborales internacionales.',
    points: [
      'Preparación para exámenes internacionales (SAT, GRE, IELTS)',
      'Red de ex-alumnos en universidades de Europa y EEUU',
      'Asesoría personalizada para aplicar a becas',
      'Certificaciones reconocidas por empleadores globales',
    ],
    visual: 'opportunity' as const,
    link: '#/recursos',
    linkText: 'Ver becas disponibles',
  },
];

function BenefitVisual({ type }: { type: 'map' | 'method' | 'opportunity' }) {
  if (type === 'map') {
    return (
      <div className="relative w-full h-full min-h-[300px] rounded-2xl p-6 flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(5,8,20,0.95) 100%)', border: '1px solid rgba(6,182,212,0.2)'}}>
        <div className="absolute inset-0 grid-cyber-pattern opacity-30" />

        <div className="relative space-y-4 w-full max-w-xs">
          {[
            { city: 'Lima', students: '8,340' },
            { city: 'Cusco', students: '3,210' },
            { city: 'Arequipa', students: '4,150' },
            { city: 'Iquitos', students: '1,870' },
            { city: 'Trujillo', students: '2,960' },
          ].map((item, i) => (
            <motion.div
              key={item.city}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-cyan-500/20"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.city}</p>
                <p className="text-xs text-slate-400">{item.students}+ estudiantes</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'method') {
    return (
      <div className="relative w-full h-full min-h-[300px] rounded-2xl p-6 flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(5,8,20,0.95) 100%)', border: '1px solid rgba(245,158,11,0.2)'}}>
        <div className="relative space-y-3 w-full max-w-xs">
          {[
            { step: '1', label: 'Aprende', desc: 'Video + lectura interactiva', icon: BookOpen, progress: 100, color: 'text-cyan-400' },
            { step: '2', label: 'Practica', desc: 'Ejercicios adaptativos', icon: PenTool, progress: 75, color: 'text-amber-400' },
            { step: '3', label: 'Repasa', desc: 'Repetición espaciada', icon: Brain, progress: 50, color: 'text-violet-400' },
            { step: '4', label: 'Domina', desc: 'Evaluación y certificación', icon: Trophy, progress: 25, color: 'text-yellow-400' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-amber-500/20"
            >
              <div className={`w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-2xl p-6 flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,8,20,0.95) 100%)', border: '1px solid rgba(16,185,129,0.2)'}}>
      <div className="relative space-y-3 w-full max-w-xs">
        {[
          { uni: 'MIT', country: 'EE.UU.', scholarships: '3 becas disponibles' },
          { uni: 'Oxford', country: 'Reino Unido', scholarships: '2 becas disponibles' },
          { uni: 'TU München', country: 'Alemania', scholarships: '5 becas disponibles' },
          { uni: 'Sorbonne', country: 'Francia', scholarships: '4 becas disponibles' },
        ].map((item, i) => (
          <motion.div
            key={item.uni}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.12 }}
            className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-emerald-500/20"
          >
            <span className="text-xs font-bold text-surface-400 uppercase">{item.country}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{item.uni}</p>
              <p className="text-xs text-emerald-400 font-medium">{item.scholarships}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BenefitBlock({
  block,
  index,
}: {
  block: typeof benefitBlocks[number];
  index: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  const isReversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16 ${
        index > 0 ? 'mt-20 md:mt-32' : ''
      }`}
    >
      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="flex-1"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${block.tagColor} text-sm font-mono tracking-wider border border-white/10 mb-5`}>
          <block.tagIcon className="w-4 h-4" />
          {block.tag}
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
          {block.title}
        </h3>
        <p className="mt-4 text-base md:text-lg text-slate-400 leading-relaxed">
          {block.description}
        </p>
        <ul className="mt-6 space-y-3">
          {block.points.map((point, pi) => (
            <motion.li
              key={pi}
              initial={{ opacity: 0, x: -10 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + pi * 0.08 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base text-slate-300">{point}</span>
            </motion.li>
          ))}
        </ul>
        <motion.a
          href={block.link}
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2 mt-8 text-cyan-400 font-semibold hover:text-cyan-300 group transition-colors"
        >
          {block.linkText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.a>
      </motion.div>

      {/* Visual */}
      <motion.div
        initial={{ opacity: 0, x: isReversed ? -30 : 30 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex-1 w-full"
      >
        <BenefitVisual type={block.visual} />
      </motion.div>
    </div>
  );
}

export default function Benefits() {
  return (
    <section className="py-20 md:py-32 bg-[#050814] relative overflow-hidden">
      <div className="absolute inset-0 grid-cyber-pattern opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {benefitBlocks.map((block, index) => (
          <BenefitBlock key={block.tag} block={block} index={index} />
        ))}
      </div>
    </section>
  );
}
