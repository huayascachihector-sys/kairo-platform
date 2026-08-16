import { useState, useEffect, useRef } from 'react';
import { XCircle, Clock, CheckCircle2, XCircle as XIcon, Trophy } from 'lucide-react';
import type { SubjectBank, Question } from '../../data/questionBank';

type Level = 'primaria' | 'secundaria';

interface SimulacroModalProps {
  open: boolean;
  banks: SubjectBank[];
  level: Level;
  onClose: () => void;
}

export default function SimulacroModal({ open, banks, level, onClose }: SimulacroModalProps) {
  const [step, setStep] = useState<'config' | 'quiz' | 'result'>('config');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step === 'quiz' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timerRef.current!); finishQuiz(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [step, timeLeft]);

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const startSimulacro = () => {
    const allQs: Question[] = [];
    for (const b of banks) {
      if (selectedSubjects.includes(b.id)) {
        allQs.push(...b[level]);
      }
    }
    const shuffled = shuffle(allQs).slice(0, 40);
    setQuestions(shuffled);
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setFinished(false);
    setTimeLeft(totalMinutes * 60);
    setStep('quiz');
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null || finished) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer!];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setFinished(true);
    setStep('result');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep('config');
    setSelectedSubjects([]);
    setFinished(false);
    onClose();
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!open) return null;

  if (step === 'config') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={handleClose}>
        <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-100 dark:border-surface-800 shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Simulacro</h2>
            <button onClick={handleClose} className="text-surface-400 hover:text-surface-600 transition-colors"><XCircle className="w-5 h-5" /></button>
          </div>

          <div className="mb-5">
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Selecciona materias</p>
            <div className="grid grid-cols-2 gap-2">
              {banks.filter(b => b[level].length > 0).map(b => (
                <button key={b.id} onClick={() => setSelectedSubjects(prev =>
                  prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id]
                )}
                  className={`text-left p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    selectedSubjects.includes(b.id)
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-primary-200'
                  }`}>
                  <span>{b.icon} {b.label}</span>
                  <span className="block text-[10px] opacity-60">{b[level].length} preguntas</span>
                </button>
              ))}
            </div>
            {selectedSubjects.length === 0 && (
              <p className="text-xs text-amber-500 mt-2">Selecciona al menos una materia</p>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Duración</p>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map(m => (
                <button key={m} onClick={() => setTotalMinutes(m)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                    totalMinutes === m
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:border-primary-200'
                  }`}>
                  {m} min
                </button>
              ))}
            </div>
          </div>

          <button onClick={startSimulacro} disabled={selectedSubjects.length === 0}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 shadow-lg">
            Comenzar simulacro ({selectedSubjects.length} materias, {totalMinutes} min)
          </button>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    const correctCount = answers.filter((a, i) => a === questions[i].correct).length;
    const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={handleClose}>
        <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-100 dark:border-surface-800 shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
          <div className="text-center py-4">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">
              {pct >= 80 ? '¡Excelente!' : pct >= 60 ? 'Buen trabajo' : pct >= 40 ? 'Sigue practicando' : 'Ánimo'}
            </h2>
            <div className="relative w-28 h-28 mx-auto my-4">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                  className="text-surface-100 dark:text-surface-800" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                  className="text-primary-500" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-surface-900 dark:text-white">{pct}%</span>
              </div>
            </div>
            <p className="text-surface-500 text-sm mb-1">{correctCount} de {questions.length} correctas</p>
            <p className="text-surface-400 text-xs mb-4">Tiempo: {formatTime(totalMinutes * 60 - timeLeft)}</p>
            <div className="flex gap-3">
              <button onClick={handleClose}
                className="flex-1 py-3 rounded-xl border-2 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 text-sm font-semibold hover:border-primary-200 transition-all">
                Cerrar
              </button>
              <button onClick={startSimulacro}
                className="flex-1 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all">
                Repetir
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;
  const isCorrect = selectedAnswer === q.correct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-100 dark:border-surface-800 shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-surface-900 dark:text-white">Pregunta {currentQ + 1} de {questions.length}</span>
            <span className={`text-sm font-bold font-mono ${timeLeft < 60 ? 'text-red-500' : 'text-surface-500'}`}>
              <Clock className="w-3.5 h-3.5 inline mr-1" />{formatTime(timeLeft)}
            </span>
          </div>
          <button onClick={handleClose} className="text-surface-400 hover:text-surface-600 transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full mb-5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
            style={{ width: `${((currentQ) / questions.length) * 100}%` }} />
        </div>

        <p className="text-base md:text-lg font-bold text-surface-900 dark:text-white leading-relaxed mb-5">{q.question}</p>
        <div className="space-y-2.5 mb-5">
          {q.options.map((opt, idx) => {
            let style = 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-primary-300';
            if (selectedAnswer !== null) {
              if (idx === q.correct) style = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30';
              else if (idx === selectedAnswer && !isCorrect) style = 'border-red-400 bg-red-50 dark:bg-red-900/30';
              else style = 'border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50 opacity-60';
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)}
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
          <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800'}`}>
            <div className="flex items-start gap-2">
              {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                : <XIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
              <div>
                <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                  {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                </p>
                <p className="text-sm text-surface-700 dark:text-surface-300">{q.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {selectedAnswer !== null && (
          <button onClick={selectedAnswer !== null && !finished ? handleNext : undefined}
            className={`w-full py-3 rounded-2xl font-bold text-sm transition-all ${
              currentQ < questions.length - 1
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}>
            {currentQ < questions.length - 1 ? 'Siguiente' : 'Ver resultados'}
          </button>
        )}
      </div>
    </div>
  );
}
