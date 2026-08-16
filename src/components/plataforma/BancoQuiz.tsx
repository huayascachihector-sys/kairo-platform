import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, XCircle as XIcon, RotateCcw, Sparkles, Brain, Trophy } from 'lucide-react';
import SRSRating from './SRSRating';
import type { SRSAction } from '../../lib/srsEngine';

interface QuizQuestion { question: string; options: string[]; correct: number; explanation?: string; }
interface BancoQuizProps {
  qs: QuizQuestion[];
  currentQ: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  score: number;
  finished: boolean;
  answers: number[];
  timerMode: boolean;
  timeLeft: number;
  timerStarted: boolean;
  showResults: boolean;
  srsVersion: number;
  isIb: boolean;
  isImported: boolean;
  onAnswer: (idx: number) => void;
  onNext: () => void;
  onSRSRate: (action: SRSAction) => void;
  onReset: () => void;
  onRestart: () => void;
  onToggleResults: () => void;
  onClose: () => void;
}

const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

function wrongIndices(answers: number[], qs: QuizQuestion[]): number[] {
  return answers.map((a, i) => a !== qs[i].correct ? i : -1).filter(i => i >= 0);
}

export default function BancoQuiz({
  qs, currentQ, selectedAnswer, showExplanation, score, finished, answers,
  timerMode, timeLeft, timerStarted, showResults, isIb, isImported,
  onAnswer, onNext, onSRSRate, onReset, onRestart, onToggleResults, onClose,
}: BancoQuizProps) {
  if (finished && showResults) {
    const wrong = wrongIndices(answers, qs);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={onToggleResults} className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver
          </button>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {wrong.map(i => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-white dark:bg-surface-900 rounded-2xl border border-red-200 dark:border-red-900/50 p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-surface-900 dark:text-white mb-2">{qs[i].question}</p>
                  <p className="text-xs text-surface-500 mb-1">
                    <span className="text-red-500 font-semibold">Tu respuesta: </span>
                    {qs[i].options[answers[i]]}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                    Correcta: {qs[i].options[qs[i].correct]}
                  </p>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{qs[i].explanation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const correctCount = answers.filter((a, i) => a === qs[i].correct).length;
    const pct = Math.round((correctCount / qs.length) * 100);
    const wrong = wrongIndices(answers, qs);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Resultados</h1>
        </div>
        <div className="max-w-md mx-auto text-center py-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-600 shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-1">
              {pct >= 80 ? '¡Excelente! 🎉' : pct >= 60 ? '¡Buen trabajo! 👍' : pct >= 40 ? 'Sigue practicando 💪' : 'Ánimo, tú puedes 🚀'}
            </h2>
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6 mb-6 mt-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                    className="text-surface-100 dark:text-surface-800" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                    className={`${pct >= 60 ? 'text-emerald-500' : pct >= 40 ? 'text-amber-500' : 'text-red-500'}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-surface-900 dark:text-white">{pct}%</span>
                </div>
              </div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">{correctCount} de {qs.length} correctas</p>
              {timerMode && (
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-surface-400 dark:text-surface-500">
                  <Clock className="w-4 h-4" /> Tiempo: {formatTime(0)}
                </div>
              )}
            </div>
            {wrong.length > 0 && (
              <button onClick={onToggleResults}
                className="w-full text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-xl py-3 mb-4 transition-all flex items-center justify-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Revisar {wrong.length} incorrectas
              </button>
            )}
            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-primary-300 rounded-xl py-3 transition-all">
                <RotateCcw className="w-4 h-4" /> Cambiar
              </button>
              <button onClick={onRestart}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-primary-600 text-white rounded-xl py-3 hover:bg-primary-700 transition-all shadow-md">
                <Sparkles className="w-4 h-4" /> Repetir
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const q = qs[currentQ] as any;
  const isCorrect = selectedAnswer === q.correct;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-surface-900 dark:text-white">Pregunta {currentQ + 1} de {qs.length}</h1>
        <div className="flex items-center gap-3">
          {timerMode && (
            <span className={`text-sm font-bold font-mono ${timeLeft < 60 ? 'text-red-500' : 'text-surface-500 dark:text-surface-400'}`}>
              <Clock className="w-3.5 h-3.5 inline mr-1" />{formatTime(timeLeft)}
            </span>
          )}
          <button onClick={onClose} className="flex items-center gap-1 text-xs text-surface-400 hover:text-primary-600 transition-colors">
            <XIcon className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full mb-5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
            style={{ width: `${((currentQ) / qs.length) * 100}%` }} />
        </div>
        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
          {qs.map((_: any, i: number) => (
            <div key={i} className={`w-5 h-1.5 rounded-full flex-shrink-0 transition-all ${
              i === currentQ ? 'w-8 bg-primary-600' :
              answers[i] !== undefined ? (answers[i] === qs[i].correct ? 'bg-emerald-400' : 'bg-red-400') :
              i < currentQ ? 'bg-surface-300 dark:bg-surface-600' : 'bg-surface-200 dark:bg-surface-700'
            }`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={currentQ}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-6 md:p-8">
            <p className="text-base md:text-lg font-bold text-surface-900 dark:text-white leading-relaxed mb-5">{q.question}</p>
            <div className="space-y-2.5 mb-5">
              {q.options.map((opt: string, idx: number) => {
                let style = 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20';
                if (selectedAnswer !== null) {
                  if (idx === q.correct) style = 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30';
                  else if (idx === selectedAnswer && !isCorrect) style = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30';
                  else style = 'border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50 opacity-60';
                }
                return (
                  <button key={idx} onClick={() => onAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${style}`}>
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      selectedAnswer !== null && idx === q.correct ? 'border-emerald-500 bg-emerald-500 text-white' :
                      selectedAnswer === idx && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                      'border-surface-300 dark:border-surface-600 text-surface-500 dark:text-surface-400'
                    }`}>
                      {selectedAnswer !== null && idx === q.correct ? '✓' :
                       selectedAnswer === idx && !isCorrect ? '✗' :
                       String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium text-surface-800 dark:text-surface-200">{opt}</span>
                  </button>
                );
              })}
            </div>
            {showExplanation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800'}`}>
                <div className="flex items-start gap-2">
                  {isCorrect
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                      {isCorrect ? '¡Correcto!' : 'Respuesta incorrecta'}
                    </p>
                    <p className="text-sm text-surface-700 dark:text-surface-300">{q.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
            {selectedAnswer !== null && <SRSRating onRate={onSRSRate} />}
            <p className="text-[10px] text-surface-400 dark:text-surface-500 text-center mt-3">
              Atajos: <kbd className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-[10px] font-mono">1</kbd>
              <kbd className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-[10px] font-mono ml-1">2</kbd>
              <kbd className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-[10px] font-mono ml-1">3</kbd>
              <kbd className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-[10px] font-mono ml-1">4</kbd>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
}
