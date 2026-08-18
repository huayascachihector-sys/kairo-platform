import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Zap,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Home,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import { loadState, addFlashcard, removeFlashcard, getFlashcards, getFlashcardsByCourse, getFlashcardStats, type StoreState } from "../../lib/store";
import { ALL_COURSES } from "../../lib/courseData";
import { generateFlashcardsForCourse } from "../../lib/store";

interface Props {
  onNavigate: (view: string, extra?: string) => void;
}

export default function Flashcards({ onNavigate }: Props) {
  const [state, setState] = useState<StoreState>(loadState);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCourseId, setNewCourseId] = useState("");
  const [stats, setStats] = useState(getFlashcardStats(state));

  const refresh = () => {
    setState(loadState());
    setStats(getFlashcardStats(loadState()));
  };

  const cards = selectedCourse === "all"
    ? getFlashcards(state)
    : getFlashcardsByCourse(state, selectedCourse);

  const currentCard = cards[currentIndex];

  const generateForCourse = (courseId: string) => {
    const newState = generateFlashcardsForCourse(courseId);
    setState(newState);
    setStats(getFlashcardStats(newState));
  };

  const addManualCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    addFlashcard({
      lessonId: "",
      courseId: newCourseId || "general",
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      difficulty: "medio",
      source: "manual",
    });
    setNewQuestion("");
    setNewAnswer("");
    refresh();
    setShowForm(false);
  };

  const deleteCard = (id: string) => {
    removeFlashcard(id);
    refresh();
  };

  useEffect(() => {
    setStats(getFlashcardStats(state));
  }, [state]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            Flashcards IA
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            Tarjetas generadas automáticamente desde tus lecciones
          </p>
        </div>
        <button
          onClick={() => onNavigate("dashboard")}
          className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 transition-colors"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/30" },
          { label: "IA", value: stats.aiGenerated, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
          { label: "Manuales", value: stats.manual, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/30" },
          { label: "Cursos", value: Object.keys(stats.byCourse).length, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/30" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-xl p-4 text-center ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Course filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCourse("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedCourse === "all"
              ? "bg-primary-600 text-white"
              : "bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200"
          }`}
        >
          Todas
        </button>
        {ALL_COURSES.map((c) => {
          const count = (state.flashcards || []).filter((f) => f.courseId === c.id).length;
          if (count === 0) return null;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCourse(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCourse === c.id
                  ? "bg-primary-600 text-white"
                  : "bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200"
              }`}
            >
              {c.icon} {c.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Generate buttons */}
      <div className="flex gap-2 flex-wrap">
        {ALL_COURSES.map((c) => {
          const count = (state.flashcards || []).filter((f) => f.courseId === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => generateForCourse(c.id)}
              className="inline-flex items-center gap-1.5 text-xs bg-white dark:cyber-card-dark border border-surface-200 dark:border-surface-700 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-surface-600 dark:text-surface-300 hover:text-primary-700 dark:hover:text-primary-300 px-3 py-1.5 rounded-full transition-all"
            >
              <Sparkles className="w-3 h-3" />
              Generar {c.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Flashcard Review */}
      {cards.length > 0 && currentCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-primary-500 to-accent-500">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-surface-400 dark:text-surface-500">
                {currentIndex + 1} / {cards.length}
              </span>
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                {currentCard.courseId}
              </span>
            </div>

            <div
              className="min-h-[120px] flex items-center justify-center cursor-pointer perspective-1000"
              onClick={() => setFlipped(!flipped)}
            >
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", damping: 15 }}
                className="w-full max-w-md"
              >
                {!flipped ? (
                  <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl p-6 text-center border border-primary-100 dark:border-primary-800">
                    <p className="text-lg font-semibold text-surface-900 dark:text-white">
                      {currentCard.question}
                    </p>
                    <p className="text-xs text-surface-400 dark:text-surface-500 mt-3">
                      Toca para ver la respuesta
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-6 text-center border border-emerald-100 dark:border-emerald-800">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      RESPUESTA
                    </p>
                    <p className="text-lg font-semibold text-surface-900 dark:text-white whitespace-pre-wrap">
                      {currentCard.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => deleteCard(currentCard.id)}
                className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                title="Eliminar tarjeta"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFlipped(false);
                    setCurrentIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 font-semibold text-sm hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors disabled:opacity-30"
                >
                  Anterior
                </button>
                <button
                  onClick={() => {
                    setFlipped(false);
                    setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
                  }}
                  disabled={currentIndex >= cards.length - 1}
                  className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-30"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add manual card */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-white dark:cyber-card-dark border border-surface-200 dark:border-surface-700 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-surface-600 dark:text-surface-300 hover:text-primary-700 dark:hover:text-primary-300 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Agregar tarjeta manual
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 p-6"
        >
          <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4">Nueva Tarjeta</h3>
          <div className="space-y-3">
            <select
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              className="w-full bg-surface-50 dark:cyber-card-dark border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-900 dark:text-white outline-none focus:border-primary-400"
            >
              <option value="">Seleccionar curso...</option>
              {ALL_COURSES.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Pregunta..."
              className="w-full bg-surface-50 dark:cyber-card-dark border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-900 dark:text-white outline-none focus:border-primary-400"
            />
            <input
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Respuesta..."
              className="w-full bg-surface-50 dark:cyber-card-dark border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-900 dark:text-white outline-none focus:border-primary-400"
            />
            <div className="flex gap-2">
              <button
                onClick={addManualCard}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 font-semibold text-sm hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {cards.length === 0 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 p-8 text-center">
          <Sparkles className="w-12 h-12 text-surface-200 dark:text-surface-700 mx-auto mb-4" />
          <p className="text-surface-400 dark:text-surface-500 text-sm mb-4">
            No tienes flashcards aún. Genera tarjetas desde tus lecciones usando los botones de arriba.
          </p>
        </div>
      )}
    </div>
  );
}