import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, CheckCircle2, AlertCircle, RotateCcw, ChevronRight, Wand2, AlertTriangle, PenTool, FileEdit, BookOpen } from 'lucide-react';

const ESSAY_PROMPTS = [
  {
    id: 'sat-1',
    prompt: 'Some people believe that the best way to solve a problem is to work together in a group. Others believe that working alone is more effective. Which do you agree with? Use reasons and examples to support your choice.',
    type: 'SAT Essay',
    time: '50 min',
    words: { min: 400, max: 600 },
  },
  {
    id: 'uni-peru',
    prompt: 'Escribe una composición sobre por qué elegiste la carrera que estás postulando y qué experiencias te motivaron a elegir ese camino.',
    type: 'UNI/UNMSM Admisión',
    time: '45 min',
    words: { min: 200, max: 400 },
  },
  {
    id: 'college-prompt',
    prompt: 'Describe a challenge you faced and how you overcame it. How did this experience shape who you are today?',
    type: 'Universal College Essay',
    time: '65 min',
    words: { min: 500, max: 650 },
  },
  {
    id: 'persuasive',
    prompt: 'Should schools require students to wear uniforms? Write an essay arguing for or against school uniforms with supporting evidence.',
    type: 'Argumentative Essay',
    time: '40 min',
    words: { min: 300, max: 500 },
  },
];

export default function Ensayo() {
  const [selectedPrompt, setSelectedPrompt] = useState(ESSAY_PROMPTS[0]);
  const [essay, setEssay] = useState('');
  const [feedback, setFeedback] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    const words = essay.trim().split(/\s+/).filter(Boolean).length;
    const parrafos = essay.split('\n').filter(p => p.trim()).length;
    const hasIntro = essay.toLowerCase().includes('creo') || essay.toLowerCase().includes('en mi opinión') || essay.toLowerCase().includes('según mi perspectiva');
    const hasBody = essay.length > 300;
    const hasConclusion = essay.toLowerCase().includes('en conclusión') || essay.toLowerCase().includes('para concluir') || essay.toLowerCase().includes('resumiendo');

    let score = 0;
    const comments: string[] = [];

    if (words >= selectedPrompt.words.min) { score += 25; comments.push(`✓ Extensión adecuada (${words} palabras)`); }
    else { comments.push(`✗ La extensión mínima es ${selectedPrompt.words.min} palabras. Llevas ${words}.`); }

    if (words <= selectedPrompt.words.max) { score += 25; }
    else { comments.push(`⚠️ Excedes el máximo de ${selectedPrompt.words.max} palabras.`); }

    if (hasIntro) { score += 25; comments.push('✓ Tienes una postura clara en la introducción'); }
    else comments.push('✗ Asegúrate de incluir una opinión clara al inicio.');

    if (hasBody && essay.length > 200) { score += 15; comments.push('✓ Desarrollo con argumentos'); }
    else comments.push('✗ Agrega más argumentos y ejemplos de apoyo.');

    if (hasConclusion) { score += 10; comments.push('✓ Conclusión presente'); }
    else comments.push('✗ Agrega una conclusión breve que resuma tu postura.');

    setFeedback(`**Tu ensayo ha sido evaluado**\n\n**Puntaje:** ${score}/100\n\n${comments.join('\n')}\n\n**Sugerencias:**\n- Usa conectores: "sin embargo", "además", "por otro lado"\n- Cada párrafo debe desarrollar UNA idea\n- Incluye un ejemplo concreto que respalde tu argumento\n- Revisa la ortografía antes de enviar tu ensayo real`);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary-600" /> Práctica de Ensayos
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            Escribe ensayos de admisión con feedback inmediato de IA. Incluye SAT, ensayos peruanos y universales.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-400">
          <Sparkles className="w-4 h-4 text-accent-500" /> Feedback de IA en tiempo real
        </div>
      </div>

      {/* Prompt selection */}
      <div className="grid sm:grid-cols-2 gap-4">
        {ESSAY_PROMPTS.map((p, i) => (
          <motion.button key={p.id} whileHover={{ scale: 1.01 }}
            onClick={() => { setSelectedPrompt(p); setEssay(''); setFeedback(''); setSubmitted(false); }}
            className={`text-left rounded-xl border p-4 transition-all ${
              selectedPrompt.id === p.id
                ? 'border-primary-400 ring-2 ring-primary-100'
                : 'border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600'
            }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">{p.type}</span>
              <span className="text-[11px] text-surface-400">{p.time}</span>
            </div>
            <p className="text-sm text-surface-700 dark:text-surface-200 leading-relaxed">{p.prompt}</p>
          </motion.button>
        ))}
      </div>

      {/* Editor */}
      <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-semibold text-surface-500">{selectedPrompt.type}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-surface-400">{wordCount} palabras</span>
            <span className="text-[11px] text-surface-400">
              {selectedPrompt.words.min}-{selectedPrompt.words.max} mínimo
            </span>
          </div>
        </div>
        <textarea
          value={essay}
          onChange={(e) => { setEssay(e.target.value); setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length); }}
          placeholder="Escribe tu ensayo aquí..."
          rows={18}
          className="w-full px-6 py-4 text-sm text-surface-800 dark:text-white placeholder-surface-400 outline-none resize-none bg-transparent"
        />
        <div className="flex items-center justify-between px-6 py-3 border-t border-surface-100 bg-surface-50 dark:bg-surface-800">
          <span className="text-xs text-surface-400">
            {essay.length > selectedPrompt.words.max * 6 ? <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Ensayo demasiado largo</span>
            : wordCount >= (selectedPrompt.words.min * 0.8) ? <span className="flex items-center gap-1"><PenTool className="w-3.5 h-3.5 text-emerald-500" /> Buen avance</span>
            : <span className="flex items-center gap-1"><FileEdit className="w-3.5 h-3.5 text-primary-400" /> Sigue escribiendo...</span>}
          </span>
          <button onClick={handleSubmit} disabled={essay.trim().length < 50}
            className="bg-primary-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
            <Wand2 className="w-4 h-4" /> Obtener Feedback
          </button>
        </div>
      </div>

      {/* Feedback */}
      {submitted && feedback && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-5 h-5 text-primary-500" />
            <h3 className="text-base font-bold text-surface-900 dark:text-white">Feedback de IA</h3>
          </div>
          <div className="prose prose-sm max-w-none text-surface-700 dark:text-surface-300 whitespace-pre-line">
            {feedback}
          </div>
          <button onClick={() => { setEssay(''); setFeedback(''); setSubmitted(false); setWordCount(0); }}
            className="mt-4 text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3" /> Reescribir ensayo
          </button>
        </motion.div>
      )}

      {/* Essay tips */}
      <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2"><PenTool className="w-4 h-4 text-primary-500" /> Estructura de un buen ensayo de admisión</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
            <h4 className="text-xs font-bold text-primary-700 dark:text-primary-300 mb-2">1. Introducción (20%)</h4>
            <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">Engancha al lector con una historia o cita personal. Presenta tu postura claramente.</p>
          </div>
          <div className="bg-accent-50 dark:bg-accent-900/20 rounded-xl p-4">
            <h4 className="text-xs font-bold text-accent-700 dark:text-accent-300 mb-2">2. Desarrollo (60%)</h4>
            <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">3-4 párrafos. Cada uno con UNA idea. Usa ejemplos concretos y conectores lógicos.</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-2">3. Conclusión (20%)</h4>
            <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">Resume tu postura y conecta con tu futuro. Cierra con una visión clara.</p>
          </div>
        </div>
      </div>
    </div>
  );
}