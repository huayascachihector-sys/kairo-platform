import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Sparkles, Brain, Award, BookOpen, CheckCircle2 } from "lucide-react";
import { activatePremium } from "@/lib/premium";

interface PremiumActivationModalProps {
  open: boolean;
  onClose: () => void;
}

const benefits = [
  {
    icon: BookOpen,
    title: "Cursos Premium IB",
    desc: "Matemáticas, Física, Historia y Sociedad Digital con material interactivo generado con IA avanzada.",
  },
  {
    icon: Brain,
    title: "Modelo de IA avanzado",
    desc: "El tutor KAIRO responde con el modelo premium: respuestas más profundas y detalladas.",
  },
  {
    icon: Award,
    title: "Certificados de finalización",
    desc: "Obtén un certificado descargable al completar cada curso premium.",
  },
  {
    icon: Sparkles,
    title: "Seguimiento de progreso",
    desc: "Tu avance queda guardado: retoma cualquier curso exactamente donde lo dejaste.",
  },
];

export default function PremiumActivationModal({ open, onClose }: PremiumActivationModalProps) {
  const [activating, setActivating] = useState(false);

  const handleActivate = () => {
    setActivating(true);
    setTimeout(() => {
      activatePremium();
      setActivating(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-surface-900 border-2 border-amber-400/50 dark:border-amber-400/30 shadow-2xl shadow-amber-500/10"
          >
            {/* Header dorado */}
            <div className="relative bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-6 pb-8 text-surface-900 overflow-hidden">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-900/10 hover:bg-surface-900/20 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-surface-900/15">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight">KAIRO Premium</h3>
                  <p className="text-sm font-medium text-surface-800">Cursos IB con IA avanzada</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {benefits.map((b) => (
                  <div key={b.title} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <b.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900 dark:text-white text-sm">
                        {b.title}
                      </p>
                      <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleActivate}
                disabled={activating}
                className="mt-6 w-full py-3.5 rounded-xl font-bold text-surface-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {activating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-surface-900/30 border-t-surface-900 rounded-full animate-spin" />
                    Activando...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Activar Premium
                    <CheckCircle2 className="w-4 h-4 opacity-60" />
                  </>
                )}
              </button>
              <p className="mt-3 text-xs text-center text-surface-400 dark:text-surface-500">
                Activación libre en esta versión de demostración. Permanece activo en este
                navegador.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
