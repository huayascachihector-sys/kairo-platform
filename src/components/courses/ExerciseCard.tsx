import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Exercise, ExerciseVariant } from '@/lib/courseData';
import { FillInBlank } from './FillInBlank';
import { OrderingExercise } from './OrderingExercise';
import { CheckCircle2, XCircle, Sparkles, Lightbulb, Bot, ArrowRight, Gauge } from 'lucide-react';
import { ExerciseAITutor } from './ExerciseAITutor';

interface ExerciseCardProps {
  exercise: Exercise;
  variant?: ExerciseVariant;
  index: number;
  total: number;
  subject?: string;
  onNext: (correct: boolean) => void;
}

type PresentedType = 'choice' | 'fill' | 'order';
type DifficultyLevel = 'basico' | 'intermedio' | 'avanzado';

function pickType(variant?: ExerciseVariant, seed?: string): PresentedType {
  if (variant) {
    const map: Record<string, PresentedType> = {
      choice: 'choice',
      fill: 'fill',
      order: 'order',
    };
    return map[variant.type] || 'choice';
  }
  let hash = 0;
  for (let i = 0; i < (seed || '').length; i++) {
    hash = ((hash << 5) - hash) + seed!.charCodeAt(i);
    hash |= 0;
  }
  const roll = (Math.abs(hash) % 100) / 100;
  if (roll < 0.25) return 'fill';
  if (roll < 0.40) return 'order';
  return 'choice';
}

function deriveDifficulty(index: number, total: number): DifficultyLevel {
  const ratio = index / Math.max(1, total - 1);
  if (ratio < 0.35) return 'basico';
  if (ratio < 0.75) return 'intermedio';
  return 'avanzado';
}

