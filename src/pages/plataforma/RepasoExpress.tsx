import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Zap,
  Target,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flame,
  TrendingDown,
  Award,
  Home,
} from "lucide-react";
import { loadState, saveState, recordQuestionAnswer, addXP, getSubjectProgress, type StoreState } from "../../lib/store";
import { generateRepasoSession, getRecentSessions, type RepasoSession, type RepasoQuestion, saveSessionToStorage } from "../../lib/repasoExpress";
import { ALL_COURSES } from "../../lib/courseData";

interface Props {
  onNavigate: (view: string, extra?: string) => void;
}

export default function RepasoExpress({ onNavigate }: Props) {
  const [state, setState] = useState<StoreState>(loadState);
  const [session, setSession] = useState<RepasoSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [recentSessions, setRecentSessions] = useState<RepasoSession[]>([]);
  const [activeTab, setActiveTab] = useState<"nuevo" | "historial">("nuevo");

  const refresh = () => setState(loadState());

  useEffect(() => {
    setRecentSessions(getRecentSessions());
  }, []);

  const startSession = useCallback(() => {
    const newSession = generateRepasoSession(loadState());
    setSession(newSession);
    saveSessionToStorage(newSession);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionComplete(false);
    setFinalScore(0);
    setActiveTab("nuevo");
  }, []);

  const answerQuestion = useCallback(
    (index: number) => {
      if (!session) return;
      const q = session.questions[index];
      if (!q) return;

      const isCorrect = index === q.correct;
      const newState = recordQuestionAnswer(`${q.topicId}:${q.id}`, isCorrect);
      setState(newState);

      if (isCorrect) {
        const xpState = addXP(10);
        setState(xpState);
      }

      const updatedSession = {
        ...session,
        score: session.score + (isCorrect ? 1 : 0),
        currentIndex: index + 1,
      };
      setSession(updatedSession);
      saveSessionToStorage(updatedSession);
      setSelectedAnswer(index);
      setShowResult(true);

      if (index + 1 >= session.questions.length) {
        setTimeout(() => {
          setSessionComplete(true);
          setFinalScore(updatedSession.score);
          const completed = { ...updatedSession, completed: true };
          setSession(completed);
          saveSessionToStorage(completed);
        }, 1500);
      }
    },
    [session],
  );

  const nextQuestion = useCallback(() => {
    if (!session) return;
    if (session.currentIndex >= session.questions.length) {
      setSessionComplete(true);
      setFinalScore(session.score);
      const completed = { ...session, completed: true };
      setSession(completed);
      saveSessionToStorage(completed);
      return;
    }
    setSelectedAnswer(null);
    setShowResult(false);
  }, [session]);

  const restartSession = useCallback(() => {
    if (!session) return;
    const restarted = {
      ...session,
      currentIndex: 0,
      score: 0,
      completed: false,
    };
    setSession(restarted);
    saveSessionToStorage(restarted);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionComplete(false);
    setFinalScore(0);
  }, [session]);

  const q = session?.questions[session?.currentIndex ?? 0];
  const progress = session ? ((session.currentIndex) / session.questions.length) * 100 : 0;
  const isLastQuestion = session && session.currentIndex === session.questions.length - 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary-600" />
            Repaso Express
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            Sesiones de 5 minutos enfocadas en tus temas más débiles
          </p>
        </div>
        <button
          onClick={() => onNavigate("dashboard")}
          className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 transition-colors"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* Weak topics preview */}
      {!session && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 p-6"
        >
          <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-red-500" />
            Tus Temas Más Débiles
          </h3>
          <WeakTopicsList />
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("nuevo")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "nuevo"
              ? "bg-primary-600 text-white"
              : "bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200"
          }`}
        >
          Nueva Sesión
        </button>
        <button
          onClick={() => setActiveTab("historial")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "historial"
              ? "bg-primary-600 text-white"
              : "bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200"
          }`}
        >
          Historial ({recentSessions.length})
        </button>
      </div>

      {/* New Session / Active Session */}
      {activeTab === "nuevo" && !session && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">
            ¿Listo para repasar?
          </h3>
          <p className="text-surface-500 dark:text-surface-400 text-sm mb-6 max-w-md mx-auto">
            KAIRO analizará tus debilidades y generará 10 preguntas rápidas de los temas donde más necesitas mejorar.
          </p>
          <button
            onClick={startSession}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-lg hover:shadow-primary-200/50 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all"
          >
            <Flame className="w-4 h-4" />
            Iniciar Repaso Express
          </button>
        </motion.div>
      )}

      {/* Active Session */}
      {session && !sessionComplete && q && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 overflow-hidden"
        >
          {/* Progress bar */}
          <div className="h-1 bg-surface-100 dark:bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="p-6">
            {/* Question counter */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-surface-400 dark:text-surface-500">
                Pregunta {session.currentIndex + 1} de {session.questions.length}
              </span>
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                {session.score} / {session.currentIndex}
              </span>
            </div>

            {/* Topic badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-full">
                <BookOpen className="w-3 h-3" />
                {q.topicTitle}
              </span>
            </div>

            {/* Question */}
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-6 leading-relaxed">
              {q.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let btnCls = "border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20";
                if (showResult) {
                  if (i === q.correct) {
                    btnCls = "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200";
                  } else if (i === selectedAnswer && i !== q.correct) {
                    btnCls = "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200";
                  } else {
                    btnCls = "opacity-40 pointer-events-none";
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => !showResult && answerQuestion(i)}
                    disabled={showResult}
                    className={`w-full text-left px-4 py-3 rounded-xl border ${btnCls} transition-all text-sm font-medium`}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 text-xs font-bold mr-3">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-surface-800"
              >
                <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1">
                  {selectedAnswer === q.correct ? "✅ Correcto" : "❌ Incorrecto"}
                </p>
                <p className="text-sm text-surface-700 dark:text-surface-300">{q.explanation}</p>
              </motion.div>
            )}

            {/* Next button */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex justify-end"
              >
                <button
                  onClick={nextQuestion}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
                >
                  {isLastQuestion ? "Ver resultado" : "Siguiente pregunta"}
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Session Complete */}
      {sessionComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 p-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
            ¡Sesión completada!
          </h3>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
            {finalScore} / {session?.questions.length}
          </p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">
            {finalScore >= 8
              ? "¡Excelente! Dominas estos temas."
              : finalScore >= 5
              ? "Buen progreso. Sigue practicando."
              : "Revisa las explicaciones y vuelve a intentar."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={restartSession}
              className="inline-flex items-center gap-2 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-200 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Repetir
            </button>
            <button
              onClick={() => {
                setSession(null);
                setActiveTab("historial");
                setRecentSessions(getRecentSessions());
              }}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              <Home className="w-4 h-4" />
              Ver Historial
            </button>
          </div>
        </motion.div>
      )}

      {/* History tab */}
      {activeTab === "historial" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {recentSessions.length === 0 ? (
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 p-8 text-center">
              <p className="text-surface-400 dark:text-surface-500 text-sm">
                No tienes sesiones completadas aún.
              </p>
              <button
                onClick={() => setActiveTab("nuevo")}
                className="mt-4 text-sm font-semibold text-primary-600 hover:underline"
              >
                Comenzar tu primera sesión →
              </button>
            </div>
          ) : (
            recentSessions.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      s.score / s.questions.length >= 0.7
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : s.score / s.questions.length >= 0.4
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    {s.score / s.questions.length >= 0.7 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : s.score / s.questions.length >= 0.4 ? (
                      <TrendingDown className="w-5 h-5 text-amber-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-800 dark:text-surface-100">
                      {s.topics.map((t) => t.subjectTitle).join(", ")}
                    </p>
                    <p className="text-xs text-surface-400 dark:text-surface-500">
                      {new Date(s.createdAt).toLocaleDateString("es-PE")} · {s.questions.length} preguntas
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {s.score}/{s.questions.length}
                </span>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}

function WeakTopicsList() {
  const state = loadState();
  const topics: Array<{
    title: string;
    pct: number;
    color: string;
  }> = ALL_COURSES.map((c) => {
    const p = getSubjectProgress(state, c.id);
    return {
      title: c.title,
      pct: p.pct,
      color:
        p.pct < 50
          ? "from-red-400 to-red-500"
          : p.pct < 70
          ? "from-amber-400 to-orange-500"
          : "from-emerald-400 to-emerald-500",
    };
  })
    .filter((t) => t.pct > 0)
    .sort((a, b) => a.pct - b.pct);

  if (topics.length === 0) {
    return (
      <p className="text-surface-400 dark:text-surface-500 text-sm">
        Completa algunos ejercicios para ver tus temas débiles aquí.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {topics.slice(0, 5).map((t) => (
        <div key={t.title} className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">
                {t.title}
              </span>
              <span className="text-xs font-bold text-surface-500 dark:text-surface-400">
                {t.pct}%
              </span>
            </div>
            <div className="w-full h-2 bg-surface-100 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${t.pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${t.color}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}