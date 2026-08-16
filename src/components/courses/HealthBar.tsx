import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HealthBarProps {
  hearts: number;
  maxHearts?: number;
}

export function HealthBar({ hearts, maxHearts = 5 }: HealthBarProps) {
  return (
    <div className="flex gap-1.5 items-center">
      <AnimatePresence mode="popLayout">
        {Array.from({ length: maxHearts }).map((_, i) => (
          <motion.span
            key={i}
            layout
            initial={false}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={cn(
              'text-2xl',
              i < hearts ? 'text-red-500' : 'text-white/20'
            )}
          >
            {i < hearts ? '\u2764\uFE0F' : '\u2764'}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
