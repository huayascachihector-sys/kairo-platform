import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lightbulb, ChevronRight } from 'lucide-react';
import DialogueBubble from './DialogueBubble';
import type { DialogueLine } from './DialogueBubble';

interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
}

interface GrammarFocus {
  pattern: string;
  explanation: string;
  example: string;
}

interface StoryConfig {
  title: string;
  context: string;
  dialogue: DialogueLine[];
  vocabulary: VocabularyItem[];
  grammarFocus: GrammarFocus[];
}

interface StoryViewProps {
  config: StoryConfig;
  onComplete: () => void;
}

export default function StoryView({ config, onComplete }: StoryViewProps) {
  const [showVocab, setShowVocab] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [stage, setStage] = useState<'story' | 'vocab' | 'grammar'>('story');

  const allWords = config.vocabulary.map((v) => v.word);

  const handleWordClick = (word: string) => {
    setSelectedWord(selectedWord === word ? null : word);
  };

  const handleContinue = () => {
    if (stage === 'story') {
      setStage('vocab');
      setShowVocab(true);
    } else if (stage === 'vocab') {
      setStage('grammar');
      setShowVocab(false);
      setShowGrammar(true);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen size={20} className="text-rose-400" />
          <div>
            <h3 className="text-lg font-bold text-white">{config.title}</h3>
            <p className="text-xs text-surface-400">{config.context}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {stage === 'story' && (
            <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogueBubble lines={config.dialogue} />

              <div className="flex items-center gap-2 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <Lightbulb size={14} className="text-amber-400 shrink-0" />
                <p className="text-xs text-amber-300/80">
                  Presta atención a las palabras marcadas. Las veremos en detalle a continuación.
                </p>
              </div>
            </motion.div>
          )}

          {stage === 'vocab' && (
            <motion.div key="vocab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-rose-400" />
                Vocabulario en contexto
              </h4>
              <div className="space-y-2">
                {config.vocabulary.map((v, i) => (
                  <motion.div
                    key={v.word}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedWord === v.word
                        ? 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-white/5 border-white/10 hover:border-rose-500/20'
                    }`}
                    onClick={() => handleWordClick(v.word)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-rose-300">{v.word}</span>
                      <ChevronRight size={14} className={`text-surface-500 transition-transform ${selectedWord === v.word ? 'rotate-90' : ''}`} />
                    </div>
                    <AnimatePresence>
                      {selectedWord === v.word && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-1 overflow-hidden"
                        >
                          <p className="text-xs text-surface-300">{v.definition}</p>
                          <p className="text-xs text-surface-500 italic">"{v.example}"</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'grammar' && (
            <motion.div key="grammar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-amber-400" />
                Gramática en contexto
              </h4>
              <div className="space-y-3">
                {config.grammarFocus.map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4"
                  >
                    <div className="bg-amber-500/10 rounded-lg px-3 py-1.5 inline-block mb-2">
                      <span className="text-sm font-mono text-amber-300">{g.pattern}</span>
                    </div>
                    <p className="text-xs text-surface-300 mb-2">{g.explanation}</p>
                    <p className="text-xs text-surface-400 italic">"{g.example}"</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl font-semibold text-sm transition-all"
      >
        {stage === 'story' ? 'Ver vocabulario →' : stage === 'vocab' ? 'Ver gramática →' : 'Ir a los ejercicios →'}
      </button>
    </div>
  );
}
