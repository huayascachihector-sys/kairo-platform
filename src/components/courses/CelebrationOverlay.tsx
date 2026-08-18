import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Zap, Gem, TrendingUp } from "lucide-react";

interface CelebrationOverlayProps {
  show: boolean;
  xpGained: number;
  streakDays?: number;
  gemsGained?: number;
  level?: number;
  levelUp?: boolean;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

const COLORS = [
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
];

export function CelebrationOverlay({
  show,
  xpGained,
  streakDays,
  gemsGained,
  level,
  levelUp,
  onClose,
}: CelebrationOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!show) return;
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 10,
        rotation: Math.random() * 360,
      });
    }
    setParticles(newParticles);
    const timer = setTimeout(() => {
      setParticles([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-surface-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden max-w-sm mx-4 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0 }}
                animate={{
                  y: "110vh",
                  rotate: p.rotation + 360,
                }}
                transition={{ duration: 2.5 + Math.random(), ease: "easeIn" }}
                className="absolute"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}
              />
            ))}
            <Trophy size={48} className="mx-auto text-yellow-500 mb-3" />
            {levelUp && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1.3, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2"
              >
                <TrendingUp className="w-3.5 h-3.5" /> ¡Subiste al nivel {level}!
              </motion.div>
            )}
            <h2 className="text-2xl font-bold text-white mb-2">¡Lección completada!</h2>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-primary-500 mb-2">
              <Zap size={22} />+{xpGained} XP
            </div>
            <div className="flex items-center justify-center gap-3 text-sm mb-3">
              {gemsGained && gemsGained > 0 && (
                <span className="flex items-center gap-1 font-bold text-cyan-400">
                  <Gem size={16} /> +{gemsGained}
                </span>
              )}
              {streakDays && streakDays > 1 && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Sparkles size={16} />
                  Racha {streakDays} días
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-8 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
