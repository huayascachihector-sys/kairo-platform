import { motion } from 'framer-motion';
import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  ArrowLeft, Bot, Heart, MapPin, Wifi, Battery, Cpu, Sparkles,
  GraduationCap, Sun, Mic, ShieldCheck, Rocket, CheckCircle2,
  ArrowRight, Users, Zap, BookOpen, Globe2, HandHeart, Languages,
} from 'lucide-react';

const specs = [
  { icon: Cpu, title: 'IA en el dispositivo', desc: 'Modelo ligero que funciona sin internet. Aprende del estudiante en tiempo real.' },
  { icon: Sun, title: 'Panel solar integrado', desc: 'Autonomía de 12h y recarga solar para zonas sin electricidad estable.' },
  { icon: Wifi, title: 'Sync con la app', desc: 'Se conecta con Kairo cuando hay señal y respalda el progreso en la nube.' },
  { icon: Mic, title: 'Voz + pantalla táctil', desc: 'Interfaz simple: háblale o toca. Sin manuales, sin fricción.' },
  { icon: ShieldCheck, title: 'Carcasa resistente', desc: 'Diseño robusto contra polvo, humedad y golpes. Pensado para el terreno.' },
  { icon: Languages, title: 'Quechua, Aymara, Español', desc: 'Enseña en el idioma nativo del estudiante desde el primer día.' },
];

const pros = [
  'Personaliza el ritmo y estilo de aprendizaje de cada niño.',
  'Reduce la brecha educativa en zonas rurales y de difícil acceso.',
  'Funciona sin internet, sin luz constante y sin docente presencial.',
  'Complementa —no reemplaza— al maestro local y a la comunidad.',
  'Progreso sincronizado con la plataforma Kairo cuando hay conexión.',
  'Contenido alineado al currículo peruano MINEDU + retos globales.',
];

const steps = [
  { n: '01', title: 'Diagnóstico inicial', desc: 'El robot conversa con el estudiante y evalúa su nivel en matemática, lectura y ciencia.' },
  { n: '02', title: 'Plan personalizado', desc: 'La IA arma una ruta única: ejercicios, videos cortos y proyectos según sus habilidades.' },
  { n: '03', title: 'Sesiones diarias', desc: '20-40 min por día. El robot explica, pregunta, corrige y celebra cada logro.' },
  { n: '04', title: 'Sync con Kairo', desc: 'Cada vez que hay señal, el progreso sube a la app y los padres/docentes pueden verlo.' },
];

