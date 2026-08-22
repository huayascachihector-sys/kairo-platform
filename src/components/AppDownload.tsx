import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Smartphone, Monitor, Download, Wifi, Battery, ShieldCheck } from "lucide-react";
import InstallApp from "./InstallApp";

export default function AppDownload() {
  const { ref } = useScrollReveal();

  return (
    <section
      id="descargar-app"
      ref={ref}
      className="py-20 md:py-28 bg-gradient-dark relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-cyber-pattern opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full mb-5">
              <Download className="w-3.5 h-3.5" /> App nativa
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Estudia desde tu celular <br className="hidden sm:block" />o tu laptop.{" "}
              <span className="text-gradient-cyan">Sin límites.</span>
            </h2>
            <p className="text-surface-400 text-lg leading-relaxed mb-8 max-w-lg">
              Instala KAIRO como aplicación en tu dispositivo Android o Windows. Funciona igual que
              la web: tu progreso, sesiones y documentos quedan guardados en tu equipo.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-lg">
              {[
                { icon: Wifi, label: "Funciona con o sin internet" },
                { icon: Battery, label: "Consumo mínimo de batería" },
                { icon: ShieldCheck, label: "Tus datos, siempre seguros" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-center"
                >
                  <f.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs text-surface-300 leading-snug">{f.label}</span>
                </div>
              ))}
            </div>

            <InstallApp label="Descargar la App" />
            <p className="text-xs text-surface-500 mt-3 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> APK para Android ·{" "}
              <Monitor className="w-3.5 h-3.5" /> EXE para Windows
            </p>
          </div>

          {/* Mockup visual */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto w-[320px] rounded-[2.5rem] border border-white/15 bg-slate-950 p-4 shadow-2xl shadow-cyan-500/10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 border-x border-b border-white/15 rounded-b-2xl" />
              <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-primary-950 via-slate-950 to-accent-950 aspect-[9/16] flex flex-col">
                <div className="p-5 flex items-center gap-3 border-b border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                    K
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">KAIRO App</p>
                    <p className="text-[10px] text-surface-400">Estudiando como los mejores</p>
                  </div>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  {["Matemáticas", "Física", "Química", "Historia"].map((t, i) => (
                    <div
                      key={t}
                      className={`p-3 rounded-xl border ${i === 0 ? "border-cyan-400/40 bg-cyan-500/10" : "border-white/10 bg-white/5"}`}
                    >
                      <p className="text-xs font-semibold text-white mb-2">{t}</p>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${["w-4/5 bg-gradient-to-r from-cyan-400 to-primary-500", "w-3/5 bg-gradient-to-r from-primary-500 to-accent-500", "w-2/5 bg-gradient-to-r from-primary-500 to-accent-500", "w-4/5 bg-gradient-to-r from-primary-500 to-accent-500"][i]}`}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center gap-2 text-white text-xs font-bold">
                    <Download className="w-4 h-4" /> ¡Sigue tu racha de 12 días!
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary-600/30 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
