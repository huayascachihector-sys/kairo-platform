import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Heart, Shield, Zap, Pill, Check, Sparkles, Crown } from "lucide-react";
import { loadState, buyShopItem, buyMascotOutfit, setMascotOutfit, addGems } from "../../lib/store";
import {
  SHOP_ITEMS,
  MASCOT_OUTFITS,
  type ShopItemId,
  type MascotOutfitId,
} from "../../lib/gamification";
import { Mascot } from "../../components/plataforma/Mascot";
import { PremiumGate, isPremiumPlan } from "../../lib/premium";
import { useCallback, useEffect } from "react";

const SHOP_ICONS: Record<ShopItemId, React.ReactNode> = {
  refill_hearts: <Heart className="w-5 h-5" />,
  streak_freeze: <Shield className="w-5 h-5" />,
  xp_boost: <Zap className="w-5 h-5" />,
  revive: <Pill className="w-5 h-5" />,
};

export default function Tienda() {
  const [state, setState] = useState(loadState);
  const [toast, setToast] = useState<string | null>(null);
  const [spent, setSpent] = useState(0);

  const refresh = useCallback(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const handleBuy = (itemId: ShopItemId) => {
    const res = buyShopItem(itemId);
    if (res.ok) {
      setSpent((s) => s + (SHOP_ITEMS.find((i) => i.id === itemId)?.cost ?? 0));
      setToast("¡Compra realizada! 🎉");
    } else {
      setToast("No tienes suficientes gemas 💎");
    }
    refresh();
  };

  const handleOutfit = (outfitId: MascotOutfitId) => {
    const isOwned = state.mascotOutfits.includes(outfitId);
    if (isOwned) {
      setMascotOutfit(outfitId);
      setToast("¡Look actualizado! 🦉");
    } else {
      const res = buyMascotOutfit(outfitId);
      setToast(res.ok ? "¡Nuevo outfit desbloqueado! 🎉" : "No tienes suficientes gemas 💎");
    }
    refresh();
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-surface-900">Tienda</h1>
          <p className="text-surface-400 dark:text-surface-500 text-sm mt-1">
            Gasta tus gemas en ventajas para seguir aprendiendo
          </p>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20 font-bold">
          <Gem className="w-4 h-4" /> {state.gems} gemas
        </div>
      </div>

      {/* Mascota + outfits */}
      <div className="bg-white/5 dark:bg-white border border-white/10 dark:border-surface-100 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-5">
          <Mascot outfit={state.mascotOutfit} size="lg" reaction="happy" />
          <div>
            <h2 className="text-lg font-bold text-white dark:text-surface-900">
              Personaliza a Kairo
            </h2>
            <p className="text-sm text-surface-400 dark:text-surface-500">
              Tu compañero de estudio. Consigue outfits con gemas.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MASCOT_OUTFITS.map((o) => {
            const owned = state.mascotOutfits.includes(o.id);
            const selected = state.mascotOutfit === o.id;
            return (
              <button
                key={o.id}
                onClick={() => handleOutfit(o.id)}
                className={`relative rounded-2xl border p-4 text-center transition-all ${
                  selected
                    ? "border-rose-500 bg-rose-500/10"
                    : owned
                      ? "border-white/10 dark:border-surface-100 bg-white/5 hover:bg-white/10"
                      : "border-dashed border-white/15 dark:border-surface-200 bg-black/20 hover:bg-black/30"
                }`}
              >
                <div className="text-4xl mb-2">{o.icon}</div>
                <p className="text-xs font-bold text-white dark:text-surface-900">{o.name}</p>
                <p className="text-[10px] text-surface-400 dark:text-surface-500 mt-1">
                  {owned ? (selected ? "En uso" : "Puesto") : `${o.cost} 💎`}
                </p>
                {selected && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="grid sm:grid-cols-2 gap-4">
        {SHOP_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 dark:bg-white border border-white/10 dark:border-surface-100 rounded-2xl p-5 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
              {SHOP_ICONS[item.id]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white dark:text-surface-900 text-sm">{item.name}</h3>
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5 leading-relaxed">
                {item.description}
              </p>
            </div>
            <button
              onClick={() => handleBuy(item.id)}
              disabled={state.gems < item.cost}
              className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                state.gems < item.cost
                  ? "bg-white/5 dark:bg-surface-50 text-surface-500 dark:text-surface-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:shadow-lg hover:shadow-rose-500/25 hover:-translate-y-0.5"
              }`}
            >
              <Gem className="w-3.5 h-3.5" /> {item.cost}
            </button>
          </div>
        ))}
      </div>

      {/* Pro */}
      {!isPremiumPlan(state) && (
        <PremiumGate
          state={state}
          title="KAIRO Pro — corazones ilimitados"
          description="Con Pro nunca te quedas sin corazones, accedes a todas las ligas y disfrutas sin límites."
          onUpgrade={() => (window.location.hash = "#/pago")}
        >
          <div />
        </PremiumGate>
      )}

      {/* Debug: demo gems (se eliminará en producción) */}
      <div className="text-center">
        <button
          onClick={() => {
            addGems(500);
            refresh();
          }}
          className="text-xs text-surface-500 dark:text-surface-400 hover:text-primary-400 underline"
        >
          +500 gemas de demostración
        </button>
      </div>
    </div>
  );
}
