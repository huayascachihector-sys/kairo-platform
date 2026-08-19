import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Video, Clock, CheckCircle2, AlertCircle, RefreshCw, Star, ArrowLeft, ClipboardList, HelpCircle, AlertTriangle, Send } from 'lucide-react';
import { markFlag } from '../../lib/store';

interface EntrevistaProps {
  onNavigate: (view: string) => void;
}

const INTERVIEW_TIPS = [
  {
    title: 'Preparación',
    icon: ClipboardList,
    iconColor: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-600',
    tips: [
      'Investiga la carrera y la universidad antes de la entrevista.',
      'Prepara 3 preguntas que quieras hacer sobre la carrera.',
      'Ten un motivo claro de por qué esa universidad.',
      'Practica respuestas cortas (30-60 segundos).',
      'Lleva tu DNI, ensayo y cualquier documento requerido.',
    ],
  },
  {
    title: 'Durante la entrevista',
    icon: Mic,
    iconColor: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-600',
    tips: [
      'Llega 15 minutos antes.',
      'Saluda con firme mano y sonrisa.',
      'Mantén contacto visual natural.',
      'Habla con claridad y buen ritmo.',
      'Si no entiendes una pregunta, pide que la repitan.',
      'Sé honesto sobre tus fortalezas y debilidades.',
    ],
  },
  {
    title: 'Preguntas comunes',
    icon: HelpCircle,
    iconColor: 'text-violet-400',
    gradient: 'from-violet-500 to-purple-600',
    tips: [
      '"¿Por qué quieres estudiar esta carrera?" → Sé específico.',
      '"¿Cuáles son tus fortalezas?" → Da ejemplos concretos.',
      '"¿Qué opinas sobre [tema actual]?" → Muestra pensamiento crítico.',
      '"¿De qué leíste algo interesante sobre tu carrera?" → Sé auténtico.',
      '"¿Tienes alguna pregunta?" → Siempre da 2-3 preguntas preparadas.',
    ],
  },
  {
    title: 'Errores frecuentes',
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
    gradient: 'from-rose-500 to-red-600',
    tips: [
      'No llegues tarde.',
      'No te des por vencido si respondes mal a una pregunta.',
      'Evita respuestas tipo "no sé" sin contexto.',
      'No hables mal de tu colegio o profesores.',
      'No uses el celular durante la entrevista.',
    ],
  },
];

