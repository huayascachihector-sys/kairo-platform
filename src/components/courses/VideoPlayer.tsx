import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, FileVideo, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function isLocalVideo(url: string): boolean {
  return /\.(mp4|webm|ogv|mov)(\?|#|$)/i.test(url);
}

export default function VideoPlayer({ videoUrl, onComplete }: VideoPlayerProps) {
  const [watched, setWatched] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const videoId = extractYoutubeId(videoUrl);
  const isLocal = isLocalVideo(videoUrl);

  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : videoUrl;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://kairoedu.vercel.app";

  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&origin=${encodeURIComponent(origin)}`
    : null;

  const handleReady = useCallback(() => {
    setLoadError(false);
  }, []);

  const handleError = useCallback(() => {
    setLoadError(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleMarkWatched = () => {
    setWatched(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(onComplete, 400);
  };

  if (!videoUrl || (!embedUrl && !isLocal)) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
        <p className="text-surface-300 text-sm font-medium">Contenido teórico listo para lectura</p>
        <button onClick={onComplete} className="btn-primary text-sm mt-3">
          <span>Continuar</span>
        </button>
      </div>
    );
  }

  if (loadError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center mx-auto mb-3">
          <FileVideo className="w-6 h-6 text-primary-400" />
        </div>
        <p className="font-bold text-white text-sm">Video en optimización</p>
        <p className="text-xs text-surface-400 mt-1 mb-4">Puedes continuar con la lectura teórica y los ejercicios interactivos.</p>
        <div className="flex items-center justify-center gap-2">
          {videoId && (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir en YouTube
            </a>
          )}
          <button onClick={onComplete} className="btn-primary text-xs flex items-center gap-2 !py-2 !px-4">
            <Play className="w-3.5 h-3.5" /> Continuar con la lección
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-xl"
    >
      <div className="relative aspect-video bg-surface-950">
        {isLocal ? (
          <video
            src={videoUrl}
            className="absolute inset-0 w-full h-full"
            controls
            playsInline
            onLoadedData={handleReady}
            onError={handleError}
          />
        ) : (
          <iframe
            src={embedUrl as string}
            title="Video de la lección"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={handleReady}
          />
        )}
      </div>

      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-900/60 border-t border-white/5">
        <p className="text-xs text-surface-400 flex items-center gap-1.5">
          <Play size={14} className="text-primary-400" /> Mira el video explicativo y continúa a la práctica
        </p>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {watched && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-xs text-emerald-400 font-medium mr-1"
            >
              <CheckCircle2 size={14} /> Visto
            </motion.span>
          )}
          {videoId && (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="¿El video no carga? Ábrelo en YouTube"
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-white/15 text-white/80 hover:bg-white/10 transition active:scale-95"
            >
              <ExternalLink size={14} /> Abrir en YouTube
            </a>
          )}
          <button
            onClick={handleMarkWatched}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 size={14} /> He terminado de ver
          </button>
        </div>
      </div>
    </motion.div>
  );
}