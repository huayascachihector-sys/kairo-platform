import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Brain, HardDrive, Globe, Loader2, Timer as TimerIcon, GraduationCap, School } from 'lucide-react';
import { BANK as FALLBACK_BANK, type SubjectBank, type Question } from '../../data/questionBank';
import {
  loadState, recordQuestionAnswer, getSubjectProgress,
  addImportedBank, removeImportedBank,
  addIbBank, removeIbBank, getIbBanksByCourse,
  type ImportedQuestionBank, type ImportedQuestion
} from '../../lib/store';
import { extractZip, groupByFolder, mergeGroupText } from '../../lib/zipImporter';
import { extractQuestionsFromText, extractIbQuestionsFromText } from '../../lib/questionExtractor';
import { IB_COURSES, detectCourse, type IbCourseDef } from '../../data/ibCourses';
import type { ParsedIbQuestion } from '../../lib/htmlQuestionParser';
import IbFlashcardDeck from '../../components/IbFlashcardDeck';
import { buildCardId, updateCardData, getDueCards, getDueCount, getStats as getSRSStats, parseCardId, type SRSAction } from '../../lib/srsEngine';
import { recordDailyEntry } from '../../lib/progressTracker';
import BancoQuiz from '../../components/plataforma/BancoQuiz';
import BancoBrowser from '../../components/plataforma/BancoBrowser';
import ReviewPanel from '../../components/plataforma/ReviewPanel';
import BancoImportados from '../../components/plataforma/BancoImportados';
import BancoIB from '../../components/plataforma/BancoIB';
import ProgressCharts from '../../components/plataforma/ProgressCharts';
import SimulacroModal from '../../components/plataforma/SimulacroModal';

const ibQuestionCache = new Map<string, ParsedIbQuestion[]>();

type Level = 'primaria' | 'secundaria';
type Tab = 'banco' | 'repaso' | 'importados' | 'ib' | 'progreso';

