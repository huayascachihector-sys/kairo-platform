import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, ChevronRight, ChevronLeft, RefreshCw, BookOpen, Briefcase, GraduationCap, ArrowLeft, Loader as Loader2, Wrench, Microscope, Palette, Handshake, Briefcase as BriefcaseIcon, BarChart3, Settings, Heart, Landmark, Brain, Scale, Palette as PaletteIcon, Monitor, Globe, Dna, Megaphone, Star } from 'lucide-react';
import { type StoreState, saveVocationalResult } from '../../lib/store';
import {
  VOCATIONAL_QUESTIONS, RIASEC_LABELS, CAREERS,
  scoreVocationalTest, getTopCode, matchCareers, getCareerById,
} from '../../lib/careerData';

const RIASEC_ICONS: Record<string, any> = {
  R: Wrench, I: Microscope, A: Palette,
  S: Handshake, E: BriefcaseIcon, C: BarChart3,
};

const CAREER_ICONS: Record<string, any> = {
  'ingenieria-mecanica': Settings,
  'medicina': Heart,
  'arquitectura': Landmark,
  'psicologia': Brain,
  'administracion': BriefcaseIcon,
  'derecho': Scale,
  'arte-diseno': PaletteIcon,
  'contabilidad': BarChart3,
  'computacion': Monitor,
  'educacion': BookOpen,
  'biologia': Dna,
  'comunicaciones': Megaphone,
};
import { getAIResponse } from '../../lib/aiEngine';

interface Props {
  state: StoreState;
  onStateChange: () => void;
}

type Stage = 'intro' | 'quiz' | 'loading' | 'results';

const SCALE = [
  { v: 1, label: 'Nada' },
  { v: 2, label: 'Poco' },
  { v: 3, label: 'Algo' },
  { v: 4, label: 'Bastante' },
  { v: 5, label: 'Mucho' },
];

