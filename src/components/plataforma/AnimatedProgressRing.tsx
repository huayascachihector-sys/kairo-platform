import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
  label?: string;
  animateOnMount?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function AnimatedProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  color = "#6366f1",
  trackColor = "#e2e8f0",
  showLabel = true,
  label,
  animateOnMount = true,
  className = "",
  onComplete,
}: AnimatedProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(animateOnMount ? 0 : progress);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    if (!animateOnMount) {
      setDisplayProgress(progress);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayProgress(progress);
      if (progress >= 100 && onComplete) {
        setTimeout(onComplete, 300);
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [progress, animateOnMount, onComplete]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          className="dark:stroke-white/10"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ 
            duration: 1.2, 
            ease: [0.23, 1, 0.32, 1],
            delay: 0.1 
          }}
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-3xl font-bold tabular-nums text-surface-900 dark:text-white"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {Math.round(displayProgress)}
            <span className="text-base align-super font-medium">%</span>
          </motion.span>
          {label && (
            <span className="text-[10px] font-medium text-surface-500 dark:text-surface-400 tracking-wider -mt-0.5">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
