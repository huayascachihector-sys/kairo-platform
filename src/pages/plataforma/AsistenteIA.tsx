import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, BookOpen, RefreshCw, X, AlertCircle, Paperclip, FileText, File, Loader2, Library, Volume2, VolumeX, Mic, Square } from 'lucide-react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, saveChatMessage, loadState, Document as AppDocument } from '../../lib/store';
import { getAIResponse, FileAttachment, getSessionMemory } from '../../lib/aiEngine';
import { parseDocument } from '../../lib/documentParser';
import { speak, cleanText, toBcp47, SpeechRecognitionController, isSpeechSynthesisSupported } from '../../lib/speech';
import DocumentSelector from '../../components/DocumentSelector';

const SUGGESTED = [
  '¿Cómo resuelvo ecuaciones lineales?',
  'Explícame la 2ª Ley de Newton',
  '¿Qué es la mole en química?',
  'How do I use Present Perfect?',
  '¿Cuándo fue la Independencia del Perú?',
  'Tipos de texto en comunicación',
];

const MAX_FILES = 5;

function makeMsg(role: 'user' | 'ai', text: string): ChatMessage {
  return { id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), role, text, timestamp: new Date().toISOString() };
}

function getDocActionLabel(action: string): string {
  switch (action) {
    case 'summarize': return '📝 Resumir este documento';
    case 'explain': return '🔍 Explicar conceptos clave';
    case 'questions': return '❓ Preguntas sobre el documento';
    default: return '';
  }
}

function getDocActionPrompt(action: string): string {
  switch (action) {
    case 'summarize': return 'Haz un resumen completo de este documento. Incluye los puntos principales, la estructura y las conclusiones clave. Usa un lenguaje claro y organiza la información con viñetas.';
    case 'explain': return 'Explica los conceptos más importantes de este documento de forma didáctica. Si hay términos técnicos, defínelos. Adapta la explicación para un estudiante de secundaria.';
    case 'questions': return 'Genera 5 preguntas de comprensión basadas en el contenido de este documento, con sus respuestas. Las preguntas deben cubrir los puntos más importantes.';
    default: return '';
  }
}

