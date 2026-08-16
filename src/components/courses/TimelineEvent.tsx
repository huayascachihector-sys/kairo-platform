import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowRight, RotateCcw, Target } from 'lucide-react';
import { useState } from 'react';

export interface TimelineEventData {
  id: string;
  date: string;
  title: string;
  description: string;
  cause: string;
  consequence: string;
  nextConnection: string;
  icon: string;
}

interface TimelineEventProps {
  event: TimelineEventData;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
}

const iconMap: Record<string, any> = {
  collapse: RotateCcw,
  target: Target,
  default: Target,
};

export default function TimelineEvent({ event, index, total, isSelected, onSelect }: TimelineEventProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    onSelect();
    setExpanded((e) => !e);
  };

  const IconComp = iconMap[event.icon] || iconMap.default;

  return (
    <div className="relative flex items-start gap-4 group">
      <div className="flex flex-col items-center shrink-0">
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${
            isSelected
              ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
              : 'bg-white/5 border-white/10 hover:border-amber-500/30'
          }`}
        >
          <span className={isSelected ? 'text-amber-300' : 'text-surface-400'}>{event.icon}</span>
        </motion.button>
        {index < total - 1 && (
          <div className="w-0.5 h-12 bg-gradient-to-b from-amber-500/30 to-transparent mt-1" />
        )}
      </div>

      <motion.div
        className="flex-1 min-w-0 pb-6"
        initial={false}
      >
        <button
          onClick={handleToggle}
          className="w-full text-left"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              {event.date}
            </span>
            {isSelected && expanded && (
              <ChevronUp size={14} className="text-amber-400" />
            )}
            {!expanded && (
              <ChevronDown size={14} className="text-surface-500" />
            )}
          </div>
          <h4 className="text-sm font-bold text-white">{event.title}</h4>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="mt-3 space-y-3 overflow-hidden"
            >
              <p className="text-xs text-surface-300 leading-relaxed">{event.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <RotateCcw size={12} className="text-red-400" />
                    <span className="text-xs font-semibold text-red-300">Causa</span>
                  </div>
                  <p className="text-xs text-surface-400 leading-relaxed">{event.cause}</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Target size={12} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">Consecuencia</span>
                  </div>
                  <p className="text-xs text-surface-400 leading-relaxed">{event.consequence}</p>
                </div>
              </div>

              <div className="bg-primary-500/5 border border-primary-500/15 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <ArrowRight size={12} className="text-primary-400" />
                  <span className="text-xs font-semibold text-primary-300">Conexión</span>
                </div>
                <p className="text-xs text-surface-400 leading-relaxed">{event.nextConnection}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
