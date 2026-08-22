import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Rocket,
  Atom,
  Scale,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { addXP } from '../../lib/store';

// ─── TAB 1: GRAFICADOR DE FUNCIONES MATEMÁTICAS ─────────────────────────────
type MathFnType = 'cuadratica' | 'trigonometrica' | 'lineal' | 'exponencial';

function GraficadorMatematico({ onGainXP }: { onGainXP: (amount: number) => void }) {
  const [fnType, setFnType] = useState<MathFnType>('cuadratica');
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cálculos matemáticos en vivo
  const stats = useMemo(() => {
    if (fnType === 'cuadratica') {
      const disc = b * b - 4 * a * c;
      const vx = a !== 0 ? -b / (2 * a) : 0;
      const vy = a !== 0 ? a * vx * vx + b * vx + c : c;
      let roots: string[] = [];
      if (a !== 0) {
        if (disc > 0) {
          const r1 = (-b + Math.sqrt(disc)) / (2 * a);
          const r2 = (-b - Math.sqrt(disc)) / (2 * a);
          roots = [r1.toFixed(2), r2.toFixed(2)];
        } else if (disc === 0) {
          roots = [vx.toFixed(2)];
        }
      }
      return {
        formula: `f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`,
        vertex: `(${vx.toFixed(2)}, ${vy.toFixed(2)})`,
        roots: roots.length ? roots.join(' y ') : 'Sin raíces reales (Δ < 0)',
        discriminant: disc.toFixed(2),
        concavity: a > 0 ? 'Hacia arriba (Mínimo)' : a < 0 ? 'Hacia abajo (Máximo)' : 'Lineal',
      };
    } else if (fnType === 'trigonometrica') {
      return {
        formula: `f(x) = ${a}·sen(${b}x) ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`,
        amplitude: Math.abs(a).toFixed(2),
        period: b !== 0 ? (Math.abs((2 * Math.PI) / b)).toFixed(2) : '∞',
        verticalShift: c.toFixed(2),
      };
    } else if (fnType === 'lineal') {
      const root = a !== 0 ? (-c / a).toFixed(2) : 'No definida';
      return {
        formula: `f(x) = ${a}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`,
        slope: a.toFixed(2),
        intercept: `(0, ${c.toFixed(2)})`,
        root: root,
      };
    } else {
      return {
        formula: `f(x) = ${a} · 2^(${b}x) ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`,
        asymptote: `y = ${c.toFixed(2)}`,
        intercept: `(0, ${(a + c).toFixed(2)})`,
      };
    }
  }, [fnType, a, b, c]);

  // Dibujado en Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 360);

    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height / 2;
    const scale = 25; // píxeles por unidad

    // Cuadrícula
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let x = originX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = originY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Ejes cartesianos
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Flechas y marcas
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('X', width - 15, originY - 6);
    ctx.fillText('Y', originX + 6, 15);
    ctx.fillText('(0,0)', originX + 4, originY + 12);

    // Evaluar función
    const evaluate = (xVal: number) => {
      if (fnType === 'cuadratica') return a * xVal * xVal + b * xVal + c;
      if (fnType === 'trigonometrica') return a * Math.sin(b * xVal) + c;
      if (fnType === 'lineal') return a * xVal + c;
      if (fnType === 'exponencial') return a * Math.pow(2, b * xVal) + c;
      return 0;
    };

    // Trazar curva
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;

    let first = true;
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - originX) / scale;
      const mathY = evaluate(mathX);
      const py = originY - mathY * scale;

      if (py >= -100 && py <= height + 100) {
        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      } else {
        first = true;
      }
    }
    ctx.stroke();

    // Puntos especiales para cuadrática (Vértice y Raíces)
    if (fnType === 'cuadratica' && a !== 0) {
      const vx = -b / (2 * a);
      const vy = a * vx * vx + b * vx + c;
      const pVx = originX + vx * scale;
      const pVy = originY - vy * scale;

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(pVx, pVy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Raíces
      const disc = b * b - 4 * a * c;
      if (disc >= 0) {
        const r1 = (-b + Math.sqrt(disc)) / (2 * a);
        const r2 = (-b - Math.sqrt(disc)) / (2 * a);
        [r1, r2].forEach((r) => {
          const prX = originX + r * scale;
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(prX, originY, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }
  }, [fnType, a, b, c]);

  return (
    <div className="space-y-6">
      {/* Controles de tipo de función */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'cuadratica', label: 'Cuadrática ax² + bx + c' },
          { id: 'lineal', label: 'Lineal ax + c' },
          { id: 'trigonometrica', label: 'Trigonométrica a·sen(bx) + c' },
          { id: 'exponencial', label: 'Exponencial a·2^(bx) + c' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFnType(f.id as MathFnType);
              onGainXP(5);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              fnType === f.id
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Canvas del Graficador */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-400 font-bold">{stats.formula}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">1 cuadrícula = 1 unidad</span>
          </div>
          <div className="w-full h-[360px] bg-slate-900/60 rounded-xl overflow-hidden relative">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>

        {/* Sliders y Métricas en Tiempo Real */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Parámetros Interactivos</span>
            </div>

            {/* Slider A */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Coeficiente a:</span>
                <span className="text-cyan-400 font-mono font-bold">{a}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800"
              />
            </div>

            {/* Slider B */}
            {fnType !== 'lineal' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Coeficiente b:</span>
                  <span className="text-cyan-400 font-mono font-bold">{b}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={b}
                  onChange={(e) => setB(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>
            )}

            {/* Slider C */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Término independiente c:</span>
                <span className="text-cyan-400 font-mono font-bold">{c}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.5"
                value={c}
                onChange={(e) => setC(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800"
              />
            </div>

            <button
              onClick={() => {
                setA(1);
                setB(-2);
                setC(-3);
              }}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Valores
            </button>
          </div>

          {/* Tarjeta de Análisis Neuro-Visual */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/20 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Análisis Matemático Automático
            </h4>
            {fnType === 'cuadratica' && (
              <div className="text-xs space-y-1.5 text-slate-300">
                <p>📍 <strong>Vértice:</strong> <span className="font-mono text-amber-400">{(stats as any).vertex}</span></p>
                <p>🎯 <strong>Raíces (Cortes con X):</strong> <span className="font-mono text-emerald-400">{(stats as any).roots}</span></p>
                <p>📐 <strong>Discriminante (Δ):</strong> <span className="font-mono">{(stats as any).discriminant}</span></p>
                <p>🔄 <strong>Concavidad:</strong> {(stats as any).concavity}</p>
              </div>
            )}
            {fnType === 'trigonometrica' && (
              <div className="text-xs space-y-1.5 text-slate-300">
                <p>🌊 <strong>Amplitud:</strong> <span className="font-mono text-cyan-300">{(stats as any).amplitude}</span></p>
                <p>⏱️ <strong>Periodo (T):</strong> <span className="font-mono text-amber-400">{(stats as any).period} rad</span></p>
                <p>↕️ <strong>Desplazamiento Vertical:</strong> <span className="font-mono">{(stats as any).verticalShift}</span></p>
              </div>
            )}
            {fnType === 'lineal' && (
              <div className="text-xs space-y-1.5 text-slate-300">
                <p>📈 <strong>Pendiente (m):</strong> <span className="font-mono text-cyan-300">{(stats as any).slope}</span></p>
                <p>📍 <strong>Corte con eje Y:</strong> <span className="font-mono text-amber-400">{(stats as any).intercept}</span></p>
                <p>🎯 <strong>Raíz (Corte X):</strong> <span className="font-mono text-emerald-400">{(stats as any).root}</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB 2: SIMULADOR DE TIRO PARABÓLICO Y CINEMÁTICA ──────────────────────
function SimuladorFisica({ onGainXP }: { onGainXP: (amount: number) => void }) {
  const [v0, setV0] = useState(25); // m/s
  const [angle, setAngle] = useState(45); // grados
  const [gravity, setGravity] = useState(9.8); // m/s²
  const [h0, setH0] = useState(0); // altura inicial
  const [isPlaying, setIsPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const rad = (angle * Math.PI) / 180;
  const vx0 = v0 * Math.cos(rad);
  const vy0 = v0 * Math.sin(rad);

  // Cálculos teóricos
  const tFlight = (vy0 + Math.sqrt(vy0 * vy0 + 2 * gravity * h0)) / gravity;
  const hMax = h0 + (vy0 * vy0) / (2 * gravity);
  const xMax = vx0 * tFlight;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setSimTime((t) => {
        const next = t + dt * 1.5;
        if (next >= tFlight) {
          setIsPlaying(false);
          onGainXP(10);
          return tFlight;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, tFlight, onGainXP]);

  // Dibujar trayectoria
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 360);

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const groundY = height - padding;
    const startX = padding;

    const scaleX = (width - padding * 2) / Math.max(xMax * 1.15, 20);
    const scaleY = (height - padding * 2) / Math.max(hMax * 1.2, 10);

    // Fondo y suelo
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, groundY, width, padding);

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Trayectoria teórica completa (punteada)
    ctx.beginPath();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    for (let t = 0; t <= tFlight; t += 0.05) {
      const x = vx0 * t;
      const y = h0 + vy0 * t - 0.5 * gravity * t * t;
      const px = startX + x * scaleX;
      const py = groundY - y * scaleY;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Trayectoria recorrida hasta simTime
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    for (let t = 0; t <= simTime; t += 0.02) {
      const x = vx0 * t;
      const y = h0 + vy0 * t - 0.5 * gravity * t * t;
      const px = startX + x * scaleX;
      const py = groundY - y * scaleY;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Posición actual del proyectil
    const curX = vx0 * simTime;
    const curY = Math.max(0, h0 + vy0 * simTime - 0.5 * gravity * simTime * simTime);
    const pX = startX + curX * scaleX;
    const pY = groundY - curY * scaleY;

    // Vectores de velocidad instantánea
    const curVy = vy0 - gravity * simTime;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pX, pY);
    ctx.lineTo(pX + vx0 * 0.8, pY - curVy * 0.8);
    ctx.stroke();

    // Proyectil
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(pX, pY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [simTime, v0, angle, gravity, h0, tFlight, xMax, hMax, vx0, vy0]);

  return (
    <div className="space-y-6">
      {/* Selector de Gravedad rápida */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold">Cuerpo celeste:</span>
        {[
          { name: 'Tierra (9.8 m/s²)', g: 9.8 },
          { name: 'Luna (1.62 m/s²)', g: 1.62 },
          { name: 'Marte (3.72 m/s²)', g: 3.72 },
          { name: 'Júpiter (24.79 m/s²)', g: 24.79 },
        ].map((planet) => (
          <button
            key={planet.name}
            onClick={() => {
              setGravity(planet.g);
              setSimTime(0);
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              gravity === planet.g
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {planet.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Canvas de Animación */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pausar' : simTime >= tFlight ? 'Repetir' : 'Lanzar'}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setSimTime(0);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Tiempo: <span className="text-cyan-400 font-bold">{simTime.toFixed(2)}s</span> / {tFlight.toFixed(2)}s
            </div>
          </div>

          <div className="w-full h-[360px] rounded-xl overflow-hidden relative">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>

        {/* Sliders de Física */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-cyan-400" />
              Condiciones de Lanzamiento
            </h4>

            {/* Velocidad Inicial */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Velocidad Inicial (v₀):</span>
                <span className="text-cyan-400 font-mono font-bold">{v0} m/s</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={v0}
                onChange={(e) => {
                  setV0(parseFloat(e.target.value));
                  setSimTime(0);
                }}
                className="w-full accent-cyan-400 bg-slate-800"
              />
            </div>

            {/* Ángulo */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Ángulo de Disparo (θ):</span>
                <span className="text-cyan-400 font-mono font-bold">{angle}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="85"
                value={angle}
                onChange={(e) => {
                  setAngle(parseFloat(e.target.value));
                  setSimTime(0);
                }}
                className="w-full accent-cyan-400 bg-slate-800"
              />
            </div>

            {/* Altura inicial */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Altura Inicial (h₀):</span>
                <span className="text-cyan-400 font-mono font-bold">{h0} m</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={h0}
                onChange={(e) => {
                  setH0(parseFloat(e.target.value));
                  setSimTime(0);
                }}
                className="w-full accent-cyan-400 bg-slate-800"
              />
            </div>
          </div>

          {/* Resultados Teóricos */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Métricas Cinemáticas</h4>
            <div className="text-xs space-y-1.5 text-slate-300">
              <p>🎯 <strong>Alcance Máximo (X_max):</strong> <span className="font-mono text-cyan-300 font-bold">{xMax.toFixed(2)} m</span></p>
              <p>🏔️ <strong>Altura Máxima (H_max):</strong> <span className="font-mono text-amber-400 font-bold">{hMax.toFixed(2)} m</span></p>
              <p>⏱️ <strong>Tiempo Total de Vuelo:</strong> <span className="font-mono text-emerald-400 font-bold">{tFlight.toFixed(2)} s</span></p>
              <p>➡️ <strong>Componente vx:</strong> <span className="font-mono">{vx0.toFixed(2)} m/s (constante)</span></p>
              <p>⬆️ <strong>Componente vy inicial:</strong> <span className="font-mono">{vy0.toFixed(2)} m/s</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB 3: TABLA PERIÓDICA INTERACTIVA ─────────────────────────────────────
interface ElementInfo {
  z: number;
  symbol: string;
  name: string;
  mass: number;
  category: 'alcalino' | 'alcalinoterreo' | 'transicion' | 'no-metal' | 'halogeno' | 'gas-noble';
  electronConfig: string;
  state: 'gas' | 'liquido' | 'solido';
  oxidation: string;
  description: string;
}

const ELEMENTS: ElementInfo[] = [
  { z: 1, symbol: 'H', name: 'Hidrógeno', mass: 1.008, category: 'no-metal', electronConfig: '1s¹', state: 'gas', oxidation: '+1, -1', description: 'El elemento más abundante del universo. Fundamental para el agua y compuestos orgánicos.' },
  { z: 2, symbol: 'He', name: 'Helio', mass: 4.0026, category: 'gas-noble', electronConfig: '1s²', state: 'gas', oxidation: '0', description: 'Gas noble inerte. Usado en criogenia y globos aeroespaciales.' },
  { z: 3, symbol: 'Li', name: 'Litio', mass: 6.94, category: 'alcalino', electronConfig: '[He] 2s¹', state: 'solido', oxidation: '+1', description: 'Metal alcalino ultraligero clave para baterías recargables.' },
  { z: 6, symbol: 'C', name: 'Carbono', mass: 12.011, category: 'no-metal', electronConfig: '[He] 2s² 2p²', state: 'solido', oxidation: '+4, +2, -4', description: 'Base de toda la química orgánica y la vida conocida en la Tierra.' },
  { z: 7, symbol: 'N', name: 'Nitrógeno', mass: 14.007, category: 'no-metal', electronConfig: '[He] 2s² 2p³', state: 'gas', oxidation: '+5, +3, -3', description: 'Constituye el 78% de la atmósfera terrestre.' },
  { z: 8, symbol: 'O', name: 'Oxígeno', mass: 15.999, category: 'no-metal', electronConfig: '[He] 2s² 2p⁴', state: 'gas', oxidation: '-2', description: 'Esencial para la respiración celular y la combustión.' },
  { z: 9, symbol: 'F', name: 'Flúor', mass: 18.998, category: 'halogeno', electronConfig: '[He] 2s² 2p⁵', state: 'gas', oxidation: '-1', description: 'El elemento más electronegativo de la tabla periódica (3.98 Pauling).' },
  { z: 10, symbol: 'Ne', name: 'Neón', mass: 20.180, category: 'gas-noble', electronConfig: '[He] 2s² 2p⁶', state: 'gas', oxidation: '0', description: 'Emite una luz rojiza brillante al ser ionizado en tubos de descarga.' },
  { z: 11, symbol: 'Na', name: 'Sodio', mass: 22.990, category: 'alcalino', electronConfig: '[Ne] 3s¹', state: 'solido', oxidation: '+1', description: 'Metal blando altamente reactivo que forma la sal común (NaCl).' },
  { z: 12, symbol: 'Mg', name: 'Magnesio', mass: 24.305, category: 'alcalinoterreo', electronConfig: '[Ne] 3s²', state: 'solido', oxidation: '+2', description: 'Componente central de la molécula de clorofila en plantas.' },
  { z: 13, symbol: 'Al', name: 'Aluminio', mass: 26.982, category: 'transicion', electronConfig: '[Ne] 3s² 3p¹', state: 'solido', oxidation: '+3', description: 'Metal ligero de gran resistencia a la corrosión.' },
  { z: 17, symbol: 'Cl', name: 'Cloro', mass: 35.45, category: 'halogeno', electronConfig: '[Ne] 3s² 3p⁵', state: 'gas', oxidation: '+7, +5, +3, +1, -1', description: 'Halógeno potente desinfectante y agente oxidante.' },
  { z: 26, symbol: 'Fe', name: 'Hierro', mass: 55.845, category: 'transicion', electronConfig: '[Ar] 3d⁶ 4s²', state: 'solido', oxidation: '+2, +3', description: 'Pilar de la metalurgia y núcleo de la hemoglobina humana.' },
  { z: 29, symbol: 'Cu', name: 'Cobre', mass: 63.546, category: 'transicion', electronConfig: '[Ar] 3d¹⁰ 4s¹', state: 'solido', oxidation: '+1, +2', description: 'Excelente conductor térmico y eléctrico, gran recurso del Perú.' },
  { z: 79, symbol: 'Au', name: 'Oro', mass: 196.97, category: 'transicion', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', state: 'solido', oxidation: '+3, +1', description: 'Metal noble de altísima inercia química y valor histórico.' },
];

function TablaPeriodicaInteractivo({ onGainXP }: { onGainXP: (amount: number) => void }) {
  const [selected, setSelected] = useState<ElementInfo>(ELEMENTS[3]); // Carbono por defecto
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  const filtered = useMemo(() => {
    if (categoryFilter === 'todos') return ELEMENTS;
    return ELEMENTS.filter((e) => e.category === categoryFilter);
  }, [categoryFilter]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'alcalino', label: 'Alcalinos' },
            { id: 'alcalinoterreo', label: 'Alcalinotérreos' },
            { id: 'transicion', label: 'Transición' },
            { id: 'no-metal', label: 'No Metales' },
            { id: 'halogeno', label: 'Halógenos' },
            { id: 'gas-noble', label: 'Gases Nobles' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Elementos */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {filtered.map((el) => {
            const isSelected = selected.z === el.z;
            return (
              <motion.button
                key={el.z}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelected(el);
                  onGainXP(2);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start text-[10px] text-slate-400 font-mono">
                  <span>{el.z}</span>
                  <span className="truncate max-w-[40px]">{el.mass.toFixed(1)}</span>
                </div>
                <div className="text-2xl font-extrabold text-white my-1 font-mono text-center">
                  {el.symbol}
                </div>
                <div className="text-[11px] text-slate-300 truncate text-center font-medium">
                  {el.name}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Ficha Atómica Detallada */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.z}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">Z = {selected.z}</span>
                <h3 className="text-2xl font-extrabold text-white">{selected.name}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl font-black text-cyan-300 font-mono">
                {selected.symbol}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>⚖️ <strong>Masa Atómica:</strong> <span className="font-mono text-amber-400">{selected.mass} u</span></p>
              <p>⚡ <strong>Configuración:</strong> <span className="font-mono text-cyan-300">{selected.electronConfig}</span></p>
              <p>🔢 <strong>Estados de Oxidación:</strong> <span className="font-mono">{selected.oxidation}</span></p>
              <p>🌡️ <strong>Estado (20°C):</strong> <span className="capitalize">{selected.state}</span></p>
              <p>🏷️ <strong>Familia:</strong> <span className="capitalize text-slate-400">{selected.category}</span></p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              💡 {selected.description}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── TAB 4: BALANCEADOR QUÍMICO INTERACTIVO ─────────────────────────────────
interface Challenge {
  id: string;
  name: string;
  formula: string;
  reactants: { formula: string; atoms: Record<string, number> }[];
  products: { formula: string; atoms: Record<string, number> }[];
  solution: number[];
}

const CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    name: 'Formación del Agua',
    formula: 'a H₂ + b O₂ → c H₂O',
    reactants: [{ formula: 'H₂', atoms: { H: 2 } }, { formula: 'O₂', atoms: { O: 2 } }],
    products: [{ formula: 'H₂O', atoms: { H: 2, O: 1 } }],
    solution: [2, 1, 2],
  },
  {
    id: 'ch-2',
    name: 'Combustión del Metano',
    formula: 'a CH₄ + b O₂ → c CO₂ + d H₂O',
    reactants: [{ formula: 'CH₄', atoms: { C: 1, H: 4 } }, { formula: 'O₂', atoms: { O: 2 } }],
    products: [{ formula: 'CO₂', atoms: { C: 1, O: 2 } }, { formula: 'H₂O', atoms: { H: 2, O: 1 } }],
    solution: [1, 2, 1, 2],
  },
  {
    id: 'ch-3',
    name: 'Oxidación del Hierro',
    formula: 'a Fe + b O₂ → c Fe₂O₃',
    reactants: [{ formula: 'Fe', atoms: { Fe: 1 } }, { formula: 'O₂', atoms: { O: 2 } }],
    products: [{ formula: 'Fe₂O₃', atoms: { Fe: 2, O: 3 } }],
    solution: [4, 3, 2],
  },
];

function BalanceadorQuimico({ onGainXP }: { onGainXP: (amount: number) => void }) {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const challenge = CHALLENGES[activeChallengeIdx];

  const totalCoeffs = challenge.reactants.length + challenge.products.length;
  const [coeffs, setCoeffs] = useState<number[]>(() => Array(totalCoeffs).fill(1));
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setCoeffs(Array(challenge.reactants.length + challenge.products.length).fill(1));
    setIsSuccess(false);
  }, [activeChallengeIdx, challenge]);

  // Contar átomos de reactivos y productos
  const atomCounts = useMemo(() => {
    const leftAtoms: Record<string, number> = {};
    const rightAtoms: Record<string, number> = {};

    let idx = 0;
    challenge.reactants.forEach((r) => {
      const c = coeffs[idx] || 1;
      Object.entries(r.atoms).forEach(([atom, count]) => {
        leftAtoms[atom] = (leftAtoms[atom] || 0) + count * c;
      });
      idx++;
    });

    challenge.products.forEach((p) => {
      const c = coeffs[idx] || 1;
      Object.entries(p.atoms).forEach(([atom, count]) => {
        rightAtoms[atom] = (rightAtoms[atom] || 0) + count * c;
      });
      idx++;
    });

    const allAtoms = Array.from(new Set([...Object.keys(leftAtoms), ...Object.keys(rightAtoms)]));
    const isBalanced = allAtoms.every((atom) => leftAtoms[atom] === rightAtoms[atom]);

    return { leftAtoms, rightAtoms, allAtoms, isBalanced };
  }, [challenge, coeffs]);

  const updateCoeff = (index: number, delta: number) => {
    setCoeffs((prev) => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(8, next[index] + delta));
      return next;
    });
  };

  useEffect(() => {
    if (atomCounts.isBalanced && !isSuccess) {
      setIsSuccess(true);
      onGainXP(25);
    }
  }, [atomCounts.isBalanced, isSuccess, onGainXP]);

  return (
    <div className="space-y-6">
      {/* Selector de Reacción */}
      <div className="flex gap-2">
        {CHALLENGES.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => setActiveChallengeIdx(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeChallengeIdx === i
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {ch.name}
          </button>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-6 shadow-xl">
        <h3 className="text-xl font-bold text-white">{challenge.name}</h3>

        {/* Ecuación Interactiva con Selectores de Coeficientes */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-lg font-mono font-bold">
          {challenge.reactants.map((r, i) => (
            <div key={r.formula} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-500 font-sans">+</span>}
              <div className="flex items-center bg-slate-950 border border-cyan-500/40 rounded-xl px-2 py-1 gap-2">
                <button
                  onClick={() => updateCoeff(i, -1)}
                  className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                >
                  -
                </button>
                <span className="text-cyan-400 w-4 text-center">{coeffs[i]}</span>
                <button
                  onClick={() => updateCoeff(i, 1)}
                  className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                >
                  +
                </button>
              </div>
              <span className="text-white">{r.formula}</span>
            </div>
          ))}

          <span className="text-cyan-400 text-2xl font-sans mx-2">→</span>

          {challenge.products.map((p, i) => {
            const actualIdx = challenge.reactants.length + i;
            return (
              <div key={p.formula} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-500 font-sans">+</span>}
                <div className="flex items-center bg-slate-950 border border-cyan-500/40 rounded-xl px-2 py-1 gap-2">
                  <button
                    onClick={() => updateCoeff(actualIdx, -1)}
                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                  >
                    -
                  </button>
                  <span className="text-cyan-400 w-4 text-center">{coeffs[actualIdx]}</span>
                  <button
                    onClick={() => updateCoeff(actualIdx, 1)}
                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                  >
                    +
                  </button>
                </div>
                <span className="text-white">{p.formula}</span>
              </div>
            );
          })}
        </div>

        {/* Comparativa de Átomos: Ley de Lavoisier */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-4">
          {atomCounts.allAtoms.map((atom) => {
            const l = atomCounts.leftAtoms[atom] || 0;
            const r = atomCounts.rightAtoms[atom] || 0;
            const match = l === r;
            return (
              <div
                key={atom}
                className={`p-3 rounded-2xl border ${
                  match
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                }`}
              >
                <div className="text-xs font-bold font-mono">Átomo: {atom}</div>
                <div className="text-sm font-extrabold mt-1">
                  {l} reactivos vs {r} productos
                </div>
              </div>
            );
          })}
        </div>

        {atomCounts.isBalanced && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold flex items-center justify-center gap-2 max-w-md mx-auto"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>¡Reacción perfectamente balanceada! (+25 XP)</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN LABORATORY COMPONENT ──────────────────────────────────────────────
export default function LaboratorioInteractivo() {
  const [activeTab, setActiveTab] = useState<'math' | 'physics' | 'elements' | 'chemistry'>('math');
  const [earnedXP, setEarnedXP] = useState(0);

  const handleGainXP = (amount: number) => {
    addXP(amount);
    setEarnedXP((prev) => prev + amount);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Neuro-Educación Visual · Intuición antes de la Fórmula
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Laboratorio Interactivo de Ciencias
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Experimenta en tiempo real con simulaciones de matemáticas, física y química.
          </p>
        </div>

        {earnedXP > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl text-amber-400 text-xs font-bold">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>+{earnedXP} XP ganados hoy</span>
          </div>
        )}
      </div>

      {/* Tabs principales */}
      <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-4">
        {[
          { id: 'math', label: 'Graficador de Funciones', icon: LineChart },
          { id: 'physics', label: 'Simulador de Física', icon: Rocket },
          { id: 'elements', label: 'Tabla Periódica', icon: Atom },
          { id: 'chemistry', label: 'Balanceador Químico', icon: Scale },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25 scale-[1.02]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido activo */}
      <div>
        {activeTab === 'math' && <GraficadorMatematico onGainXP={handleGainXP} />}
        {activeTab === 'physics' && <SimuladorFisica onGainXP={handleGainXP} />}
        {activeTab === 'elements' && <TablaPeriodicaInteractivo onGainXP={handleGainXP} />}
        {activeTab === 'chemistry' && <BalanceadorQuimico onGainXP={handleGainXP} />}
      </div>
    </div>
  );
}
