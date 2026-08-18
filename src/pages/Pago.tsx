import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Check,
  Crown,
  Zap,
  ShieldCheck,
  Lock,
  ArrowRight,
  Star,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { setPlan } from "../lib/store";

const plans = [
  {
    id: "mensual",
    name: "Mensual",
    price: "S/ 49",
    period: "/mes",
    badge: null,
    features: [
      "Acceso a todos los cursos",
      "Práctica con IA",
      "Recursos descargables",
      "Soporte por chat",
    ],
    color: "border-surface-200",
    highlight: false,
  },
  {
    id: "semestral",
    name: "Semestral",
    price: "S/ 29",
    period: "/mes",
    badge: "Más popular",
    note: "Facturado S/ 174 cada 6 meses",
    features: [
      "Todo lo del plan Mensual",
      "Tutores en vivo",
      "Exámenes simulacro",
      "Acceso offline",
      "Certificados",
    ],
    color: "border-primary-500",
    highlight: true,
  },
  {
    id: "anual",
    name: "Anual",
    price: "S/ 19",
    period: "/mes",
    badge: "Mejor valor",
    note: "Facturado S/ 228 al año · Ahorras S/ 360",
    features: [
      "Todo lo del plan Semestral",
      "Clases 1-a-1 mensuales",
      "Acceso a vida",
      "Prioridad en soporte",
    ],
    color: "border-amber-400",
    highlight: false,
  },
];

function getParam(key: string) {
  try {
    const hash = window.location.hash;
    const query = hash.includes("?") ? hash.split("?")[1] : "";
    return new URLSearchParams(query).get(key) || "";
  } catch {
    return "";
  }
}

