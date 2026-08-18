import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Timer, RotateCcw, ChevronRight, TrendingUp } from 'lucide-react';
import type { ExamSection } from '../../../lib/examData';
import type { ExamAttempt } from '../../../lib/store';

export function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Cronómetro reutilizable (cuenta regresiva) */
export function Countdown({
  seconds,
  running,
  onEnd,
  className = '',
}: {
  seconds: number;
  running: boolean;
  onEnd?: () => void;
  className?: string;
}) {
  const [left, setLeft] = useState(seconds);
  const endedRef = useRef(false);

  useEffect(() => { setLeft(seconds); endedRef.current = false; }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          if (!endedRef.current) { endedRef.current = true; onEnd?.(); }
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, onEnd]);

  const low = left <= 30;
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold tabular-nums px-3 py-1.5 rounded-full text-xs ${
      low ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300'
          : 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
    } ${className}`}>
      <Timer className="w-3.5 h-3.5" /> {fmtTime(left)}
    </span>
  );
}

/** Gráfico de líneas simple (SVG) de puntaje a lo largo del tiempo */
export function ScoreChart({
  attempts,
  max,
  label,
}: {
  attempts: ExamAttempt[];
  max: number;
  label: string;
}) {
  const points = attempts.filter((a) => a.scaledScore != null);
  if (points.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-surface-200 dark:border-surface-700">
        <TrendingUp className="w-8 h-8 mx-auto text-surface-300 dark:text-surface-600 mb-2" />
        <p className="text-sm text-surface-400">Completa una práctica para ver tu curva de puntaje.</p>
      </div>
    );
  }
  const W = 560, H = 160, PAD = 8;
  const step = points.length > 1 ? (W - PAD * 2) / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = PAD + i * step;
    const y = H - PAD - ((p.scaledScore! / max) * (H - PAD * 2));
    return [x, y] as const;
  });
  const d = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const area = `${d} L${coords[coords.length - 1][0]},${H} L${coords[0][0]},${H} Z`;
  const best = Math.max(...points.map((p) => p.scaledScore!));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-surface-400">{label}</p>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300 px-2.5 py-1 rounded-full">
          Mejor: {best}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40">
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="text-primary-500">
          <path d={area} fill="url(#scoreGrad)" />
          <motion.path
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
            d={d} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
          {coords.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4} className="fill-white" stroke="currentColor" strokeWidth={2.5} />
          ))}
        </g>
      </svg>
      <div className="flex flex-wrap gap-2 mt-2">
        {points.slice(-6).map((p) => (
          <span key={p.id} className="text-[11px] text-surface-500 bg-surface-50 dark:bg-surface-800 px-2 py-1 rounded-lg">
            {new Date(p.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })} · {p.scaledScore}
            {p.mode === 'simulacro' && ' ⏱'}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface QuizResult {
  correct: number;
  total: number;
  minutes: number;
}

/** Banco de preguntas con modo práctica y modo simulacro cronometrado */
export function QuizRunner({
  section,
  mode,
  onFinish,
  onExit,
}: {
  section: ExamSection;
  mode: 'practica' | 'simulacro';
  onFinish: (r: QuizResult) => void;
  onExit: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() => section.questions.map(() => null));
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());

  const q = section.questions[idx];
  const total = section.questions.length;
  const correct = useMemo(
    () => answers.reduce<number>((s, a, i) => s + (a === section.questions[i].answer ? 1 : 0), 0),
    [answers, section]
  );

  const finish = (finalAnswers = answers) => {
    if (done) return;
    const c = finalAnswers.reduce<number>((s, a, i) => s + (a === section.questions[i].answer ? 1 : 0), 0);
    const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    setDone(true);
    onFinish({ correct: c, total, minutes });
  };

  const select = (i: number) => {
    if (mode === 'practica' && picked !== null) return;
    setPicked(i);
    const next = [...answers];
    next[idx] = i;
    setAnswers(next);
    if (mode === 'simulacro') {
      setTimeout(() => {
        if (idx + 1 < total) { setIdx(idx + 1); setPicked(null); }
        else finish(next);
      }, 150);
    }
  };

  const next = () => {
    if (idx + 1 < total) { setIdx(idx + 1); setPicked(answers[idx + 1]); }
    else finish();
  };

  if (done) {
    const pct = Math.round((correct / total) * 100);
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 p-8 text-center">
        <div className="text-5xl mb-3">{pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'}</div>
        <h3 className="text-xl font-bold text-surface-900 dark:text-white">
          {correct}/{total} correctas · {pct}%
        </h3>
        <p className="text-sm text-surface-500 mt-1">
          {mode === 'simulacro' ? 'Simulacro cronometrado registrado' : 'Práctica registrada'} en tu progreso.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button onClick={onExit}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold">
            Volver
          </button>
          <button onClick={() => { setIdx(0); setPicked(null); setAnswers(section.questions.map(() => null)); setDone(false); startedAt.current = Date.now(); }}
            className="px-5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-sm font-semibold text-surface-600 dark:text-surface-300 inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Repetir
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 p-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-surface-500">Pregunta {idx + 1} de {total}</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            mode === 'simulacro' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                 : 'bg-surface-100 dark:bg-surface-800 text-surface-500'}`}>
            {mode === 'simulacro' ? `Simulacro · ${section.realMinutes} min` : 'Práctica'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'simulacro' && (
            <Countdown seconds={section.realMinutes * 60} running onEnd={() => finish()} />
          )}
          <button onClick={onExit} className="text-xs text-surface-400 hover:text-surface-600">Salir</button>
        </div>
      </div>

      <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden mb-5">
        <motion.div animate={{ width: `${((idx) / total) * 100}%` }}
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
      </div>

      {q.passage && (
        <div className="mb-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800 text-sm leading-relaxed text-surface-700 dark:text-surface-300">
          {q.passage}
        </div>
      )}
      <p className="text-base font-semibold text-surface-900 dark:text-white mb-4">{q.prompt}</p>

      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const reveal = mode === 'practica' && picked !== null;
          const isRight = i === q.answer;
          return (
            <button key={i} onClick={() => select(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                reveal && isRight ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200'
                : reveal && isPicked ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : isPicked ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200'
                : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 text-surface-700 dark:text-surface-300'
              }`}>
              <span className="w-6 h-6 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {reveal && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {reveal && isPicked && !isRight && <XCircle className="w-4 h-4 text-red-500" />}
            </button>
          );
        })}
      </div>

      {mode === 'practica' && picked !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
          <div className="p-4 rounded-xl bg-primary-50/60 dark:bg-primary-900/20 text-sm text-surface-700 dark:text-surface-300">
            <strong className="text-primary-700 dark:text-primary-300">Explicación:</strong> {q.explanation}
          </div>
          <button onClick={next}
            className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold">
            {idx + 1 < total ? 'Siguiente' : 'Ver resultado'} <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {mode === 'practica' && picked === null && correct >= 0 && (
        <p className="text-[11px] text-surface-400 mt-4">Aciertos hasta ahora: {correct}</p>
      )}
    </div>
  );
}
