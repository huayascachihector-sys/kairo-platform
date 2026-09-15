import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Brain,
  Calculator,
  Flame,
  CheckCircle,
  Cpu,
  Terminal,
  Sparkles,
  Star,
  Users,
  TrendingUp,
  Activity,
  ChevronRight,
  Play,
  BookOpen,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const UNIVERSITIES = ['UNI', 'UNMSM', 'PUCP', 'U.Lima'];

const METRICS = [
  { label: '+25,000', sub: 'Estudiantes', icon: Users, color: 'from-cyan-500 to-blue-500' },
  { label: '4.9★', sub: 'Valoración', icon: Star, color: 'from-amber-400 to-orange-500' },
  { label: '98.4%', sub: 'Precisión IA', icon: Activity, color: 'from-emerald-400 to-teal-500' },
  { label: '95%', sub: 'Aprobación', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
];

const STEPS = [
  { step: '1', text: 'Sea u = x²  →  du = 2x dx', color: 'text-cyan-400' },
  { step: '2', text: 'Sea dv = eˣ dx  →  v = eˣ', color: 'text-purple-400' },
  { step: '3', text: '∫u dv = uv − ∫v du', color: 'text-slate-300' },
  { step: '✓', text: 'x²eˣ − 2xeˣ + 2eˣ + C', color: 'text-emerald-400', bold: true },
];

const TABS = [
  { id: 'prompt' as const, label: 'Asistente IA', icon: Brain },
  { id: 'sim' as const, label: 'Simulaciones', icon: Calculator },
  { id: 'plan' as const, label: 'Plan Neural', icon: Zap },
];

/* ─────────────────────────────────────────────
   TYPING ANIMATION HOOK
───────────────────────────────────────────── */
function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

/* ─────────────────────────────────────────────
   TILT CARD HOOK
───────────────────────────────────────────── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 30 });

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);
  const reset = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return { ref, rotateX, rotateY, handleMouse, reset };
}

/* ─────────────────────────────────────────────
   PARTICLE BACKGROUND
───────────────────────────────────────────── */
const ParticleField = React.memo(function ParticleField() {
  const prefersReducedMotion = useReducedMotion();
  const particles = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 100}%`,
    duration: 4 + (i % 6),
    delay: (i * 0.4) % 4,
    size: i % 3 === 0 ? 2 : 1,
  })), []);

  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/30"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5], y: [-20, 20, -20] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
});

/* ─────────────────────────────────────────────
   NEURAL ENGINE MOCK CARD
───────────────────────────────────────────── */
function NeuralEngineCard() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'sim' | 'plan'>('prompt');
  const { ref, rotateX, rotateY, handleMouse, reset } = useTilt();
  const query = '∫ x² eˣ dx usando integración por partes';
  const { displayed } = useTypewriter(query, 40);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="relative w-full"
    >
      {/* Outer glow */}
      <div className="absolute -inset-px rounded-3xl blur-sm" style={{ background: 'linear-gradient(135deg, rgba(0,242,254,0.4), rgba(121,40,202,0.2), rgba(255,0,122,0.3))' }} />

      <div className="relative rounded-3xl overflow-hidden border border-white/10 backdrop-blur-2xl" style={{ background: 'rgba(9,13,22,0.92)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>

        {/* Top bar */}
        <div className="border-b border-white/5 px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(5,8,20,0.8)' }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500 px-3 py-1 rounded-lg border border-white/5" style={{ background: 'rgba(5,8,20,0.6)' }}>
              <Terminal className="w-3 h-3 text-cyan-500" />
              <span>kairo-neural-engine v3.6</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/25" style={{ background: 'rgba(5,46,22,0.4)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>12ms</span>
            </div>
            <span className="hidden md:block text-slate-600 text-[10px]">SYS: OPTIMAL</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5" style={{ background: 'rgba(5,8,20,0.5)' }} role="tablist" aria-label="Demo sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 text-[11px] sm:text-xs font-semibold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
              style={activeTab === tab.id ? { background: 'rgba(8,145,178,0.1)' } : undefined}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 grid md:grid-cols-3 gap-5" role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {/* Left: main demo */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'prompt' && (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <div className="rounded-2xl p-4 border border-white/8 flex items-start gap-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0" style={{ background: 'linear-gradient(135deg, #7928CA, #FF007A)' }}>
                      TÚ
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-500 mb-1">Estudiante · UNI Cálculo II</p>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        "Explícame cómo resolver{' '}
                        <span className="text-cyan-400 font-mono">{displayed}</span>
                        <span className="animate-pulse text-cyan-400">▍</span>"
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 border border-cyan-500/25" style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.15), rgba(5,8,20,1))', boxShadow: '0 0 30px rgba(6,182,212,0.1)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}>
                        <Cpu className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Kairo Neural Bot</span>
                      <span className="ml-auto text-[10px] text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25" style={{ background: 'rgba(5,46,22,0.6)' }}>
                        ⚡ 0.2s
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      Aplicamos <span className="text-cyan-300 font-semibold">integración por partes</span> — fórmula: ∫u dv = uv − ∫v du
                    </p>
                    <div className="rounded-xl p-3 border border-white/5 space-y-1.5" style={{ background: 'rgba(5,8,20,0.8)' }}>
                      {STEPS.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.12 }}
                          className="flex items-center gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-[9px] font-bold text-slate-400 shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            {s.step}
                          </span>
                          <span className={`text-[11px] font-mono ${s.color} ${s.bold ? 'font-bold' : ''}`}>
                            {s.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-500">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Verificado · demostración matemática completa
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sim' && (
                <motion.div
                  key="sim"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="rounded-2xl p-4 border border-indigo-500/25" style={{ background: 'linear-gradient(135deg, rgba(67,56,202,0.15), rgba(5,8,20,1))' }}>
                    <h4 className="text-xs font-bold text-indigo-300 mb-2 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Simulador Admisión UNI / UNMSM
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                      Modo Adaptativo: Las preguntas ajustan su dificultad con IA en tiempo real.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'Rendimiento', value: '18.5/20', color: 'text-emerald-400' },
                        { label: 'Vel. / ejercicio', value: '1m 14s', color: 'text-cyan-400' },
                        { label: 'Posición ranking', value: '#342', color: 'text-purple-400' },
                        { label: 'Preguntas hoy', value: '47', color: 'text-amber-400' },
                      ].map((m) => (
                        <div key={m.label} className="p-3 rounded-xl border border-white/5" style={{ background: 'rgba(5,8,20,0.8)' }}>
                          <span className="text-[10px] text-slate-500 block mb-0.5">{m.label}</span>
                          <span className={`text-base font-bold ${m.color}`}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'plan' && (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="rounded-2xl p-4 border border-cyan-500/25" style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.1), rgba(5,8,20,1))' }}>
                    <h4 className="text-xs font-bold text-cyan-300 mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Plan Neural Personalizado — 14 Días
                    </h4>
                    <div className="space-y-2">
                      {[
                        { day: '01', task: 'Álgebra Lineal & Vectores', time: '30 min', done: true },
                        { day: '02', task: 'Física I — Cinemática', time: '45 min', done: true },
                        { day: '03', task: 'Química Orgánica', time: '40 min', done: false },
                        { day: '04', task: 'Cálculo Diferencial', time: '50 min', done: false },
                      ].map((item, idx) => (
                        <motion.div
                          key={item.day}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border text-[11px] ${
                            item.done
                              ? 'border-emerald-500/20 text-emerald-300'
                              : 'border-white/5 text-slate-300'
                          }`}
                          style={{ background: item.done ? 'rgba(5,78,32,0.2)' : 'rgba(5,8,20,0.5)' }}
                        >
                          <span className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            {item.done ? '✓' : item.day}
                          </span>
                          <span className="flex-1">{item.task}</span>
                          <span className="text-slate-500">{item.time}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: stats sidebar */}
          <div className="space-y-3">
            <div className="rounded-2xl p-4 border border-white/6" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-3">Métricas</span>
              <div className="space-y-3">
                {[
                  { label: 'Progreso General', pct: 84, gradient: 'linear-gradient(90deg, #06b6d4, #34d399)', textColor: 'text-cyan-400' },
                  { label: 'Matemáticas', pct: 92, gradient: 'linear-gradient(90deg, #6366f1, #22d3ee)', textColor: 'text-indigo-400' },
                  { label: 'Física', pct: 76, gradient: 'linear-gradient(90deg, #a855f7, #ec4899)', textColor: 'text-purple-400' },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>{bar.label}</span>
                      <span className={`${bar.textColor} font-bold`}>{bar.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: bar.gradient }}
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.pct}%` }}
                        transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-3.5 border border-white/6 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)' }}>
                <Flame className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-mono">Racha activa</p>
                <p className="text-base font-extrabold text-white">7 días 🔥</p>
              </div>
            </div>

            <div className="rounded-2xl p-3.5 border border-white/6 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-mono">Sesiones hoy</p>
                <p className="text-base font-extrabold text-white">3 completadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN HERO
───────────────────────────────────────────── */
export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = useCallback((delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }), [prefersReducedMotion]);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-20 text-white"
      style={{ background: 'linear-gradient(160deg, #090D16 0%, #0F172A 60%, #090D16 100%)' }}
    >
      {/* Animated background orbs */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,242,254,0.12) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(121,40,202,0.18) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,0,122,0.08) 0%, transparent 65%)' }}
          />
        </>
      )}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <ParticleField />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT: Text + CTAs */}
          <div className="flex flex-col items-start">

            {/* Pill badge */}
            <motion.div {...fadeUp(0)}>
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 text-xs font-mono tracking-wide mb-8"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 24px rgba(0,242,254,0.15)',
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-bold text-cyan-300">KAIRO NEURAL AI 3.6</span>
                <span className="text-white/20">•</span>
                <span className="text-slate-400">Educación Futurista</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </motion.div>

            {/* H1 */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-5xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight leading-[1.06] mb-6"
            >
              <span className="text-white">El Tutor IA</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #00F2FE 0%, #7928CA 50%, #FF007A 100%)' }}
              >
                que el Perú
              </span>
              <br />
              <span className="text-white">Merece.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.2)}
              className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10 max-w-lg"
            >
              <span className="text-cyan-400 font-semibold">Kairo</span> combina modelos neuronales
              adaptativos, tutores IA 24/7 y planes de estudio generados en tiempo real para{' '}
              <span className="text-white font-semibold">democratizar la educación</span> superior en
              todo el Perú.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.3)}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10"
            >
              <a
                href="#/registro"
                id="hero-cta-primary"
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-bold text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #00F2FE 0%, #7928CA 55%, #FF007A 100%)',
                  boxShadow: '0 0 30px rgba(0,242,254,0.35), 0 0 60px rgba(121,40,202,0.2)',
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transform: 'skewX(-12deg)' }} />
                <Zap className="w-4 h-4 text-white/90 animate-pulse" />
                Probar Kairo Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#/matematicas"
                id="hero-cta-secondary"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-semibold text-slate-200 border border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:text-white"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <Play className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                Explorar Tutor IA
              </a>
            </motion.div>

            {/* Trust micro-text */}
            <motion.p {...fadeUp(0.4)} className="text-xs text-slate-500 flex items-center gap-2 mb-10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sin tarjeta requerida · 100% Adaptativo · Sesión guardada en tu dispositivo
            </motion.p>

            {/* Social proof */}
            <motion.div {...fadeUp(0.45)} className="w-full">
              <div
                className="rounded-2xl border border-white/8 p-5"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                  {METRICS.map((m) => (
                    <div key={m.label} className="flex flex-col items-center text-center gap-1">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-1`}>
                        <m.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg font-extrabold text-white leading-none">{m.label}</span>
                      <span className="text-[10px] text-slate-500">{m.sub}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/6 pt-4">
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider text-center mb-3">
                    Confiado por estudiantes de
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {UNIVERSITIES.map((uni) => (
                      <span
                        key={uni}
                        className="px-3 py-1.5 rounded-lg border border-white/8 text-[11px] font-bold text-slate-300 tracking-wider cursor-default transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        {uni}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Neural Engine Card */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="w-full lg:pl-4"
          >
            <NeuralEngineCard />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #090D16, transparent)' }}
      />
    </section>
  );
}
