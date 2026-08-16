/* eslint-disable react-refresh/only-export-components */
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { StoreState } from "./store";

export function isPremiumPlan(state: StoreState | null | undefined): boolean {
  return state?.plan === "premium";
}

interface PremiumGateProps {
  state?: StoreState | null;
  title?: string;
  description?: string;
  onUpgrade?: () => void;
  children: ReactNode;
}

export function PremiumGate({
  state,
  title = "Función Premium",
  description = "Mejora a KAIRO Pro para desbloquear corazones ilimitados, ligas y funciones exclusivas.",
  onUpgrade,
  children,
}: PremiumGateProps) {
  if (isPremiumPlan(state)) return <>{children}</>;

  return (
    <div className="relative rounded-2xl border border-dashed border-amber-400/40 bg-gradient-to-br from-amber-50/60 to-orange-50/40 dark:from-amber-950/30 dark:to-orange-950/20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-400/20 blur-3xl" />
      </div>
      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-bold text-surface-900 dark:text-white">{title}</span>
        </div>
        <p className="text-xs text-surface-500 dark:text-surface-400 mb-4 leading-relaxed">
          {description}
        </p>
        <button
          onClick={onUpgrade}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4" />
          Mejorar plan
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white ${className}`}
    >
      <Crown className="w-3 h-3" /> Pro
    </span>
  );
}
