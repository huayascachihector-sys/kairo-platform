import { motion } from 'framer-motion';

export interface DialogueLine {
  speaker: string;
  text: string;
  translation?: string;
}

interface DialogueBubbleProps {
  lines: DialogueLine[];
}

const speakerColors: Record<string, string> = {
  A: 'from-primary-500/20 to-primary-600/10 border-primary-500/30',
  B: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
  narrator: 'from-surface-500/10 to-surface-600/5 border-surface-500/20',
};

export default function DialogueBubble({ lines }: DialogueBubbleProps) {
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const colors = speakerColors[line.speaker] || speakerColors.narrator;
        const isNarrator = line.speaker === 'narrator';
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: line.speaker === 'A' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2, duration: 0.3 }}
            className={`${isNarrator ? 'text-center' : ''}`}
          >
            <div
              className={`inline-block max-w-[85%] bg-gradient-to-br ${colors} border rounded-2xl px-4 py-3 ${
                isNarrator ? 'mx-auto' : line.speaker === 'A' ? '' : ''
              }`}
            >
              {!isNarrator && (
                <p className="text-[11px] font-semibold text-primary-300 mb-1">
                  {line.speaker === 'A' ? '👤 Person A' : '👤 Person B'}
                </p>
              )}
              <p className={`text-sm ${isNarrator ? 'text-surface-400 italic' : 'text-white'}`}>
                {line.text}
              </p>
              {line.translation && (
                <p className="text-xs text-surface-500 mt-1 border-t border-white/5 pt-1">
                  {line.translation}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
