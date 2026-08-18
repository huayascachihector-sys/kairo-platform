import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clapperboard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  PlayCircle,
  Info,
  Sparkles,
  GraduationCap,
  School,
  AudioLines,
  BookOpen,
} from "lucide-react";
import {
  createVideoJob,
  getVideoStatus,
  getVideoDownloadUrl,
  VIDEO_STAGE_LABELS,
  type VideoJob,
} from "../../lib/videoGenerator";

type Phase = "idle" | "running" | "done" | "error";

export default function GeneradorVideos() {
  const [tema, setTema] = useState("");
  const [nivel, setNivel] = useState<"primaria" | "secundaria">("secundaria");
  const [estilo, setEstilo] = useState<"educativo" | "resumen" | "historia">("educativo");
  const [duracion, setDuracion] = useState(2);
  const [phase, setPhase] = useState<Phase>("idle");
  const [job, setJob] = useState<VideoJob | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const pollStatus = useCallback(
    async (jobId: string) => {
      try {
        const data = await getVideoStatus(jobId);
        setJob(data);
        if (data.status === "done") {
          stopPolling();
          setPhase("done");
        } else if (data.status === "error") {
          stopPolling();
          setPhase("error");
          setErrorMsg(data.error || "Ocurrió un error durante la generación.");
        }
      } catch {
        stopPolling();
        setPhase("error");
        setErrorMsg("Se perdió la conexión con el generador de videos.");
      }
    },
    [stopPolling],
  );

  const handleGenerate = async () => {
    const cleanTema = tema.trim();
    if (cleanTema.length < 2) return;

    setErrorMsg("");
    setJob(null);
    setPhase("running");
    try {
      const created = await createVideoJob({ tema: cleanTema, nivel, duracion, estilo });
      setJob(created);
      pollRef.current = setInterval(() => pollStatus(created.job_id), 4000);
      pollStatus(created.job_id);
    } catch (err) {
      setPhase("error");
      setErrorMsg(
        err instanceof Error ? err.message : "No se pudo iniciar la generación del video.",
      );
    }
  };

  const handleReset = () => {
    stopPolling();
    setJob(null);
    setPhase("idle");
    setErrorMsg("");
  };

  const stageLabel = job ? VIDEO_STAGE_LABELS[job.stage] || job.stage : "";
  const progress = job ? Math.max(2, Math.min(100, job.percent || 0)) : 0;
  const videoUrl = job ? getVideoDownloadUrl(job.job_id) : "";

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Clapperboard className="w-7 h-7 text-primary-600" /> Generador de Videos
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            Crea videos educativos con narración, animaciones y fórmulas en 4K. 100% gratis.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-400">
          <Sparkles className="w-4 h-4 text-accent-500" /> IA local · sin costo
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800">
          <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-primary-500" /> Nuevo video educativo
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-surface-500 mb-1.5">
              Tema del video
            </label>
            <input
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
              }}
              placeholder="Ej: Fracciones, Revolución Industrial, La célula..."
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-sm text-surface-800 dark:text-white placeholder-surface-400 outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-500 mb-1.5">Nivel</label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["primaria", "Primaria", School],
                    ["secundaria", "Secundaria", GraduationCap],
                  ] as const
                ).map(([key, label, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setNivel(key)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      nivel === key
                        ? "border-primary-400 ring-2 ring-primary-100 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                        : "border-surface-200 dark:border-surface-700 text-surface-500 hover:border-primary-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-500 mb-1.5" htmlFor="dur">
                Duración aproximada
              </label>
              <select
                id="dur"
                value={duracion}
                onChange={(e) => setDuracion(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-sm text-surface-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
              >
                {[1, 2, 3, 4, 5].map((m) => (
                  <option key={m} value={m}>
                    {m} minuto{m > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-500 mb-1.5">Estilo</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["educativo", "Educativo", Clapperboard],
                  ["resumen", "Resumen", AudioLines],
                  ["historia", "Historia", BookOpen],
                ] as const
              ).map(([key, label, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEstilo(key)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    estilo === key
                      ? "border-primary-400 ring-2 ring-primary-100 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      : "border-surface-200 dark:border-surface-700 text-surface-500 hover:border-primary-300"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={tema.trim().length < 2 || phase === "running"}
            className="w-full sm:w-auto bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            <PlayCircle className="w-4 h-4" /> Generar video
          </button>
        </div>
      </div>

      {/* Progress */}
      <AnimatePresence>
        {phase === "running" && job && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
              <div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">{stageLabel}</h3>
                <p className="text-xs text-surface-400 mt-0.5">Video: «{job.tema || tema}»</p>
              </div>
              <span className="ml-auto text-xs font-bold text-primary-600">{progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
              />
            </div>
            <p className="mt-3 text-xs text-surface-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> La generación puede tardar varios minutos. Puedes
              cerrar esta pestaña, el video se generará igualmente.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-surface-900 dark:text-white">¡Tu video está listo!</h3>
            </div>
            <video
              controls
              preload="metadata"
              src={videoUrl}
              className="w-full rounded-xl bg-black aspect-video"
            />
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <a
                href={videoUrl}
                download
                className="bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" /> Descargar MP4
              </a>
              <button
                onClick={handleReset}
                className="text-sm font-semibold text-surface-500 hover:text-surface-800 dark:hover:text-surface-200 flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Generar otro video
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {phase === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-red-200 dark:border-red-900/40 p-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-white">No se pudo generar el video</h3>
                <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">{errorMsg}</p>
                <p className="text-xs text-surface-400 mt-3">
                  Este generador funciona con un servicio local en tu computadora. Asegúrate de que
                  el archivo{" "}
                  <code className="bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">
                    start_api.bat
                  </code>{" "}
                  (carpeta agentedevideos\servicio_video) esté corriendo y deja la ventana abierta.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reintentar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary-500" /> ¿Cómo funciona?
        </h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
            <h4 className="text-xs font-bold text-primary-700 mb-2">1. Escribe el tema</h4>
            <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
              Elige cualquier tema educativo. KAIRO crea un guion con escenas narradas
              automáticamente.
            </p>
          </div>
          <div className="bg-accent-50 dark:bg-accent-900/20 rounded-xl p-4">
            <h4 className="text-xs font-bold text-accent-700 mb-2">2. Se genera localmente</h4>
            <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
              El servicio usa Edge TTS (voz en español), Pillow + LaTeX para las animaciones y
              ffmpeg para componer.
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <h4 className="text-xs font-bold text-emerald-700 mb-2">3. Descarga el MP4</h4>
            <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
              Recibe tu video en 1920×1080 con transiciones, música de fondo y narración
              profesional. Gratis y sin límites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
