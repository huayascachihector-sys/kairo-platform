import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import type { Module } from '../../lib/courseData';
import { getPruebaAprobarCon, getPruebaQuestions } from '../../lib/courseData';

interface PruebaModuloProps {
  modulo: Module;
  onComplete: (aprobado: boolean, nota: number) => void;
}

export default function PruebaModulo({ modulo, onComplete }: PruebaModuloProps) {
  const preguntas = getPruebaQuestions(modulo);
  const aprobarCon = getPruebaAprobarCon(modulo);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = preguntas[idx];
  const nota = Math.round((score / Math.max(1, preguntas.length)) * 100);
  const aprobado = nota >= aprobarCon;

  function verificar() {
    if (selected === null || submitted) return;
    setSubmitted(true);
    if (selected === q.correct) setScore((s) => s + 1);
  }

  function siguiente() {
    setSubmitted(false);
    setSelected(null);
    if (idx + 1 >= preguntas.length) {
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
    }
  }

  function reintentar() {
    setIdx(0);
    setScore(0);
    setFinished(false);
    setSubmitted(false);
    setSelected(null);
  }

  if (preguntas.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
        <p className="text-surface-400 text-sm">
          Este módulo no tiene preguntas para la prueba. Regresa a practicar.
        </p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8"
        >
          <div className="text-6xl mb-3">{aprobado ? '🏆' : '💪'}</div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {aprobado ? '¡Módulo aprobado!' : 'Sigue practicando'}
          </h2>
          <p className="text-surface-400 text-sm mb-4">
            Tu nota:{' '}
            <span className="text-primary-400 font-bold">{nota}%</span> · Necesitas{' '}
            <span className="text-amber-400 font-semibold">{aprobarCon}%</span> para aprobar
          </p>

          <div className="flex items-center justify-center gap-1.5 mb-2">
            {preguntas.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${i < score ? 'bg-emerald-500' : 'bg-white/20'}`}
              />
            ))}
          </div>
          <p className="text-xs text-surface-500 mb-6">
            {score} de {preguntas.length} correctas
          </p>

          {!aprobado && (
            <p className="text-sm text-surface-400 mb-5">
              Repasa la teoría y vuelve a intentarlo. Repetir la prueba refuerza lo aprendido.
            </p>
          )}

          <div className="flex gap-3 justify-center">
            <button onClick={() => onComplete(aprobado, nota)} className="btn-secondary text-sm">
              Volver al curso
            </button>
            {!aprobado && (
              <button onClick={reintentar} className="btn-primary text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Reintentar
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const correctIdx = q.correct;
  const isCorrect = submitted && selected === correctIdx;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">Prueba final del módulo</p>
            <p className="text-xs text-surface-400">
              Nota mínima para aprobar:{' '}
              <span className="text-amber-400 font-semibold">{aprobarCon}%</span>
            </p>
          </div>
          <span className="text-xs text-surface-500">
            Pregunta {idx + 1}/{preguntas.length}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1">
          {preguntas.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i === idx ? 'bg-primary-500' : i < idx ? 'bg-emerald-500/70' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`prueba-${idx}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-medium text-white mb-5">{q.question}</h3>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              let borderClass = 'border-white/10 hover:border-primary-500/30';
              if (submitted && i === correctIdx)
                borderClass = 'border-emerald-500/50 bg-emerald-500/10';
              else if (submitted && isSelected) borderClass = 'border-red-500/50 bg-red-500/10';
              else if (isSelected) borderClass = 'border-primary-500/50 bg-primary-500/10';

              return (
                <button
                  key={i}
                  onClick={() => !submitted && setSelected(i)}
                  disabled={submitted}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${borderClass}`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      submitted && i === correctIdx
                        ? 'bg-emerald-500 text-white'
                        : submitted && isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-surface-400'
                    }`}
                  >
                    {submitted && i === correctIdx ? (
                      <CheckCircle2 size={16} />
                    ) : submitted && isSelected ? (
                      <XCircle size={16} />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="text-surface-200">{opt}</span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <p
                className={`text-sm font-medium ${
                  isCorrect ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </p>
              <p className="text-sm text-surface-400 mt-1">{q.explanation}</p>
            </motion.div>
          )}

          <button
            onClick={submitted ? siguiente : verificar}
            disabled={selected === null && !submitted}
            className="mt-5 w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {submitted
              ? idx + 1 >= preguntas.length
                ? 'Ver resultado'
                : 'Siguiente pregunta'
              : 'Verificar'}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}