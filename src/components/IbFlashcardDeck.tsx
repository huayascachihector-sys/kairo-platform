import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, XCircle,
  BarChart3, BookOpen, Clock, Sparkles, Brain
} from 'lucide-react';
import type { ParsedIbQuestion } from '../lib/htmlQuestionParser';
import MathContent from './MathContent';

interface Props {
  questions: ParsedIbQuestion[];
  courseName: string;
  onClose: () => void;
  onProgress?: (cardId: string, knew: boolean) => void;
}

export default function IbFlashcardDeck({ questions, courseName, onClose, onProgress }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState<Record<string, 'knew' | 'didnt'>>({});
  const [finished, setFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [totalSeen, setTotalSeen] = useState(0);
  const [startedAt] = useState(Date.now());
  const [internalQuestions, setInternalQuestions] = useState(questions);
  const [shuffled, setShuffled] = useState(() => [...questions].sort(() => Math.random() - 0.5));

  useEffect(() => {
    if (questions.length > internalQuestions.length) {
      const newOnes = questions.slice(internalQuestions.length);
      const newShuffled = [...newOnes].sort(() => Math.random() - 0.5);
      setInternalQuestions(questions);
      setShuffled(prev => [...prev, ...newShuffled]);
    }
  }, [questions, internalQuestions.length]);

  const card = shuffled[currentIdx];
  const total = internalQuestions.length;
  const known = Object.values(stats).filter(v => v === 'knew').length;
  const progress = Object.keys(stats).length;
  const cardParts = card && card.parts.length > 0 ? card.parts : (card ? extractPartsFromHtml(card.questionHtml) : []);

  const mark = (knew: boolean) => {
    if (!card) return;
    const newStats = { ...stats, [card.id]: knew ? 'knew' as const : 'didnt' as const };
    setStats(newStats);
    setShowAnswer(false);
    onProgress?.(card.id, knew);
    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setShuffled([...internalQuestions].sort(() => Math.random() - 0.5));
    setCurrentIdx(0);
    setShowAnswer(false);
    setStats({});
    setFinished(false);
    setShowResults(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (finished && e.key === 'r') { reset(); return; }
    if (finished) return;
    if (e.key === ' ' || e.key === 'Enter') {
      if (!showAnswer) { setShowAnswer(true); return; }
      mark(true);
      return;
    }
    if (showAnswer && e.key === '1') { mark(true); return; }
    if (showAnswer && e.key === '2') { mark(false); return; }
    if (!showAnswer && e.key === 'ArrowRight' && currentIdx < total - 1) {
      setCurrentIdx(c => c + 1);
    }
    if (!showAnswer && e.key === 'ArrowLeft' && currentIdx > 0) {
      setCurrentIdx(c => c - 1);
    }
  }, [showAnswer, currentIdx, total, finished]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (finished && showResults) {
    const wrongCards = shuffled
      .filter(c => stats[c.id] === 'didnt')
      .slice(0, 50);
    return (
      <div className="space-y-4">
        <button onClick={() => setShowResults(false)}
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Volver a resultados
        </button>
        <h2 className="text-lg font-bold text-surface-900 dark:text-white">
          {wrongCards.length} preguntas para repasar
        </h2>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {wrongCards.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="bg-white dark:bg-surface-900 rounded-xl border border-red-200 dark:border-red-900/50 p-4">
              <div className="flex items-start gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <MathContent html={c.questionHtml.slice(0, 300)} className="text-sm text-surface-900 dark:text-white prose prose-sm dark:prose-invert max-w-none" />
              </div>
              <details className="text-xs text-surface-500">
                <summary className="cursor-pointer font-semibold text-primary-600">Ver respuesta</summary>
                <MathContent html={c.markschemeHtml.slice(0, 500)} className="mt-2 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg text-surface-700 dark:text-surface-300 prose prose-xs dark:prose-invert max-w-none" />
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = total > 0 ? Math.round((known / total) * 100) : 0;
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="text-center py-6">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${
            pct >= 70 ? 'from-emerald-500 to-emerald-600' : pct >= 40 ? 'from-amber-500 to-amber-600' : 'from-red-500 to-red-600'
          }`}>
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">
            {pct >= 80 ? '¡Excelente!' : pct >= 60 ? '¡Buen trabajo!' : pct >= 40 ? 'Sigue practicando' : 'Ánimo, tú puedes'}
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
            {courseName} · {total} flashcards · {mins}:{secs.toString().padStart(2, '0')} min
          </p>
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                className="text-surface-100 dark:text-surface-800" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                className={pct >= 70 ? 'text-emerald-500' : pct >= 40 ? 'text-amber-500' : 'text-red-500'}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-surface-900 dark:text-white">{pct}%</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-surface-500 dark:text-surface-400 mb-6">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {known} sabidas</span>
            <span className="flex items-center gap-1"><XCircle className="w-4 h-4 text-red-500" /> {total - known} repasar</span>
          </div>
          {total - known > 0 && (
            <button onClick={() => setShowResults(true)}
              className="text-sm font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-xl px-5 py-2.5 mb-4 transition-all">
              Revisar {total - known} pendientes
            </button>
          )}
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 text-sm font-semibold bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 rounded-xl py-3 hover:border-primary-300 transition-all">
              Cerrar
            </button>
            <button onClick={reset}
              className="flex-1 text-sm font-semibold bg-primary-600 text-white rounded-xl py-3 hover:bg-primary-700 transition-all shadow-md flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Repetir
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return <div className="text-center py-8 text-surface-500">No hay preguntas disponibles.</div>;
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <button onClick={onClose}
          className="flex items-center gap-1 text-xs text-surface-400 hover:text-primary-600 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Salir
        </button>
        <div className="flex items-center gap-2 text-xs text-surface-500">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="font-semibold">{courseName}</span>
        </div>
        <span className="text-xs text-surface-400 font-mono">
          {currentIdx + 1}/{total}
        </span>
      </div>

      <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
          style={{ width: `${(progress / total) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={card.id}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm p-5 md:p-7">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {card.examCode && (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-500">
                {card.examCode}
              </span>
            )}
            {card.marks > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                {card.marks} pts
              </span>
            )}
            {cardParts.length > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {cardParts.map(p => p.toUpperCase()).join(', ')}
              </span>
            )}
            {card.subtopic && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-500 max-w-[200px] truncate">
                {card.subtopic}
              </span>
            )}
          </div>

          <MathContent html={formatQuestionHtml(card.questionHtml)} className="prose prose-sm dark:prose-invert max-w-none mb-6 text-surface-900 dark:text-white question-content" />

          {!showAnswer && (
            <button onClick={() => setShowAnswer(true)}
              className="w-full bg-gradient-to-br from-primary-600 to-accent-500 text-white font-bold text-sm py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Mostrar respuesta
            </button>
          )}

          {showAnswer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mb-4">
                <p className="text-xs font-bold text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider">Markscheme</p>
                <MathContent html={formatMarkschemeHtml(card.markschemeHtml)} className="prose prose-sm dark:prose-invert max-w-none text-surface-800 dark:text-surface-200 markscheme-content" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => mark(false)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-white dark:bg-surface-900 border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <XCircle className="w-4 h-4" /> No lo sabía
                </button>
                <button onClick={() => mark(true)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl py-3 hover:bg-emerald-700 transition-all shadow-md">
                  <CheckCircle2 className="w-4 h-4" /> Lo sabía
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-1 pt-1">
        {shuffled.slice(0, Math.min(total, 30)).map((c, i) => (
          <div key={c.id} className={`w-2 h-2 rounded-full transition-all ${
            i === currentIdx ? 'w-4 bg-primary-600' :
            stats[c.id] === 'knew' ? 'bg-emerald-400' :
            stats[c.id] === 'didnt' ? 'bg-red-400' :
            i < currentIdx ? 'bg-surface-300 dark:bg-surface-600' :
            'bg-surface-200 dark:bg-surface-700'
          }`} />
        ))}
        {total > 30 && <span className="text-[10px] text-surface-400 ml-1">+{total - 30}</span>}
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] text-surface-400">
        <span><kbd className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded">Espacio</kbd> revelar</span>
        <span><kbd className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded">1</kbd> sabía</span>
        <span><kbd className="px-1 py-0.5 bg-surface-100 dark:bg-surface-800 rounded">2</kbd> no sabía</span>
      </div>
    </div>
  );
}

function extractPartsFromHtml(html: string): string[] {
  const parts: string[] = [];
  const re = /<div class='question_part_label'>\s*([a-zA-Z])\.?\s*<\/div>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const label = m[1].toLowerCase();
    if (!parts.includes(label)) parts.push(label);
  }
  return parts;
}

function formatQuestionHtml(html: string): string {
  let cleaned = html.replace(/<div class='question_part_label'>.*?<\/div>/gs, '');
  cleaned = cleaned.replace(/<div class='marks'>.*?<\/div>/gs, '');
  cleaned = cleaned.replace(/style="[^"]*"/gi, '');
  return cleaned;
}

function formatMarkschemeHtml(html: string): string {
  let cleaned = html.replace(/<div class='question_part_label'>.*?<\/div>/gs, '');
  cleaned = cleaned.replace(/style="[^"]*"/gi, '');
  cleaned = cleaned.replace(/<strong>Note:<\/strong>/g, '<span class="text-amber-600 dark:text-amber-400 font-semibold">Note:</span>');
  return cleaned;
}
