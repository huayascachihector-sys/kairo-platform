// wouter removed
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 px-6 py-16 md:py-24 text-center md:px-16 shadow-2xl">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 rounded-full bg-blue-400/30 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Empieza a estudiar hoy
            </h2>
            <p className="text-xl text-blue-50 mb-10 leading-relaxed">
              Únete a la revolución educativa en el Perú. Crea tu cuenta gratuita y comienza a mejorar tus notas desde el primer día.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#" 
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-lg transition-transform hover:scale-105"
              >
                Crear cuenta gratis
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-100/80">
              No requiere tarjeta de crédito
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
