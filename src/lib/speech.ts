// ─── KAIRO Speech Engine — TTS + Speech Recognition ────────────────────────
// Uses native Web Speech API. Works in Chrome/Edge (Safari needs webkit prefix).

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function detectLang(text: string): string {
  // Heuristic: if the text has many latin-accent chars => spanish; else english.
  const accents = (text.match(/[áéíóúñü¿¡]/g) || []).length;
  const words = text.split(/\s+/).filter(Boolean).length;
  return accents / (words || 1) > 0.03 ? "es-ES" : "en-US";
}

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition)
  );
}

// Convert markdown/basic HTML to plain speakable text.
export function cleanText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " código. ") // code blocks -> label
    .replace(/`([^`]*)`/g, " $1 ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, " $1 ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, " · ")
    .replace(/^\s*\d+[.)]\s+/gm, " ")
    .replace(/\|/g, " ")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  onstart?: () => void;
  onend?: () => void;
  onerror?: () => void;
}

// Returns a cancel function.
export function speak(text: string, options: SpeakOptions = {}): () => void {
  const cancel = () => {
    if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
  };

  const synth = window?.speechSynthesis;
  if (!synth || !text) return cancel;

  cancel();
  const clean = cleanText(text);
  if (!clean) return cancel;

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = options.lang ?? detectLang(clean);
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;

  const voices = synth.getVoices();
  const bestVoice =
    voices.find((v) =>
      v.lang.replace("_", "-").toLowerCase().startsWith(utterance.lang.toLowerCase()),
    ) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("es")) ||
    voices[0];
  if (bestVoice) utterance.voice = bestVoice;

  utterance.onstart = () => options.onstart?.();
  utterance.onend = () => options.onend?.();
  utterance.onerror = () => options.onerror?.();

  synth.speak(utterance);
  return cancel;
}

function detectEsVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const es = voices.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith("es"));
  const order = ["pe", "la", "mx", "ar", "co", "cl", "es", "us"];
  es.sort((a, b) => {
    const ai = order.indexOf(a.lang.slice(3, 5).toLowerCase());
    const bi = order.indexOf(b.lang.slice(3, 5).toLowerCase());
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  return es;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return [];
  return window.speechSynthesis.getVoices();
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window?.speechSynthesis;
  if (!synth) return Promise.resolve([]);
  return new Promise((resolve) => {
    const voices = synth.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    synth.addEventListener("voiceschanged", () => resolve(synth.getVoices()), { once: true });
    setTimeout(() => resolve(synth.getVoices()), 1000);
  });
}

// ─── Voice language map ─────────────────────────────────────────────────────
export function toBcp47(lang: string): string {
  switch (lang) {
    case "en":
      return "en-US";
    case "qu":
      return "es-ES";
    default:
      return "es-ES";
  }
}

// ─── Speech recognition hook ────────────────────────────────────────────────

interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: any) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: any) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function createRecognition(lang: string): RecognitionLike | null {
  if (!isSpeechRecognitionSupported()) return null;
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = lang;
  rec.continuous = true;
  rec.interimResults = true;
  return rec as RecognitionLike;
}

export interface RecognitionHandlers {
  onFinal: (transcript: string) => void;
  onInterim?: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export class SpeechRecognitionController {
  private rec: RecognitionLike | null = null;
  private started = false;
  private handlers: RecognitionHandlers;

  constructor(lang: string, handlers: RecognitionHandlers) {
    this.handlers = handlers;
    const recognition = createRecognition(lang);
    this.rec = recognition;
    if (!recognition) return;

    recognition.onresult = (e: any) => {
      let final = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      if (final) this.handlers.onFinal(final);
      if (interim) this.handlers.onInterim?.(interim);
    };
    recognition.onend = () => {
      const running = this.started;
      this.started = false;
      // Continuous mode sometimes ends; restart silently unless explicitly stopped.
      if (running) {
        try {
          recognition.start();
        } catch {}
      }
      this.handlers.onEnd?.();
    };
    recognition.onerror = (e: any) => {
      this.started = false;
      this.handlers.onError?.(e?.error || "reconocimiento no disponible");
    };
  }

  get isSupported() {
    return !!this.rec;
  }

  get isListening() {
    return this.started;
  }

  start() {
    if (!this.rec) return;
    if (this.started) return;
    try {
      this.rec.start();
      this.started = true;
    } catch {
      /* already started */
    }
  }

  stop() {
    this.started = false;
    if (this.rec) {
      try {
        this.rec.stop();
      } catch {
        /* noop */
      }
    }
  }

  abort() {
    this.started = false;
    if (this.rec) {
      try {
        this.rec.abort();
      } catch {
        /* noop */
      }
    }
  }

  dispose() {
    this.abort();
    this.rec = null;
  }
}
