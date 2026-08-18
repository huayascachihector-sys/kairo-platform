import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, X, Lightbulb, RotateCcw,
  Trophy, Target, Flame, BookOpen, ChevronDown, Filter, Sparkles,
  Star, Zap, Search
} from 'lucide-react';
import { mathQuestions, mathCategories, type MathQuestion } from '../data/mathQuestions';

type Difficulty = 'Todos' | 'Básico' | 'Intermedio' | 'Avanzado';
type View = 'categories' | 'quiz' | 'results';

const difficultyColors: Record<string, string> = {
  'Básico': 'bg-emerald-100 text-emerald-700',
  'Intermedio': 'bg-amber-100 text-amber-700',
  'Avanzado': 'bg-rose-100 text-rose-700',
};

export default function MathPractice() {
  const [view, setView] = useState<View>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('Todos');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: number; correct: boolean }>>({});
  const [showDiffFilter, setShowDiffFilter] = useState(false);

  const filteredQuestions = useMemo(() => {
    let qs = mathQuestions;
    if (selectedCategory) qs = qs.filter(q => q.category === selectedCategory);
    if (difficulty !== 'Todos') qs = qs.filter(q => q.difficulty === difficulty);
    return qs;
  }, [selectedCategory, difficulty]);

  const currentQuestion: MathQuestion | undefined = filteredQuestions[currentIndex];

  const score = useMemo(() => {
    const answered = Object.values(answers);
    return {
      total: answered.length,
      correct: answered.filter(a => a.correct).length,
    };
  }, [answers]);

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCategory(catId);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHint(false);
    setAnswers({});
    setView('quiz');
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    setShowHint(false);
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          selected: optionIndex,
          correct: optionIndex === currentQuestion.correctIndex,
        },
      }));
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
    } else {
      setView('results');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      const prevQ = filteredQuestions[currentIndex - 1];
      const prevAnswer = answers[prevQ.id];
      setSelectedAnswer(prevAnswer?.selected ?? null);
      setShowExplanation(prevAnswer !== undefined);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHint(false);
    setAnswers({});
    setView('quiz');
  };

  const handleBackToCategories = () => {
    setView('categories');
    setSelectedCategory(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHint(false);
    setAnswers({});
  };

  // ── Categories view ─────────────────
  if (view === 'categories') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 dark:from-surface-950 via-white dark:bg-surface-900 to-accent-50/30 dark:to-surface-900 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <a href="#" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 font-medium">
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </a>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-surface-900 dark:text-white tracking-tight">
              Practica <span className="text-gradient">Matemáticas</span>
            </h1>
            <p className="mt-4 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
              Ejercicios interactivos con explicaciones detalladas. Elige una categoría y empieza a practicar al nivel que necesites.
            </p>

            {/* Global stats */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                <BookOpen className="w-4 h-4 text-primary-500" />
                <span className="font-semibold">{mathQuestions.length}</span> preguntas
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold">{mathCategories.length}</span> categorías
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">3</span> niveles
              </div>
            </div>
          </motion.div>

          {/* All questions button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <button
              onClick={() => handleSelectCategory(null)}
              className="w-full p-5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all hover:-translate-y-1 text-left flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-lg">🎯 Todas las Categorías</h3>
                <p className="text-primary-100 text-sm mt-1">Practica con las {mathQuestions.length} preguntas disponibles mezcladas</p>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mathCategories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                onClick={() => handleSelectCategory(cat.id)}
                className="group text-left p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 hover:border-primary-200 dark:hover:border-primary-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-surface-900 dark:text-white mb-1">{cat.name}</h3>
                <p className="text-sm text-surface-500">{cat.count} preguntas</p>
                <div className="mt-3 flex gap-1.5">
                  {['Básico', 'Intermedio', 'Avanzado'].map(d => {
                    const count = mathQuestions.filter(q => q.category === cat.id && q.difficulty === d).length;
                    if (count === 0) return null;
                    return (
                      <span key={d} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyColors[d]}`}>
                        {count} {d.charAt(0)}
                      </span>
                    );
                  })}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Results view ────────────────────
  if (view === 'results') {
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const getMessage = () => {
      if (percentage >= 90) return { emoji: 'trophy', text: '¡Excelente! Dominas este tema.', color: 'text-emerald-600' };
      if (percentage >= 70) return { emoji: 'star', text: '¡Muy bien! Estás en buen camino.', color: 'text-blue-600' };
      if (percentage >= 50) return { emoji: 'zap', text: 'Buen esfuerzo. Sigue practicando.', color: 'text-amber-600' };
      return { emoji: 'book', text: 'No te rindas. Repasa y vuelve a intentarlo.', color: 'text-rose-600' };
    };
    const msg = getMessage();

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 dark:from-surface-950 via-white dark:bg-surface-900 to-accent-50/30 dark:to-surface-900 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-900 rounded-3xl shadow-xl border border-surface-100 dark:border-surface-800 p-8 md:p-12 text-center"
          >
            <div className="mb-4 flex justify-center">
              {msg.emoji === 'trophy' ? <Trophy className="w-16 h-16 text-emerald-500" /> :
               msg.emoji === 'star' ? <Star className="w-16 h-16 text-blue-500" /> :
               msg.emoji === 'zap' ? <Zap className="w-16 h-16 text-amber-500" /> :
               <BookOpen className="w-16 h-16 text-rose-500" />}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-surface-900 dark:text-white mb-2">
              ¡Resultados!
            </h2>
            <p className={`text-lg font-semibold ${msg.color} mb-8`}>{msg.text}</p>

            {/* Score circle */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e4e4e7" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke="url(#scoreGradient)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={339.3}
                  initial={{ strokeDashoffset: 339.3 }}
                  animate={{ strokeDashoffset: 339.3 * (1 - percentage / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-surface-900 dark:text-white">{percentage}%</span>
                <span className="text-sm text-surface-500">{score.correct}/{score.total}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-emerald-700">{score.correct}</div>
                <div className="text-xs text-emerald-600">Correctas</div>
              </div>
              <div className="bg-rose-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-rose-700">{score.total - score.correct}</div>
                <div className="text-xs text-rose-600">Incorrectas</div>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-primary-700">{filteredQuestions.length - score.total}</div>
                <div className="text-xs text-primary-600">Sin responder</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleRestart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Reintentar
                </span>
              </button>
              <button onClick={handleBackToCategories} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Categorías
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Quiz view ───────────────────────
  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 dark:from-surface-950 via-white dark:bg-surface-900 to-accent-50/30 dark:to-surface-900 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white dark:bg-surface-900 rounded-3xl shadow-xl border border-surface-100 dark:border-surface-800 p-12">
            <div className="mb-4 flex justify-center"><div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center"><Search className="w-8 h-8 text-surface-400" /></div></div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">No hay preguntas</h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6">No se encontraron preguntas con los filtros seleccionados.</p>
            <button onClick={handleBackToCategories} className="btn-primary">
              <span>Volver a categorías</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / filteredQuestions.length) * 100;
  const catInfo = selectedCategory ? mathCategories.find(c => c.id === selectedCategory) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 dark:from-surface-950 via-white dark:bg-surface-900 to-accent-50/30 dark:to-surface-900 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToCategories}
            className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Categorías
          </button>
          <div className="flex items-center gap-3">
            {/* Difficulty filter */}
            <div className="relative">
              <button
                onClick={() => setShowDiffFilter(!showDiffFilter)}
                className="flex items-center gap-1.5 text-sm font-medium text-surface-600 dark:text-surface-300 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-1.5 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                {difficulty}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {showDiffFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-full mt-1 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-100 dark:border-surface-800 py-1 z-20 min-w-[140px]"
                  >
                    {(['Todos', 'Básico', 'Intermedio', 'Avanzado'] as Difficulty[]).map(d => (
                      <button
                        key={d}
                        onClick={() => {
                          setDifficulty(d);
                          setShowDiffFilter(false);
                          setCurrentIndex(0);
                          setSelectedAnswer(null);
                          setShowExplanation(false);
                          setAnswers({});
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors ${
                          difficulty === d ? 'text-primary-600 font-semibold bg-primary-50/50' : 'text-surface-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 text-sm bg-white border border-surface-200 rounded-lg px-3 py-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold text-surface-700">{score.correct}</span>
              <span className="text-surface-400">/{score.total}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-surface-500 mb-1.5">
            <span>Pregunta {currentIndex + 1} de {filteredQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-surface-900 rounded-3xl shadow-lg border border-surface-100 dark:border-surface-800 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {catInfo && <span className="text-lg">{catInfo.icon}</span>}
                <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">
                  {catInfo?.name || 'Todas las categorías'}
                </span>
                <span className="text-surface-300">·</span>
                <span className="text-sm text-surface-500">{currentQuestion?.subcategory}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                difficultyColors[currentQuestion?.difficulty || 'Básico']
              }`}>
                {currentQuestion?.difficulty}
              </span>
            </div>

            {/* Question body */}
            <div className="p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-surface-900 dark:text-white leading-relaxed mb-6">
                {currentQuestion?.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion?.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;
                  const isAnswered = selectedAnswer !== null;

                  let optionClass = 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/30 dark:hover:bg-primary-900/20';
                  if (isAnswered) {
                    if (isCorrect) {
                      optionClass = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'border-rose-400 bg-rose-50 dark:bg-rose-900/30';
                    } else {
                      optionClass = 'border-surface-100 dark:border-surface-700 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${optionClass} ${
        !isAnswered ? 'cursor-pointer' : 'cursor-default'
      } border-surface-200 dark:border-surface-700`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isAnswered && isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isAnswered && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300'
                      }`}>
                        {isAnswered && isCorrect ? (
                          <Check className="w-4 h-4" />
                        ) : isAnswered && isSelected && !isCorrect ? (
                          <X className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </div>
                      <span className={`text-sm md:text-base ${
                        isAnswered && isCorrect ? 'text-emerald-800 font-semibold' : 'text-surface-700 dark:text-surface-200'
                      }`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Hint button */}
              {!showExplanation && !showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="mt-4 flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  Ver pista
                </button>
              )}

              {/* Hint */}
              <AnimatePresence>
                {showHint && !showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800 dark:text-amber-400">{currentQuestion?.hint}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <div className={`p-5 rounded-xl ${
                        selectedAnswer === currentQuestion?.correctIndex
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800'
                      }}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedAnswer === currentQuestion?.correctIndex ? (
                          <>
                            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-bold text-emerald-800 dark:text-emerald-400">¡Correcto!</span>
                          </>
                        ) : (
                          <>
                            <X className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                            <span className="font-bold text-rose-800 dark:text-rose-400">Incorrecto</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                          <span className="font-semibold">Explicación: </span>
                          {currentQuestion?.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer navigation */}
            <div className="px-6 py-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-primary-600 disabled:opacity-30 disabled:hover:text-surface-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
              
              {selectedAnswer !== null ? (
                <button
                  onClick={handleNext}
                  className="btn-primary !py-2.5 !px-6 text-sm flex items-center gap-2"
                >
                  <span className="flex items-center gap-2">
                    {currentIndex < filteredQuestions.length - 1 ? 'Siguiente' : 'Ver Resultados'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              ) : (
                <span className="text-xs text-surface-400">Selecciona una respuesta</span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Question dots */}
        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          {filteredQuestions.map((q, i) => {
            const ans = answers[q.id];
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(i);
                  const a = answers[q.id];
                  setSelectedAnswer(a?.selected ?? null);
                  setShowExplanation(a !== undefined);
                  setShowHint(false);
                }}
                className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                  i === currentIndex
                    ? 'bg-primary-600 text-white scale-110'
                    : ans?.correct
                    ? 'bg-emerald-100 text-emerald-700'
                    : ans && !ans.correct
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