const LEVELS_CONFIG: { key: Level; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'primaria', label: 'Primaria', icon: <School className="w-4 h-4" />, color: 'from-emerald-500 to-teal-600' },
  { key: 'secundaria', label: 'Secundaria', icon: <GraduationCap className="w-4 h-4" />, color: 'from-primary-500 to-accent-600' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDifficulty(q: Question, _level: Level, index: number): string {
  if (_level === 'primaria') return index < 4 ? 'facil' : index < 7 ? 'medio' : 'dificil';
  return index < 3 ? 'medio' : 'dificil';
}

export default function BancoPreguntas() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState<Tab>('banco');
  const [level, setLevel] = useState<Level>('primaria');
  const [diffFilter, setDiffFilter] = useState<'facil' | 'medio' | 'dificil' | null>(null);
  const [subject, setSubject] = useState<string>('matematicas');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timerMode, setTimerMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [importedBank, setImportedBank] = useState<ImportedQuestionBank | null>(null);
  const [importedQuestions, setImportedQuestions] = useState<ImportedQuestion[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [importError, setImportError] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ibSelectedCourse, setIbSelectedCourse] = useState<IbCourseDef | null>(null);
  const [ibQuizQuestions, setIbQuizQuestions] = useState<ImportedQuestion[]>([]);
  const [ibProcessing, setIbProcessing] = useState(false);
  const [ibProcessingStatus, setIbProcessingStatus] = useState('');
  const [ibProgress, setIbProgress] = useState({ current: 0, total: 0, currentFolder: '' });
  const [ibDetected, setIbDetected] = useState<{ folderName: string; course: IbCourseDef; count: number }[]>([]);
  const [ibImportStage, setIbImportStage] = useState<'idle' | 'scanning' | 'confirm' | 'extracting' | 'done'>('idle');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardQuestions, setFlashcardQuestions] = useState<ParsedIbQuestion[]>([]);
  const [flashcardCourse, setFlashcardCourse] = useState('');
  const [ibCoursesList, setIbCoursesList] = useState<{ slug: string; name: string; edition: string; count: number }[]>([]);
  const [ibLoading, setIbLoading] = useState(true);
  const [ibFlashcardLoading, setIbFlashcardLoading] = useState(false);
  const loadIbAbortRef = useRef(false);
  const [srsVersion, setSrsVersion] = useState(0);
  const dueCount = getDueCount();
  const [simulacroOpen, setSimulacroOpen] = useState(false);

  const [jsonBank, setJsonBank] = useState<SubjectBank[]>([]);
  const [bankLoading, setBankLoading] = useState(true);
  const [loadedSubjects, setLoadedSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data/question-bank/courses.json');
        const courses = await res.json();
        const stubs: SubjectBank[] = courses.map((c: any) => ({
          id: c.id, label: c.label, icon: c.icon, color: c.color,
          primaria: [] as Question[], secundaria: [] as Question[],
        }));
        setJsonBank(stubs);
      } catch { setJsonBank([]); }
      finally { setBankLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!subject || loadedSubjects.has(subject) || jsonBank.length === 0) return;
    (async () => {
      try {
        const res = await fetch(`/data/question-bank/${subject}/data.json`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setJsonBank(prev => prev.map(b =>
          b.id === subject ? { ...b, primaria: data.primaria || [], secundaria: data.secundaria || [] } : b
        ));
      } catch {
        const fallback = FALLBACK_BANK.find(b => b.id === subject);
        if (fallback) setJsonBank(prev => prev.map(b => b.id === subject ? fallback : b));
      } finally { setLoadedSubjects(prev => new Set(prev).add(subject)); }
    })();
  }, [subject, loadedSubjects, jsonBank.length]);

  const bank = bankLoading
    ? FALLBACK_BANK.find(b => b.id === subject)!
    : (jsonBank.find(b => b.id === subject) ?? FALLBACK_BANK.find(b => b.id === subject)!);
  const questions = bank[level].filter(q => !diffFilter || getDifficulty(q, level, bank[level].indexOf(q)) === diffFilter);
  const shuffled = useRef<Question[]>([]);
  const shuffledImported = useRef<ImportedQuestion[]>([]);
  const shuffledIb = useRef<ImportedQuestion[]>([]);
  const originalIndicesRef = useRef<number[]>([]);
  const subjProgress = getSubjectProgress(state, subject);

  useEffect(() => {
    fetch('/data/ib-questions/courses.json')
      .then(r => r.json())
      .then(data => setIbCoursesList(data.courses || []))
      .catch(() => setIbCoursesList([]))
      .finally(() => setIbLoading(false));
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (timerMode && quizStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [timerMode, quizStarted, timeLeft]);

  const startQuiz = (useTimer?: boolean) => {
    const qs = importedBank ? [...importedBank.questions] : [...questions];
    const indexed = qs.map((q, i) => ({ q, originalIdx: i }));
    const shuffledIndexed = shuffle(indexed);
    shuffled.current = shuffledIndexed.map(x => x.q);
    originalIndicesRef.current = shuffledIndexed.map(x => x.originalIdx);
    shuffledImported.current = importedBank ? shuffle(importedBank.questions) : [];
    setQuizStarted(true);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
    setShowResults(false);
    setTimerMode(!!useTimer);
    if (useTimer) setTimeLeft(questions.length * 60);
  };

  const startIbQuiz = (qns: ImportedQuestion[]) => {
    shuffledIb.current = shuffle(qns);
    setIbQuizQuestions(qns);
    setQuizStarted(true);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
    setShowResults(false);
    setTimerMode(false);
  };

  const startFlashcardMode = (qns: ParsedIbQuestion[], courseName: string) => {
    setFlashcardQuestions(qns);
    setFlashcardCourse(courseName);
    setFlashcardMode(true);
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    let qs: any[];
    if (ibQuizQuestions.length > 0) qs = shuffledIb.current;
    else if (importedBank) qs = shuffledImported.current;
    else qs = shuffled.current;
    const q = qs[currentQ] as any;
    const newAnswers = [...answers, selectedAnswer!];
    setAnswers(newAnswers);
    const wasCorrect = selectedAnswer === q.correct;

    if (ibQuizQuestions.length > 0) recordQuestionAnswer(`ib_${currentQ}`, wasCorrect);
    else if (importedBank) recordQuestionAnswer(`imported_${importedBank.id}_${currentQ}`, wasCorrect);
    else recordQuestionAnswer(`${subject}_${level}_${currentQ}`, wasCorrect);

    if (currentQ < qs.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const correctCount = newAnswers.filter((a, i) => a === qs[i].correct).length;
      setScore(Math.round((correctCount / qs.length) * 100));
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      recordDailyEntry({
        questionsAnswered: qs.length,
        correct: correctCount,
        minutesStudied: timerMode ? Math.ceil((questions.length * 60 - timeLeft) / 60) : Math.ceil(qs.length / 2),
        subjects: { [subject]: { correct: correctCount, total: qs.length } },
      });
    }
    setState(loadState());
  };

  const handleSRSRating = (action: SRSAction) => {
    let qs: any[];
    if (ibQuizQuestions.length > 0) qs = shuffledIb.current;
    else if (importedBank) qs = shuffledImported.current;
    else qs = shuffled.current;
    const q = qs[currentQ] as any;
    let cardId: string;
    if (ibQuizQuestions.length > 0 && q.id) cardId = buildCardId('ib', q.courseId || 'unknown', q.id);
    else if (importedBank) cardId = buildCardId('imported', importedBank.id, String(currentQ));
    else {
      const originalIdx = originalIndicesRef.current[currentQ];
      cardId = buildCardId('bank', subject, level, String(originalIdx));
    }
    updateCardData(cardId, action);
    setSrsVersion(v => v + 1);
    handleNext();
  };

  const reset = () => {
    setQuizStarted(false);
    setFinished(false);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
    setShowResults(false);
    setTimerMode(false);
    setTimeLeft(0);
    setIbQuizQuestions([]);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (quizStarted && !finished && selectedAnswer === null) {
      const keyIdx = ['1', '2', '3', '4'].indexOf(e.key);
      if (keyIdx >= 0) handleAnswer(keyIdx);
    }
  }, [quizStarted, finished, selectedAnswer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const processZip = async (file: File) => {
    setProcessing(true);
    setImportError('');
    setProcessingStatus('Leyendo archivo .zip...');
    try {
      const { entries, skipped } = await extractZip(file);
      if (entries.length === 0) {
        setImportError('No se encontraron archivos de texto o PDF en el .zip.');
        setProcessing(false); return;
      }
      setProcessingStatus(`Procesando ${entries.length} archivos (${skipped.length} omitidos)...`);
      const merged = entries.map(e => `--- ${e.filename} ---\n${e.text}`).join('\n\n');
      setProcessingStatus('Extrayendo preguntas con IA...');
      const result = await extractQuestionsFromText(merged, file.name);
      if (!result.success || !result.bank) {
        setImportError(result.error || 'Error desconocido al extraer preguntas.');
        setProcessing(false); return;
      }
      const newState = addImportedBank(result.bank);
      setState(newState);
      setProcessing(false);
      setProcessingStatus('');
      const bankFromState = newState.importedBanks[0];
      if (bankFromState) { setImportedBank(bankFromState); setImportedQuestions(bankFromState.questions); startQuiz(); }
    } catch (err) {
      console.error('[processZip]', err);
      setImportError('Error al procesar el archivo .zip. Verifica que sea un archivo válido.');
      setProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processZip(file);
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      if (tab === 'ib') processIbZip(file);
      else processZip(file);
    } else { setImportError('Solo se aceptan archivos .zip.'); }
  };

  const processIbZip = async (file: File) => {
    ibZipFileRef.current = file;
    setIbProcessing(true);
    setIbImportStage('scanning');
    setIbProcessingStatus('Escaneando estructura del archivo...');
    try {
      const { entries } = await extractZip(file);
      const { groups, ungrouped } = groupByFolder(entries);
      const allGroups = groups.filter(g => g.entries.length > 0);
      if (allGroups.length === 0 && ungrouped.length > 0) {
        allGroups.push({ folderName: 'root', entries: ungrouped, totalChars: ungrouped.reduce((s, e) => s + e.text.length, 0) });
      }
      if (allGroups.length === 0) {
        setImportError('No se encontraron archivos procesables en el .zip.');
        setIbProcessing(false); setIbImportStage('idle'); return;
      }
      const detected = allGroups.map(g => ({ folderName: g.folderName, course: detectCourse(g.folderName), count: g.entries.length }));
      setIbDetected(detected);
      setIbImportStage('confirm');
      setIbProcessing(false);
    } catch (err) {
      console.error('[processIbZip]', err);
      setImportError('Error al procesar el archivo .zip.');
      setIbProcessing(false); setIbImportStage('idle');
    }
  };

  const confirmAndExtract = async () => {
    setIbProcessing(true);
    setIbImportStage('extracting');
    setIbProgress({ current: 0, total: ibDetected.length, currentFolder: '' });
    const fileToProcess = ibZipFileRef.current;
    if (!fileToProcess) {
      setImportError('No se encontró el archivo .zip. Vuelve a seleccionarlo.');
      setIbProcessing(false); setIbImportStage('idle'); return;
    }
    const { entries } = await extractZip(fileToProcess);
    const { groups } = groupByFolder(entries);
    const allGroups = groups.filter(g => g.entries.length > 0);
    if (allGroups.length === 0 && ibDetected.some(d => d.folderName === 'root')) {
      allGroups.push({ folderName: 'root', entries: [], totalChars: 0 });
    }
    let processed = 0;
    for (const group of allGroups) {
      const detected = ibDetected.find(d => d.folderName === group.folderName);
      if (!detected) continue;
      setIbProgress({ current: processed, total: ibDetected.length, currentFolder: group.folderName });
      setIbProcessingStatus(`Extrayendo preguntas de ${detected.course.name} (${detected.count} archivos)...`);
      const mergedText = mergeGroupText(group);
      const result = await extractIbQuestionsFromText(mergedText, detected.course.id, detected.course.name, group.folderName);
      if (result.success && result.bank) {
        const newState = addIbBank(result.bank);
        setState(newState);
      }
      processed++;
    }
    setIbProcessing(false);
    setIbImportStage('done');
    setIbProcessingStatus(`Importación completada. ${processed} curso(s) procesado(s).`);
  };

  const ibZipFileRef = useRef<File | null>(null);

  const cancelIbImport = () => { setIbImportStage('idle'); setIbDetected([]); setIbProcessing(false); };

  const loadIbCourseData = async (slug: string, courseName: string) => {
    setIbFlashcardLoading(true);
    setImportError('');
    loadIbAbortRef.current = false;
    try {
      const cacheKey = `ib_${slug}`;
      const cached = ibQuestionCache.get(cacheKey);
      if (cached) { startFlashcardMode(cached, courseName); setIbFlashcardLoading(false); return; }
      const idxRes = await fetch(`/data/ib-questions/${slug}/index.json`);
      if (!idxRes.ok) throw new Error('Not found');
      const idx = await idxRes.json();
      const chunkCount: number = idx.chunkCount || 0;
      if (!chunkCount) throw new Error('No chunks');
      const mapItem = (item: any): ParsedIbQuestion => ({
        id: item.meta.id, courseId: slug, questionHtml: item.questionHtml, markschemeHtml: item.markschemeHtml,
        examCode: item.meta.examCode || '', session: '', level: '', paper: '', commandTerm: '',
        marks: item.meta.marks || 0, topic: item.meta.topic || '', subtopic: item.meta.subtopic || '',
        parts: [], syllabusIds: [],
      });
      const firstRes = await fetch(`/data/ib-questions/${slug}/data_000.json`);
      const firstChunk = await firstRes.json();
      const firstQuestions = firstChunk.map(mapItem);
      startFlashcardMode(firstQuestions, courseName);
      setIbFlashcardLoading(false);
      const allQuestions = [...firstQuestions];
      for (let i = 1; i < chunkCount; i++) {
        if (loadIbAbortRef.current) break;
        try {
          const pad = String(i).padStart(3, '0');
          const res = await fetch(`/data/ib-questions/${slug}/data_${pad}.json`);
          const chunk = await res.json();
          const qs: ParsedIbQuestion[] = chunk.map(mapItem);
          allQuestions.push(...qs);
          if (!loadIbAbortRef.current) setFlashcardQuestions([...allQuestions]);
        } catch { }
      }
      if (!loadIbAbortRef.current) ibQuestionCache.set(cacheKey, allQuestions);
    } catch (err) {
      console.error('[loadIbCourseData]', err);
      setImportError('Error al cargar las flashcards. Verifica la conexión.');
      setIbFlashcardLoading(false);
    }
  };

  const getQsForQuiz = () => {
    if (ibQuizQuestions.length > 0) return shuffledIb.current;
    if (importedBank) return shuffledImported.current;
    return shuffled.current;
  };

  const qs = getQsForQuiz();

  const handleQuizClose = () => { reset(); };
  const handleQuizRestart = () => {
    ibQuizQuestions.length > 0 ? startIbQuiz(ibQuizQuestions) : startQuiz();
  };

  if (quizStarted || finished) {
    return (
      <BancoQuiz
        qs={qs as any[]}
        currentQ={currentQ}
        selectedAnswer={selectedAnswer}
        showExplanation={showExplanation}
        score={score}
        finished={finished}
        answers={answers}
        timerMode={timerMode}
        timeLeft={timeLeft}
        timerStarted={quizStarted}
        showResults={showResults}
        srsVersion={srsVersion}
        isIb={ibQuizQuestions.length > 0}
        isImported={!!importedBank}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onSRSRate={handleSRSRating}
        onReset={reset}
        onRestart={handleQuizRestart}
        onToggleResults={() => setShowResults(v => !v)}
        onClose={handleQuizClose}
      />
    );
  }

  if (ibFlashcardLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
        <p className="text-sm text-surface-500 dark:text-surface-400">Cargando flashcards...</p>
      </div>
    );
  }

  if (flashcardMode && flashcardQuestions.length > 0) {
    return (
      <IbFlashcardDeck
        questions={flashcardQuestions}
        courseName={flashcardCourse}
        onClose={() => { loadIbAbortRef.current = true; setFlashcardMode(false); setFlashcardQuestions([]); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary-600" /> Banco de Preguntas
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              {tab === 'banco' ? 'Practica por materia, nivel y dificultad' :
               tab === 'repaso' ? 'Repaso espaciado — tarjetas que vencen hoy' :
               tab === 'importados' ? 'Bancos de preguntas importados' :
               tab === 'progreso' ? 'Tu progreso y estadísticas' :
               'Exámenes pasados IB organizados por curso'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white dark:cyber-card-dark rounded-xl border border-surface-100 p-0.5">
          {(['banco', 'repaso', 'importados', 'ib', 'progreso'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setImportedBank(null); setIbSelectedCourse(null); }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all relative ${
                tab === t
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
              }`}>
              {t === 'banco' ? <BookOpen className="w-3.5 h-3.5" /> :
               t === 'repaso' ? <Brain className="w-3.5 h-3.5" /> :
               t === 'importados' ? <HardDrive className="w-3.5 h-3.5" /> :
               t === 'progreso' ? <TimerIcon className="w-3.5 h-3.5" /> :
               <Globe className="w-3.5 h-3.5" />}
              {t === 'banco' ? 'Banco' :
               t === 'repaso' ? 'Repasar' :
               t === 'importados' ? 'Importados' :
               t === 'progreso' ? 'Progreso' : 'IB'}
              {t === 'repaso' && dueCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full min-w-[18px] px-1">
                  {dueCount > 99 ? '99+' : dueCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === 'banco' && (
        <div>
          <BancoBrowser
            level={level}
            diffFilter={diffFilter}
            subject={subject}
            bank={bank}
            questions={questions}
            jsonBank={jsonBank}
            bankLoading={bankLoading}
            onSetLevel={setLevel}
            onSetDiffFilter={setDiffFilter}
            onSetSubject={setSubject}
            onStartQuiz={(useTimer) => startQuiz(useTimer)}
            progress={subjProgress}
            getProgress={(id) => getSubjectProgress(state, id)}
          />
          <div className="flex justify-center mt-6">
            <button onClick={() => setSimulacroOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl px-6 py-3 hover:opacity-90 transition-all shadow-lg">
              <TimerIcon className="w-4 h-4" /> Simulacro completo
            </button>
          </div>
        </div>
      )}

      {tab === 'repaso' && (
        <ReviewPanel
          srsVersion={srsVersion}
          jsonBank={jsonBank}
          fallbackBank={FALLBACK_BANK}
          level={level}
          onStartReview={(qns) => {
            const indexed = qns.map((q, i) => ({ q, originalIdx: -1 }));
            const shuffledIndexed = shuffle(indexed);
            shuffled.current = shuffledIndexed.map(x => x.q);
            originalIndicesRef.current = shuffledIndexed.map(x => x.originalIdx);
            setQuizStarted(true);
            setCurrentQ(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setScore(0);
            setFinished(false);
            setAnswers([]);
            setShowResults(false);
            setTimerMode(false);
          }}
        />
      )}

      {tab === 'importados' && (
        <BancoImportados
          state={state}
          processing={processing}
          processingStatus={processingStatus}
          dragOver={dragOver}
          importError={importError}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          onStartQuiz={() => startQuiz()}
          onSetBank={(b) => { setImportedBank(b); setImportedQuestions(b.questions); }}
        />
      )}

      {tab === 'ib' && (
        <BancoIB
          ibImportStage={ibImportStage}
          ibProcessing={ibProcessing}
          ibProcessingStatus={ibProcessingStatus}
          ibDetected={ibDetected}
          ibProgress={ibProgress}
          ibImportError={importError}
          importError={importError}
          dragOver={dragOver}
          ibCoursesList={ibCoursesList}
          ibLoading={ibLoading}
          ibFlashcardLoading={ibFlashcardLoading}
          state={state}
          onDrop={handleDrop}
          onCancelImport={cancelIbImport}
          onConfirmExtract={confirmAndExtract}
          onContinue={() => { setIbImportStage('idle'); setIbDetected([]); }}
          onLoadCourse={loadIbCourseData}
          onStartIbQuiz={startIbQuiz}
          onFileSelect={(e) => {
            const file = e.target.files?.[0];
            if (file) processIbZip(file);
            if (e.target) e.target.value = '';
          }}
        />
      )}

      {tab === 'progreso' && <ProgressCharts />}

      <SimulacroModal
        open={simulacroOpen}
        banks={jsonBank.length > 0 ? jsonBank : FALLBACK_BANK}
        level={level}
        onClose={() => setSimulacroOpen(false)}
      />
    </div>
  );
}