export default function Pago() {
  const [selected, setSelected] = useState("semestral");
  const [tab, setTab] = useState<"plan" | "pago">("plan");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardTouched, setCardTouched] = useState(false);
  const email = getParam("email") || "tucorreo@ejemplo.com";
  const name = getParam("name") || "Estudiante";

  const selectedPlan = plans.find((p) => p.id === selected)!;

  const cardNumberDigits = cardNumber.replace(/\D/g, "");
  const cardValid =
    cardNumberDigits.length === 16 &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry) &&
    /^\d{3,4}$/.test(cardCvv) &&
    cardName.trim().length >= 3;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardValid) {
      setCardTouched(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setPlan("premium");
    }, 1800);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 dark:from-transparent via-white dark:via-transparent to-emerald-50 dark:to-transparent flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-white dark:cyber-card-dark rounded-3xl shadow-2xl border border-surface-100 p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-3">
            ¡Bienvenido, {name.split(" ")[0]}!
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            Tu suscripción al plan <strong className="text-primary-600 dark:text-primary-400">{selectedPlan.name}</strong>{" "}
            está activa. Revisa tu correo en <span className="text-primary-600 dark:text-primary-400">{email}</span> para
            acceder.
          </p>
          <a href="#/plataforma" className="btn-primary w-full justify-center text-base">
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Ir a mi plataforma
            </span>
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 dark:from-transparent via-white dark:via-transparent to-accent-50/30 dark:to-transparent py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <a href="#" className="inline-flex items-center gap-2.5 mb-8">
            <img src="/logo-light.png" alt="KAIRO Logo" className="h-11 w-auto object-contain" />
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
            Elige tu plan, {name.split(" ")[0]}
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Registrado como <span className="text-primary-600 dark:text-primary-400 font-semibold">{email}</span> · 14
            días gratis incluidos
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-surface-100 dark:bg-surface-800 rounded-2xl p-1 gap-1">
            <button
              onClick={() => setTab("plan")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "plan" ? "bg-white dark:cyber-card-dark text-primary-600 dark:text-primary-400 shadow-sm" : "text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"}`}
            >
              1. Elegir plan
            </button>
            <button
              onClick={() => selected && setTab("pago")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "pago" ? "bg-white dark:cyber-card-dark text-primary-600 dark:text-primary-400 shadow-sm" : "text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"}`}
            >
              2. Datos de pago
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === "plan" && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {plans.map((plan) => (
                  <motion.button
                    key={plan.id}
                    onClick={() => setSelected(plan.id)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative text-left rounded-2xl border-2 p-6 transition-all ${
                      selected === plan.id
                        ? plan.id === "anual"
                          ? "border-amber-400 bg-amber-50/40 dark:bg-amber-900/20 shadow-lg shadow-amber-100 dark:shadow-black/30"
                          : "border-primary-500 bg-primary-50/40 dark:bg-primary-900/20 shadow-lg shadow-primary-100 dark:shadow-black/30"
                        : "border-surface-200 dark:border-surface-700 bg-white dark:cyber-card-dark hover:border-surface-300 dark:hover:border-surface-600"
                    }`}
                  >
                    {plan.badge && (
                      <span
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-3 py-1 rounded-full ${
                          plan.id === "anual"
                            ? "bg-amber-400 text-white"
                            : "bg-primary-600 text-white"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}

                    <div
                      className={`w-5 h-5 rounded-full border-2 mb-4 flex items-center justify-center flex-shrink-0 ${
                        selected === plan.id
                          ? "border-primary-500 bg-primary-500"
                          : "border-surface-300 dark:border-surface-600"
                      }`}
                    >
                      {selected === plan.id && <Check className="w-3 h-3 text-white" />}
                    </div>

                    <p className="text-surface-500 dark:text-surface-400 text-sm font-semibold mb-1">{plan.name}</p>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-3xl font-bold text-surface-900 dark:text-white">{plan.price}</span>
                      <span className="text-surface-400 text-sm mb-1">{plan.period}</span>
                    </div>
                    {plan.note && <p className="text-xs text-surface-400 dark:text-surface-500 mb-4">{plan.note}</p>}
                    {!plan.note && <div className="mb-4" />}

                    <ul className="space-y-2.5">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-300">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.button>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setTab("pago")}
                  className="btn-primary text-base !py-4 !px-10 inline-flex items-center gap-2"
                >
                  <span className="flex items-center gap-2">
                    Continuar con plan {selectedPlan.name}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
                <p className="text-surface-400 dark:text-surface-500 text-sm mt-4">
                  Sin compromiso · Cancela en cualquier momento
                </p>
              </div>
            </motion.div>
          )}

          {tab === "pago" && (
            <motion.div
              key="pago"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="max-w-lg mx-auto">
                {/* Order summary */}
                <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6 mb-6">
                  <h3 className="font-bold text-surface-900 dark:text-white mb-4">Resumen de tu pedido</h3>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-surface-600 dark:text-surface-300">Plan {selectedPlan.name}</span>
                    <span className="font-semibold text-surface-900 dark:text-white">
                      {selectedPlan.price}
                      {selectedPlan.period}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-surface-600 dark:text-surface-300">Prueba gratis</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">14 días · S/ 0</span>
                  </div>
                  <div className="border-t border-surface-100 dark:border-surface-800 pt-3 flex items-center justify-between">
                    <span className="font-bold text-surface-900 dark:text-white">Hoy pagas</span>
                    <span className="font-bold text-2xl text-primary-600 dark:text-primary-400">S/ 0.00</span>
                  </div>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">
                    Después del período de prueba se cobra {selectedPlan.price}
                    {selectedPlan.period}
                  </p>
                </div>

                {/* Payment form */}
                <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-surface-500" />
                    <h3 className="font-bold text-surface-900 dark:text-white">Datos de pago</h3>
                    <span className="ml-auto text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Pago seguro
                    </span>
                  </div>

                  <form onSubmit={handlePay} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-2">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(
                            e.target.value
                              .replace(/\D/g, "")
                              .replace(/(.{4})/g, "$1 ")
                              .trim()
                              .slice(0, 19)
                          )
                        }
                        className="w-full px-4 py-3.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 outline-none text-sm font-medium focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white dark:focus:bg-surface-800 transition-all"
                      />
                      {cardTouched && cardNumberDigits.length > 0 && cardNumberDigits.length < 16 && (
                        <p className="text-xs text-red-500 mt-1.5">
                          El número de tarjeta debe tener 16 dígitos.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-2">
                          Vencimiento
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setCardExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                          }}
                          className="w-full px-4 py-3.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 outline-none text-sm font-medium focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white dark:focus:bg-surface-800 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className="w-full px-4 py-3.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 outline-none text-sm font-medium focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white dark:focus:bg-surface-800 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-2">
                        Nombre en la tarjeta
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Nombre completo"
                        className="w-full px-4 py-3.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 outline-none text-sm font-medium focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white dark:focus:bg-surface-800 transition-all"
                      />
                      {cardTouched && !cardValid && (
                        <p className="text-xs text-red-500 mt-1.5">
                          Revisa los datos: 16 dígitos de tarjeta, vencimiento MM/AA y el nombre completo.
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full justify-center text-base !py-4 mt-2 disabled:opacity-70"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Activar prueba gratis
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="mt-5 flex items-center justify-center gap-4 text-surface-400 dark:text-surface-500">
                    <div className="flex items-center gap-1 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Pago seguro SSL
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1 text-xs">
                      <Lock className="w-3 h-3 text-emerald-500" /> Datos encriptados
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 text-amber-400" /> 45k+ alumnos
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setTab("plan")}
                  className="w-full text-center text-sm text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-200 transition-colors py-4"
                >
                  ← Cambiar plan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
