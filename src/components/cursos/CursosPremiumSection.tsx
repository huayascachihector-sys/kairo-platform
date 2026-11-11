import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Lock,
  Clock,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  FolderOpen,
  Award,
} from "lucide-react";
import {
  loadPremiumCourses,
  getSubjectMeta,
  PREMIUM_SUBJECTS,
  type PremiumCourse,
  type PremiumSubject,
} from "@/data/premiumCourses";
import { getPremiumProgressMap, getPremiumStats } from "@/lib/premium";
import { usePremium } from "@/hooks/usePremium";
import PremiumActivationModal from "./PremiumActivationModal";

type SubjectFilter = "todas" | PremiumSubject;
type LevelFilter = "todos" | "SL" | "HL";

const hv = { y: -4, boxShadow: "0 12px 40px rgba(245,158,11,0.18)" };

export default function CursosPremiumSection() {
  const { active, version } = usePremium();
  const [courses, setCourses] = useState<PremiumCourse[] | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("todas");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("todos");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPremiumCourses().then((list) => {
      if (!cancelled) setCourses(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-leer el progreso cada vez que cambia la activación o un curso se marca.
  const progress = useMemo(() => {
    void version;
    return getPremiumProgressMap();
  }, [version]);

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter(
      (c) =>
        (subjectFilter === "todas" || c.subject === subjectFilter) &&
        (levelFilter === "todos" || c.level === levelFilter),
    );
  }, [courses, subjectFilter, levelFilter]);

  const subjectCounts = useMemo(() => {
    if (!courses) return new Map<SubjectFilter, number>();
    const map = new Map<SubjectFilter, number>();
    map.set("todas", courses.length);
    for (const s of PREMIUM_SUBJECTS) {
      map.set(s.id, courses.filter((c) => c.subject === s.id).length);
    }
    return map;
  }, [courses]);

  const globalStats = useMemo(() => {
    void version;
    return getPremiumStats(courses ? courses.map((c) => c.id) : []);
  }, [courses, version]);

  const openCourse = (course: PremiumCourse) => {
    if (!active) {
      setModalOpen(true);
      return;
    }
    window.location.hash = `#/cursos-premium/${encodeURIComponent(course.id)}`;
  };

  const renderCard = (course: PremiumCourse, i: number) => {
    const meta = getSubjectMeta(course.subject);
    const p = progress[course.id];
    const completed = !!p?.completedAt;
    const started = !!p?.startedAt;

    return (
      <motion.button
        key={course.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * i }}
        whileHover={hv}
        onClick={() => openCourse(course)}
        className="relative text-left w-full rounded-2xl border-2 border-amber-400/40 dark:border-amber-400/25 bg-white dark:bg-white/5 overflow-hidden group transition-colors hover:border-amber-400 dark:hover:border-amber-400/60"
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${meta.gradient} p-5 text-white relative overflow-hidden`}
        >
          <div className="absolute top-3 right-3 opacity-20 text-4xl">{meta.emoji}</div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-surface-900 px-2.5 py-1 rounded-full">
            <Crown className="w-3 h-3" />
            IB · PREMIUM
          </span>
          <h3 className="text-lg font-extrabold mt-3 pr-10 leading-snug">{course.title}</h3>
          <p className="text-xs text-white/80 mt-1">
            {meta.label} · {course.level}
          </p>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed mb-4 line-clamp-3">
            {course.description || "Curso premium del IB Diploma Programme."}
          </p>

          <div className="flex items-center gap-4 text-xs text-surface-500 dark:text-surface-400 mb-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {course.durationMin} min
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              IA generativa
            </span>
          </div>

          {/* Progreso */}
          {completed ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Completado
              <span className="text-[11px] font-normal text-surface-400">
                · certificado disponible
              </span>
            </div>
          ) : started ? (
            <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
              <PlayCircle className="w-4 h-4" />
              En progreso
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium text-surface-500 dark:text-surface-400">
              <PlayCircle className="w-4 h-4" />
              No iniciado
            </div>
          )}

          {!active && (
            <div className="absolute inset-0 bg-surface-50/60 dark:bg-surface-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-surface-900 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">
                Activa Premium para abrir
              </span>
            </div>
          )}
        </div>
      </motion.button>
    );
  };

  return (
    <section className="mb-14" aria-labelledby="cursos-premium-title">
      {/* Banner premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border-2 border-amber-400/50 dark:border-amber-400/30 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-500/10 dark:via-yellow-500/5 dark:to-orange-500/10 dark:bg-surface-900 p-6 sm:p-8 mb-6"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(245 158 11 / 0.35) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-surface-900 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <h2
                id="cursos-premium-title"
                className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight"
              >
                Cursos{" "}
                <span className="bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                  Premium IB
                </span>
              </h2>
              <p className="mt-1 text-sm text-surface-600 dark:text-surface-300 max-w-xl">
                Cursos interactivos del IB Diploma Programme (Matemáticas, Física, Historia y
                Sociedad Digital), creados con IA avanzada. Incluye certificados y tutor premium.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            {active ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Premium activo
              </span>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Activar Premium
              </button>
            )}
            <span className="text-xs text-surface-500 dark:text-surface-400">
              {courses?.length ?? 0} cursos · {globalStats.completed} completados ·{" "}
              {globalStats.pct}% avance
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["todas", ...PREMIUM_SUBJECTS.map((s) => s.id)] as SubjectFilter[]).map((f) => {
          const label = f === "todas" ? "Todas" : getSubjectMeta(f as PremiumSubject).label;
          return (
            <button
              key={f}
              onClick={() => setSubjectFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                subjectFilter === f
                  ? "bg-amber-500 text-surface-900 shadow-md shadow-amber-500/25"
                  : "bg-white dark:bg-white/5 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-400/50"
              }`}
            >
              {f !== "todas" && (
                <span className="mr-1">{getSubjectMeta(f as PremiumSubject).emoji}</span>
              )}
              {label}
              <span className="ml-1.5 opacity-60">{subjectCounts.get(f) ?? 0}</span>
            </button>
          );
        })}
        <span className="w-px bg-surface-200 dark:bg-white/10 mx-1" />
        {(["todos", "SL", "HL"] as LevelFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setLevelFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              levelFilter === f
                ? "bg-surface-800 dark:bg-white text-white dark:text-surface-900"
                : "bg-white dark:bg-white/5 text-surface-500 dark:text-surface-400 border border-surface-200 dark:border-white/10"
            }`}
          >
            {f === "todos" ? "Nivel" : f}
          </button>
        ))}
      </div>

      {/* Grid de cursos */}
      {courses === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-56 rounded-2xl border-2 border-amber-400/20 bg-white dark:bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-amber-400/40 bg-amber-50/50 dark:bg-amber-500/5 p-10 text-center">
          <FolderOpen className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <p className="font-semibold text-surface-800 dark:text-surface-100">
            Aún no hay cursos premium publicados
          </p>
          <p className="text-sm text-surface-500 dark:text-surface-400 max-w-md mx-auto mt-2">
            Coloca tus HTMLs de cursos en{" "}
            <code className="text-xs bg-surface-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
              public/cursos-premium/&lt;materia&gt;/
            </code>{" "}
            y agrégalos a{" "}
            <code className="text-xs bg-surface-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
              manifest.json
            </code>
            .{" "}
            <a
              href="/cursos-premium/README.md"
              target="_blank"
              rel="noreferrer"
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              Ver instrucciones
            </a>
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-surface-500 dark:text-surface-400 py-6">
          No hay cursos con estos filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(renderCard)}
        </div>
      )}

      {/* Nota de integración */}
      {courses !== null && courses.length > 0 && (
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-surface-400 dark:text-surface-500 text-center">
          <Award className="w-3.5 h-3.5" />
          Cada curso incluye banco de preguntas IB y flashcards de repaso en la plataforma
        </p>
      )}

      <PremiumActivationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
