import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface VideoQuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface VideoQuizProps {
  questions: VideoQuizQuestion[];
  onComplete: () => void;
}

export default function VideoQuiz({ questions, onComplete }: VideoQuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const q = questions[current];

  const handleSubmit = () => {
    if (submitted || selected === null) return;
    setSubmitted(true);
    setAnswers((a) => [...a, selected === q.correct]);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      onComplete();
    }
  };

  if (!questions.length) {
    return null;
  }

  const isCorrect = submitted && selected === q.correct;
  const isWrong = submitted && selected !== null && selected !== q.correct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs font-semibold text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-500/20">
          {current + 1}/{questions.length}
        </span>
        <span className="text-xs text-surface-400">Mini-quiz del video</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h3 className="text-lg font-medium text-white mb-5">{q.question}</h3>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              let borderClass = 'border-white/10 hover:border-primary-500/30';
              if (submitted && i === q.correct) borderClass = 'border-emerald-500/50 bg-emerald-500/10';
              else if (isSelected && isWrong) borderClass = 'border-red-500/50 bg-red-500/10';
              else if (isSelected) borderClass = 'border-primary-500/50 bg-primary-500/10';

              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelected(i)}
                  disabled={submitted}
                  className={cn(
                    'w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3',
                    borderClass
                  )}
                >
                  <span
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0',
                      submitted && i === q.correct
                        ? 'bg-emerald-500 text-white'
                        : isSelected && isWrong
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-surface-400'
                    )}
                  >
                    {submitted && i === q.correct ? <CheckCircle2 size={16} /> : isSelected && isWrong ? <XCircle size={16} /> : String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-surface-200">{opt}</span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <p className={cn('text-sm font-medium', isCorrect ? 'text-emerald-400' : 'text-red-400')}>
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </p>
              <p className="text-sm text-surface-400 mt-1">{q.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={submitted ? handleNext : handleSubmit}
        disabled={!submitted && selected === null}
        className="mt-5 w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitted
          ? current < questions.length - 1
            ? <>Siguiente <ChevronRight size={16} /></>
            : 'Comenzar ejercicios'
          : 'Verificar'}
      </button>
    </motion.div>
  );
}
