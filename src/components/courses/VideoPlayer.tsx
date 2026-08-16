import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, FileVideo, AlertTriangle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
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
  const [showButton, setShowButton] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isYouTube, setIsYouTube] = useState(() => !!extractYoutubeId(videoUrl));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const videoId = extractYoutubeId(videoUrl);
  const isLocal = isLocalVideo(videoUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`
    : null;

  const handleReady = useCallback(() => {
    setLoadError(false);
    timerRef.current = setTimeout(() => setShowButton(true), 30000);
  }, []);

  const handleError = useCallback(() => {
    setLoadError(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleMarkWatched = () => {
    setWatched(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(onComplete, 600);
  };

  if (!videoUrl || (!embedUrl && !isLocal)) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
        <p className="text-surface-400 text-sm">URL de video no disponible</p>
        <button onClick={onComplete} className="btn-primary text-sm mt-4">
          Continuar
        </button>
      </div>
    );
  }

  // MP4 local que no pudo cargar (archivo ausente): mostrar aviso en vez de cuadro negro
  if (isLocal && loadError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
          <FileVideo className="w-8 h-8 text-amber-400" />
        </div>
        <p className="font-bold text-white">Este video aún no está listo</p>
        <p className="text-sm text-surface-400 mt-1 mb-5">El tutor sigue generando este video. Puedes continuar sin reproducirlo.</p>
        <button onClick={onComplete} className="btn-primary text-sm flex items-center gap-2 mx-auto">
          <AlertTriangle className="w-4 h-4" /> Continuar sin video
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
    >
      <div className="relative aspect-video bg-surface-900">
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
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleReady}
          />
        )}
        {!watched && showButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 right-4 z-10"
          >
            <button
              onClick={handleMarkWatched}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-colors"
            >
              <Play size={16} /> He terminado de ver
            </button>
          </motion.div>
        )}
      </div>

      <div className="p-4 flex items-center justify-between">
        <p className="text-xs text-surface-500">Mira el video explicativo y luego continúa</p>
        {watched && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 text-xs text-emerald-400 font-medium"
          >
            <CheckCircle2 size={14} /> Visto
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}