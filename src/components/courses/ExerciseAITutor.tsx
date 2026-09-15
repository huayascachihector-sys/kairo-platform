import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Lightbulb,
  HelpCircle,
  Send,
  X,
  Bot,
  User,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAIResponse } from "../../lib/aiEngine";

interface ExerciseAITutorProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  options?: string[];
  selectedAnswer?: number | null;
  correctAnswer?: number;
  explanation?: string;
  subject?: string;
  difficulty?: "basico" | "intermedio" | "avanzado";
}

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export function ExerciseAITutor({
  isOpen,
  onClose,
  question,
  options = [],
  selectedAnswer = null,
  correctAnswer = 0,
  explanation = "",
  subject = "General",
  difficulty = "intermedio",
}: ExerciseAITutorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hintCount, setHintCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedText = selectedAnswer !== null && options[selectedAnswer] ? options[selectedAnswer] : null;
  const correctText = options[correctAnswer] || "";
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === correctAnswer;

  // Initialize with helpful context when opened
  useEffect(() => {
    if (!isOpen) return;

    let initialText = "";
    if (selectedAnswer === null) {
      initialText = `¡Hola! Soy tu **Tutor IA**. Estoy aquí para ayudarte a resolver este ejercicio paso a paso sin darte la respuesta de golpe para que realmente aprendas el concepto. 🧠\n\n¿Quieres una **pista orientativa** o prefieres que repasemos la **fórmula / concepto clave**?`;
    } else if (isCorrect) {
      initialText = `🎉 **¡Excelente trabajo!** Respondiste correctamente: **"${correctText}"**.\n\n${explanation ? `\n> *${explanation}*` : ""}\n\nSi quieres profundizar o ver una variante más desafiante de este problema, ¡avísame!`;
    } else {
      initialText = `No te preocupes por fallar, **los errores son la mejor oportunidad de aprender** 🌱.\n\nElegiste: *"${selectedText}"*, pero la respuesta correcta es: **"${correctText}"**.\n\n¿Te gustaría que analicemos **por qué ocurrió la confusión** o que veamos la **solución paso a paso**?`;
    }

    setMessages([
      {
        id: "init",
        role: "ai",
        text: initialText,
      },
    ]);
    setHintCount(0);
    setError("");
  }, [isOpen, question, selectedAnswer, correctAnswer, explanation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendPromptToAI = async (prompt: string, userFacingQuestion?: string) => {
    const userMsg: Message = {
      id: "u_" + Date.now(),
      role: "user",
      text: userFacingQuestion || prompt,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError("");

    try {
      const fullContextPrompt = `Eres un tutor pedagógico experto y entusiasta de la plataforma educativa KAIRO (enseñanza de secundaria y preuniversitaria con Método Feynman y Active Recall).
Materia: ${subject}
Dificultad: ${difficulty}
Pregunta del ejercicio: "${question}"
Opciones disponibles:
${options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}${i === correctAnswer ? " [CORRECTA]" : ""}`).join("\n")}
${selectedAnswer !== null ? `Respuesta que marcó el estudiante: "${selectedText}" (${isCorrect ? "CORRECTA" : "INCORRECTA"})` : "El estudiante aún está intentando resolver la pregunta."}
Explicación oficial de la lección: "${explanation}"

Instrucción del usuario: ${prompt}

Pautas pedagógicas:
1. Explica de forma ultra-clara, visual y empática (Método Feynman).
2. Si pide una pista, dale una pista progresiva sin revelar la respuesta final inmediatamente.
3. Si el estudiante falló, explica amablemente cuál fue la trampa o confusión común en su opción.
4. Usa formato Markdown con viñetas y negritas para que sea súper fácil de leer.`;

      const aiResponse = await getAIResponse(fullContextPrompt);

      if (!aiResponse.trim() || aiResponse.startsWith("⚠️") || aiResponse.startsWith("⏳")) {
        setError(aiResponse || "El tutor de IA no pudo responder en este momento.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "ai_" + Date.now(),
          role: "ai",
          text: aiResponse,
        },
      ]);
    } catch (err) {
      console.error("[ExerciseAITutor]", err);
      setError("No se pudo conectar con el tutor de IA. Verifica tu conexión e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickHint = () => {
    const nextCount = hintCount + 1;
    setHintCount(nextCount);
    let prompt = "";
    if (nextCount === 1) {
      prompt = "¿Cuál es el concepto o fórmula clave para empezar a resolver esta pregunta?";
    } else if (nextCount === 2) {
      prompt = "Dame una segunda pista más específica sobre cómo relacionar los datos del problema.";
    } else {
      prompt = "Guíame en el último paso antes de llegar al resultado final.";
    }
    sendPromptToAI(prompt, `💡 Dame la pista #${nextCount}`);
  };

  const handleStepByStep = () => {
    sendPromptToAI(
      "Explícame la solución completa paso a paso usando el Método Feynman (de forma simple y didáctica con un ejemplo intuitivo).",
      "🤖 Explicar solución paso a paso",
    );
  };

  const handleExplainError = () => {
    sendPromptToAI(
      `Explícame exactamente por qué la opción que elegí ("${selectedText}") es incorrecta y cuál es el error conceptual que debo evitar.`,
      "🔍 ¿Por qué mi respuesta fue incorrecta?",
    );
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    sendPromptToAI(text, text);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-2xl bg-surface-900/95 border border-primary-500/30 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-primary-900/50 via-surface-900 to-accent-900/40 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Tutor IA Explicativo
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 font-semibold border border-primary-500/30">
                    {subject} · {difficulty.toUpperCase()}
                  </span>
                </h3>
                <p className="text-xs text-surface-400">Pregunta y aprende paso a paso en tiempo real</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Question Summary Bar */}
          <div className="px-6 py-3 bg-white/5 border-b border-white/5 text-xs text-surface-300 flex items-center justify-between gap-3 flex-shrink-0">
            <p className="truncate font-medium flex-1">
              <span className="text-primary-400 font-semibold">Pregunta: </span>
              {question}
            </p>
            {isAnswered && (
              <span
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                  isCorrect
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {isCorrect ? "Correcta" : "Incorrecta"}
              </span>
            )}
          </div>

          {/* Quick Action Chips */}
          <div className="px-6 py-3 bg-surface-900/60 border-b border-white/5 flex gap-2 flex-wrap flex-shrink-0">
            <button
              onClick={handleQuickHint}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5" /> Pista #{hintCount + 1}
            </button>
            <button
              onClick={handleStepByStep}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" /> Paso a paso
            </button>
            {selectedAnswer !== null && !isCorrect && (
              <button
                onClick={handleExplainError}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
              >
                <HelpCircle className="w-3.5 h-3.5" /> ¿Por qué me equivoqué?
              </button>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className="w-8 h-8 rounded-xl bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-primary-300 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                    m.role === "user"
                      ? "bg-primary-600 text-white shadow-md rounded-tr-none"
                      : "bg-white/5 border border-white/10 text-surface-200 shadow-sm rounded-tl-none prose prose-invert prose-sm max-w-none"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="font-medium">{m.text}</p>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-accent-600/30 border border-accent-500/40 flex items-center justify-center text-accent-300 flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-primary-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-primary-300 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-400" />
                  El tutor está razonando la mejor explicación...
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300 flex-shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl px-4 py-3 text-xs text-rose-200">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleCustomSubmit}
            className="p-4 bg-surface-900/80 border-t border-white/10 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hazle una pregunta específica al tutor sobre este ejercicio..."
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-primary !py-2.5 !px-4 flex items-center gap-1.5 text-xs font-semibold shadow-md disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" /> Enviar
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
