import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone, Monitor, X, Sparkles, ShieldCheck } from 'lucide-react';

export interface AppBinary {
  size: string;
  url: string;
  date: string;
}

export interface DownloadInfo {
  version: string;
  apk: AppBinary;
  exe: AppBinary;
}

const DEFAULT_INFO: DownloadInfo = {
  version: '1.0.0',
  apk: { size: '3.5 MB', url: '/downloads/kairo.apk', date: '2026-08-19' },
  exe: { size: '~110 MB', url: '/downloads/KAIRO-Setup.exe', date: '2026-08-19' },
};

type Platform = 'android' | 'windows' | 'ios' | 'other';

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/windows/i.test(ua)) return 'windows';
  return 'other';
}

// ─── Captura global del prompt de instalación PWA ──────────────────────
let deferredPrompt: { prompt: () => Promise<void> } | null = null;
let promptListeners = new Set<(available: boolean) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as unknown as { prompt: () => Promise<void> };
    promptListeners.forEach((cb) => cb(true));
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    promptListeners.forEach((cb) => cb(false));
  });
}

export function usePwaInstall(): { available: boolean; promptInstall: () => void } {
  const [available, setAvailable] = useState(!!deferredPrompt);

  useEffect(() => {
    promptListeners.add(setAvailable);
    return () => {
      promptListeners.delete(setAvailable);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    deferredPrompt = null;
    setAvailable(false);
  };

  return { available, promptInstall };
}

export interface DownloadAvailability {
  apk: boolean;
  exe: boolean;
}

export function useDownloadInfo(): { info: DownloadInfo; available: DownloadAvailability } {
  const [info, setInfo] = useState<DownloadInfo>(DEFAULT_INFO);
  const [available, setAvailable] = useState<DownloadAvailability>({ apk: false, exe: false });

  useEffect(() => {
    let cancelled = false;
    fetch('/downloads/version.json', { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DownloadInfo | null) => {
        if (cancelled) return;
        const final = data && data.version && data.apk && data.exe ? data : DEFAULT_INFO;
        setInfo(final);
        return Promise.all([
          fetch(final.apk.url, { method: 'HEAD' })
            .then((r) => r.ok)
            .catch(() => false),
          fetch(final.exe.url, { method: 'HEAD' })
            .then((r) => r.ok)
            .catch(() => false),
        ]).then(([apkOk, exeOk]) => {
          if (!cancelled) setAvailable({ apk: !!apkOk, exe: !!exeOk });
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return { info, available };
}

interface InstallAppProps {
  label?: string;
  iconOnly?: boolean;
  className?: string;
}

export default function InstallApp({ label, iconOnly, className }: InstallAppProps) {
  const [open, setOpen] = useState(false);
  const { info, available } = useDownloadInfo();
  const { available: pwaAvailable, promptInstall } = usePwaInstall();
  const platform = detectPlatform();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const featured = platform === 'android' ? 'apk' : platform === 'windows' ? 'exe' : null;
  const isAndroid = platform === 'android';

  const Card = ({ type }: { type: 'apk' | 'exe' }) => {
    const bin = type === 'apk' ? info.apk : info.exe;
    const isApk = type === 'apk';
    const highlight = featured === type;
    const ready = type === 'apk' ? available.apk : available.exe;
    return (
      <div
        className={`relative rounded-2xl p-6 border transition-all ${
          highlight
            ? 'border-primary-500/60 bg-primary-500/10 shadow-lg shadow-primary-500/10'
            : 'border-white/10 bg-white/5'
        }`}
      >
        {highlight && (
          <span className="absolute -top-2.5 left-5 text-[10px] font-bold bg-gradient-to-r from-primary-500 to-accent-500 text-white px-2.5 py-1 rounded-full">
            Recomendado para tu dispositivo
          </span>
        )}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
            {isApk ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
          </div>
          <div>
            <p className="font-bold text-white">{isApk ? 'Android' : 'Windows'}</p>
            <p className="text-xs text-surface-400">{isApk ? 'Archivo .apk' : 'Instalador .exe'}</p>
          </div>
        </div>
        <ul className="space-y-1.5 text-xs text-surface-300 mb-5">
          <li>• {isApk ? 'Teléfonos y tablets Android' : 'Laptops y PC con Windows 10/11'}</li>
          <li>• Peso: {bin.size}</li>
          <li>• Actualizado: {bin.date}</li>
        </ul>
        {ready ? (
          <a
            href={bin.url}
            download
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
              highlight
                ? 'btn-primary !py-3'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            <Download className="w-4 h-4" />
            Descargar {isApk ? 'APK' : 'para Windows'}
          </a>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold bg-white/5 text-surface-500 border border-white/5 cursor-not-allowed">
            ⏳ Próximamente
          </div>
        )}
        {isApk && isAndroid && (
          <p className="text-[11px] text-surface-500 mt-3 text-center leading-snug">
            Al instalar, Android pedirá permiso de "fuentes desconocidas". Acepta y listo.
          </p>
        )}
      </div>
    );
  };

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl cyber-card-dark rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Instala KAIRO</h2>
                  <p className="text-xs text-surface-400">
                    Lleva tu plataforma de estudio a cualquier dispositivo
                  </p>
                </div>
              </div>
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-surface-400 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instalación rápida PWA (prioridad en Android/Chrome) */}
            {isAndroid && pwaAvailable && (
              <button
                onClick={promptInstall}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold btn-primary"
              >
                <Download className="w-5 h-5" />
                Instalar KAIRO al instante
              </button>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <Card type="apk" />
              <Card type="exe" />
            </div>

            <div className="mt-5 space-y-3">
              {!isAndroid && pwaAvailable && (
                <button
                  onClick={promptInstall}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Instalar directamente en este navegador (PWA)
                </button>
              )}
              {platform === 'ios' && (
                <p className="text-xs text-surface-400 text-center">
                  En iPhone/iPad: abre la web y usa "Compartir → Agregar a pantalla de inicio".
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-surface-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Versión {info.version}
              </span>
              <span>kairoedu.vercel.app</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          iconOnly
            ? `p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 transition-colors ${className || ''}`
            : `btn-primary text-sm flex items-center gap-2 ${className || ''}`
        }
        title={label || 'Instalar la app de KAIRO'}
        aria-label={label || 'Instalar la app de KAIRO'}
      >
        <Download className="w-4 h-4" />
        {!iconOnly && (label || 'Descargar App')}
      </button>

      {typeof document !== 'undefined' ? createPortal(modal, document.body) : modal}
    </>
  );
}