const BASE_QUESTIONS = [
  {
    question: '¿Por qué quieres estudiar esta carrera?',
    model: 'Mi interés nace de [experiencia específica]. He explorado [tema] y quiero profundizar. La facultad de [universidad] ofrece [elemento específico del programa] que se alinea con mis metas.',
  },
  {
    question: '¿Cuáles son tus fortalezas principales?',
    model: 'Soy perseverante y analítico. Por ejemplo, [historia concreta]. En matemáticas, resolvía problemas difíciles hasta entenderlos a fondo. En comunicación, mis escritos siempre recibieron buenos comentarios.',
  },
  {
    question: '¿Cómo te preparas para exámenes?',
    model: 'Sigo un método de repetición espaciada: estudio nuevo contenido, reviso lo aprendido a los 3 días y a la semana, luego hago simulacros cronometrados. Esto me permite retener la información sin agobiarme.',
  },
  {
    question: '¿Qué harás en los próximos 5 años?',
    model: 'En 5 años me graduaré con mención en [área]. Me gustaría especializarme en [subcampo] mediante una maestría. A mediano plazo, quiero [meta profesional concreta].',
  },
  {
    question: '¿Tienes alguna pregunta para nosotros?',
    model: 'Sí, dos: 1) ¿Qué oportunidades de investigación hay para estudiantes de primer año? 2) ¿Qué porcentaje de egresados logra empleo en su campo durante el primer año tras graduarse?',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function aiFeedback(answer: string): string {
  const words = answer.trim().split(/\s+/).length;
  if (words < 10) {
    return 'Tu respuesta es muy corta. Los entrevistadores esperan al menos 2-3 oraciones desarrolladas. Intenta incluir un ejemplo concreto.';
  }
  if (answer.toLowerCase().includes('no sé') || answer.toLowerCase().includes('no se')) {
    return 'Evita decir "no sé" directamente. En su lugar, di "No tengo esa información todavía, pero me gustaría aprender sobre...".';
  }
  if (words < 30) {
    return 'Buen inicio. Puedes expandir tu respuesta con ejemplos concretos de tu experiencia: los entrevistadores valoran historias reales.';
  }
  return 'Excelente respuesta. Incluiste elementos clave y mostraste pensamiento claro. Para destacar más, menciona algo específico de la universidad o carrera.';
}

export default function Entrevista({ onNavigate }: EntrevistaProps) {
  const [activeTip, setActiveTip] = useState<number | null>(0);
  const [questions, setQuestions] = useState(BASE_QUESTIONS);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const [aiInput, setAiInput] = useState('');
  const [aiStarted, setAiStarted] = useState(false);
  const [aiMsgs, setAiMsgs] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
  const [aiStep, setAiStep] = useState(0);

  const nextQuestion = () => {
    setQuestionIdx((prev) => (prev + 1) % questions.length);
    setUserAnswer('');
    setFeedback('');
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
    setFeedback(aiFeedback(userAnswer));
    markFlag("interview_done");
  };

  const newQuestions = () => {
    setQuestions(shuffle(BASE_QUESTIONS));
    setQuestionIdx(0);
    setUserAnswer('');
    setFeedback('');
    setShowFeedback(false);
  };

  const startAiTutor = () => {
    if (!aiInput.trim().toLowerCase().includes('si')) return;
    setAiStarted(true);
    setAiStep(1);
    setAiMsgs([
      { role: 'ai', text: '¡Hola! Soy tu tutor de entrevistas. Te haré 3 preguntas, respóndelas como si fuera la entrevista real. Empecemos:' },
      { role: 'ai', text: questions[0].question },
    ]);
  };

  const sendAiMessage = (text: string) => {
    const reply =
      aiStep % 2 === 1
        ? aiFeedback(text)
        : questions[(aiStep / 2) % questions.length]?.question;
    setAiMsgs((prev) => [...prev, { role: 'user', text }, { role: 'ai', text: reply }]);
    setAiStep((s) => s + 1);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => onNavigate('dashboard')}
        className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-800 dark:hover:text-surface-200">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-primary-600" /> Preparación para Entrevistas
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            Consejos, práctica con IA y simulacros de entrevistas de admisión.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-400">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          Práctica constante = Confianza
        </div>
      </div>

      {/* Tips sections */}
      <div className="grid md:grid-cols-2 gap-4">
        {INTERVIEW_TIPS.map((tip, i) => (
          <motion.button
            key={tip.title}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={() => setActiveTip(activeTip === i ? null : i)}
            className={`text-left bg-white dark:cyber-card-dark rounded-2xl border p-5 transition-all ${
              activeTip === i ? 'border-primary-300 shadow-md shadow-primary-100' : 'border-surface-100 dark:border-surface-800 hover:border-primary-200'
            }`}>
            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-2 flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tip.gradient} flex items-center justify-center`}>
                <tip.icon className="w-4 h-4 text-white" />
              </div> {tip.title}
            </h3>
            <div className={`space-y-1.5 ${activeTip === i ? '' : 'hidden'}`}>
              {tip.tips.map((t, ti) => (
                <div key={ti} className="flex items-start gap-2 text-xs text-surface-600">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> {t}
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Mock interview */}
      <motion.div initial={{ opacity: 0, y: 20 }} className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-primary-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Mic className="w-5 h-5 text-white/80" />
          <h2 className="text-lg font-bold">Simulacro de Entrevista</h2>
          <span className="ml-auto bg-white/15 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Pregunta {questionIdx + 1} de {questions.length}
          </span>
        </div>

        <div className="bg-white/10 rounded-xl p-5 mb-4">
          <p className="text-sm leading-relaxed">{questions[questionIdx].question}</p>
        </div>

        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          rows={4}
          className="w-full bg-white/90 rounded-xl px-4 py-3 text-sm text-surface-900 placeholder-surface-400 outline-none focus:ring-2 focus:ring-white resize-none"
        />

        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <button onClick={checkAnswer} disabled={!userAnswer.trim()}
            className="bg-white text-primary-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-primary-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            Ver feedback
          </button>
          <button onClick={nextQuestion}
            className="bg-white/15 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-white/25 transition-all">
            Siguiente pregunta
          </button>
        </div>

        {showFeedback && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm leading-relaxed">{feedback}</p>
          </motion.div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button disabled title="Próximamente: requiere cámara e IA de visión"
            className="flex items-center gap-2 text-xs bg-white/15 px-3 py-2 rounded-lg transition-colors text-white opacity-50 cursor-not-allowed">
            <Video className="w-3.5 h-3.5" /> Simular por video (próximamente)
          </button>
          <button onClick={newQuestions} className="flex items-center gap-2 text-xs bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg transition-colors text-white">
            <RefreshCw className="w-3.5 h-3.5" /> Nuevas preguntas
          </button>
        </div>
      </motion.div>

      {/* Mock interview with AI */}
      <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary-500" /> Práctica con tutor de IA
        </h3>
        <p className="text-xs text-surface-500 mb-4">
          El tutor de IA te hace preguntas de entrevista, evalúa tus respuestas y da feedback personalizado.
        </p>

        {!aiStarted ? (
          <div className="flex gap-2">
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startAiTutor()}
              placeholder="¿Quieres practicar una entrevista virtual? Escribe 'si'"
              className="flex-1 px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-white placeholder-surface-400 text-sm outline-none focus:border-primary-400"
            />
            <button onClick={startAiTutor}
              className="bg-primary-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors">
              Iniciar
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {aiMsgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] text-sm px-4 py-2.5 rounded-2xl ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-white rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!aiInput.trim()) return;
                sendAiMessage(aiInput.trim());
                setAiInput('');
              }}
              className="flex gap-2"
            >
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={aiStep % 2 === 1 ? 'Tu respuesta...' : '¿Alguna duda? Continúa...'}
                className="flex-1 px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-white placeholder-surface-400 text-sm outline-none focus:border-primary-400"
              />
              <button type="submit" className="bg-primary-600 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" /> Enviar
              </button>
            </form>
            {aiStep >= 6 && (
              <p className="text-xs text-surface-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-500" />
                Sesión completada. Pulsa "Nuevas preguntas" para volver a practicar con otras preguntas.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}