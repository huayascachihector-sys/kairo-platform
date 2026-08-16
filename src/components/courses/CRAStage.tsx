import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lightbulb, BarChart3, Sigma, Dumbbell, CheckCircle2 } from 'lucide-react';
import type { CRAConfig, Exercise, ExerciseVariant } from '@/lib/courseData';
import ScaleSimulator from './ScaleSimulator';
import InteractiveGraph from './InteractiveGraph';
import { ExerciseCard } from './ExerciseCard';

interface CRAStageProps {
  config: CRAConfig;
  exercises: Exercise[];
  variants?: ExerciseVariant[];
  onComplete: (score: number) => void;
}

type Stage = 'concrete' | 'representational' | 'abstract' | 'practice' | 'done';

const stageMeta: Record<string, { icon: any; title: string; color: string }> = {
  concrete: { icon: Lightbulb, title: 'Visualiza', color: 'from-orange-500 to-amber-500' },
  representational: { icon: BarChart3, title: 'Representa', color: 'from-cyan-500 to-blue-500' },
  abstract: { icon: Sigma, title: 'Abstracto', color: 'from-violet-500 to-purple-500' },
  practice: { icon: Dumbbell, title: 'Practica', color: 'from-emerald-500 to-green-500' },
};

export default function CRAStage({ config, exercises, variants, onComplete }: CRAStageProps) {
  const [stage, setStage] = useState<Stage>('concrete');
  const [currentEx, setCurrentEx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleConcreteComplete = () => {
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setStage('representational');
    }, 1000);
  };

  const handleRepresentationalComplete = () => {
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setStage('abstract');
    }, 1000);
  };

  const handleAbstractContinue = () => {
    setStage('practice');
  };

  const handleExerciseAnswer = (correct: boolean) => {
    if (correct) setCorrectCount((c) => c + 1);
    if (currentEx < exercises.length - 1) {
      setCurrentEx((c) => c + 1);
    } else {
      setStage('done');
      setTimeout(() => onComplete(correctCount + (correct ? 1 : 0)), 800);
    }
  };

  const totalStages: Stage[] = ['concrete', 'representational', 'abstract', 'practice'];
  const currentIdx = totalStages.indexOf(stage);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {totalStages.map((s, i) => {
          const meta = stageMeta[s as Stage];
          const isActive = s === stage;
          const isPast = currentIdx > i;
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white/10 text-white border border-white/20'
                  : isPast
                  ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/5 text-surface-500 border border-white/5'
              }`}>
                <meta.icon size={14} />
                <span>{meta.title}</span>
              </div>
              {i < totalStages.length - 1 && (
                <ChevronRight size={14} className={`${isPast ? 'text-emerald-500' : 'text-surface-600'}`} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {stage === 'concrete' && (
          <motion.div key="concrete" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <ScaleSimulator
              expression={config.concrete.params.defaultExpression || '2x + 3 = 7'}
              steps={config.concrete.params.steps || []}
              onComplete={handleConcreteComplete}
            />
          </motion.div>
        )}

        {stage === 'representational' && (
          <motion.div key="representational" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <InteractiveGraph
              equation={config.representational.params.equation || 'y = 2x - 4'}
              solutionX={config.representational.params.solutionX || 2}
              onComplete={handleRepresentationalComplete}
            />
          </motion.div>
        )}

        {stage === 'abstract' && (
          <motion.div key="abstract" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-violet-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sigma size={20} className="text-violet-400" />
                <h3 className="text-lg font-bold text-white">Fórmula Abstracta</h3>
              </div>

              <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-4 mb-4 text-center">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300">
                  {config.abstract.formula}
                </span>
              </div>

              <p className="text-sm text-surface-300 mb-6">{config.abstract.explanation}</p>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Conexión con la balanza</h4>
                {config.abstract.connectionSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs text-surface-400">{step.label}</p>
                      <p className="text-sm font-mono text-violet-300 mt-0.5">{step.highlight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={handleAbstractContinue}
                className="mt-6 w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all"
              >
                Ir a la práctica →
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'practice' && exercises[currentEx] && (
          <motion.div key={`practice-${currentEx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <ExerciseCard
              exercise={exercises[currentEx]}
              variant={variants?.[currentEx]}
              index={currentEx}
              total={exercises.length}
              onNext={handleExerciseAnswer}
            />
          </motion.div>
        )}

        {stage === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">¡Lección completada!</h3>
              <p className="text-surface-400">
                Acertaste {correctCount} de {exercises.length} ejercicios
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center py-2"
        >
          <p className="text-sm text-emerald-400 font-medium animate-pulse">¡Excelente! Pasando a la siguiente etapa...</p>
        </motion.div>
      )}
    </div>
  );
}
