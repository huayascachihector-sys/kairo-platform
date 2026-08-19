import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Users, GraduationCap, Globe, Cpu, Sparkles, Zap, Terminal, CheckCircle, Brain, Calculator, Flame } from 'lucide-react';

const stats = [
  { icon: Users, value: '25,000+', label: 'Estudiantes activos en Kairo' },
  { icon: Cpu, value: '98.4%', label: 'Precisión en Asistencia IA' },
  { icon: GraduationCap, value: '95%', label: 'Tasa de aprobación' },
  { icon: Globe, value: '24/7', label: 'Disponibilidad Neural' },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'sim' | 'plan'>('prompt');

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16 bg-[#050814] text-white">
      {/* High-Tech Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      <div className="absolute inset-0 grid-cyber-pattern opacity-30" />

      {/* Cyber Ambient Glowing Orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 right-[12%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-24 left-[8%] w-[450px] h-[450px] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Cyber Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono tracking-wide mb-8 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-xl"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="font-semibold text-cyan-400">KAIRO NEURAL AI 3.6</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Educación Futurista Perú</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]"
          >
            <span className="text-white">Educación de </span>
            <span className="text-gradient-hero">Clase Mundial</span>
            <br />
            <span className="text-white">Impulsada por </span>
            <span className="text-gradient-cyan">Hectorstian</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            <span className="text-cyan-400 font-semibold">Kairo</span> combina modelos neuronales adaptativos, tutores virtuales 24/7 y planes de estudio en tiempo real para democratizar el aprendizaje superior en todo el Perú.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#/registro" className="btn-primary text-base md:text-lg !px-8 !py-4 w-full sm:w-auto shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <span className="flex items-center justify-center gap-2.5 font-bold">
                <Zap className="w-5 h-5 text-cyan-300 animate-pulse" />
                Probar Kairo Gratis
                <ArrowRight className="w-5 h-5" />
              </span>
            </a>
            <a href="#/matematicas" className="btn-secondary text-base md:text-lg !px-8 !py-4 w-full sm:w-auto flex items-center justify-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              Explorar Tutor IA
            </a>
          </motion.div>

          {/* Trust Signal */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-5 text-xs sm:text-sm text-slate-400 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Sin tarjeta requerida · Sesión guardada en tu dispositivo · 100% Adaptativo</span>
          </motion.p>
        </div>

        {/* Futuristic Cyber Interactive HUD Display Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden bg-slate-950/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] backdrop-blur-2xl">
            {/* HUD Top Bar */}
            <div className="bg-slate-900/90 border-b border-cyan-500/20 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400" />
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>kairo-neural-engine://v3.6-active</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>LATENCY: 12ms</span>
                </div>
                <div className="hidden md:block text-slate-400">SYS_STATUS: OPTIMAL</div>
              </div>
            </div>

            {/* Tab Controls */}
            <div className="flex border-b border-slate-800 bg-slate-900/50">
              {[
                { id: 'prompt', label: 'Asistente Neuronal IA', icon: Brain },
                { id: 'sim', label: 'Simulaciones & Mates', icon: Calculator },
                { id: 'plan', label: 'Plan Inteligente', icon: Zap },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-2 ${activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* HUD Main Interactive Preview Screen */}
            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950">
              {/* Left 2 Cols: Main Interactive Demo */}
              <div className="md:col-span-2 space-y-4">
                {activeTab === 'prompt' && (
                  <div className="space-y-4">
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-600/30 border border-primary-400 flex items-center justify-center text-primary-300 font-bold text-xs">
                        TÚ
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 mb-1">Estudiante (UNI - Cálculo II)</p>
                        <p className="text-sm text-slate-200 font-medium">
                          "Explícame paso a paso cómo resolver $\int x^2 e^x dx$ usando el método de integración por partes."
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 rounded-2xl p-5 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 to-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Kairo Neural Bot</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">Generado en 0.2s</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed mb-3">
                        Para resolver $\int x^2 e^x dx$, aplicamos integración por partes con la fórmula $\int u dv = uv - \int v du$:
                      </p>
                      <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-cyan-300 border border-slate-800 mb-3 space-y-1">
                        <p>1. $u = x^2 \Rightarrow du = 2x dx$</p>
                        <p>2. $dv = e^x dx \Rightarrow v = e^x$</p>
                        <p className="text-emerald-400 font-bold">Resultado: $x^2 e^x - 2x e^x + 2e^x + C$</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Verificado con demostración matemática paso a paso</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sim' && (
                  <div className="space-y-4">
                    <div className="bg-slate-900 p-5 rounded-2xl border border-indigo-500/30">
                      <h4 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Simulador de Examen de Admisión San Marcos / UNI
                      </h4>
                      <p className="text-xs text-slate-300 mb-4">
                        Modo Adaptativo con IA: Las preguntas ajustan su dificultad según tus respuestas en tiempo real.
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block mb-1">Rendimiento Estimado</span>
                          <span className="text-lg font-bold text-emerald-400">18.5 / 20</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block mb-1">Velocidad por Ejercicio</span>
                          <span className="text-lg font-bold text-cyan-400">1m 14s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'plan' && (
                  <div className="space-y-4">
                    <div className="bg-slate-900 p-5 rounded-2xl border border-cyan-500/30">
                      <h4 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        Plan Personalizado de 14 Días
                      </h4>
                      <div className="space-y-2 mt-3">
                        {['Día 1: Álgebra Lineal & Vectores (30 min)', 'Día 2: Física I - Cinemática Cuántica (45 min)', 'Día 3: Química Orgánica (40 min)'].map((task, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                              ✓
                            </span>
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Col: Holographic Status Panel */}
              <div className="space-y-4">
                <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">Métricas de Estudio</span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Progreso General</span>
                        <span className="text-cyan-400 font-bold">84%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-[84%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Dominio de Matemáticas</span>
                        <span className="text-indigo-400 font-bold">92%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-[92%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Racha Activa</p>
                    <p className="text-lg font-bold text-white">7 Días Seguidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="cyber-card rounded-2xl p-5 md:p-6 text-center group"
            >
              <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2.5 group-hover:scale-110 transition-transform" />
              <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Glow transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050814] to-transparent pointer-events-none" />
    </section>
  );
}
