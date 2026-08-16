import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, User, ChevronRight, Sparkles } from 'lucide-react';
import type { Module } from '../../lib/courseData';
import { SocraticEngine, type ResponseQuality } from '../../lib/pedagogy';

interface TutorIAProps {
  modulo: Module;
  onComplete: (hecho: boolean) => void;
}

type Msg = { role: 'tutor' | 'alumno'; text: string };

export default function TutorIA({ modulo, onComplete }: TutorIAProps) {
  const problema = modulo.iaTutor || inferirProblema(modulo);

  const [engine] = useState<SocraticEngine>(() => new SocraticEngine({ mastery: 0.4, errorType: null }));
  const [hintIdx, setHintIdx] = useState(0);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'tutor',
      text: `Resolveremos juntos este problema. Te iré dando pistas una a la vez — no te doy la respuesta. Intenta razonar y escribe tu resultado (número) o tu duda.\n\n**Enunciado:** ${problema.problema}`,
    },
  ]);
  const [resuelto, setResuelto] = useState(false);
  const [terminado, setTerminado] = useState(false);

  const hints = problema.hints;

  function clasificar(respuesta: string): ResponseQuality {
    const t = respuesta.trim().toLowerCase();
    const nums = t.match(/-?\d+(?:\.\d+)?/g);
    if (nums && nums.length > 0) {
      const val = parseFloat(nums[nums.length - 1]);
      if (Math.abs(val - problema.answer) <= problema.tolerancia) return 'correct';
      if (val !== 0) return 'wrong';
    }
    if (/(no se|no sé|ayuda|duda|ayúdame|no entiendo|no me sale)/.test(t)) return 'confused';
    if (t.length < 8) return 'no_response';
    return 'partial';
  }

  function responder() {
    if (!input.trim() || resuelto) return;
    const respuesta = input.trim();
    setMessages((m) => [...m, { role: 'alumno', text: respuesta }]);
    setInput('');

    const calidad = clasificar(respuesta);
    const sig = new SocraticEngine(engine.snapshot());
    const next = sig.transition(calidad);
    engine.state = next;
    engine.turnsInState = sig.turnsInState;

    if (calidad === 'correct') {
      setResuelto(true);
      setMessages((m) => [
        ...m,
        {
          role: 'tutor',
          text: `✅ **¡Correcto!** La respuesta es **${problema.answer}**.\n\nLo lograste razonando. La clave fue:\n- ${problema.formula}\n- Identificar los datos y aplicar la operación paso a paso.\n\n¿Listo para la prueba final del módulo?`,
        },
      ]);
      return;
    }

    if (calidad === 'wrong') {
      setMessages((m) => [
        ...m,
        {
          role: 'tutor',
          text: `Tu valor **${respuesta}** no coincide con la respuesta esperada (**${problema.answer}**).\n\nPiensa en un contraejemplo: si ese fuera el resultado, ¿qué pasaría con el resto? Reconsidera usando la fórmula:\n> ${problema.formula}`,
        },
      ]);
      return;
    }

    if (hintIdx < hints.length) {
      const pista = hints[hintIdx];
      setHintIdx((h) => h + 1);
      const esUltima = hintIdx >= hints.length - 1;
      let texto = `🧩 **Pista ${hintIdx + 1} de ${hints.length}:** ${pista}`;
      if (esUltima) {
        texto += `\n\n> Con eso ya puedes llegar. Aplica **${problema.formula}**.`;
      }
      setMessages((m) => [
        ...m,
        {
          role: 'tutor',
          text: texto,
        },
      ]);
    } else {
      setMessages((m) => [
        ...m,
        {
          role: 'tutor',
          text: `Has intentado varias veces. Te lo explico directamente:\n\n> ${problema.formula}\n\nSustituye los datos del enunciado:\n\n**Resultado: ${problema.answer}**\n\nAhora verifica tu comprensión: ¿qué pasaría si cambiaras un dato?`,
        },
      ]);
    }
  }

  function terminar() {
    setTerminado(true);
    onComplete(true);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">La IA te enseña a resolver</p>
            <p className="text-xs text-surface-400">Tutor socrático • aprende razonando</p>
          </div>
        </div>
        <p className="text-xs text-surface-500 mt-1">
          El tutor no te da el resultado. Te guía con pistas progresivas hasta que razones la solución tú mismo.
        </p>
      </div>

      <div className="bg-surface-900/40 rounded-2xl border border-white/10 p-5 space-y-4 max-h-[60vh] overflow-y-auto">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={m.role === 'tutor' ? 'flex gap-3' : 'flex gap-3 flex-row-reverse'}
            >
              <div
                className={
                  m.role === 'tutor'
                    ? 'w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 shrink-0'
                    : 'w-8 h-8 rounded-lg bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-accent-400 shrink-0'
                }
              >
                {m.role === 'tutor' ? <Lightbulb className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="max-w-[85%]">
                <div
                  className={
                    m.role === 'tutor'
                      ? 'bg-surface-800 border border-white/10 rounded-2xl rounded-tl-sm p-4'
                      : 'bg-primary-600/20 border border-primary-500/30 rounded-2xl rounded-tr-sm p-4'
                  }
                >
                  <div className="text-sm text-surface-200 whitespace-pre-line [&_strong]:text-white">
                    {m.text}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!resuelto && !terminado ? (
        <div className="flex items-center justify-between gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && responder()}
            placeholder="Escribe tu respuesta, tu razonamiento o tu duda…"
            className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-surface-100 placeholder:text-surface-500 outline-none border border-white/10 text-sm"
          />
          <button onClick={responder} className="btn-primary text-sm flex items-center gap-2">
            Enviar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        !terminado && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <p className="text-3xl mb-1">🌟</p>
            <p className="font-bold text-white">¡Resolviste el problema!</p>
            <p className="text-sm text-surface-400">
              Tu razonamiento es la mejor fuente de aprendizaje. Avanza a la prueba final.
            </p>
            <button onClick={terminar} className="btn-primary text-sm">
              Continuar a la Prueba final
            </button>
          </div>
        )
      )}
    </div>
  );
}

function inferirProblema(modulo: Module) {
  const conEx = modulo.lessons.find((l) => l.exercises && l.exercises.length > 0);
  if (conEx) {
    const ex = conEx.exercises[0];
    return {
      problema: ex.question,
      formula: ex.explanation,
      answer: 1,
      tolerancia: 0.9,
      hints:
        ex.hints && ex.hints.length
          ? ex.hints
          : ['Vuelve a leer el enunciado.', 'Identifica los datos.', 'Aplica paso a paso.'],
    };
  }
  return {
    problema: `Explica con tus palabras el concepto central de "${modulo.title}".`,
    formula: 'Usa los ejemplos de la teoría.',
    answer: 1,
    tolerancia: 0.9,
    hints: ['Define el concepto en una frase.', 'Da un ejemplo concreto.', 'Relaciónalo con el módulo.'],
  };
}