import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  ArrowLeft, Heart, Globe, GraduationCap, Users, Target,
  Lightbulb, Shield, BookOpen, ArrowRight, MapPin,
  Rocket, Sparkles, Handshake, Cpu, Trophy,
} from 'lucide-react';

const lucideIcons: Record<string, any> = { Rocket, BookOpen, Sparkles, Handshake, Cpu, MapPin, Trophy, Globe };

const values = [
  { icon: Globe, title: 'Accesibilidad', desc: 'Educación de clase mundial accesible para todos, sin importar ubicación o recursos económicos.' },
  { icon: Lightbulb, title: 'Innovación', desc: 'Usamos la última tecnología en IA y pedagogía para crear la mejor experiencia educativa posible.' },
  { icon: Heart, title: 'Empatía', desc: 'Entendemos las realidades del estudiante peruano y diseñamos soluciones reales para sus necesidades.' },
  { icon: Shield, title: 'Excelencia', desc: 'No comprometemos la calidad. Cada curso, cada ejercicio, cada interacción debe ser de primer nivel.' },
];

const team = [
  { name: 'Jordan Rui Huamancayo', role: 'CONSTRUCTOR', bg: 'from-primary-400 to-primary-600', initials: 'AV', bio: 'estudiante del COAR LIMA.' },
  { name: 'Ian Paredes', role: 'EXPLORADOR', bg: 'from-accent-400 to-accent-600', initials: 'SC', bio: 'Abierto a nuevas experiencias UWU.' },
  { name: 'Huanca Karlos', role: 'CREATIVO', bg: 'from-emerald-400 to-emerald-600', initials: 'LP', bio: 'Estudiante del COAR LIMA' },
  { name: 'Huaches Anderson', role: 'COORDINADOR', bg: 'from-amber-400 to-amber-600', initials: 'MQ', bio: 'Estudiante del COAR LIMA' },
  { name: 'Hector Huayascachi Borda', role: 'CONSTRUCTOR', bg: 'from-rose-400 to-rose-600', initials: 'JT', bio: 'Estudiante del COAR LIMA' },
  { name: 'Ivan Salazar', role: 'COMUNICADOR', bg: 'from-violet-400 to-violet-600', initials: 'AR', bio: 'Estudiante del COAR LIMA' },
];

const MILE_ICONS: Record<string, any> = {
  phase1: 'Rocket', phase2: 'BookOpen', milestone2023: 'Sparkles',
  milestone2024: 'Handshake', milestone2024b: 'Cpu', milestone2025: 'MapPin',
  milestone2025b: 'Trophy', milestone2026: 'Globe',
};

const milestones = [
  { year: 'FASE 1', event: 'Identificación del problema sobre el acceso a información academica', icon: 'phase1' },
  { year: 'FASE 2', event: 'Lanzamiento de la plataforma con 100 cursos iniciales', icon: 'phase2' },
  { year: '2023', event: '5,000 estudiantes activos en los primeros 6 meses', icon: 'milestone2023' },
  { year: '2024', event: 'Alianza con universidades europeas para contenido exclusivo', icon: 'milestone2024' },
  { year: '2024', event: 'Lanzamiento del motor de IA personalizada', icon: 'milestone2024b' },
  { year: '2025', event: '25,000 estudiantes activos en todo el Perú', icon: 'milestone2025' },
  { year: '2025', event: 'Primer estudiante becado en Oxford gracias a Kairo', icon: 'milestone2025b' },
  { year: '2026', event: 'Expansión a Colombia, Ecuador y Bolivia', icon: 'milestone2026' },
];

export default function About() {
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollReveal();
  const { ref: teamRef, isVisible: teamVisible } = useScrollReveal();

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 pt-24 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <a href="#" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 font-medium">
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </a>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-tight">
              Nuestra misión:{' '}
              <span className="text-gradient-hero">democratizar la educación</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto leading-relaxed">
              Creemos que cada estudiante peruano merece acceso a la misma calidad educativa
              que disfrutan los estudiantes en las mejores universidades del mundo.
              Kairo existe para hacer eso una realidad.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: '25K+', label: 'Estudiantes', icon: Users },
              { value: '500+', label: 'Cursos', icon: BookOpen },
              { value: '12', label: 'Países', icon: Globe },
              { value: '95%', label: 'Satisfacción', icon: Target },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-5">
                <stat.icon className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-surface-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-20 md:py-28 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-surface-900 dark:text-white">
              Nuestros <span className="text-gradient">Valores</span>
            </h2>
            <p className="mt-3 text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
              Los principios que guían cada decisión que tomamos.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-white dark:cyber-card-dark rounded-2xl p-6 border border-surface-100 card-hover text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-surface-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-white dark:bg-surface-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-surface-900 dark:text-white">
              Nuestra <span className="text-gradient">Historia</span>
            </h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-200 dark:from-primary-800 via-accent-200 dark:via-accent-800 to-emerald-200 dark:to-emerald-800" />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative flex items-start gap-4 mb-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`hidden md:block flex-1 ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-white dark:cyber-card-dark rounded-xl p-4 border border-surface-100 shadow-sm inline-block">
                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-1">{m.year}</p>
                    <p className="text-sm text-surface-700 dark:text-surface-200">{m.event}</p>
                  </div>
                </div>
                <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  {React.createElement(lucideIcons[MILE_ICONS[m.icon]], { className: 'w-5 h-5 text-white' })}
                </div>
                <div className={`flex-1 md:hidden`}>
                  <div className="bg-white dark:cyber-card-dark rounded-xl p-4 border border-surface-100 shadow-sm">
                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-1">{m.year}</p>
                    <p className="text-sm text-surface-700 dark:text-surface-200">{m.event}</p>
                  </div>
                </div>
                <div className={`hidden md:block flex-1 ${i % 2 === 1 ? 'text-right pr-8' : 'text-left pl-8'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="py-20 md:py-28 bg-surface-50 dark:bg-surface-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamVisible ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-surface-900 dark:text-white">
              Nuestro <span className="text-gradient">Equipo</span>
            </h2>
            <p className="mt-3 text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
              Estudiantes apasionados por generar un cambio en la educación 
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={teamVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-white dark:cyber-card-dark rounded-2xl p-6 border border-surface-100 card-hover text-center"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.bg} flex items-center justify-center text-white text-xl font-bold mx-auto mb-4`}>
                  {member.initials}
                </div>
                <h3 className="font-bold text-surface-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Locations */}
      <section className="py-20 md:py-28 bg-white dark:bg-surface-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-surface-900 dark:text-white mb-4">
              ¿Quieres ser parte del <span className="text-gradient">cambio</span>?
            </h2>
            <p className="text-surface-500 dark:text-surface-400 max-w-xl mx-auto mb-8">
              Estamos buscando personas talentosas y apasionadas por la educación. 
              Únete a nuestro equipo y ayúdanos a transformar el futuro de millones de estudiantes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <a href="mailto:careers@kairo.pe" className="btn-primary flex items-center gap-2">
                <span className="flex items-center gap-2">
                  Ver Posiciones Abiertas
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
              <a href="mailto:hola@kairo.pe" className="btn-secondary flex items-center gap-2">
                Contactar
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-surface-500 dark:text-surface-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary-500" />
                Lima, Perú
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                Remote-first
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