export function ExerciseCard({
  exercise,
  variant,
  index,
  total,
  subject = "Materia",
  onNext,
}: ExerciseCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(() =>
    deriveDifficulty(index, total)
  );

  const mode = useMemo(() => pickType(variant, exercise.question), [variant, exercise.question]);

  const handleChoiceSubmit = () => {
    if (submitted || selected === null) return;
    const correct = selected === exercise.correct;
    setIsAnswerCorrect(correct);
    setSubmitted(true);
  };

  const handleManualNext = () => {
    if (isAnswerCorrect !== null) {
      onNext(isAnswerCorrect);
    }
  };

  const handleVariantAnswer = (correct: boolean) => {
    setIsAnswerCorrect(correct);
    setSubmitted(true);
    setTimeout(() => {
      onNext(correct);
    }, correct ? 800 : 2000);
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
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-surface-400">Completa la frase</div>
          <button
            onClick={() => setShowTutorModal(true)}
            className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-semibold px-2.5 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20"
          >
            <Bot size={13} /> Tutor IA
          </button>
        </div>
        <FillInBlank exercise={fillData} onAnswer={handleVariantAnswer} />
        <ExerciseAITutor
          isOpen={showTutorModal}
          onClose={() => setShowTutorModal(false)}
          question={exercise.question}
          options={exercise.options}
          selectedAnswer={selected}
          correctAnswer={exercise.correct}
          explanation={exercise.explanation}
          subject={subject}
          difficulty={selectedDifficulty}
        />
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
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-surface-400">Ordena correctamente</div>
          <button
            onClick={() => setShowTutorModal(true)}
            className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-semibold px-2.5 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20"
          >
            <Bot size={13} /> Tutor IA
          </button>
        </div>
        <OrderingExercise exercise={orderData} onAnswer={handleVariantAnswer} />
        <ExerciseAITutor
          isOpen={showTutorModal}
          onClose={() => setShowTutorModal(false)}
          question={exercise.question}
          options={exercise.options}
          selectedAnswer={selected}
          correctAnswer={exercise.correct}
          explanation={exercise.explanation}
          subject={subject}
          difficulty={selectedDifficulty}
        />
      </div>
    );
  }

  const correctIndex = exercise.correct;
  const isCorrect = submitted && selected === correctIndex;
  const isWrong = submitted && selected !== null && selected !== correctIndex;

  const diffBadge = {
    basico: { label: "🟢 Básico", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    intermedio: { label: "🟡 Intermedio", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
    avanzado: { label: "🔴 Avanzado", color: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  }[selectedDifficulty];

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-surface-400">
            Ejercicio {index + 1} de {total}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffBadge.color}`}>
            {diffBadge.label}
          </span>
        </div>

        {/* Action Buttons: Hints & AI Tutor */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTutorModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all active:scale-95"
            title="Pedir pista socrática"
          >
            <Lightbulb size={14} /> Pistas
          </button>
          <button
            type="button"
            onClick={() => setShowTutorModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary-600/30 hover:bg-primary-600/50 text-primary-300 border border-primary-500/40 transition-all active:scale-95"
            title="Abrir tutor de IA para resolver dudas"
          >
            <Bot size={14} /> Tutor IA
          </button>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-lg md:text-xl font-semibold text-white mb-6 leading-relaxed">
        {exercise.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          let borderClass = 'border-white/10 hover:border-primary-500/40 bg-white/[0.03] hover:bg-white/[0.06]';
          if (submitted && i === correctIndex) borderClass = 'border-emerald-500/60 bg-emerald-500/15 shadow-sm shadow-emerald-500/20';
          else if (isSelected && isWrong) borderClass = 'border-red-500/60 bg-red-500/15 shadow-sm shadow-red-500/20';
          else if (isSelected) borderClass = 'border-primary-500/60 bg-primary-500/20';

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              aria-pressed={isSelected}
              aria-label={`Opción ${String.fromCharCode(65 + i)}: ${opt}`}
              className={cn(
                'w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all flex items-center gap-3.5',
                borderClass
              )}
            >
              <span
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-transform',
                  submitted && i === correctIndex
                    ? 'bg-emerald-500 text-white shadow-md'
                    : isSelected && isWrong
                    ? 'bg-red-500 text-white shadow-md'
                    : isSelected
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/10 text-surface-300'
                )}
                aria-hidden="true"
              >
                {submitted && i === correctIndex ? <CheckCircle2 size={18} /> : isSelected && isWrong ? <XCircle size={18} /> : String.fromCharCode(65 + i)}
              </span>
              <span className="text-surface-100 text-sm md:text-base font-medium flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Post-submit Feedback Panel */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'mt-5 p-4 rounded-2xl border flex flex-col gap-2',
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          )}
        >
          <div className="flex items-center justify-between">
            <p className={cn('text-sm font-bold flex items-center gap-1.5', isCorrect ? 'text-emerald-400' : 'text-red-400')}>
              {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {isCorrect ? '¡Excelente! Respuesta correcta (+10 XP)' : 'Respuesta incorrecta'}
            </p>
            <button
              onClick={() => setShowTutorModal(true)}
              className="text-xs font-semibold text-primary-300 hover:text-primary-200 underline flex items-center gap-1"
            >
              <Sparkles size={12} /> Explicar con Tutor IA
            </button>
          </div>

          <p className="text-xs md:text-sm text-surface-300 mt-1 leading-relaxed">
            {exercise.explanation}
          </p>
        </motion.div>
      )}

      {/* Bottom Button Action */}
      <div className="mt-6 flex gap-3">
        {!submitted ? (
          <button
            onClick={handleChoiceSubmit}
            disabled={selected === null}
            className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/20 transition-all disabled:opacity-35 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            Verificar respuesta
          </button>
        ) : (
          <button
            onClick={handleManualNext}
            className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {index < total - 1 ? 'Siguiente ejercicio' : 'Finalizar sesión de práctica'} <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Embedded Interactive AI Tutor Modal */}
      <ExerciseAITutor
        isOpen={showTutorModal}
        onClose={() => setShowTutorModal(false)}
        question={exercise.question}
        options={exercise.options}
        selectedAnswer={selected}
        correctAnswer={exercise.correct}
        explanation={exercise.explanation}
        subject={subject}
        difficulty={selectedDifficulty}
      />
    </motion.div>
  );
}
