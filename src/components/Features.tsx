import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  Brain,
  Users,
  BookOpenCheck,
  Video,
  BarChart3,
  Clock,
  Zap,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'IA Personalizada',
    description: 'Nuestro motor de IA analiza tu estilo de aprendizaje y crea un plan de estudios único adaptado a tus fortalezas y áreas de mejora.',
    glowColor: 'from-primary-500/20 to-primary-700/10',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10 border border-indigo-500/30',
    dotColor: 'bg-indigo-400',
  },
  {
    icon: Users,
    title: 'Tutores Europeos',
    description: 'Conecta en tiempo real con profesores de universidades top de Europa. Clases 1-a-1 y grupales con expertos en cada materia.',
    glowColor: 'from-cyan-500/20 to-cyan-700/10',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border border-cyan-500/30',
    dotColor: 'bg-cyan-400',
  },
  {
    icon: BookOpenCheck,
    title: 'Contenido Completo',
    description: 'Lecciones interactivas, ejercicios prácticos y materiales actualizados para todos los niveles, siguiendo los estándares educativos más exigentes.',
    glowColor: 'from-emerald-500/20 to-emerald-700/10',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border border-emerald-500/30',
    dotColor: 'bg-emerald-400',
  },
  {
    icon: Video,
    title: 'Clases en Vivo',
    description: 'Sesiones en vivo todos los días con grabaciones disponibles 24/7. Nunca te pierdas una clase, repasa cuando necesites.',
    glowColor: 'from-rose-500/20 to-rose-700/10',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10 border border-rose-500/30',
    dotColor: 'bg-rose-400',
  },
  {
    icon: BarChart3,
    title: 'Analíticas Avanzadas',
    description: 'Dashboard detallado con tu progreso, predicción de notas, identificación de temas débiles y recomendaciones personalizadas.',
    glowColor: 'from-violet-500/20 to-violet-700/10',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border border-violet-500/30',
    dotColor: 'bg-violet-400',
  },
  {
    icon: Clock,
    title: 'Aprende a tu Ritmo',
    description: 'Sin horarios fijos. Estudia a cualquier hora desde cualquier dispositivo. El contenido se adapta a tu disponibilidad.',
    glowColor: 'from-amber-500/20 to-amber-700/10',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border border-amber-500/30',
    dotColor: 'bg-amber-400',
  },
  {
    icon: Zap,
    title: 'Resultados Rápidos',
    description: 'El 89% de nuestros estudiantes mejora sus notas en las primeras 4 semanas. Metodología probada y eficiente.',
    glowColor: 'from-orange-500/20 to-orange-700/10',
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/10 border border-orange-500/30',
    dotColor: 'bg-orange-400',
  },
  {
    icon: Shield,
    title: 'Certificaciones',
    description: 'Obtén certificados reconocidos internacionalmente al completar cada módulo. Suma valor real a tu CV profesional.',
    glowColor: 'from-teal-500/20 to-teal-700/10',
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/10 border border-teal-500/30',
    dotColor: 'bg-teal-400',
  },
];

export default function Features() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="beneficios" ref={ref} className="py-20 md:py-32 bg-[#050814] relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-cyber-pattern opacity-25" />

      {/* Ambient radial glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-mono tracking-wider mb-6">
            <Zap className="w-4 h-4" />
            FUNCIONALIDADES_PREMIUM
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Todo lo que necesitas para{' '}
            <span className="text-gradient">una educación de primer nivel</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            Cada herramienta está diseñada para cerrar la brecha educativa y darte las mismas 
            oportunidades que los estudiantes en las mejores universidades del mundo.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              className="group relative p-6 md:p-7 rounded-2xl cyber-card cursor-default overflow-hidden"
            >
              {/* Inner glow on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${feature.dotColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className={`absolute top-3 right-6 w-1 h-1 rounded-full ${feature.dotColor} opacity-30`} />
              </div>

              <div className={`relative w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="relative text-base font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="relative text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom line accent */}
              <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${feature.glowColor.replace('/20', '').replace('/10', '')} transition-all duration-500 rounded-full`} />
            </motion.div>
          ))}
        </div>

        {/* Action links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12"
        >
          <a
            href="#/matematicas"
            className="btn-primary text-sm flex items-center gap-2"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Practicar Matemáticas
            </span>
          </a>
          <a
            href="#/cursos"
            className="btn-secondary text-sm flex items-center gap-2"
          >
            Ver Todos los Cursos
          </a>
          <a
            href="#/recursos"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group transition-colors"
          >
            Explorar Recursos
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
