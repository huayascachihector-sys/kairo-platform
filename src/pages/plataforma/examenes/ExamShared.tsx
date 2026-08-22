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
  unmsmScore?: number;
  incorrect?: number;
  blank?: number;
}

/** Banco de preguntas con modo práctica y modo simulacro cronometrado con navegación matricial y flags de revisión */
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
  const [markedForReview, setMarkedForReview] = useState<boolean[]>(() => section.questions.map(() => false));
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());

  const q = section.questions[idx];
  const total = section.questions.length;
  
  const correct = useMemo(
    () => answers.reduce<number>((s, a, i) => s + (a === section.questions[i].answer ? 1 : 0), 0),
    [answers, section]
  );

  const incorrect = useMemo(
    () => answers.reduce<number>((s, a, i) => s + (a !== null && a !== section.questions[i].answer ? 1 : 0), 0),
    [answers, section]
  );

  const blank = total - (correct + incorrect);

  // Puntaje oficial San Marcos (+20 correcta, -1.125 incorrecta, 0 en blanco)
  const unmsmScore = useMemo(() => {
    const raw = correct * 20 - incorrect * 1.125;
    return Math.max(0, Math.round(raw * 100) / 100);
  }, [correct, incorrect]);

  const finish = (finalAnswers = answers) => {
    if (done) return;
    const c = finalAnswers.reduce<number>((s, a, i) => s + (a === section.questions[i].answer ? 1 : 0), 0);
    const inc = finalAnswers.reduce<number>((s, a, i) => s + (a !== null && a !== section.questions[i].answer ? 1 : 0), 0);
    const blk = total - (c + inc);
    const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    const score = Math.max(0, Math.round((c * 20 - inc * 1.125) * 100) / 100);
    setDone(true);
    onFinish({ correct: c, total, minutes, unmsmScore: score, incorrect: inc, blank: blk });
  };

  const select = (i: number) => {
    if (mode === 'practica' && picked !== null) return;
    setPicked(i);
    const next = [...answers];
    next[idx] = i;
    setAnswers(next);
  };

  const toggleMarkReview = () => {
    setMarkedForReview((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const goToQuestion = (targetIdx: number) => {
    setIdx(targetIdx);
    setPicked(answers[targetIdx]);
  };

  const next = () => {
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setPicked(answers[idx + 1]);
    } else {
      finish();
    }
  };

  const prev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setPicked(answers[idx - 1]);
    }
  };

  if (done) {
    const pct = Math.round((correct / total) * 100);
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:cyber-card-dark rounded-3xl border border-surface-100 dark:border-cyan-500/20 p-8 text-center space-y-6 shadow-2xl">
        <div className="text-5xl">{pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'}</div>
        <div>
          <h3 className="text-2xl font-black text-surface-900 dark:text-white">
            Resultados del Examen
          </h3>
          <p className="text-sm text-surface-500 mt-1">
            {mode === 'simulacro' ? 'Simulacro Oficial cronometrado registrado' : 'Práctica registrada'} con éxito.
          </p>
        </div>

        {/* Breakdown de Puntaje Oficial */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-xs text-emerald-400 font-bold block">Correctas (+20 pts)</span>
            <span className="text-2xl font-black text-emerald-400">{correct}</span>
          </div>
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
            <span className="text-xs text-red-400 font-bold block">Incorrectas (-1.125)</span>
            <span className="text-2xl font-black text-red-400">{incorrect}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/30">
            <span className="text-xs text-slate-400 font-bold block">En blanco (0 pts)</span>
            <span className="text-2xl font-black text-slate-300">{blank}</span>
          </div>
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
            <span className="text-xs text-cyan-400 font-bold block">Puntaje Oficial</span>
            <span className="text-2xl font-black text-cyan-300">{unmsmScore} <span className="text-xs">pts</span></span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <button onClick={onExit}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25">
            Volver a Secciones
          </button>
          <button onClick={() => {
            setIdx(0);
            setPicked(null);
            setAnswers(section.questions.map(() => null));
            setMarkedForReview(section.questions.map(() => false));
            setDone(false);
            startedAt.current = Date.now();
          }}
            className="px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-700 text-sm font-semibold text-surface-700 dark:text-surface-200 inline-flex items-center gap-2 hover:bg-white/5">
            <RotateCcw className="w-4 h-4" /> Repetir Simulacro
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:cyber-card-dark rounded-3xl border border-surface-100 dark:border-cyan-500/20 p-6 space-y-5 shadow-xl">
      {/* Barra superior de estado */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-surface-500">Pregunta {idx + 1} de {total}</span>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            mode === 'simulacro' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                 : 'bg-surface-100 dark:bg-surface-800 text-surface-400'}`}>
            {mode === 'simulacro' ? `Simulacro Oficial · ${section.realMinutes} min` : 'Modo Práctica Feynman'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMarkReview}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              markedForReview[idx]
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            📌 {markedForReview[idx] ? 'Marcada para revisar' : 'Marcar duda'}
          </button>

          {mode === 'simulacro' && (
            <Countdown seconds={section.realMinutes * 60} running onEnd={() => finish()} />
          )}

          <button onClick={onExit} className="text-xs text-surface-400 hover:text-surface-200">
            Salir
          </button>
        </div>
      </div>

      {/* Matriz interactiva de navegación de preguntas */}
      <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 flex flex-wrap gap-1.5 items-center">
        <span className="text-[11px] text-slate-500 font-mono mr-2">Navegador:</span>
        {section.questions.map((_, i) => {
          const isCur = i === idx;
          const isAnswered = answers[i] !== null;
          const isMarked = markedForReview[i];
          return (
            <button
              key={i}
              onClick={() => goToQuestion(i)}
              className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all relative ${
                isCur
                  ? 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-300'
                  : isMarked
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                  : isAnswered
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              {i + 1}
              {isMarked && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
        <motion.div animate={{ width: `${((idx + 1) / total) * 100}%` }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
      </div>

      {q.passage && (
        <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-900/80 border border-slate-800 text-sm leading-relaxed text-surface-700 dark:text-surface-300 font-serif">
          {q.passage}
        </div>
      )}

      <p className="text-base font-semibold text-surface-900 dark:text-white">{q.prompt}</p>

      {/* Opciones de respuesta */}
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          const isPicked = (picked !== null ? picked : answers[idx]) === i;
          const reveal = mode === 'practica' && (picked !== null || answers[idx] !== null);
          const isRight = i === q.answer;
          return (
            <button key={i} onClick={() => select(i)}
              className={`w-full text-left px-4 py-3 rounded-2xl border text-sm transition-all flex items-center gap-3 ${
                reveal && isRight
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                  : reveal && isPicked && !isRight
                  ? 'border-red-500 bg-red-500/10 text-red-300 font-semibold'
                  : isPicked
                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200 shadow-md'
                  : 'border-surface-200 dark:border-slate-800 hover:border-cyan-500/40 text-surface-700 dark:text-surface-300 bg-slate-900/40'
              }`}>
              <span className="w-7 h-7 rounded-xl bg-surface-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {reveal && isRight && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {reveal && isPicked && !isRight && <XCircle className="w-5 h-5 text-red-400" />}
            </button>
          );
        })}
      </div>

      {/* Explicación Feynman en Modo Práctica */}
      {mode === 'practica' && (picked !== null || answers[idx] !== null) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-sm text-surface-300 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>🧠</span> Método Feynman · Explicación Paso a Paso
            </div>
            <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
          </div>
        </motion.div>
      )}

      {/* Botones de navegación Anterior / Siguiente / Finalizar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
        >
          &larr; Anterior
        </button>

        <div className="flex items-center gap-2">
          {idx + 1 < total ? (
            <button
              onClick={next}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <span>Siguiente Pregunta</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => finish()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Finalizar Examen</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
