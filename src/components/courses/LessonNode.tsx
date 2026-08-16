import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Lock, Trophy, ChevronRight } from "lucide-react";
import type { LessonType } from "@/lib/courseData";
import { LessonTypeIcon } from "./LessonTypeIcon";

export type NodeStatus = "locked" | "unlocked" | "completed" | "crowned";

interface LessonNodeProps {
  status: NodeStatus;
  title: string;
  number: number;
  lessonType?: LessonType;
  requiredLesson?: string;
  isLast?: boolean;
  legendary?: boolean;
  onSelect?: () => void;
}

const statusColors = {
  locked: {
    bg: "bg-gray-800/50",
    border: "border-gray-700/50",
    text: "text-gray-500",
    glow: "none",
  },
  unlocked: {
    bg: "bg-primary-900/30",
    border: "border-primary-500/50",
    text: "text-primary-300",
    glow: "0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.15)",
  },
  completed: {
    bg: "bg-emerald-900/30",
    border: "border-emerald-500/50",
    text: "text-emerald-300",
    glow: "0 0 15px rgba(52,211,153,0.2)",
  },
  crowned: {
    bg: "bg-amber-900/30",
    border: "border-amber-500/50",
    text: "text-amber-300",
    glow: "0 0 20px rgba(251,191,36,0.3), 0 0 40px rgba(251,191,36,0.15)",
  },
};

export function LessonNode({
  status,
  title,
  number,
  lessonType,
  requiredLesson,
  legendary,
  onSelect,
}: LessonNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const colors = statusColors[status];

  const icon = {
    locked: <Lock size={16} className="text-gray-500" />,
    unlocked: (
      <div className="relative">
        {lessonType ? (
          <LessonTypeIcon type={lessonType} size={18} />
        ) : (
          <span className="text-sm font-bold text-primary-300">{number}</span>
        )}
      </div>
    ),
    completed: <Check size={18} className="text-emerald-400" />,
    crowned: <Trophy size={16} className="text-amber-400" />,
  }[status];

  const ringClass = {
    locked: "ring-1 ring-gray-700",
    unlocked: "ring-2 ring-primary-500/50",
    completed: "ring-2 ring-emerald-500/50",
    crowned: "ring-2 ring-amber-500/50",
  }[status];

  return (
    <div
      className="flex flex-col items-center gap-1.5 relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.button
        onClick={status !== "locked" ? onSelect : undefined}
        disabled={status === "locked"}
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 relative",
          "backdrop-blur-sm",
          colors.bg,
          colors.border,
          ringClass,
          status !== "locked" && "cursor-pointer hover:scale-110",
        )}
        style={status === "unlocked" ? { boxShadow: colors.glow } : undefined}
        whileHover={
          status === "unlocked"
            ? {
                scale: 1.12,
                boxShadow: "0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2)",
              }
            : undefined
        }
        whileTap={status === "unlocked" ? { scale: 0.95 } : undefined}
        animate={
          status === "unlocked"
            ? {
                boxShadow: [
                  "0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.15)",
                  "0 0 25px rgba(99,102,241,0.4), 0 0 50px rgba(99,102,241,0.2)",
                  "0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.15)",
                ],
              }
            : undefined
        }
        transition={
          status === "unlocked"
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      >
        {icon}
        {legendary && (
          <motion.span
            animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1.5 -right-1.5 text-[13px] drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
            title="¡Dominada! Nivel legendario"
          >
            ⭐
          </motion.span>
        )}
      </motion.button>

      <span className={cn("text-[11px] text-center max-w-24 leading-tight px-1", colors.text)}>
        {title}
      </span>

      <AnimatePresence>
        {showTooltip && status === "locked" && requiredLesson && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 z-50 w-52"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl p-3 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={12} className="text-gray-500 shrink-0" />
                <span className="text-xs font-semibold text-gray-300">Lección bloqueada</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">Completa primero:</p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-primary-400">
                <ChevronRight size={12} />
                <span className="font-medium">{requiredLesson}</span>
              </div>
              <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full" />
              </div>
            </div>
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/95 rotate-45 -mt-1 border-r border-b border-gray-700"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
