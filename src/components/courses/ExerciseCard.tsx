import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Exercise, ExerciseVariant } from '@/lib/courseData';
import { FillInBlank } from './FillInBlank';
import { OrderingExercise } from './OrderingExercise';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  variant?: ExerciseVariant;
  index: number;
  total: number;
  onNext: (correct: boolean) => void;
}

type PresentedType = 'choice' | 'fill' | 'order';

function pickType(variant?: ExerciseVariant): PresentedType {
  if (variant) {
    const map: Record<string, PresentedType> = {
      choice: 'choice',
      fill: 'fill',
      order: 'order',
    };
    return map[variant.type] || 'choice';
  }
  const roll = Math.random();
  if (roll < 0.3) return 'fill';
  if (roll < 0.45) return 'order';
  return 'choice';
}

export function ExerciseCard({ exercise, variant, index, total, onNext }: ExerciseCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [mode] = useState<PresentedType>(pickType(variant));

  const handleChoiceSubmit = () => {
    if (submitted || selected === null) return;
    const correct = selected === exercise.correct;
    setSubmitted(true);
    setTimeout(() => {
      onNext(correct);
    }, correct ? 600 : 1500);
  };

  const handleAnswer = (correct: boolean) => {
    setSubmitted(true);
    setTimeout(() => {
      onNext(correct);
    }, correct ? 600 : 1500);
  };

  if (mode === 'fill') {
    const fillData = variant?.type === 'fill' ? variant.data : {
      question: exercise.question,
      answer: exercise.options[exercise.correct],
      acceptableAnswers: [exercise.options[exercise.correct]],
      explanation: exercise.explanation,
    };
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="text-xs text-surface-400 mb-1">Completa la frase</div>
        <FillInBlank exercise={fillData} onAnswer={handleAnswer} />
      </div>
    );
  }

  if (mode === 'order') {
    const orderData = variant?.type === 'order' ? variant.data : {
      question: exercise.question,
      items: exercise.options,
      correctOrder: exercise.options.map((_, i) => i),
      explanation: exercise.explanation,
    };
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="text-xs text-surface-400 mb-1">Ordena correctamente</div>
        <OrderingExercise exercise={orderData} onAnswer={handleAnswer} />
      </div>
    );
  }

  const correctIndex = exercise.correct;
  const isCorrect = submitted && selected === correctIndex;
  const isWrong = submitted && selected !== null && selected !== correctIndex;

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-surface-500">
          Ejercicio {index + 1} de {total}
        </span>
        <span className="text-xs text-surface-500">Opción múltiple</span>
      </div>

      <h3 className="text-lg font-medium text-white mb-5">
        {exercise.question}
      </h3>

      <div className="space-y-2.5">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          let borderClass = 'border-white/10 hover:border-primary-500/30';
          if (submitted && i === correctIndex) borderClass = 'border-emerald-500/50 bg-emerald-500/10';
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
                  submitted && i === correctIndex
                    ? 'bg-emerald-500 text-white'
                    : isSelected && isWrong
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-surface-400'
                )}
              >
                {submitted && i === correctIndex ? <CheckCircle2 size={16} /> : isSelected && isWrong ? <XCircle size={16} /> : String.fromCharCode(65 + i)}
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
          <p className="text-sm text-surface-400 mt-1">{exercise.explanation}</p>
        </motion.div>
      )}

      <button
        onClick={handleChoiceSubmit}
        disabled={selected === null || submitted}
        className="mt-5 w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {submitted ? 'Continuando...' : 'Verificar'}
      </button>
    </motion.div>
  );
}
