import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiBurstProps {
  trigger: boolean;
  onComplete?: () => void;
  particleCount?: number;
  colors?: string[];
  duration?: number;
}

export function ConfettiBurst({ 
  trigger, 
  onComplete, 
  particleCount = 28, 
  colors = ["#6366f1", "#a855f7", "#f43f5e", "#22c55e", "#eab308"],
  duration = 1400 
}: ConfettiBurstProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 7 + 4;
      
      particle.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.6 ? "50%" : "2px"};
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
      `;

      container.appendChild(particle);
      particles.push(particle);

      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const velocity = 60 + Math.random() * 95;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 35;

      particle.animate(
        [
          { 
            transform: `translate(-50%, -50%)`,
            opacity: 1 
          },
          { 
            transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
            opacity: 0 
          }
        ],
        {
          duration: duration + Math.random() * 400,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        }
      ).onfinish = () => {
        particle.remove();
      };
    }

    const timeout = setTimeout(() => {
      onComplete?.();
    }, duration + 300);

    return () => {
      clearTimeout(timeout);
      particles.forEach(p => p.remove());
    };
  }, [trigger, particleCount, colors, duration, onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden z-50"
    />
  );
}

// Hook helper
export function useConfetti() {
  const [show, setShow] = useState(false);

  const burst = () => {
    setShow(true);
    setTimeout(() => setShow(false), 1800);
  };

  return { show, burst };
}
