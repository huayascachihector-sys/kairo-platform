import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScaleStep {
  action: string;
  from: string;
  to: string;
}

interface ScaleSimulatorProps {
  expression: string;
  steps: ScaleStep[];
  onComplete: () => void;
}

export default function ScaleSimulator({ expression, steps, onComplete }: ScaleSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [balance, setBalance] = useState(50);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleStep = (stepIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(stepIndex);

    const tilt = stepIndex % 2 === 0 ? -8 : 8;
    setBalance(50 + (stepIndex + 1) * 3);

    setTimeout(() => {
      setBalance(50);
      setIsAnimating(false);
      if (stepIndex === steps.length - 1) {
        setCompleted(true);
        setTimeout(onComplete, 800);
      }
    }, 1200);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <h3 className="text-lg font-bold text-white mb-2">Balanza Algebraica</h3>
      <p className="text-sm text-surface-400 mb-6">
        Cada lado de la balanza debe estar equilibrado. Las operaciones que hagas a un lado, hazlas al otro.
      </p>

      <div className="flex flex-col items-center mb-6">
        <motion.div
          animate={{ rotate: (balance - 50) * 0.4 }}
          transition={{ type: 'spring', stiffness: 40, damping: 8 }}
          className="relative w-64 h-48"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-16 bg-gradient-to-t from-gray-600 to-gray-500 rounded-full" />

          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 w-56 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full origin-center"
            animate={{ rotate: (balance - 50) * 0.4 }}
            transition={{ type: 'spring', stiffness: 40, damping: 8 }}
          />

          <motion.div
            className="absolute top-2 left-8 w-20 h-20 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 border border-orange-500/30 flex items-center justify-center"
            animate={{ rotate: (balance - 50) * 0.4, y: (balance - 50) * 0.6 }}
            transition={{ type: 'spring', stiffness: 40, damping: 8 }}
          >
            <span className="text-xs font-mono text-orange-300 text-center leading-tight px-1">
              {currentStep === -1 ? '2x + 3' : steps[Math.min(currentStep, steps.length - 1)]?.from.split('=')[0]?.trim() || '2x'}
            </span>
          </motion.div>

          <motion.div
            className="absolute top-2 right-8 w-20 h-20 rounded-lg bg-gradient-to-br from-primary-500/30 to-primary-600/20 border border-primary-500/30 flex items-center justify-center"
            animate={{ rotate: (balance - 50) * 0.4, y: -(balance - 50) * 0.6 }}
            transition={{ type: 'spring', stiffness: 40, damping: 8 }}
          >
            <span className="text-xs font-mono text-primary-300 text-center leading-tight px-1">
              {currentStep === -1 ? '7' : steps[Math.min(currentStep, steps.length - 1)]?.from.split('=')[1]?.trim() || '4'}
            </span>
          </motion.div>

          <motion.div
            className="absolute top-24 left-1/2 -translate-x-1/2 w-1 h-8 bg-gray-600 rounded-full"
            animate={{ height: Math.abs(balance - 50) * 0.3 + 32 }}
            transition={{ type: 'spring', stiffness: 40, damping: 8 }}
          />
        </motion.div>

        <div className="bg-white/5 rounded-xl px-4 py-3 font-mono text-sm text-center min-w-[200px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white"
            >
              {currentStep === -1 ? expression : steps[currentStep]?.from || expression}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.button
            key={i}
            onClick={() => handleStep(i)}
            disabled={i > currentStep + 1 || isAnimating || completed}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              i < currentStep
                ? 'bg-emerald-900/30 border border-emerald-500/30 text-emerald-300'
                : i === currentStep
                ? 'bg-primary-900/30 border border-primary-500/50 text-primary-300'
                : 'bg-white/5 border border-white/10 text-surface-400 hover:border-primary-500/30 hover:text-white cursor-pointer'
            } ${(i > currentStep + 1 || isAnimating || completed) ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span>{i + 1}. {step.action}</span>
              <span className="font-mono text-xs">{step.from} → {step.to}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-center"
        >
          <p className="text-emerald-300 font-semibold text-sm">¡Balanza equilibrada!</p>
          <p className="text-emerald-400/60 text-xs mt-1">Solución: x = {steps[steps.length - 1]?.to.split('=')[1]?.trim()}</p>
        </motion.div>
      )}
    </div>
  );
}
