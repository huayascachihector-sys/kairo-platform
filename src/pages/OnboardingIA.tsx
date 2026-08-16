import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Check, School, GraduationCap, University, Briefcase, Heart, Brain, Target, Clock, BookOpen, Star, Zap, ArrowLeft, Bot, PartyPopper } from 'lucide-react';
import { loadState, saveState, type StoreState, type OnboardingData } from '../lib/store';
import { generateRecommendations, getGreetingMessage, getWelcomeMessage, type OnboardingRecommendation } from '../lib/onboardingEngine';

type Step = 'welcome' | 'name-age' | 'level' | 'interests' | 'goals' | 'exams' | 'hours' | 'style' | 'summary';

const levels = [
  { id: 'secundaria', label: 'Secundaria', icon: School, desc: '3ero, 4to o 5to de secundaria' },
  { id: 'preuniversitario', label: 'Pre-Universitario', icon: GraduationCap, desc: 'Preparándome para ingresar a la universidad' },
  { id: 'universidad', label: 'Universidad', icon: University, desc: 'Estudiando una carrera universitaria' },
  { id: 'egresado', label: 'Egresado', icon: Briefcase, desc: 'Profesional que quiere seguir aprendiendo' },
  { id: 'otro', label: 'Otro', icon: Heart, desc: 'Autodidacta o educación alternativa' },
];

const subjects = [
  { id: 'matematicas', label: 'Matemáticas', icon: '∫', color: 'from-primary-500 to-primary-700' },
  { id: 'fisica', label: 'Física', icon: '⚛', color: 'from-cyan-500 to-blue-700' },
  { id: 'quimica', label: 'Química', icon: '⚗', color: 'from-emerald-500 to-emerald-700' },
  { id: 'historia', label: 'Historia', icon: '🏛', color: 'from-amber-500 to-orange-700' },
  { id: 'comunicacion', label: 'Comunicación', icon: '📝', color: 'from-violet-500 to-violet-700' },
  { id: 'ingles', label: 'Inglés', icon: '🌎', color: 'from-pink-500 to-rose-700' },
  { id: 'biologia', label: 'Biología', icon: '🧬', color: 'from-green-500 to-teal-700' },
  { id: 'computacion', label: 'Computación', icon: '💻', color: 'from-indigo-500 to-purple-700' },
];

const goalOptions = [
  { id: 'admission', label: 'Admisión universitaria', icon: Target, desc: 'Ingresar a la universidad de mis sueños' },
  { id: 'exam', label: 'Preparar examen', icon: Brain, desc: 'SAT, TOEFL, o exámenes internacionales' },
  { id: 'grades', label: 'Mejorar notas', icon: Star, desc: 'Subir mi rendimiento académico actual' },
  { id: 'career', label: 'Desarrollo profesional', icon: Briefcase, desc: 'Crecer en mi carrera o trabajo' },
  { id: 'personal', label: 'Interés personal', icon: Heart, desc: 'Aprender por curiosidad o pasión' },
];

const examOptions = [
  { id: 'sat', label: 'SAT', desc: 'Scholastic Assessment Test' },
  { id: 'toefl', label: 'TOEFL', desc: 'Test of English as a Foreign Language' },
  { id: 'admision', label: 'Admisión UNI/SM/PUCP', desc: 'Exámenes de admisión peruanos' },
  { id: 'ninguno', label: 'Ninguno por ahora', desc: 'Solo quiero aprender' },
];

const styleOptions = [
  { id: 'visual', label: 'Visual', icon: '🎬', desc: 'Videos, diagramas, animaciones' },
  { id: 'lectura', label: 'Lectura', icon: '📖', desc: 'Textos, resúmenes, apuntes' },
  { id: 'practica', label: 'Práctica', icon: '✍️', desc: 'Ejercicios, simulacros, problemas' },
  { id: 'mixto', label: 'Mixto', icon: '🔄', desc: 'Combinación de todo' },
];

