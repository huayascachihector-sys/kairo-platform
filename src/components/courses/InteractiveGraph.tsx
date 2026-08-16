import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface InteractiveGraphProps {
  equation: string;
  solutionX: number;
  onComplete: () => void;
}

export default function InteractiveGraph({ equation, solutionX, onComplete }: InteractiveGraphProps) {
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(-2);
  const [found, setFound] = useState(false);
  const [checked, setChecked] = useState(false);

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = -5; x <= 5; x += 0.25) {
      const y = slope * x + intercept;
      pts.push({ x, y });
    }
    return pts;
  }, [slope, intercept]);

  const correctSlope = 2;
  const correctIntercept = -4;

  const padding = 32;
  const width = 300;
  const height = 280;
  const gridSize = 28;

  const toPixel = (x: number, y: number) => ({
    px: padding + (x + 5) * gridSize,
    py: height - padding - (y + 5) * gridSize,
  });

  const checkAnswer = () => {
    setChecked(true);
    if (Math.abs(slope - correctSlope) < 0.1 && Math.abs(intercept - correctIntercept) < 0.1) {
      setFound(true);
      setTimeout(onComplete, 1200);
    }
  };

  const origin = toPixel(0, 0);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <h3 className="text-lg font-bold text-white mb-2">Gráfico de la Recta</h3>
      <p className="text-sm text-surface-400 mb-4">
        Ajusta la pendiente (m) y la intersección (b) para que la recta cruce el eje X en x = {solutionX}.
      </p>

      <div className="flex gap-6 flex-wrap">
        <svg width={width} height={height} className="bg-surface-900/50 rounded-xl border border-white/5">
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={i}>
              <line
                x1={padding + i * gridSize}
                y1={padding}
                x2={padding + i * gridSize}
                y2={height - padding}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <line
                x1={padding}
                y1={height - padding - i * gridSize}
                x2={width - padding}
                y2={height - padding - i * gridSize}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            </g>
          ))}

          <line x1={padding} y1={origin.py} x2={width - padding} y2={origin.py} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1={origin.px} y1={padding} x2={origin.px} y2={height - padding} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {Array.from({ length: 11 }).map((_, i) => {
            const val = i - 5;
            if (val === 0) return null;
            const pos = toPixel(val, 0);
            return (
              <text key={i} x={pos.px} y={origin.py + 14} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">
                {val}
              </text>
            );
          })}

          <motion.path
            d={points.map((p, i) => {
              const { px, py } = toPixel(p.x, p.y);
              return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
            }).join(' ')}
            stroke="url(#lineGrad)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
            className="drop-shadow-[0_0_6px_rgba(99,102,241,0.4)]"
          />

          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {found && (
            <motion.circle
              cx={toPixel(solutionX, 0).px}
              cy={toPixel(solutionX, 0).py}
              r="6"
              fill="#34d399"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
            />
          )}
        </svg>

        <div className="flex-1 min-w-[160px] space-y-4">
          <div>
            <label className="text-xs text-surface-400 mb-1.5 block">Pendiente (m): {slope.toFixed(1)}</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={slope}
              onChange={(e) => { setSlope(parseFloat(e.target.value)); setChecked(false); setFound(false); }}
              className="w-full accent-primary-500"
            />
          </div>
          <div>
            <label className="text-xs text-surface-400 mb-1.5 block">Intersección (b): {intercept.toFixed(1)}</label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={intercept}
              onChange={(e) => { setIntercept(parseFloat(e.target.value)); setChecked(false); setFound(false); }}
              className="w-full accent-primary-500"
            />
          </div>

          <div className="text-xs text-surface-500 font-mono bg-white/5 rounded-lg p-2 text-center">
            y = {slope.toFixed(1)}x {intercept >= 0 ? '+' : ''} {intercept.toFixed(1)}
          </div>

          <button
            onClick={checkAnswer}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Verificar solución
          </button>

          {checked && !found && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 text-center">
              La recta aún no cruza en x = {solutionX}. Ajusta los valores.
            </motion.p>
          )}

          {found && (
            <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-xs text-emerald-400 text-center font-semibold">
              ¡Correcto! La recta cruza el eje X en x = {solutionX}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
