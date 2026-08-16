import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Calendar, Target, CheckCircle2, Trash2, Loader2, Wand2, Clock,
  MessageSquare, BookOpen, Brain, TrendingUp, ArrowRight, GraduationCap,
  FileText, Library, ExternalLink, Play, ChevronRight, ListChecks, BarChart3
} from 'lucide-react';
import { StudyPlan, StudyPlanTask, ResourceRecommendation, loadState, saveStudyPlan, toggleStudyPlanTask, deleteStudyPlan, addNotification } from '../../lib/store';
import { getAIResponse } from '../../lib/aiEngine';
import { getDueCount } from '../../lib/srsEngine';

interface Props {
  onStateChange: () => void;
  onNavigate?: (view: string, extra?: string) => void;
}

const TYPE_META: Record<StudyPlanTask['type'], { color: string; label: string }> = {
  teoria:   { color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300', label: 'Teoría' },
  repaso:   { color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300', label: 'Repaso' },
  ejercicios: { color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300', label: 'Ejercicios' },
  simulacro: { color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300', label: 'Simulacro' },
  descanso:  { color: 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300', label: 'Descanso' },
};

interface QuestionStep {
  key: string;
  question: string;
  placeholder: string;
}

const CONVERSATION_STEPS: QuestionStep[] = [
  {
    key: 'subjects',
    question: '¡Hola! Soy tu **planificador de estudio con IA**. Para crear un plan perfecto para ti, necesito conocerte un poco.\n\n**¿Qué materias necesitas estudiar?**\n\nPuedes escribir una o varias, por ejemplo: *Matemáticas, Física y Química*',
    placeholder: 'Ej: Matemáticas, Física, Química...',
  },
  {
    key: 'level',
    question: '**¿Cuál es tu nivel actual en estas materias?**\n\n• *Básico* — Estoy empezando desde cero\n• *Intermedio* — Tengo bases pero necesito reforzar\n• *Avanzado* — Ya domino lo básico, quiero profundizar',
    placeholder: 'Básico, Intermedio o Avanzado',
  },
  {
    key: 'time',
    question: '**¿Cuánto tiempo tienes para prepararte?**\n\n¿Tienes un examen con fecha fija? ¿O quieres un plan de estudio general para mejorar?',
    placeholder: 'Ej: Examen en 15 días, o estudio general',
  },
  {
    key: 'hours',
    question: '**¿Cuántas horas al día puedes estudiar?**\n\nSé realista — es mejor estudiar 1 hora constante que 5 horas un solo día.',
    placeholder: 'Ej: 2 horas al día',
  },
  {
    key: 'weaknesses',
    question: '**¿Cuáles son tus temas más débiles?**\n\n¿Hay algún tema en particular que se te complique? Así puedo enfocar más tiempo y recursos en eso.',
    placeholder: 'Ej: Ecuaciones cuadráticas, enlaces químicos...',
  },
  {
    key: 'goal',
    question: '**Por último, ¿cuál es tu meta principal?**\n\n• *Examen de admisión* (UNI, UNMSM, etc.)\n• *Estudio general* (mejorar en el colegio)\n• *Tema específico* (repasar un tema concreto)\n• *Preparación internacional* (SAT, TOEFL)',
    placeholder: 'Ej: Preparación para examen de admisión',
  },
];

const SUBJECT_ICONS: Record<string, string> = {
  matemáticas: '∫', física: '⚡', química: '🧪', historia: '📜',
  comunicación: '✍️', biología: '🧬', computación: '💻', inglés: '🇬🇧',
};

const RESOURCE_ROUTES: Record<string, { route: string; icon: string; label: string }> = {
  banco:  { route: 'banco',  icon: '📝', label: 'Banco de Preguntas' },
  curso:  { route: 'cursos', icon: '📖', label: 'Mis Cursos' },
  examen: { route: 'examenes', icon: '🌍', label: 'Exámenes Internacionales' },
  documento: { route: 'mis-documentos', icon: '📄', label: 'Mis Documentos' },
  asistente: { route: 'asistente', icon: '🤖', label: 'Asistente IA' },
};

async function generatePlanWithAI(answers: string[]): Promise<StudyPlan> {
  const systemPrompt = `Eres un planificador de estudio experto de la plataforma KAIRO. Tu tarea es crear un plan de estudio personalizado basado en la información del estudiante.

Información del estudiante:
- Materias: ${answers[0] || 'No especificado'}
- Nivel: ${answers[1] || 'No especificado'}
- Tiempo disponible: ${answers[2] || 'No especificado'}
- Horas por día: ${answers[3] || 'No especificado'}
- Debilidades: ${answers[4] || 'Ninguna'}
- Meta: ${answers[5] || 'No especificado'}

Responde SOLO con JSON válido (sin markdown ni texto extra) con esta estructura exacta:
{
  "goal": "resumen de la meta en una frase",
  "days": número de días del plan,
  "subjects": ["materia1", "materia2"],
  "difficulty": "basico|intermedio|avanzado",
  "hoursPerDay": número de horas,
  "priorities": ["prioridad 1", "prioridad 2", "prioridad 3", "prioridad 4"],
  "tasks": [
    {"day": 1, "title": "título de la tarea", "minutes": 60, "type": "teoria|repaso|ejercicios|simulacro|descanso"}
  ],
  "recommendations": [
    {"type": "banco|curso|examen|documento|asistente", "subject": "materia", "title": "título del recurso", "description": "descripción breve"}
  ]
}

Reglas:
- Incluye exactamente ${(() => { const days = answers[2]?.match(/(\d+)/); return days ? Math.min(Math.max(parseInt(days[1]), 2), 30) : 7; })()} tareas (una por día).
- El último día debe ser un simulacro.
- Alterna teoría, ejercicios y repaso.
- Recomienda al menos 3-4 recursos de la plataforma relevantes para el estudiante (banco de preguntas, cursos, exámenes internacionales, documentos, asistente IA).
- Los tipos de recurso válidos son: "banco", "curso", "examen", "documento", "asistente".`;

  const daysMatch = answers[2]?.match(/(\d+)/);
  let days = daysMatch ? Math.min(Math.max(parseInt(daysMatch[1]), 2), 30) : 7;

  const prompt = systemPrompt;

  try {
    const response = await getAIResponse(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('no json');
    const parsed = JSON.parse(jsonMatch[0]);

    const now = new Date();
    const tasks: StudyPlanTask[] = (parsed.tasks || []).slice(0, days).map((t: any, i: number) => {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      return {
        day: t.day || i + 1,
        date: d.toISOString().slice(0, 10),
        title: String(t.title || `Día ${i + 1}`),
        minutes: Number(t.minutes) || 60,
        type: (['teoria', 'repaso', 'ejercicios', 'simulacro', 'descanso'].includes(t.type) ? t.type : 'teoria') as StudyPlanTask['type'],
        done: false,
      };
    });

    if (tasks.length === 0) throw new Error('empty');

    const recommendations: ResourceRecommendation[] = (parsed.recommendations || []).slice(0, 8).map((r: any) => ({
      type: r.type as ResourceRecommendation['type'],
      subject: String(r.subject || 'General'),
      title: String(r.title || 'Recurso recomendado'),
      description: String(r.description || ''),
      route: RESOURCE_ROUTES[r.type]?.route || 'asistente',
      icon: RESOURCE_ROUTES[r.type]?.icon || '📚',
    }));

    return {
      id: Math.random().toString(36).slice(2),
      goal: String(parsed.goal || answers.join(' · ')),
      days: tasks.length,
      createdAt: new Date().toISOString(),
      tasks,
      priorities: (parsed.priorities || []).slice(0, 5).map(String),
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects.map(String) : answers[0]?.split(',').map(s => s.trim()).filter(Boolean) || [],
      difficulty: parsed.difficulty as StudyPlan['difficulty'] || 'intermedio',
      hoursPerDay: Number(parsed.hoursPerDay) || 2,
      recommendations,
    };
  } catch {
    return buildFallbackPlan(answers);
  }
}

function buildFallbackPlan(answers: string[]): StudyPlan {
  const daysMatch = answers[2]?.match(/(\d+)/);
  const days = daysMatch ? Math.min(Math.max(parseInt(daysMatch[1]), 2), 30) : 7;
  const now = new Date();
  const tasks: StudyPlanTask[] = [];

  for (let i = 1; i <= days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + (i - 1));
    const type: StudyPlanTask['type'] =
      i === days ? 'simulacro' : i % 4 === 0 ? 'repaso' : i % 3 === 0 ? 'ejercicios' : 'teoria';
    tasks.push({
      day: i,
      date: d.toISOString().slice(0, 10),
      title: `Día ${i}: ${type === 'simulacro' ? 'Simulacro final' : type === 'repaso' ? 'Repaso general' : type === 'ejercicios' ? 'Práctica intensiva' : 'Nueva teoría'}`,
      minutes: type === 'simulacro' ? 90 : 60,
      type,
      done: false,
    });
  }

  const subjects = answers[0]?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return {
    id: Math.random().toString(36).slice(2),
    goal: answers.join(' · ').slice(0, 100),
    days,
    createdAt: new Date().toISOString(),
    tasks,
    priorities: ['Teoría base', 'Ejercicios variados', 'Repaso activo', 'Simulacro final'],
    subjects,
    difficulty: (answers[1]?.toLowerCase().includes('básico') ? 'basico' : answers[1]?.toLowerCase().includes('avanzado') ? 'avanzado' : 'intermedio') as StudyPlan['difficulty'],
    hoursPerDay: parseInt(answers[3]?.match(/\d+/)?.[0] || '2'),
    recommendations: subjects.slice(0, 4).map((s, i) => ({
      type: 'banco' as const,
      subject: s,
      title: `Practica ${s} en el Banco de Preguntas`,
      description: `Refuerza ${s} con ejercicios interactivos y explicaciones detalladas.`,
      route: 'banco',
      icon: '📝',
    })),
  };
}

type PlanTab = 'plan' | 'recursos' | 'progreso';

export default function PlanEstudio({ onStateChange, onNavigate }: Props) {
  const [state, setState] = useState(loadState);
  const [phase, setPhase] = useState<'idle' | 'conversation' | 'generating' | 'complete'>('idle');
  const [conversationStep, setConversationStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(state.studyPlans[0]?.id || null);
  const [activeTab, setActiveTab] = useState<PlanTab>('plan');
  const [showExistingPlans, setShowExistingPlans] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationStep, phase]);

  useEffect(() => {
    if (phase === 'conversation') {
      inputRef.current?.focus();
    }
  }, [conversationStep, phase]);

  const refresh = () => { const s = loadState(); setState(s); onStateChange(); };

  const startConversation = () => {
    setAnswers([]);
    setConversationStep(0);
    setPhase('conversation');
    setCurrentInput('');
  };

  const handleAnswer = useCallback(async () => {
    if (!currentInput.trim() || generating) return;
    const newAnswers = [...answers, currentInput.trim()];
    setAnswers(newAnswers);
    setCurrentInput('');

    if (conversationStep < CONVERSATION_STEPS.length - 1) {
      setConversationStep(prev => prev + 1);
    } else {
      setPhase('generating');
      setGenerating(true);
      try {
        const plan = await generatePlanWithAI(newAnswers);
        saveStudyPlan(plan);
        addNotification({
          type: 'ia',
          title: '✨ Plan de estudio creado',
          body: `${plan.days} días · ${plan.subjects?.join(', ') || plan.goal.slice(0, 50)}`,
        });
        setActivePlanId(plan.id);
        setPhase('complete');
        setActiveTab('plan');
        refresh();
      } catch {
        setPhase('complete');
      } finally {
        setGenerating(false);
      }
    }
  }, [currentInput, answers, conversationStep, generating, refresh]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnswer();
    }
  };

  const toggle = (planId: string, day: number, title: string) => {
    toggleStudyPlanTask(planId, day, title);
    refresh();
  };

  const remove = (id: string) => {
    if (!confirm('¿Eliminar este plan?')) return;
    deleteStudyPlan(id);
    const remaining = loadState().studyPlans;
    setActivePlanId(remaining[0]?.id || null);
    setPhase(remaining.length === 0 ? 'idle' : 'complete');
    refresh();
  };

  const activePlan = state.studyPlans.find((p) => p.id === activePlanId) || state.studyPlans[0];
  const doneCount = activePlan?.tasks.filter((t) => t.done).length || 0;
  const totalCount = activePlan?.tasks.length || 0;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const pctBySubject = activePlan?.subjects?.length
    ? Math.round(pct / Math.max(activePlan.subjects.length, 1))
    : pct;

  const diffLabel = activePlan?.difficulty === 'basico' ? 'Básico' : activePlan?.difficulty === 'avanzado' ? 'Avanzado' : 'Intermedio';
  const diffColor = activePlan?.difficulty === 'basico' ? 'bg-emerald-100 text-emerald-700' : activePlan?.difficulty === 'avanzado' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Wand2 className="w-7 h-7 text-primary-600" /> Plan de Estudio Inteligente
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            Conversa con la IA y obtén un plan personalizado con recursos de la plataforma
          </p>
        </div>
        {(phase === 'complete' || state.studyPlans.length > 0) && (
          <div className="flex items-center gap-2">
            <button onClick={() => setShowExistingPlans(!showExistingPlans)}
              className="text-xs bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 px-3 py-2 rounded-xl hover:border-primary-300 transition-all flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5" /> Mis planes ({state.studyPlans.length})
            </button>
            <button onClick={() => { setPhase('idle'); startConversation(); }}
              className="text-xs bg-primary-600 text-white px-3 py-2 rounded-xl hover:bg-primary-700 transition-all flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Nuevo plan
            </button>
          </div>
        )}
      </div>

      {/* SRS Repaso CTA */}
      {getDueCount() > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                Tienes {getDueCount()} tarjeta(s) por repasar hoy
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                El repaso espaciado SM-2 te ayuda a retener lo que estudias
              </p>
            </div>
          </div>
          <button onClick={() => onNavigate?.('banco')}
            className="flex-shrink-0 text-xs font-semibold bg-amber-600 text-white px-4 py-2.5 rounded-xl hover:bg-amber-700 transition-all shadow-sm">
            Ir a repaso
          </button>
        </motion.div>
      )}

      {/* Existing plans dropdown */}
      <AnimatePresence>
        {showExistingPlans && state.studyPlans.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4">
            <div className="flex flex-wrap gap-2">
              {state.studyPlans.map((p) => (
                <button key={p.id} onClick={() => { setActivePlanId(p.id); setActiveTab('plan'); setPhase('complete'); setShowExistingPlans(false); }}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                    p.id === activePlan?.id
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-primary-300'
                  }`}>
                  <span className="mr-1.5">{p.subjects?.[0] || '📚'}</span>
                  {p.goal.slice(0, 35)}{p.goal.length > 35 ? '…' : ''}
                  <span className="ml-1.5 opacity-60">{p.days}d</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ─── IDLE STATE ─── */}
        {phase === 'idle' && !activePlan && (
          <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-8 md:p-12 shadow-lg shadow-primary-200/40 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Plan de estudio personalizado</h2>
            <p className="text-white/80 text-sm max-w-md mx-auto mb-6">
              La IA te hará unas preguntas para conocerte y creará un plan a tu medida,
              con recursos de la plataforma recomendados para cada tema.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6 text-xs text-white/70">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10">🎯 Meta personalizada</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10">📚 Recursos recomendados</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10">📊 Progreso visible</span>
            </div>
            <button onClick={startConversation}
              className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all inline-flex items-center gap-2 shadow-lg">
              <Sparkles className="w-5 h-5" /> Comenzar diagnóstico
            </button>
          </motion.div>
        )}

        {/* ─── CONVERSATION STATE ─── */}
        {phase === 'conversation' && (
          <motion.div key="conversation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid md:grid-cols-4 gap-6">
            {/* Step indicator */}
            <div className="md:col-span-1 order-2 md:order-1">
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 sticky top-4">
                <h3 className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Progreso</h3>
                <div className="space-y-2.5">
                  {CONVERSATION_STEPS.map((step, i) => {
                    const isDone = i < conversationStep;
                    const isCurrent = i === conversationStep;
                    return (
                      <div key={step.key} className={`flex items-center gap-2.5 ${
                        isCurrent ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-40'
                      }`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                          isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-primary-600 text-white ring-2 ring-primary-200 dark:ring-primary-800' : 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span className={`text-xs font-medium capitalize ${
                          isCurrent ? 'text-surface-900 dark:text-white' : 'text-surface-500 dark:text-surface-400'
                        }`}>
                          {step.key === 'subjects' ? 'Materias' : step.key === 'level' ? 'Nivel' : step.key === 'time' ? 'Tiempo' : step.key === 'hours' ? 'Horas' : step.key === 'weaknesses' ? 'Debilidades' : 'Meta'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className="md:col-span-3 order-1 md:order-2 flex flex-col">
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm flex flex-col h-[500px] md:h-[550px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                  {CONVERSATION_STEPS.slice(0, conversationStep + 1).map((step, i) => (
                    <div key={step.key}>
                      {/* AI question */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-surface-50 dark:bg-surface-800/80 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-surface-800 dark:text-surface-200 leading-relaxed max-w-[85%] prose prose-sm dark:prose-invert">
                          <div dangerouslySetInnerHTML={{ __html: step.question.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                        </div>
                      </div>
                      {/* User answer */}
                      {i < conversationStep && answers[i] && (
                        <div className="flex items-start gap-3 justify-end mb-3">
                          <div className="bg-primary-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm max-w-[75%]">
                            {answers[i]}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <BookOpen className="w-4 h-4 text-surface-600 dark:text-surface-300" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Generating indicator */}
                  {generating && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-surface-50 dark:bg-surface-800/80 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                        {[0, 0.15, 0.3].map((d, i) => (
                          <motion.div key={i} className="w-2 h-2 bg-primary-400 rounded-full"
                            animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Dark input */}
                <div className="border-t border-surface-100 dark:border-surface-800 p-3 md:p-4">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={generating}
                      placeholder={CONVERSATION_STEPS[conversationStep]?.placeholder || 'Escribe tu respuesta...'}
                      className="flex-1 bg-surface-900 dark:bg-black text-white rounded-xl px-4 py-3 text-sm placeholder-surface-500 outline-none focus:ring-2 focus:ring-primary-500 border border-surface-700 disabled:opacity-60"
                    />
                    <button
                      onClick={handleAnswer}
                      disabled={!currentInput.trim() || generating}
                      className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex-shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-surface-400 dark:text-surface-500 mt-2 text-center">
                    Pregunta {conversationStep + 1} de {CONVERSATION_STEPS.length} · Presiona Enter para enviar
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── GENERATING STATE ─── */}
        {phase === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-5">
              <Brain className="w-8 h-8 text-primary-600 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Creando tu plan personalizado...</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
              La IA está analizando tus respuestas y generando un plan con recursos recomendados.
            </p>
            <div className="flex justify-center gap-1.5">
              {[0, 0.15, 0.3, 0.45, 0.6].map((d, i) => (
                <motion.div key={i} className="w-3 h-3 bg-primary-400 rounded-full"
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── COMPLETE STATE ─── */}
        {phase === 'complete' && activePlan && (
          <motion.div key="complete" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Summary bar */}
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-5 md:p-6 shadow-lg shadow-primary-200/40 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Plan generado con IA
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white">{activePlan.goal}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/20 text-white">
                      {activePlan.days} días · {activePlan.hoursPerDay || '?'}h/día
                    </span>
                    {activePlan.difficulty && (
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${diffColor}`}>
                        {diffLabel}
                      </span>
                    )}
                    {activePlan.subjects?.map((s, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/15 text-white/90">
                        {SUBJECT_ICONS[s.toLowerCase()] || '📚'} {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{doneCount}/{totalCount}</p>
                    <p className="text-[10px] text-white/70">Tareas</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div>
                    <p className="text-2xl font-bold text-white">{pct}%</p>
                    <p className="text-[10px] text-white/70">Completado</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-white rounded-full" />
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 bg-white dark:bg-surface-900 rounded-xl border border-surface-100 dark:border-surface-800 p-1 mb-6">
              {([
                { id: 'plan' as const, icon: Calendar, label: 'Plan de estudio' },
                { id: 'recursos' as const, icon: Library, label: 'Recursos' },
                { id: 'progreso' as const, icon: BarChart3, label: 'Progreso' },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}>
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === 'plan' && (
                <motion.div key="tab-plan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="grid lg:grid-cols-3 gap-6">
                  {/* Overview sidebar */}
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-5">
                      <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary-600" /> Prioridades
                      </h3>
                      <ul className="space-y-2.5">
                        {activePlan.priorities.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-200">
                            <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-5">
                      <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary-600" /> Estadísticas
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-primary-600">{activePlan.days}</p>
                          <p className="text-[10px] text-surface-500">Días totales</p>
                        </div>
                        <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-emerald-600">{activePlan.hoursPerDay || '?'}h</p>
                          <p className="text-[10px] text-surface-500">Por día</p>
                        </div>
                        <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-amber-600">{doneCount}</p>
                          <p className="text-[10px] text-surface-500">Completadas</p>
                        </div>
                        <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-purple-600">{activePlan.subjects?.length || 0}</p>
                          <p className="text-[10px] text-surface-500">Materias</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => remove(activePlan.id)}
                      className="w-full text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold py-3 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar plan
                    </button>
                  </div>

                  {/* Schedule */}
                  <div className="lg:col-span-2 bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-600" /> Horario detallado
                    </h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                      {activePlan.tasks.map((t, i) => {
                        const meta = TYPE_META[t.type];
                        return (
                          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.015 }}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              t.done ? 'bg-emerald-50 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800' : 'bg-surface-50 dark:bg-surface-800/50 border-surface-100 dark:border-surface-800 hover:border-primary-200 dark:hover:border-primary-800'
                            }`}>
                            <button onClick={() => toggle(activePlan.id, t.day, t.title)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                t.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-surface-300 dark:border-surface-600 hover:border-primary-400'
                              }`}>
                              {t.done && <CheckCircle2 className="w-4 h-4" />}
                            </button>
                            <div className="w-10 text-center flex-shrink-0">
                              <p className="text-[10px] text-surface-400 dark:text-surface-500 uppercase">Día</p>
                              <p className="text-sm font-bold text-surface-900 dark:text-white">{t.day}</p>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${t.done ? 'text-surface-400 dark:text-surface-500 line-through' : 'text-surface-800 dark:text-surface-100'}`}>
                                {t.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                                <span className="text-[10px] text-surface-400 dark:text-surface-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {t.minutes} min</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-surface-300 dark:text-surface-600 flex-shrink-0" />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'recursos' && (
                <motion.div key="tab-recursos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {activePlan.recommendations && activePlan.recommendations.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {activePlan.recommendations.map((rec, i) => {
                        const routeInfo = RESOURCE_ROUTES[rec.type];
                        return (
                          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-5 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all group">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xl flex-shrink-0">
                                {rec.icon || '📚'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-surface-900 dark:text-white text-sm">{rec.title}</h3>
                                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">{rec.description}</p>
                                <div className="flex items-center gap-2 mt-3">
                                  {rec.subject && (
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                                      {rec.subject}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                    {routeInfo?.label || 'Recurso'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {onNavigate && (
                              <button onClick={() => onNavigate(rec.route)}
                                className="mt-4 w-full text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-xl py-2.5 transition-all flex items-center justify-center gap-1.5">
                                <ExternalLink className="w-3.5 h-3.5" /> Ir a {routeInfo?.label || 'recurso'}
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-8 text-center">
                      <Library className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                      <p className="text-sm text-surface-500 dark:text-surface-400">No hay recomendaciones disponibles para este plan.</p>
                      <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">Explora las secciones de la plataforma para encontrar material de estudio.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'progreso' && (
                <motion.div key="tab-progreso" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Overall progress */}
                  <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-5">
                    <h3 className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Avance general</h3>
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                          className="text-surface-100 dark:text-surface-800" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                          className="text-primary-600" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-surface-900 dark:text-white">{pct}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-center text-surface-500 dark:text-surface-400">
                      {doneCount} de {totalCount} tareas completadas
                    </p>
                  </div>

                  {/* Subjects progress */}
                  {activePlan.subjects && activePlan.subjects.length > 0 && (
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-5">
                      <h3 className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Materias</h3>
                      <div className="space-y-3">
                        {activePlan.subjects.map((s, i) => (
                          <div key={i}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-surface-700 dark:text-surface-200">{s}</span>
                              <span className="text-xs text-surface-400">{pctBySubject}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pctBySubject}%` }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Study stats */}
                  <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-5">
                    <h3 className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Rendimiento</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-300">Días planificados</span>
                        <span className="text-sm font-bold text-surface-900 dark:text-white">{activePlan.days}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-300">Horas totales</span>
                        <span className="text-sm font-bold text-surface-900 dark:text-white">
                          {activePlan.tasks.reduce((sum, t) => sum + t.minutes, 0)} min
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-300">Simulacros</span>
                        <span className="text-sm font-bold text-surface-900 dark:text-white">
                          {activePlan.tasks.filter(t => t.type === 'simulacro').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-300">Días de teoría</span>
                        <span className="text-sm font-bold text-surface-900 dark:text-white">
                          {activePlan.tasks.filter(t => t.type === 'teoria').length}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-surface-800 dark:text-surface-100">Horas por día</span>
                          <span className="text-sm font-bold text-primary-600">{activePlan.hoursPerDay || '?'}h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
