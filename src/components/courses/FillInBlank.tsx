import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { FillInBlankExercise } from '@/lib/courseData';

interface FillInBlankProps {
  exercise: FillInBlankExercise;
  onAnswer: (correct: boolean) => void;
}

export function FillInBlank({ exercise, onAnswer }: FillInBlankProps) {
  const [value, setValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const accepted = [exercise.answer, ...(exercise.acceptableAnswers ?? [])];
    const correct = accepted.some((a) => normalize(a) === normalize(value));
    setTimeout(() => {
      onAnswer(correct);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-white">{exercise.question}</p>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
        disabled={submitted}
        className={cn(
          'w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors',
          submitted
            ? value.trim().toLowerCase() === exercise.answer.trim().toLowerCase()
              ? 'border-emerald-500/50 bg-emerald-500/10'
              : 'border-red-500/50 bg-red-500/10'
            : 'border-white/10 focus:border-primary-500/50 bg-white/5'
        )}
        placeholder="Escribe tu respuesta..."
      />
      {submitted && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-surface-400"
        >
          Respuesta correcta: <strong>{exercise.answer}</strong>
        </motion.p>
      )}
      <div className="flex justify-between">
        {exercise.hints?.length && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="text-sm text-primary-500 underline"
          >
            Mostrar pista
          </button>
        )}
        {showHint && exercise.hints?.length && (
          <p           className="text-sm text-amber-400 italic">{exercise.hints[0]}</p>
        )}
      </div>
    </div>
  );
}
