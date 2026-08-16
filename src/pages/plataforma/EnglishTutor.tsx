import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Loader2,
  BookOpen,
  Brain,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Trash2,
  GraduationCap,
  BookMarked,
  Mic,
  Square,
  Volume2,
  VolumeX,
  MessageCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { speak, SpeechRecognitionController } from "../../lib/speech";
import {
  getEnglishTutorResponse,
  CEFR_LEVELS,
  getEnglishTutorContext,
  clearEnglishTutorContext,
} from "../../lib/englishEngine";
import {
  addErrorEntry,
  getErrorBank,
  getErrorBankStats,
  markErrorResolved,
  deleteErrorEntry,
  type ErrorEntry,
  type ErrorType,
} from "../../lib/store";
import {
  getDueCards,
  updateCardData,
  parseCardId,
  buildCardId,
  type SRSAction,
  type SRSReview,
} from "../../lib/srsEngine";
import SRSRating from "../../components/plataforma/SRSRating";
import { ENGLISH_EXPRESSIONS, type ExpressionType } from "../../data/englishExpressions";

const ERROR_LABELS: Record<ErrorType, string> = {
  grammar: "Gramática",
  vocabulary: "Vocabulario",
  collocation: "Colocación",
  pronunciation: "Pronunciación",
  register: "Registro",
};