export default function Robot() {
  const [supporters, setSupporters] = useState(1247);
  const [supported, setSupported] = useState(false);
  const { ref: specsRef, isVisible: specsVisible } = useScrollReveal();
  const { ref: howRef, isVisible: howVisible } = useScrollReveal();

  const handleSupport = () => {
    if (supported) return;
    setSupported(true);
    setSupporters((n) => n + 1);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <a href="#" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </a>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Iniciativa estudiantil · COAR Lima
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 tracking-tight leading-[1.05]">
                Kipu:{' '}
                <span className="text-gradient-hero">un tutor con IA</span>{' '}
                para cada rincón del Perú
              </h1>
              <p className="mt-6 text-lg text-surface-600 leading-relaxed">
                Imagina un robot pequeño, resistente y solar que llega a comunidades donde no hay
                internet, ni docentes, ni libros. Habla quechua, aymara o español, entiende al niño
                y le da una educación totalmente personalizada. Diseñado por estudiantes del{' '}
                <span className="font-semibold text-surface-900">COAR Lima</span>.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSupport}
                  disabled={supported}
                  className={`group relative overflow-hidden font-bold text-base px-7 py-4 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    supported
                      ? 'bg-emerald-500 text-white cursor-default'
                      : 'bg-gradient-to-r from-rose-500 to-primary-600 text-white hover:-translate-y-1 hover:shadow-2xl'
                  }`}
                >
                  {supported ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      ¡Gracias por apoyar!
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 group-hover:scale-125 transition-transform" />
                      Apoyar esta iniciativa
                    </>
                  )}
                </button>
                <a
                  href="#como-funciona"
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  Ver cómo funciona
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm text-surface-500">
                <div className="flex -space-x-2">
                  {['bg-primary-400', 'bg-accent-400', 'bg-emerald-400', 'bg-amber-400'].map((c) => (
                    <div key={c} className={`w-8 h-8 rounded-full ${c} border-2 border-white`} />
                  ))}
                </div>
                <span>
                  <span className="font-bold text-surface-900">{supporters.toLocaleString()}</span> peruanos ya apoyan Kipu
                </span>
              </div>
            </motion.div>

            {/* Robot mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative"
            >
              <div className="relative mx-auto w-full max-w-sm aspect-square">
                {/* glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 via-accent-400/20 to-emerald-400/30 rounded-[3rem] blur-3xl" />
                {/* body */}
                <div className="relative h-full bg-gradient-to-br from-white to-surface-50 rounded-[3rem] border border-surface-200 shadow-2xl shadow-primary-500/10 p-8 flex flex-col items-center justify-center">
                  {/* solar panel */}
                  <div className="w-32 h-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg grid grid-cols-6 gap-px p-0.5 mb-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-slate-600 rounded-sm" />
                    ))}
                  </div>
                  {/* head */}
                  <div className="relative w-44 h-40 bg-white rounded-[2rem] border-2 border-surface-200 shadow-lg flex items-center justify-center">
                    {/* screen face */}
                    <div className="w-36 h-32 bg-gradient-to-br from-slate-900 to-primary-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="flex gap-3"
                      >
                        <div className="w-3 h-8 bg-primary-300 rounded-full" />
                        <div className="w-3 h-8 bg-primary-300 rounded-full" />
                      </motion.div>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary-300/60 rounded-full" />
                    </div>
                    {/* antenna */}
                    <motion.div
                      animate={{ rotate: [-5, 5, -5] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 origin-bottom"
                    >
                      <div className="w-0.5 h-6 bg-surface-400 mx-auto" />
                      <div className="w-3 h-3 rounded-full bg-rose-400 shadow-lg shadow-rose-400/50" />
                    </motion.div>
                  </div>
                  {/* body/base */}
                  <div className="mt-3 w-48 h-24 bg-gradient-to-br from-primary-50 to-white rounded-[1.5rem] border-2 border-surface-200 shadow-md flex items-center justify-center">
                    <div className="flex gap-2">
                      {[Wifi, Battery, Cpu].map((Icon, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg bg-white border border-surface-200 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* floating tags */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -left-4 top-16 bg-white rounded-xl shadow-lg border border-surface-100 px-3 py-2 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-semibold text-surface-700">Cusco rural</span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -right-4 bottom-20 bg-white rounded-xl shadow-lg border border-surface-100 px-3 py-2 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-surface-700">Solar · 12h</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section ref={specsRef} className="py-20 md:py-28 bg-surface-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={specsVisible ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-surface-900">
              Diseño <span className="text-gradient">calidad-precio</span>, simple de usar
            </h2>
            <p className="mt-3 text-surface-500 max-w-2xl mx-auto">
              Un robot pensado para que cualquier niño, padre o abuelo pueda usarlo sin instrucciones.
              Sin cables complicados, sin apps confusas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specs.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={specsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="bg-white rounded-2xl p-6 border border-surface-100 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-surface-900 mb-2">{s.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" ref={howRef} className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={howVisible ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-surface-900">
              ¿Cómo <span className="text-gradient">funciona</span> Kipu?
            </h2>
            <p className="mt-3 text-surface-500 max-w-2xl mx-auto">
              Cuatro pasos simples desde que el robot llega a la comunidad.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                animate={howVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="relative bg-gradient-to-br from-white to-surface-50 rounded-2xl p-6 border border-surface-100"
              >
                <div className="text-5xl font-extrabold text-gradient opacity-40 mb-2">{step.n}</div>
                <h3 className="font-bold text-surface-900 mb-2">{step.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pros */}
      <section className="py-20 md:py-28 bg-surface-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-900">
                ¿Por qué esto <span className="text-gradient">importa</span>?
              </h2>
              <p className="mt-4 text-surface-500 leading-relaxed">
                Más de 3 millones de niños peruanos viven en zonas donde llegar a una escuela toma
                horas de caminata. Kipu no reemplaza al docente: llega donde el sistema aún no puede.
              </p>
              <div className="mt-8 space-y-3">
                {pros.map((p) => (
                  <div key={p} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-surface-700 leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Innovation card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 rounded-3xl p-8 text-white shadow-2xl shadow-primary-500/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-5 backdrop-blur-sm">
                    <Rocket className="w-3.5 h-3.5" />
                    Nuestra innovación
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">
                    Red Mesh de Kipus:
                    <br />
                    aprendizaje colectivo
                  </h3>
                  <p className="mt-4 text-primary-100 leading-relaxed">
                    Cada robot en una comunidad se conecta con los demás vía red mesh (sin necesidad
                    de internet). Comparten conocimiento entre sí: si un Kipu descubre una mejor forma
                    de explicar fracciones, todos los Kipus vecinos lo aprenden esa misma noche.
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { icon: Globe2, label: 'Sin internet' },
                      { icon: Users, label: 'Colaborativo' },
                      { icon: BookOpen, label: 'Siempre mejora' },
                    ].map((f) => (
                      <div key={f.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                        <f.icon className="w-5 h-5 mx-auto mb-1.5" />
                        <div className="text-xs font-semibold">{f.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team + Support CTA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-surface-900 via-primary-900 to-slate-900 rounded-3xl p-8 md:p-14 text-center overflow-hidden"
          >
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-semibold mb-6 backdrop-blur-sm">
                <GraduationCap className="w-3.5 h-3.5" />
                Hecho por estudiantes del COAR Lima
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                Tu apoyo lleva un{' '}
                <span className="bg-gradient-to-r from-accent-400 to-emerald-400 bg-clip-text text-transparent">
                  Kipu
                </span>{' '}
                a una comunidad
              </h2>
              <p className="mt-5 text-primary-100/80 max-w-xl mx-auto">
                Cada firma nos acerca a fabricar el primer prototipo funcional. No pedimos dinero:
                pedimos que creas en la idea y la compartas.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center">
                <button
                  onClick={handleSupport}
                  disabled={supported}
                  className={`font-bold text-base px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                    supported
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-primary-700 hover:-translate-y-1 shadow-xl'
                  }`}
                >
                  {supported ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Ya apoyas Kipu
                    </>
                  ) : (
                    <>
                      <HandHeart className="w-5 h-5" /> Sumo mi apoyo
                    </>
                  )}
                </button>
                <a
                  href="#/about"
                  className="text-white/80 hover:text-white font-medium flex items-center gap-2 px-4 py-4"
                >
                  Conocer al equipo <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Bot className="w-5 h-5 text-accent-400" />
                <span className="text-sm text-white/80">
                  <span className="font-bold text-white">{supporters.toLocaleString()}</span> personas ya creen en esto
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
