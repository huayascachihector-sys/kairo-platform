import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComprehensionQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  type: 'multiple-choice' | 'true-false' | 'complete';
}

interface ComprehensionExerciseProps {
  questions: ComprehensionQuestion[];
  onComplete: (score: number) => void;
}

export default function ComprehensionExercise({ questions, onComplete }: ComprehensionExerciseProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const q = questions[current];

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    const correct = selected === q.correct;
    setSubmitted(true);
    setScore((s) => s + (correct ? 1 : 0));
    setAnswers((a) => [...a, correct]);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      onComplete(score + (selected === q.correct ? 1 : 0));
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-surface-400">
          Comprensión {current + 1} de {questions.length}
        </span>
        <div className="flex gap-1">
          {answers.map((a, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${a ? 'bg-emerald-500' : 'bg-red-500'}`} />
          ))}
          {Array.from({ length: questions.length - answers.length }).map((_, i) => (
            <div key={i + answers.length} className="w-2 h-2 rounded-full bg-white/10" />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h3 className="text-sm font-medium text-white mb-4">{q.question}</h3>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let borderClass = 'border-white/10 hover:border-primary-500/30';
              if (submitted && i === q.correct) borderClass = 'border-emerald-500/50 bg-emerald-500/10';
              else if (submitted && selected === i && i !== q.correct) borderClass = 'border-red-500/50 bg-red-500/10';
              else if (selected === i) borderClass = 'border-primary-500/50 bg-primary-500/10';

              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelected(i)}
                  disabled={submitted}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3',
                    borderClass
                  )}
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-white/10 text-surface-300">
                    {submitted && i === q.correct ? <CheckCircle2 size={14} className="text-emerald-400" /> :
                     submitted && selected === i && i !== q.correct ? <XCircle size={14} className="text-red-400" /> :
                     String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-surface-200">{opt}</span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <p className={`text-xs font-medium ${selected === q.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                {selected === q.correct ? '✓ Correcto' : '✗ Incorrecto'}
              </p>
              <p className="text-xs text-surface-400 mt-1">{q.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={submitted ? handleNext : handleSubmit}
        disabled={selected === null}
        className="mt-4 w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {submitted ? (current < questions.length - 1 ? 'Siguiente' : 'Ver resultado') : 'Verificar'}
      </button>
    </div>
  );
}