const ERROR_COLORS: Record<ErrorType, string> = {
  grammar: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  vocabulary: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  collocation: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  pronunciation: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  register: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

const TOPICS = [
  { id: "", label: "🎯 Conversación libre" },
  {
    id: "Introduce yourself. Talk about your daily routine and what you like to do in your free time.",
    label: "👋 Presentarme",
  },
  {
    id: "Order food at a restaurant, ask for recommendations and pay the bill.",
    label: "🍽️ En un restaurante",
  },
  {
    id: "You are a job candidate in an interview. Answer questions about your experience and strengths.",
    label: "💼 Entrevista de trabajo",
  },
  {
    id: "Plan a weekend trip with a friend: destinations, budget and activities.",
    label: "✈️ Planear un viaje",
  },
  {
    id: "Debate: should students have to wear uniforms? Give arguments and counter-arguments.",
    label: "🎓 Debate escolar",
  },
  {
    id: "Talk about your plans for the future: career, studies and goals for the next five years.",
    label: "🚀 Metas futuras",
  },
  {
    id: "You are in a doctor's office describing your symptoms and asking for advice.",
    label: "🩺 En el doctor",
  },
];

const STARTERS = [
  "Hello! I'm ready to practice. What should we talk about?",
  "Can you ask me questions about my daily routine?",
  "Let's talk about technology and social media.",
  "I want to practice the past tense. Ask me about my childhood.",
  "Help me sound more natural. Give me common expressions.",
];

interface TutorMessage {
  id: string;
  role: "user" | "tutor";
  text: string;
  errors: ErrorEntry[];
}

type Tab = "chat" | "bank" | "review" | "expressions";

function makeMsg(role: "user" | "tutor", text: string, errors: ErrorEntry[] = []): TutorMessage {
  return { id: Math.random().toString(36).slice(2, 10), role, text, errors };
}

export default function EnglishTutor() {
  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState("B1");
  const [topic, setTopic] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [bankVersion, setBankVersion] = useState(0);
  const [filter, setFilter] = useState<ErrorType | "all">("all");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recRef = useRef<SpeechRecognitionController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      recRef.current?.dispose();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const initialCtxRef = useRef<{ topic: string; context: string } | null>(getEnglishTutorContext());
  const ctx = initialCtxRef.current;
  const sessionTopic = topic || ctx?.topic || "";
  const sessionContext = ctx?.context || "";

  useEffect(() => {
    const greeting = ctx
      ? `Hey! 👋 You just finished a story about "${ctx.topic}". Let's talk about it so you can use the new vocabulary. What did you like most about it?`
      : "Hi! 👋 I'm your English conversation coach. I'll correct every mistake you make so you improve fast. Pick a level and a topic, then say hi. Ready?";
    setMessages([makeMsg("tutor", greeting)]);
    if (ctx) clearEnglishTutorContext();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const history = messages
    .slice(1)
    .slice(-16)
    .map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      text: m.text,
    }));

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || typing) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setMessages((prev) => [...prev, makeMsg("user", clean)]);
      setInput("");
      setTyping(true);
      setError(null);
      setSessionStarted(true);

      try {
        const { reply, errors } = await getEnglishTutorResponse(
          clean,
          level,
          sessionTopic,
          sessionContext,
          history,
        );
        if (controller.signal.aborted) return;
        const tutorMsg = makeMsg("tutor", reply, errors);
        setMessages((prev) => [...prev, tutorMsg]);
        if (errors.length > 0) {
          for (const e of errors) {
            const saved = addErrorEntry({
              studentText: e.studentText,
              correctedText: e.correctedText,
              explanation: e.explanation,
              type: e.type,
              level,
            });
            updateCardData(buildCardId("error", saved.errorBank[0].id), "good");
          }
          setBankVersion((v) => v + 1);
        }
      } catch {
        if (controller.signal.aborted) return;
        setError("No se pudo conectar con el tutor. Verifica tu conexión.");
      } finally {
        if (!controller.signal.aborted) {
          setTyping(false);
          abortRef.current = null;
        }
      }
    },
    [typing, level, sessionTopic, sessionContext, history],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([makeMsg("tutor", "Chat reiniciado. ¿De qué quieres hablar hoy?")]);
    setSessionStarted(false);
    setError(null);
  };

  const toggleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    speak(text, {
      lang: "en-US",
      onstart: () => setSpeakingId(id),
      onend: () => setSpeakingId(null),
      onerror: () => setSpeakingId(null),
    });
  };

  const startListening = () => {
    if (recRef.current?.isListening) { stopListening(); return; }
    const ctrl = new SpeechRecognitionController("en-US", {
      onFinal: (t) => send(t.trim()),
      onInterim: (t) => setInterim(t),
      onEnd: () => setListening(false),
      onError: (msg) => {
        setListening(false);
        if (msg !== "aborted" && !msg.includes("no-speech")) {
          setError("No se pudo escuchar. Revisa el micrófono o intenta con Chrome.");
        }
      },
    });
    if (!ctrl.isSupported) {
      setError("Tu navegador no soporta dictado. Intenta con Chrome o Edge.");
      return;
    }
    recRef.current = ctrl;
    ctrl.start();
    setListening(true);
    setInterim("");
    setError(null);
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  };

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const bank = getErrorBank();
  const stats = getErrorBankStats();
  const visibleErrors = filter === "all" ? bank : bank.filter((e) => e.type === filter);

  const dueErrorCards = getDueCards()
    .filter((c) => parseCardId(c.cardId).source === "error")
    .map((c) => {
      const id = parseCardId(c.cardId).parts[0];
      const entry = bank.find((e) => e.id === id);
      return entry ? { card: c, entry } : null;
    })
    .filter((x): x is { card: SRSReview; entry: ErrorEntry } => x !== null);

  const handleRate = (card: SRSReview, action: SRSAction) => {
    updateCardData(card.cardId, action);
    setBankVersion((v) => v + 1);
  };

  const chatHeader = (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-rose-500" />
        Tutor de Conversación en Inglés
      </h1>
      <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
        Habla en inglés, el tutor corrige cada error y tus errores entran a tu repaso espaciado.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <label className="block">
          <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
            Tu nivel (CEFR)
          </span>
          <div className="flex gap-1 mt-1.5">
            {CEFR_LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  level === l
                    ? "bg-rose-600 text-white shadow-md"
                    : "bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-rose-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
            Tema / escenario
          </span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1.5 w-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl px-3 py-2 text-sm text-surface-900 dark:text-white outline-none focus:border-rose-400"
          >
            {TOPICS.map((t) => (
              <option key={t.label} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-1 mt-4 border-b border-surface-200 dark:border-surface-700">
        {(
          [
            ["chat", "Conversar", MessageCircle],
            ["bank", "Mis errores", BookMarked],
            ["review", "Repaso", Brain],
            ["expressions", "Expresiones", BookOpen],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              tab === id
                ? "border-rose-500 text-rose-600 dark:text-rose-400"
                : "border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === "bank" && bank.length > 0 && (
              <span className="text-[10px] bg-rose-600 text-white px-1.5 rounded-full min-w-[18px] text-center">
                {bank.length}
              </span>
            )}
            {id === "review" && dueErrorCards.length > 0 && (
              <span className="text-[10px] bg-amber-500 text-white px-1.5 rounded-full min-w-[18px] text-center">
                {dueErrorCards.length}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-[calc(100vh-20rem)] min-h-[420px]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "tutor" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-rose-600 text-white rounded-br-sm"
                    : "bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-sm text-surface-800 dark:text-surface-200 rounded-bl-sm"
                }`}
              >
                {msg.role === "tutor" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-surface-800 dark:prose-p:text-surface-200">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}

                {msg.role === "tutor" && (
                  <button
                    onClick={() => toggleSpeak(msg.id, msg.text)}
                    className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                      speakingId === msg.id
                        ? "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-800"
                        : "bg-surface-100 dark:bg-surface-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-surface-500 dark:text-surface-400 hover:text-rose-600 dark:hover:text-rose-400"
                    }`}
                    title={speakingId === msg.id ? "Stop" : "Hear it"}
                  >
                    {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    {speakingId === msg.id ? "Stop" : "Listen"}
                  </button>
                )}

                {msg.role === "tutor" && msg.errors.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-800 space-y-2">
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Correcciones de este turno
                    </p>
                    {msg.errors.map((e, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-700 p-2.5 text-xs"
                      >
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ERROR_COLORS[e.type]}`}
                          >
                            {ERROR_LABELS[e.type]}
                          </span>
                          <span className="text-red-500 line-through decoration-red-400/70">
                            {e.studentText}
                          </span>
                          <span className="text-surface-400">→</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {e.correctedText}
                          </span>
                        </div>
                        {e.explanation && (
                          <p className="text-surface-500 dark:text-surface-400 mt-1">
                            {e.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                    <p className="text-[10px] text-surface-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Guardados automáticamente en "Mis errores" para repasarlos con repetición
                      espaciada.
                    </p>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
                  <BookOpen className="w-4 h-4 text-surface-600 dark:text-surface-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center mr-2 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-rose-400 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {!sessionStarted && !typing && !error && (
        <div className="mb-4 flex-shrink-0">
          <p className="text-xs text-surface-400 dark:text-surface-500 mb-2 font-medium">
            Empieza con una de estas frases:
          </p>
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-surface-600 dark:text-surface-300 hover:text-rose-700 px-3 py-1.5 rounded-full transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3 flex-shrink-0">
        {listening && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface-900/95 text-white rounded-2xl px-4 py-3 shadow-xl ring-1 ring-rose-400/40">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="text-sm">
              <p className="font-semibold flex items-center gap-2"><Mic className="w-4 h-4" /> I'm listening...</p>
              <p className="text-xs text-white/70">{interim || "Say something in English — it will auto-send."}</p>
            </div>
            <button type="button" onClick={stopListening} className="ml-2 p-2 rounded-lg hover:bg-white/10 text-white" title="Stop">
              <Square className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe en inglés... Try saying something! (Tu idea en español también sirve)"
            disabled={typing}
            className="w-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl px-5 py-3.5 pr-24 text-sm text-surface-900 dark:text-white placeholder-surface-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all disabled:opacity-60"
          />
          <button
            type="button"
            onClick={startListening}
            disabled={typing}
            className={`absolute right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-colors text-surface-400 dark:text-surface-500 hover:text-rose-600 dark:hover:text-rose-400 ${
              listening ? "text-rose-600 bg-rose-50" : ""
            }`}
            title={listening ? "Stop dictation" : "Dictate by voice (English)"}>
            {listening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderBank = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.total}</p>
          <p className="text-[10px] text-surface-400 font-medium mt-0.5">Errores registrados</p>
        </div>
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.resolved}
          </p>
          <p className="text-[10px] text-surface-400 font-medium mt-0.5">Dominados</p>
        </div>
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.byType[stats.mostFrequent || "grammar"] || 0}
          </p>
          <p className="text-[10px] text-surface-400 font-medium mt-0.5">Error más común</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
            filter === "all"
              ? "bg-rose-600 text-white"
              : "bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300"
          }`}
        >
          Todos ({bank.length})
        </button>
        {(Object.keys(ERROR_LABELS) as ErrorType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(filter === t ? "all" : t)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
              filter === t
                ? "bg-rose-600 text-white"
                : "bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300"
            }`}
          >
            {ERROR_LABELS[t]} ({stats.byType[t]})
          </button>
        ))}
      </div>

      {visibleErrors.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {bank.length === 0
              ? "Aún no tienes errores guardados. Empieza una conversación con el tutor."
              : "No hay errores de este tipo. ¡Buen trabajo!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleErrors.map((e) => (
            <div
              key={e.id}
              className={`bg-white dark:bg-surface-900 rounded-xl border border-surface-100 dark:border-surface-800 shadow-sm p-3 flex items-start gap-3 ${
                e.resolved ? "opacity-60" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ERROR_COLORS[e.type]}`}
              >
                {e.resolved ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs line-through text-red-500 decoration-red-400/70">
                    {e.studentText}
                  </span>
                  <span className="text-surface-400 text-xs">→</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {e.correctedText}
                  </span>
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                  {e.explanation}
                </p>
                <p className="text-[10px] text-surface-400 mt-1">
                  {ERROR_LABELS[e.type]}
                  {e.level ? ` · Nivel ${e.level}` : ""} ·{" "}
                  {new Date(e.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {!e.resolved && (
                  <button
                    onClick={() => {
                      markErrorResolved(e.id);
                      setBankVersion((v) => v + 1);
                    }}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 transition-colors"
                    title="Lo domino ahora"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteErrorEntry(e.id);
                    setBankVersion((v) => v + 1);
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-surface-400 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderReview = () => (
    <div className="space-y-5">
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2">
          <Brain className="w-4 h-4 text-rose-500" /> Repaso espaciado de tus errores
        </h3>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
          Cada error que cometiste en conversación se convierte en una tarjeta. Según cómo la
          domines, reaparecerá en minutos, días o semanas. Así conviertes tus errores en aprendizaje
          duradero.
        </p>
      </div>

      {dueErrorCards.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {getDueCards().some((c) => parseCardId(c.cardId).source === "error")
              ? "No hay tarjetas pendientes hoy. ¡Excelente!"
              : "Comete algunos errores conversando con el tutor y vuelve aquí para repasarlos."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dueErrorCards.map(({ card, entry }) => (
            <div
              key={card.cardId}
              className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ERROR_COLORS[entry.type]}`}
                >
                  <XCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm line-through text-red-500 decoration-red-400/70">
                      {entry.studentText}
                    </span>
                    <span className="text-surface-400 text-xs">→</span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {entry.correctedText}
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    {entry.explanation}
                  </p>
                </div>
              </div>
              <div className="mt-4 border-t border-surface-100 dark:border-surface-800 pt-3">
                <SRSRating onRate={(action) => handleRate(card, action)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderExpressions = () => {
    const exprTypeLabels: Record<ExpressionType, string> = {
      idiom: "Idiom",
      "phrasal-verb": "Phrasal verb",
      collocation: "Colocación",
      expression: "Expresión",
    };
    const exprTypeColors: Record<ExpressionType, string> = {
      idiom: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      "phrasal-verb": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      collocation: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      expression: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    };

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-500" /> Las expresiones que más se usan
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
            Basadas en frecuencia real de uso (corpus). El 25% de los phrasal verbs más frecuentes
            cubren más del 60% de lo que oyes. Domina estas y sonarás mucho más natural.
          </p>
        </div>

        {ENGLISH_EXPRESSIONS.map((group) => (
          <div key={group.level}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white">{group.label}</h3>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  level === group.level
                    ? "bg-rose-600 text-white"
                    : "bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400"
                }`}
              >
                {group.expressions.length} expresiones
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {group.expressions.map((e) => (
                <div
                  key={e.expression}
                  className="bg-white dark:bg-surface-900 rounded-xl border border-surface-100 dark:border-surface-800 shadow-sm p-3"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-surface-900 dark:text-white">
                      {e.expression}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${exprTypeColors[e.type]}`}
                    >
                      {exprTypeLabels[e.type]}
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    <span className="font-semibold text-surface-700 dark:text-surface-300">
                      {e.meaning}
                    </span>
                    <br />
                    <em className="text-surface-400 dark:text-surface-500">{e.example}</em>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {chatHeader}

      {error && (
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4" /> {error}
          <button onClick={() => setError(null)} className="ml-auto hover:opacity-70">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] text-surface-400 dark:text-surface-500">
          {sessionContext
            ? `Contexto: ${sessionTopic || "lección de inglés"} — usa el vocabulario que acabas de aprender.`
            : "Ciencia: input comprensible + output con corrección + repetición espaciada."}
        </p>
        {tab === "chat" && (
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 text-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reiniciar
          </button>
        )}
      </div>

      {tab === "chat" && renderChat()}
      {tab === "bank" && renderBank()}
      {tab === "review" && renderReview()}
      {tab === "expressions" && renderExpressions()}
    </div>
  );
}