const cardCls = "relative bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 overflow-hidden group transition-all duration-300";
const dotBg = { backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' };
const hv = { y: -4, boxShadow: '0 12px 40px rgba(99,102,241,0.15)' };

export default function Carreras({ state, onStateChange }: Props) {
  const [stage, setStage] = useState<Stage>(state.vocationalTest ? 'results' : 'intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [detail, setDetail] = useState<string | null>(null);

  const totalQ = VOCATIONAL_QUESTIONS.length;
  const current = VOCATIONAL_QUESTIONS[step];
  const answered = Object.keys(answers).length;

  const selectAnswer = (value: number) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (step < totalQ - 1) {
      setTimeout(() => setStep(step + 1), 150);
    } else {
      finishQuiz(next);
    }
  };

  const finishQuiz = async (finalAnswers: Record<string, number>) => {
    setStage('loading');
    const scores = scoreVocationalTest(finalAnswers);
    const topCode = getTopCode(scores);
    const top = matchCareers(scores, 5);

    const prompt = `Eres un orientador vocacional. Un estudiante de bachillerato en Perú hizo un test RIASEC ` +
      `y obtuvo este perfil (0-15 por dimensión): Realista=${scores.R}, Investigador=${scores.I}, ` +
      `Artístico=${scores.A}, Social=${scores.S}, Emprendedor=${scores.E}, Convencional=${scores.C}. ` +
      `Su código Holland principal es "${topCode}". Las carreras que mejor calzan con su perfil son: ` +
      `${top.map((c) => c.title).join(', ')}. ` +
      `Escribe un mensaje cálido y motivador en español (máximo 2 párrafos cortos), dirigido directamente ` +
      `al estudiante, explicando qué dice este perfil sobre él y por qué esas carreras podrían encajarle. ` +
      `No uses markdown ni listas, solo texto corrido.`;

    let aiSummary = '';
    try {
      aiSummary = await getAIResponse(prompt, []);
    } catch {
      aiSummary = 'No pudimos generar tu resumen personalizado en este momento, pero tus resultados y carreras recomendadas están listos abajo.';
    }

    saveVocationalResult({
      scores,
      topCode,
      careerIds: top.map((c) => c.id),
      aiSummary,
      completedAt: new Date().toISOString(),
    });
    onStateChange();
    setStage('results');
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setStage('quiz');
  };

  // ── Detalle de una carrera ──────────────────────────────────────────────
  if (detail) {
    const career = getCareerById(detail);
    if (!career) {
      return (
        <div className="space-y-6">
          <button onClick={() => setDetail(null)}
            className="flex items-center gap-1.5 text-sm font-semibold text-surface-500 hover:text-surface-800 dark:hover:text-surface-200">
            <ArrowLeft className="w-4 h-4" /> Volver a Carreras
          </button>
          <p className="text-surface-500 text-sm">No se encontró la carrera seleccionada.</p>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        <button onClick={() => setDetail(null)}
          className="flex items-center gap-1.5 text-sm font-semibold text-surface-500 hover:text-surface-800 dark:hover:text-surface-200">
          <ArrowLeft className="w-4 h-4" /> Volver a Carreras
        </button>

        <div className="relative bg-white dark:bg-white/5 rounded-2xl border border-surface-100 dark:border-white/10 overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
          <div className="relative">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${career.color} flex items-center justify-center mb-4 shadow-md`}>
            {React.createElement(CAREER_ICONS[career.id] || BookOpen, { className: 'w-8 h-8 text-white' })}
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">{career.title}</h1>
          <p className="text-surface-500 leading-relaxed mb-6">{career.resumen}</p>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-surface-100 dark:border-surface-800 p-4">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary-500" /> Materias principales
              </h3>
              <ul className="text-sm text-surface-500 space-y-1 list-disc list-inside">
                {career.materias.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>

            <div className="rounded-xl border border-surface-100 dark:border-surface-800 p-4">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary-500" /> Campo laboral
              </h3>
              <p className="text-sm text-surface-500 leading-relaxed">{career.campoLaboral}</p>
            </div>

            <div className="rounded-xl border border-surface-100 dark:border-surface-800 p-4">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-primary-500" /> Universidades en Perú
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {career.universidadesPeru.map((u) => (
                  <span key={u} className="text-xs bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 px-2.5 py-1 rounded-full">{u}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-surface-100 dark:border-surface-800 p-4">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-accent-500" /> Universidades en el extranjero
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {career.universidadesExtranjero.map((u) => (
                  <span key={u} className="text-xs bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 px-2.5 py-1 rounded-full">{u}</span>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  if (stage === 'intro') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary-500" /> Carreras
          </h1>
          <p className="text-surface-500 text-sm mt-1">Descubre qué carreras se ajustan mejor a ti con un test vocacional evaluado por IA.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} whileHover={hv} className={cardCls}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-400" />
          <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
          <div className="relative p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mb-5 shadow-md">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Test vocacional RIASEC</h2>
            <p className="text-sm text-surface-500 max-w-md mx-auto mb-6 leading-relaxed">
              Responde {totalQ} afirmaciones cortas sobre tus gustos e intereses. Al terminar, la IA analizará
              tu perfil y te recomendará las carreras que mejor encajan contigo, con universidades en Perú y en el extranjero.
            </p>
            <button onClick={() => setStage('quiz')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all">
              Empezar test <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {(Object.keys(RIASEC_LABELS) as (keyof typeof RIASEC_LABELS)[]).map((k, i) => (
            <motion.div key={k} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.07 }} whileHover={hv} className={cardCls}>
              <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
              <div className="relative p-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mb-2">
                  {React.createElement(RIASEC_ICONS[k], { className: 'w-5 h-5 text-white' })}
                </div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">{RIASEC_LABELS[k].title}</h3>
                <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">{RIASEC_LABELS[k].desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────
  if (stage === 'quiz') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-surface-400">Pregunta {step + 1} de {totalQ}</span>
            <span className="text-xs font-semibold text-primary-600">{Math.round((answered / totalQ) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-surface-100 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${(answered / totalQ) * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-primary-600 to-accent-500" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className={cardCls}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-400" />
            <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
            <div className="relative p-8 text-center">
            <p className="text-lg font-semibold text-surface-900 dark:text-white leading-relaxed mb-8">{current.text}</p>

            <div className="grid grid-cols-5 gap-2">
              {SCALE.map((s) => (
                <button key={s.v} onClick={() => selectAnswer(s.v)}
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                    answers[current.id] === s.v
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-surface-100 dark:border-surface-800 hover:border-primary-300 hover:bg-primary-50/50'
                  }`}>
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xs font-bold flex items-center justify-center">
                    {s.v}
                  </span>
                  <span className="text-[10px] text-surface-500 font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          </motion.div>
        </AnimatePresence>

        {step > 0 && (
          <button onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mx-auto">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
        )}
      </div>
    );
  }

  // ── Loading (IA analizando) ────────────────────────────────────────────
  if (stage === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
        <h2 className="text-lg font-bold text-surface-900 dark:text-white">Analizando tus respuestas...</h2>
        <p className="text-sm text-surface-500 mt-1">La IA está armando tus recomendaciones de carrera.</p>
      </div>
    );
  }

  // ── Resultados ───────────────────────────────────────────────────────────
  const result = state.vocationalTest;
  if (!result) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary-500" /> Carreras
          </h1>
          <p className="text-surface-500 text-sm mt-1">Aún no tienes resultados. Realiza el test para descubrir tus carreras recomendadas.</p>
        </div>
        <button onClick={() => setStage('quiz')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all">
          Empezar test <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }
  const topCareers = result.careerIds.map(getCareerById).filter(Boolean) as typeof CAREERS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary-500" /> Carreras
          </h1>
          <p className="text-surface-500 text-sm mt-1">Tu código vocacional: <strong className="text-primary-600">{result.topCode}</strong></p>
        </div>
        <button onClick={restart}
          className="flex items-center gap-1.5 text-xs font-semibold text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 border border-surface-200 dark:border-surface-700 px-3 py-2 rounded-xl">
          <RefreshCw className="w-3.5 h-3.5" /> Repetir test
        </button>
      </div>

      <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl p-6 text-white">
        <h2 className="text-sm font-bold flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4" /> Tu perfil, según la IA</h2>
        <p className="text-sm leading-relaxed opacity-95 whitespace-pre-line">{result.aiSummary}</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {(Object.keys(RIASEC_LABELS) as (keyof typeof RIASEC_LABELS)[]).map((k, i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
           transition={{ delay: i * 0.05 }} whileHover={hv} className={cardCls}>
            <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
            <div className="relative p-3 text-center">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mx-auto mb-1">
                {React.createElement(RIASEC_ICONS[k], { className: 'w-4 h-4 text-white' })}
              </div>
              <p className="text-[11px] font-semibold text-surface-700 dark:text-surface-300 mt-1">{RIASEC_LABELS[k].title}</p>
              <p className="text-xs font-bold text-primary-600">{result.scores[k]}/15</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold text-surface-900 dark:text-white mb-3">Carreras recomendadas para ti</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {topCareers.map((career, i) => (
            <motion.button key={career.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileHover={hv}
              onClick={() => setDetail(career.id)}
              className={`text-left ${cardCls}`}>
              <div className="absolute inset-0 opacity-[0.03]" style={dotBg} />
              <div className="relative p-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${career.color} flex items-center justify-center mb-4 shadow-md`}>
                  {React.createElement(CAREER_ICONS[career.id] || BookOpen, { className: 'w-7 h-7 text-white' })}
                </div>
                <h3 className="text-base font-bold text-surface-900 dark:text-white mb-1">{career.title}</h3>
                <p className="text-xs text-surface-500 mb-4 leading-relaxed line-clamp-3">{career.resumen}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  Ver detalles <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
