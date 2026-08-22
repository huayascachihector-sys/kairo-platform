import { motion } from "framer-motion";
import { MASCOT_OUTFITS, type MascotOutfitId } from "../../lib/gamification";
import { cn } from "../../lib/utils";

export type MascotReaction = "idle" | "happy" | "sad" | "streak" | "levelup";

interface MascotProps {
  outfit: MascotOutfitId | string;
  reaction?: MascotReaction;
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}

const SIZES = {
  sm: { box: "w-12 h-12", emoji: "text-2xl" },
  md: { box: "w-16 h-16", emoji: "text-3xl" },
  lg: { box: "w-24 h-24", emoji: "text-5xl" },
};

const REACTION_ANIM = {
  idle: { y: [0, -6, 0], rotate: [0, 3, -3, 0] },
  happy: { y: [0, -14, 0], rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] },
  sad: { y: [0, 4, 0], rotate: [0, -4, 4, 0], scale: [1, 0.95, 1] },
  streak: { y: [0, -10, 0, -10, 0], rotate: [0, 5, -5, 5, 0], scale: [1, 1.08, 1, 1.08, 1] },
  levelup: { y: [0, -18, 0], rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] },
};

export function Mascot({
  outfit,
  reaction = "idle",
  size = "md",
  message,
  className,
}: MascotProps) {
  const found = MASCOT_OUTFITS.find((o) => o.id === outfit);
  const emoji = found?.icon ?? "🦉";
  const s = SIZES[size];

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 rounded-2xl rounded-bl-sm px-3 py-2 text-xs font-medium text-surface-700 dark:text-surface-200 shadow-sm max-w-56 text-center"
        >
          {message}
        </motion.div>
      )}
      <motion.div
        animate={REACTION_ANIM[reaction]}
        transition={{ 
          duration: reaction === "streak" ? 1.8 : 2.4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        whileHover={{ scale: 1.08, rotate: 4 }}
        className={cn(
          "rounded-full bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/40 dark:to-accent-900/40 flex items-center justify-center shadow-inner cursor-pointer",
          s.box,
        )}
      >
        <span className={cn("leading-none select-none", s.emoji)}>{emoji}</span>
      </motion.div>
    </div>
  );
}
