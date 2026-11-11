import { useEffect, useState } from "react";
import {
  activatePremium,
  deactivatePremium,
  isPremiumActive,
  subscribePremium,
} from "@/lib/premium";

interface PremiumState {
  /** Versión que incrementa con cada cambio de activación o progreso. */
  version: number;
  active: boolean;
  activate: () => void;
  deactivate: () => void;
}

/** Suscribe el componente a la activación premium y al progreso de cursos. */
export function usePremium(): PremiumState {
  const [active, setActive] = useState<boolean>(isPremiumActive);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const update = () => {
      setActive(isPremiumActive());
      setVersion((v) => v + 1);
    };
    const unsub = subscribePremium(update);
    return unsub;
  }, []);

  return {
    version,
    active,
    activate: activatePremium,
    deactivate: deactivatePremium,
  };
}