export default function AsistenteIA() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadState().chatHistory);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsingFiles, setParsingFiles] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const [showDocSelector, setShowDocSelector] = useState(false);
  const [sendingDocAction, setSendingDocAction] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recRef = useRef<SpeechRecognitionController | null>(null);
  const voiceEnabledRef = useRef(false);
  const voiceLangRef = useRef<'es' | 'en'>('es');
  const voiceRateRef = useRef(1);

  useEffect(() => {
    const s = loadState().settings;
    voiceEnabledRef.current = s.voiceEnabled;
    voiceLangRef.current = s.voiceLang;
    voiceRateRef.current = s.voiceRate;
  }, []);

  useEffect(() => {
    const stopVoice = () => { if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel(); };
    const stopRec = () => recRef.current?.dispose();
    return () => { stopRec(); stopVoice(); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (attachedFiles.length + files.length > MAX_FILES) {
      setError(`Máximo ${MAX_FILES} archivos a la vez.`);
      e.target.value = '';
      return;
    }
    setParsingFiles(true);
    setError(null);
    const newAttachments: FileAttachment[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        setError('Las imágenes no son compatibles. Solo se aceptan documentos (PDF, TXT, DOC, DOCX, MD).');
        continue;
      }
      const parsed = await parseDocument(file);
      if (parsed.error) {
        setError(parsed.error);
        continue;
      }
      newAttachments.push(parsed);
    }
    setAttachedFiles(prev => [...prev, ...newAttachments]);
    setParsingFiles(false);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocAction = async (action: string) => {
    if (attachedFiles.length === 0 || sendingDocAction) return;
    setSendingDocAction(action);
    const prompt = getDocActionPrompt(action);
    await send(prompt, attachedFiles);
    setSendingDocAction(null);
  };

  const handleDocFromLibrary = (doc: AppDocument) => {
    const attachment: FileAttachment = {
      name: doc.title,
      type: 'text/markdown',
      data: doc.content,
      wordCount: doc.content.split(/\s+/).filter(Boolean).length,
    };
    setAttachedFiles(prev => [...prev, attachment]);
    setShowDocSelector(false);
  };

  const send = useCallback(async (text: string, files?: FileAttachment[]) => {
    const filesToSend = files ?? attachedFiles;
    if (!text.trim() && filesToSend.length === 0) return;
    if (typing) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fileSummary = filesToSend.map(f => `📎 ${f.name}`).join(', ');
    const userText = text || (filesToSend.length > 0 ? 'Analiza el archivo adjunto.' : '');
    const displayText = filesToSend.length > 0 && text ? `${text}\n\n${fileSummary}` : text || fileSummary;

    const userMsg = makeMsg('user', displayText);
    setMessages(prev => [...prev, userMsg]);
    saveChatMessage(userMsg);
    setInput('');
    setTyping(true);
    setError(null);

    if (!files) {
      setAttachedFiles([]);
    }

    const geminiHistory = messages
      .slice(1)
      .slice(-20)
      .map((m) => ({ role: m.role === 'user' ? 'user' as const : 'model' as const, text: m.text }));

    const sessionCtx = getSessionMemory(loadState());
    const sessionContext = sessionCtx ? sessionCtx.topics.join(", ") : undefined;

    try {
      const response = await getAIResponse(userText, geminiHistory, filesToSend, sessionContext);
      if (controller.signal.aborted) return;
      const aiMsg = makeMsg('ai', response);
      setMessages(prev => [...prev, aiMsg]);
      saveChatMessage(aiMsg);
      if (voiceEnabledRef.current) {
        speak(response, {
          lang: toBcp47(voiceLangRef.current),
          rate: voiceRateRef.current,
          onstart: () => setSpeakingId(aiMsg.id),
          onend: () => setSpeakingId(null),
          onerror: () => setSpeakingId(null),
        });
      }
    } catch {
      if (controller.signal.aborted) return;
      setError('No se pudo conectar con el asistente. Verifica tu conexión o usa la respuesta automática.');
    } finally {
      if (!controller.signal.aborted) {
        setTyping(false);
        abortRef.current = null;
      }
    }
  }, [messages, typing, attachedFiles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const clearChat = () => {
    const initial = makeMsg('ai', '¡Chat reiniciado! ¿En qué tema puedo ayudarte hoy? Matemáticas, Física, Química, Historia, Comunicación o Inglés.');
    setMessages([initial]);
    saveChatMessage(initial);
    setAttachedFiles([]);
    setError(null);
    if (speakingId) { window.speechSynthesis.cancel(); setSpeakingId(null); }
    setListening(false);
    recRef.current?.dispose();
  };

  const toggleSpeak = (id: string, text: string, lang?: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cancel = speak(text, {
      lang: lang ?? toBcp47(voiceLangRef.current),
      rate: voiceRateRef.current,
      onstart: () => setSpeakingId(id),
      onend: () => setSpeakingId(null),
      onerror: () => setSpeakingId(null),
    });
    if (!cancel) setSpeakingId(null);
  };

  const startListening = () => {
    if (recRef.current?.isListening) { stopListening(); return; }
    const ctrl = new SpeechRecognitionController('es-ES', {
      onFinal: (t) => send(t.trim()),
      onInterim: (t) => setInterim(t),
      onEnd: () => setListening(false),
      onError: (msg) => {
        setListening(false);
        if (msg !== 'aborted' && !msg.includes('no-speech')) {
          setError('No se pudo escuchar. Revisa el permiso del micrófono.');
        }
      },
    });
    if (!ctrl.isSupported) {
      setError('Tu navegador no soporta dictado por voz. Intenta con Chrome o Edge.');
      return;
    }
    recRef.current = ctrl;
    ctrl.start();
    setListening(true);
    setInterim('');
    setError(null);
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  };

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
  };

  function fileIcon(name: string): React.ReactElement {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <File className="w-3.5 h-3.5 text-red-500" />;
    return <FileText className="w-3.5 h-3.5 text-primary-500" />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            Asistente IA
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Te ayuda con Matemáticas, Física, Química, Historia, Comunicación, Biología, Computación e Inglés
          </p>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-3 h-3" /> {error}
            </span>
          )}
          <button onClick={clearChat}
            className="p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 transition-colors"
            title="Limpiar chat">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {attachedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2 flex-shrink-0">
          {attachedFiles.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full border border-primary-200 dark:border-primary-800">
              {fileIcon(f.name)}
              {f.name}
              {f.pageCount != null && <span className="opacity-60 ml-0.5">({f.pageCount} pág.)</span>}
              {f.wordCount != null && <span className="opacity-60 ml-0.5">({f.wordCount} palabras)</span>}
              <button onClick={() => removeFile(i)} className="ml-1 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}

      {attachedFiles.length > 0 && !typing && (
        <div className="mb-3 flex flex-wrap gap-2 flex-shrink-0">
          {(['summarize', 'explain', 'questions'] as const).map(action => (
            <button key={action}
              onClick={() => handleDocAction(action)}
              disabled={sendingDocAction !== null}
              className="text-xs bg-white dark:bg-surface-900 border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full transition-all font-medium disabled:opacity-50">
              {sendingDocAction === action ? (
                <span className="flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Procesando...</span>
              ) : getDocActionLabel(action)}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm prose-p:text-white prose-strong:text-white prose-code:text-white/90'
                  : 'bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-sm text-surface-800 dark:text-surface-200 rounded-bl-sm'
              }`}>
                {msg.role === 'ai' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
                {msg.role === 'ai' && (
                  <button
                    onClick={() => toggleSpeak(msg.id, msg.text)}
                    className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                      speakingId === msg.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 ring-1 ring-primary-200 dark:ring-primary-800'
                        : 'bg-surface-100 dark:bg-surface-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                    title={speakingId === msg.id ? 'Detener' : 'Leer en voz alta'}
                  >
                    {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    {speakingId === msg.id ? 'Detener' : 'Leer'}
                  </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
                  <BookOpen className="w-4 h-4 text-surface-600 dark:text-surface-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mr-2 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.div key={i} className="w-2 h-2 bg-primary-400 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 2 && !typing && !error && (
        <div className="mb-4 flex-shrink-0">
          <p className="text-xs text-surface-400 dark:text-surface-500 mb-2 font-medium">Prueba preguntando:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="text-xs bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-surface-600 dark:text-surface-300 hover:text-primary-700 dark:hover:text-primary-300 px-3 py-1.5 rounded-full transition-all">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3 flex-shrink-0">
        {listening && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface-900/95 dark:bg-surface-900 text-white rounded-2xl px-4 py-3 shadow-xl ring-1 ring-red-400/40">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-red-500" />
            <div className="text-sm">
              <p className="font-semibold flex items-center gap-2"><Mic className="w-4 h-4" /> Te escucho...</p>
              <p className="text-xs text-white/70">{interim || 'Empieza a hablar; tu frase se enviará sola.'}</p>
            </div>
            <button onClick={stopListening} className="ml-2 p-2 rounded-lg hover:bg-white/10 text-white" title="Detener">
              <Square className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta o adjunta un archivo..."
            disabled={typing}
            className="w-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl px-5 py-3.5 pr-32 text-sm text-surface-900 dark:text-white placeholder-surface-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all disabled:opacity-60"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt,.doc,.docx,.md,.csv,.json,.xml,.html,.css,.js,.ts"
              onChange={handleFileSelect}
              className="hidden"
              disabled={typing || parsingFiles}
            />
            <button
              type="button"
              onClick={startListening}
              disabled={typing || parsingFiles}
              className={`p-2 rounded-xl transition-colors hover:bg-surface-100 dark:hover:bg-surface-800 ${
                listening ? 'text-red-600 bg-red-50' : 'text-surface-400 dark:text-surface-500 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
              title={listening ? 'Detener dictado' : 'Hablar con la IA (dictado por voz)'}>
              {listening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setShowDocSelector(true)}
              disabled={typing || parsingFiles}
              className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 dark:text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title="Abrir desde Mis Documentos">
              <Library className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={typing || parsingFiles}
              className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 dark:text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title="Adjuntar archivo">
              {parsingFiles ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
            </button>
            <button type="submit" disabled={(!input.trim() && attachedFiles.length === 0) || typing}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      <DocumentSelector
        open={showDocSelector}
        onClose={() => setShowDocSelector(false)}
        onSelect={handleDocFromLibrary}
      />
    </div>
  );
}
