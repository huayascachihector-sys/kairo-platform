import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Crown,
  Lock,
  CheckCircle2,
  Award,
  Download,
  Layers3,
  Zap,
  Clock,
} from "lucide-react";
import {
  getPremiumCourse,
  getSubjectMeta,
  loadPremiumCourses,
  premiumCourseUrl,
  type PremiumCourse,
} from "@/data/premiumCourses";
import {
  markPremiumCourseCompleted,
  markPremiumCourseOpened,
  getPremiumCourseProgress,
} from "@/lib/premium";
import { exportPremiumCertificate } from "@/lib/premiumCertificate";
import { loadState } from "@/lib/store";
import { usePremium } from "@/hooks/usePremium";
import PremiumActivationModal from "@/components/cursos/PremiumActivationModal";

function getCourseIdFromHash(): string {
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  return decodeURIComponent(hash.replace(/^#\/?/, "").split("/")[1] || "");
}

export default function CursoPremiumViewer() {
  const { active, version } = usePremium();
  const [courses, setCourses] = useState<PremiumCourse[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [studentName, setStudentName] = useState("");

  const courseId = getCourseIdFromHash();
  const course = useMemo(
    () => (courses ? getPremiumCourse(courses, courseId) : undefined),
    [courses, courseId],
  );

  useEffect(() => {
    let cancelled = false;
    loadPremiumCourses().then((list) => {
      if (!cancelled) setCourses(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (course && active) {
      markPremiumCourseOpened(course.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id, active]);

  useEffect(() => {
    setStudentName(loadState().user?.name || "");
  }, []);

  // Re-leer progreso cuando cambie (versión del hook premium).
  const progress = useMemo(() => {
    void version;
    return course ? getPremiumCourseProgress(course.id) : null;
  }, [course, version]);
  const completed = !!progress?.completedAt;

  // ─── Cargando ───────────────────────────────────────────────────────────
  if (courses === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 dark:from-transparent via-white dark:via-transparent to-amber-50/40 dark:to-transparent pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-96 rounded-2xl border-2 border-amber-400/30 bg-white dark:bg-white/5 animate-pulse" />
        </div>
      </div>
    );
  }

  // ─── Curso no encontrado ────────────────────────────────────────────────
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 dark:from-transparent via-white dark:via-transparent to-amber-50/40 dark:to-transparent pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white">
            Curso premium no encontrado
          </h1>
          <p className="mt-3 text-surface-500 dark:text-surface-400">
            El curso solicitado no existe o fue removido del catálogo.
          </p>
          <a href="#/cursos" className="btn-primary inline-flex mt-6 !py-3 !px-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Volver a Cursos
          </a>
        </div>
      </div>
    );
  }

  const meta = getSubjectMeta(course.subject);

  // ─── Bloqueo premium ────────────────────────────────────────────────────
  if (!active) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 dark:from-transparent via-white dark:via-transparent to-amber-50/40 dark:to-transparent pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 text-surface-900 flex items-center justify-center shadow-xl shadow-amber-500/25">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-surface-900 dark:text-white">
            {course.title}
          </h1>
          <p className="mt-3 text-surface-500 dark:text-surface-400">
            Este es un curso{" "}
            <strong className="text-amber-600 dark:text-amber-400">Premium IB</strong> de{" "}
            {meta.label}. Actívalo para estudiarlo y obtener tu certificado.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary mt-6 !py-3 !px-6 text-sm inline-flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Activar Premium
          </button>
          <div className="mt-6">
            <a
              href="#/cursos"
              className="text-sm text-surface-500 dark:text-surface-400 hover:text-amber-600 dark:hover:text-amber-400"
            >
              ← Volver al catálogo
            </a>
          </div>
          <PremiumActivationModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
      </div>
    );
  }

  // ─── Visor del curso ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 dark:from-transparent via-white dark:via-transparent to-amber-50/40 dark:to-transparent pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <a
            href="#/cursos"
            className="inline-flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 hover:text-amber-600 dark:hover:text-amber-400 mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Cursos
          </a>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-surface-900 px-2.5 py-1 rounded-full">
              <Crown className="w-3 h-3" />
              IB · PREMIUM
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${meta.gradient} text-white`}
            >
              {meta.emoji} {meta.label}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-800 dark:bg-white text-white dark:text-surface-900">
              {course.level}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-surface-400">
              <Clock className="w-3.5 h-3.5" />
              {course.durationMin} min
            </span>
            {completed && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completado
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight">
            {course.title}
          </h1>
          {course.description && (
            <p className="mt-2 text-surface-500 dark:text-surface-400 max-w-2xl">
              {course.description}
            </p>
          )}
        </motion.div>

        {/* Contenido del curso (iframe sandbox) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border-2 border-amber-400/40 dark:border-amber-400/25 overflow-hidden bg-white dark:bg-surface-900 shadow-lg shadow-amber-500/10"
        >
          <iframe
            src={premiumCourseUrl(course)}
            title={course.title}
            sandbox="allow-scripts allow-forms allow-popups allow-modals"
            className="w-full h-[80vh] min-h-[500px] block"
          />
        </motion.div>

        {/* Acciones */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!completed ? (
            <button
              onClick={() => {
                markPremiumCourseCompleted(course.id);
                setCertOpen(true);
              }}
              className="btn-primary text-sm !py-3 !px-5 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Marcar como completado
            </button>
          ) : (
            <button
              onClick={() => setCertOpen(true)}
              className="btn-primary text-sm !py-3 !px-5 flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Ver certificado
            </button>
          )}

          {/* Integración con la plataforma IB */}
          <a
            href="#/plataforma/banco-preguntas"
            className="btn-secondary text-sm !py-3 !px-5 flex items-center gap-2"
          >
            <Layers3 className="w-4 h-4" />
            Banco de preguntas IB
          </a>
          <a
            href="#/plataforma/flashcards"
            className="btn-secondary text-sm !py-3 !px-5 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Flashcards
          </a>
        </div>
        <p className="mt-3 text-xs text-surface-400 dark:text-surface-500">
          Tip: al finalizar, imprime tu certificado desde el diálogo de impresión (Guardar como
          PDF).
        </p>
      </div>

      {/* Modal de certificado */}
      {certOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/70 backdrop-blur-sm"
          onClick={() => setCertOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-surface-900 border-2 border-amber-400/50 dark:border-amber-400/30 p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-surface-900 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-surface-900 dark:text-white">
                  ¡Curso completado!
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Genera tu certificado premium
                </p>
              </div>
            </div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Nombre para el certificado
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Tu nombre completo"
              maxLength={60}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-white/10 bg-white dark:bg-white/5 text-surface-900 dark:text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
            <button
              onClick={() => exportPremiumCertificate(course, studentName)}
              className="mt-4 w-full py-3 rounded-xl font-bold text-surface-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar certificado
            </button>
            <button
              onClick={() => setCertOpen(false)}
              className="mt-2 w-full py-2 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}

      <PremiumActivationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
