import { useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { OrderingExercise } from '@/lib/courseData';
import { GripVertical } from 'lucide-react';

interface OrderingExerciseProps {
  exercise: OrderingExercise;
  onAnswer: (correct: boolean) => void;
}

export function OrderingExercise({ exercise, onAnswer }: OrderingExerciseProps) {
  const [items, setItems] = useState<string[]>(
    () =>
      [...exercise.items].sort(() => Math.random() - 0.5)
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    const correct = items.every(
      (item, i) => exercise.items[exercise.correctOrder[i]] === item
    );
    setTimeout(() => {
      onAnswer(correct);
    }, 1200);
  }, [items, exercise, submitted, onAnswer]);

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-white">{exercise.question}</p>
      <p className="text-sm text-surface-400">
        Arrastra para ordenar correctamente:
      </p>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-2"
      >
        {items.map((item) => (
          <Reorder.Item
            key={item}
            value={item}
            className={cn(
              'flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border-2 cursor-grab active:cursor-grabbing transition-colors',
              submitted ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 hover:border-primary-500/30'
            )}
          >
            <GripVertical size={18} className="text-surface-500 shrink-0" />
            <span className="text-surface-200">{item}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <button
        onClick={handleSubmit}
        disabled={submitted}
        className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
      >
        {submitted ? '...' : 'Verificar'}
      </button>
    </div>
  );
}