const stepLabels = ['Inicio', 'Datos', 'Nivel', 'Intereses', 'Metas', 'Exámenes', 'Horario', 'Estilo', 'Resumen'];

export default function OnboardingIA() {
  const [step, setStep] = useState<Step>('welcome');
  const [stepIdx, setStepIdx] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const [typing, setTyping] = useState(true);
  const [recommendations, setRecommendations] = useState<OnboardingRecommendation | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [state, setState] = useState<StoreState>(loadState);

  const name = data.age ? `${state.user?.name || ''} (${data.age} años)` : state.user?.name || '';

  useEffect(() => {
    const t = setTimeout(() => setTyping(false), 1200);
    return () => clearTimeout(t);
  }, [step]);

  const nextStep = useCallback(() => {
    const steps: Step[] = ['welcome', 'name-age', 'level', 'interests', 'goals', 'exams', 'hours', 'style', 'summary'];
    const nextIdx = stepIdx + 1;
    if (nextIdx < steps.length) {
      setStep(steps[nextIdx]);
      setStepIdx(nextIdx);
      setTyping(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [stepIdx]);

  const prevStep = useCallback(() => {
    const steps: Step[] = ['welcome', 'name-age', 'level', 'interests', 'goals', 'exams', 'hours', 'style', 'summary'];
    const prevIdx = stepIdx - 1;
    if (prevIdx >= 0) {
      setStep(steps[prevIdx]);
      setStepIdx(prevIdx);
      setTyping(true);
    }
  }, [stepIdx]);

  const handleComplete = () => {
    const onboarding: OnboardingData = { ...data, completedAt: new Date().toISOString() };
    const recs = generateRecommendations(onboarding);
    setRecommendations(recs);

    const st = loadState();
    st.user = { ...(st.user || { name: '', email: '', joinedAt: new Date().toISOString() }), onboarding };
    saveState(st);
    setState(st);
    setShowConfetti(true);
    setStep('summary');
  };

  const goToPlatform = () => {
    window.location.hash = '#/plataforma';
  };

  const toggleArray = (field: keyof OnboardingData, value: string) => {
    const arr = (data[field] as string[]) || [];
    setData({
      ...data,
      [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  const progress = ((stepIdx) / 8) * 100;

  const renderAiMessage = (text: string) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 mb-8"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-500/20">
        <Bot size={20} />
      </div>
      <div className="flex-1">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl rounded-tl-sm p-5">
          {typing ? (
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{text}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderProgressBar = () => (
    <div className="flex items-center gap-3 mb-8">
      {stepLabels.slice(0, 8).map((label, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i < stepIdx ? 'bg-emerald-500' : i === stepIdx ? 'bg-primary-400 ring-2 ring-primary-500/30' : 'bg-white/10'
            }`}
          />
          <span className={`text-[10px] hidden md:block ${i === stepIdx ? 'text-primary-400 font-semibold' : 'text-surface-500'}`}>
            {label}
          </span>
        </div>
      ))}
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );

  const renderCardGrid = <T extends { id: string; label: string; desc?: string }>(
    items: T[],
    field: keyof OnboardingData,
    multi: boolean,
    renderIcon?: (item: T) => React.ReactNode
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => {
        const selected = multi
          ? ((data[field] as string[]) || []).includes(item.id)
          : data[field] === item.id;
        return (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (multi) toggleArray(field, item.id);
              else setData({ ...data, [field]: item.id });
            }}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              selected
                ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {renderIcon && renderIcon(item)}
              <div className="flex-1">
                <p className={`text-sm font-semibold ${selected ? 'text-primary-300' : 'text-white'}`}>
                  {item.label}
                </p>
                {item.desc && (
                  <p className={`text-xs mt-0.5 ${selected ? 'text-primary-400/70' : 'text-surface-500'}`}>
                    {item.desc}
                  </p>
                )}
              </div>
              {multi && selected && (
                <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        {step !== 'welcome' && (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 text-surface-400 hover:text-primary-400 transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft size={16} /> Atrás
          </button>
        )}

        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {renderAiMessage(getWelcomeMessage())}

              {!typing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <button onClick={nextStep} className="btn-primary text-base px-10 py-4 flex items-center gap-2">
                    ¡Comenzar! <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'name-age' && (
            <motion.div key="name-age" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {renderProgressBar()}
              {renderAiMessage(`¡Hola! ¿Cuántos años tienes, ${state.user?.name || 'estudiante'}?`)}
              {!typing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Tu edad</label>
                    <input
                      type="number"
                      min={5}
                      max={99}
                      value={data.age || ''}
                      onChange={(e) => setData({ ...data, age: parseInt(e.target.value) || undefined })}
                      placeholder="Ej: 17"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all text-lg font-medium"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">¿De qué país eres?</label>
                    <input
                      type="text"
                      value={data.pais || ''}
                      onChange={(e) => setData({ ...data, pais: e.target.value })}
                      placeholder="Ej: Perú"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!data.age}
                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Siguiente <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'level' && (
            <motion.div key="level" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {renderProgressBar()}
              {renderAiMessage('¿Cuál es tu nivel educativo actual?')}
              {!typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {renderCardGrid(levels, 'nivelEducativo', false, (item) => {
                    const Icon = item.icon;
                    return <Icon size={20} className="text-primary-400" />;
                  })}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">¿Dónde estudias? (opcional)</label>
                    <input
                      type="text"
                      value={data.colegio || ''}
                      onChange={(e) => setData({ ...data, colegio: e.target.value })}
                      placeholder="Nombre de tu colegio, academia o universidad"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!data.nivelEducativo}
                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Siguiente <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'interests' && (
            <motion.div key="interests" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {renderProgressBar()}
              {renderAiMessage('¿Qué materias te gustaría estudiar? Puedes elegir varias.')}
              {!typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {subjects.map((sub) => {
                      const selected = (data.intereses || []).includes(sub.id);
                      return (
                        <motion.button
                          key={sub.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleArray('intereses', sub.id)}
                          className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                            selected
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sub.color} flex items-center justify-center text-white text-lg mx-auto mb-2`}>
                            {sub.icon}
                          </div>
                          <p className="text-xs font-medium text-white/80">{sub.label}</p>
                          {selected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!data.intereses || data.intereses.length === 0}
                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Siguiente <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'goals' && (
            <motion.div key="goals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {renderProgressBar()}
              {renderAiMessage('¿Cuáles son tus metas principales? Elige todas las que apliquen.')}
              {!typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {renderCardGrid(goalOptions, 'metasList', true, (item) => {
                    const Icon = item.icon;
                    return <Icon size={20} className="text-primary-400" />;
                  })}
                  <button
                    onClick={nextStep}
                    disabled={!data.metasList || data.metasList.length === 0}
                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Siguiente <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'exams' && (
            <motion.div key="exams" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {renderProgressBar()}
              {renderAiMessage('¿Estás preparando algún examen en particular? ¿O alguna universidad en mente?')}
              {!typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <p className="text-xs text-surface-400 font-medium uppercase tracking-wider mb-2">Exámenes</p>
                  {renderCardGrid(examOptions, 'examenes', true)}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Universidades de interés (opcional)</label>
                    <input
                      type="text"
                      value={(data.universidades || []).join(', ')}
                      onChange={(e) => setData({ ...data, universidades: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                      placeholder="UNI, San Marcos, PUCP, UPC, UDEP..."
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>
                  <button onClick={nextStep} className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    Siguiente <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'hours' && (
            <motion.div key="hours" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {renderProgressBar()}
              {renderAiMessage('¿Cuántas horas puedes dedicar al estudio cada día?')}
              {!typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
                    <div className="text-6xl font-bold text-primary-400 mb-2">{data.horasDiarias || 2}</div>
                    <p className="text-sm text-surface-400">horas por día</p>
                    <input
                      type="range"
                      min={0.5}
                      max={8}
                      step={0.5}
                      value={data.horasDiarias || 2}
                      onChange={(e) => setData({ ...data, horasDiarias: parseFloat(e.target.value) })}
                      className="w-full mt-6 accent-primary-500"
                    />
                    <div className="flex justify-between text-xs text-surface-500 mt-2">
                      <span>30 min</span>
                      <span>4h</span>
                      <span>8h</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-surface-400">
                      {data.horasDiarias && data.horasDiarias >= 4
                        ? '¡Ritmo intensivo! Veremos grandes resultados.'
                        : data.horasDiarias && data.horasDiarias >= 2
                        ? 'Ritmo constante y sostenible. Perfecto.'
                        : 'Ritmo ligero pero efectivo. Cada minuto cuenta.'}
                    </p>
                  </div>
                  <button onClick={nextStep} className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    Siguiente <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'style' && (
            <motion.div key="style" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {renderProgressBar()}
              {renderAiMessage('¿Cómo prefieres aprender? Elige el estilo que más te acomode.')}
              {!typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {styleOptions.map((style) => {
                      const selected = data.estiloAprendizaje === style.id;
                      return (
                        <motion.button
                          key={style.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setData({ ...data, estiloAprendizaje: style.id as OnboardingData['estiloAprendizaje'] })}
                          className={`text-center p-6 rounded-xl border-2 transition-all ${
                            selected
                              ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="text-3xl mb-2">{style.icon}</div>
                          <p className={`text-sm font-semibold ${selected ? 'text-primary-300' : 'text-white'}`}>
                            {style.label}
                          </p>
                          <p className="text-xs text-surface-500 mt-1">{style.desc}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleComplete}
                    disabled={!data.estiloAprendizaje}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} /> Generar mi plan personalizado
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'summary' && recommendations && (
            <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: Math.random() * 100 + 'vw', y: -20, rotate: 0 }}
                      animate={{ y: '110vh', rotate: 360 + Math.random() * 360 }}
                      transition={{ duration: 2 + Math.random() * 2, ease: 'easeIn' }}
                      className="absolute"
                      style={{
                        width: 6 + Math.random() * 8,
                        height: 6 + Math.random() * 8,
                        backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD'][Math.floor(Math.random() * 6)],
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                      }}
                    />
                  ))}
                </div>
              )}

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary-500/30">
                    <PartyPopper size={32} />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1">{getGreetingMessage(state.user?.name || '')}</h1>
                  <p className="text-surface-400 text-sm">{recommendations.motivation}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={18} className="text-primary-400" />
                    <h2 className="font-bold text-white">Tu plan personalizado</h2>
                  </div>
                  <p className="text-sm text-surface-400 mb-4">{recommendations.summary}</p>

                  {recommendations.recommendedCourses.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">Cursos recomendados</p>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.recommendedCourses.map((c) => (
                          <span key={c.courseId} className="text-xs bg-primary-500/10 text-primary-300 px-3 py-1.5 rounded-full border border-primary-500/20">
                            {c.courseId.charAt(0).toUpperCase() + c.courseId.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Meta diaria</p>
                      <p className="text-sm text-white/80">{recommendations.dailyGoal}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Plan de estudio</p>
                      <ul className="space-y-1.5">
                        {recommendations.studyPlan.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                            <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {recommendations.examPrep.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Preparación para exámenes</p>
                        <ul className="space-y-1.5">
                          {recommendations.examPrep.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                              <Target size={14} className="text-amber-500 mt-0.5 shrink-0" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {recommendations.careerSuggestions.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">Carreras afines</p>
                        <p className="text-sm text-surface-300">{recommendations.careerSuggestions.join(', ')}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">Horario semanal sugerido</p>
                      <div className="space-y-1">
                        {recommendations.weeklySchedule.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Clock size={12} className="text-surface-500 shrink-0" />
                            <span className="text-surface-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={goToPlatform}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                >
                  <Sparkles size={20} /> Ir a mi Panel de Estudio
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
