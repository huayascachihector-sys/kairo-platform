import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Zap, BookOpen, Lock, Sparkles } from "lucide-react";
import {
  getCourse,
  getTotalLessons,
  getModules,
  getLessonVideoUrl,
  getPracticaExercises,
  FASES,
  type Module,
  type Exercise,
} from "../../lib/courseData";
import {
  loadState,
  completeModulePhase,
  getModulePhaseProgress,
  getCourseCompletionPct,
} from "../../lib/store";
import { getLevelFromXp } from "../../lib/gamification";
import { HealthBar } from "../../components/courses/HealthBar";
import { ExerciseCard } from "../../components/courses/ExerciseCard";
import { CelebrationOverlay } from "../../components/courses/CelebrationOverlay";
import VideoPlayer from "../../components/courses/VideoPlayer";
import TutorIA from "../../components/courses/TutorIA";
import PruebaModulo from "../../components/courses/PruebaModulo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  courseId: string;
  onBack: () => void;
  onStateChange: () => void;
  onPracticeEnglish?: (ctx: { topic: string; context: string }) => void;
}

type View = "course" | "phase";
type Phase = "teoria" | "practica" | "ia" | "prueba";

const PHASES: Phase[] = ["teoria", "practica", "ia", "prueba"];

export default function CursoViewer({ courseId, onBack, onStateChange }: Props) {
  const course = getCourse(courseId);
  const totalLessons = course ? getTotalLessons(course) : 0;
  const [lastState, setLastState] = useState(() => loadState());
  const pct = getCourseCompletionPct(courseId, totalLessons);

  const [view, setView] = useState<View>("course");
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [phase, setPhase] = useState<Phase>("teoria");
  const [currentEx, setCurrentEx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [noHearts, setNoHearts] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(1);
  const [celebrationLevelUp, setCelebrationLevelUp] = useState(false);
  const [celebrationGems, setCelebrationGems] = useState(0);
  const [leccionIdx, setLeccionIdx] = useState(0);

  const isPremium = lastState.plan === "premium";
  const modules = useMemo(() => (course ? getModules(course) : []), [course]);

  const getPhaseProgress = useCallback(
    (moduleId: string) => getModulePhaseProgress(courseId, moduleId),
    [courseId],
  );

  const moduleDone = useCallback(
    (m: Module) => {
      const p = getModulePhaseProgress(courseId, m.id);
      return FASES.every((f) => p[f.id]);
    },
    [getModulePhaseProgress, courseId],
  );

  const getNextPhase = useCallback(
    (m: Module): Phase => {
      const p = getModulePhaseProgress(courseId, m.id);
      if (!p["teoria"]) return "teoria";
      if (!p["practica"]) return "practica";
      if (!p["ia"]) return "ia";
      return "prueba";
    },
    [getModulePhaseProgress],
  );

  const startModule = (m: Module) => {
    setActiveModule(m);
    setPhase(getNextPhase(m));
    setCurrentEx(0);
    setHearts(Math.max(5, loadState().hearts));
    setNoHearts(false);
    setXpEarned(0);
    setShowCelebration(false);
    setView("phase");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completePhase = (fase: Phase, xp: number) => {
    if (!activeModule) return;
    const prev = loadState();
    const prevLevel = getLevelFromXp(prev.xp).level;
    completeModulePhase(courseId, activeModule.id, fase, xp);
    const newState = loadState();
    setLastState(newState);
    const newLevel = getLevelFromXp(newState.xp).level;
    setCelebrationLevel(newLevel);
    setCelebrationLevelUp(newLevel > prevLevel);
    setCelebrationGems(Math.max(0, newState.gems - prev.gems));
    setXpEarned(xp);
    setShowCelebration(true);
    onStateChange();
  };

  const advance = (next: Phase) => {
    setPhase(next);
    setCurrentEx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCelebrationClose = () => setShowCelebration(false);

  const closeNoHearts = () => {
    setNoHearts(false);
  };

  const heartGateModal = noHearts ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="bg-surface-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <div className="text-5xl mb-3">😴</div>
        <h2 className="text-xl font-bold text-white mb-1">Te quedaste sin corazones</h2>
        <p className="text-sm text-surface-400 mb-5">Revisa la teoría o el tutor IA, y vuelve a practicar.</p>
        <button onClick={closeNoHearts} className="w-full btn-primary text-sm">
          Entendido
        </button>
      </motion.div>
    </div>
  ) : null;

  if (!course) return <div className="text-surface-400">Curso no encontrado</div>;

  // ── Vista curso: fases por módulo ─────────────────────────────────
  if (view === "course") {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-surface-400 hover:text-primary-400 transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white text-2xl shadow-lg`}
            >
              {course.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
              <p className="text-surface-400 text-sm mt-1">{course.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 via-accent-400 to-primary-300 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-surface-500 mt-1">
                {pct}% completado
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-primary-400 bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-500/20">
              <Zap size={16} /> {lastState.xp}
            </div>
          </div>
          <p className="text-xs text-surface-500">
            Cada módulo avanza en {FASES.length} fases: teoría → práctica → IA tutor → prueba final.
          </p>
        </div>

        {modules.map((mod) => {
          const prog = getPhaseProgress(mod.id);
          const next = getNextPhase(mod);
          const done = moduleDone(mod);
          return (
            <div
              key={mod.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white">{mod.title}</h3>
                <span className="text-xs text-surface-500">
                  {FASES.filter((f) => prog[f.id]).length}/{FASES.length} fases
                </span>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {FASES.map((f) => {
                    const hecha = !!prog[f.id];
                    const activa = next === f.id && !hecha;
                    return (
                      <div
                        key={f.id}
                        className={`rounded-xl border p-3 text-center transition-all ${
                          hecha
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : activa
                              ? "border-primary-500/50 bg-primary-500/10"
                              : "border-white/10 bg-white/5 opacity-60"
                        }`}
                      >
                        <div className="text-2xl mb-1">{hecha ? "✅" : f.icono}</div>
                        <p className="text-xs font-semibold text-white">{f.titulo}</p>
                        <p className="text-[10px] text-surface-500">
                          {hecha ? "Completado" : activa ? "Siguiente" : f.descripcion}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => startModule(mod)}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 btn-primary"
                >
                  {done ? (
                    <>
                      <BookOpen className="w-4 h-4" /> Revisar módulo
                    </>
                  ) : (
                    <>
                      {next === "teoria" ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}{" "}
                      {next === "teoria"
                        ? "Comenzar módulo"
                        : `Continuar: ${FASES.find((f) => f.id === next)?.titulo}`}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {heartGateModal}
      </div>
    );
  }

  if (view === "phase" && activeModule) {
    const prog = getModulePhaseProgress(courseId, activeModule.id);
    const practica = getPracticaExercises(activeModule);

    const phaseBar = (
      <div className="flex items-center gap-1 mb-6">
        {FASES.map((f) => {
          const hecha = !!prog[f.id];
          const activa = phase === f.id;
          return (
            <div key={f.id} className="flex-1 flex items-center gap-1">
              <div
                className={`h-2 flex-1 rounded-full ${
                  hecha ? "bg-emerald-500/70" : activa ? "bg-primary-500/70" : "bg-white/10"
                }`}
              />
            </div>
          );
        })}
        <span className="text-xs text-surface-500 ml-2">
          {FASES.find((f) => f.id === phase)?.titulo}
        </span>
      </div>
    );

    // ── FASE 1: TEORÍA (video + markdown por lección) ──────────────
    if (phase === "teoria") {
      const leccion = activeModule.lessons[leccionIdx];
      const videoUrl = leccion ? getLessonVideoUrl(courseId, leccion) : undefined;
      const leccionMark = leccion?.content || "";
      const esUltima = leccionIdx >= activeModule.lessons.length - 1;

      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => setView("course")}
            className="flex items-center gap-2 text-surface-400 hover:text-primary-400 text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> {activeModule.title}
          </button>
          {phaseBar}

          {leccion ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-surface-500">
                    Lección {leccionIdx + 1} de {activeModule.lessons.length}
                  </p>
                  <h3 className="font-bold text-white">{leccion.title}</h3>
                </div>
                {videoUrl && (
                  <span className="text-[10px] text-surface-500 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    {leccion.duration}
                  </span>
                )}
              </div>

              {videoUrl && <VideoPlayer videoUrl={videoUrl} onComplete={() => {}} />}

              {leccionMark.trim().length > 0 && (
                <div className="prose prose-invert max-w-none mt-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{leccionMark}</ReactMarkdown>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
              <p className="text-surface-400 text-sm">
                Este módulo no tiene lecciones de teoría. Puedes continuar a la práctica.
              </p>
            </div>
          )}

          <div className="flex justify-between items-center">
            {leccionIdx > 0 ? (
              <button
                onClick={() => setLeccionIdx((i) => Math.max(0, i - 1))}
                className="btn-secondary text-sm"
              >
                ← Anterior
              </button>
            ) : (
              <span />
            )}
            {esUltima || !leccion ? (
              <button
                onClick={() => {
                  completePhase("teoria", 20);
                  setLeccionIdx(0);
                  advance("practica");
                }}
                className="btn-primary text-sm"
              >
                Pasé la teoría &rarr; Práctica
              </button>
            ) : (
              <button
                onClick={() => setLeccionIdx((i) => i + 1)}
                className="btn-primary text-sm"
              >
                Siguiente lección &rarr;
              </button>
            )}
          </div>
          {showCelebration && (
            <CelebrationOverlay
              show={showCelebration}
              xpGained={xpEarned}
              streakDays={lastState.streak}
              gemsGained={celebrationGems}
              level={celebrationLevel}
              levelUp={celebrationLevelUp}
              onClose={handleCelebrationClose}
            />
          )}
        </div>
      );
    }

    // ── FASE 2: PRÁCTICA ───────────────────────────────────────────
    if (phase === "practica") {
      if (practica.length === 0) {
        return (
          <div className="max-w-3xl mx-auto space-y-6">
            <button
              onClick={() => setView("course")}
              className="flex items-center gap-2 text-surface-400 hover:text-primary-400 text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> {activeModule.title}
            </button>
            {phaseBar}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
              <p className="text-surface-400 text-sm">Este módulo no tiene ejercicios.</p>
              <button
                onClick={() => {
                  completePhase("practica", 20);
                  advance("ia");
                }}
                className="btn-primary text-sm mt-4"
              >
                Continuar
              </button>
            </div>
          </div>
        );
      }
      const q = practica[currentEx];
      const handleAnswer = (correct: boolean) => {
        if (!correct && !isPremium) {
          setHearts((h) => {
            const nh = h - 1;
            if (nh <= 0) setNoHearts(true);
            return nh;
          });
        }
        setXpEarned((x) => x + (correct ? 10 : 2));
        if (currentEx < practica.length - 1) {
          setCurrentEx((c) => c + 1);
        } else {
          completePhase("practica", Math.round(50 + xpEarned * 0.3));
          advance("ia");
        }
      };
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setView("course")}
            className="flex items-center gap-2 text-surface-400 hover:text-primary-400 text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> {activeModule.title}
          </button>
          {phaseBar}
          <div className="flex items-center justify-between bg-white/5 rounded-2xl border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <HealthBar hearts={hearts} />
              <span className="text-xs text-surface-400">{activeModule.title} · Práctica</span>
            </div>
            <span className="text-xs text-surface-500">
              {currentEx + 1}/{practica.length} ejercicios
            </span>
          </div>
          <AnimatePresence mode="wait">
            <ExerciseCard
              key={`${activeModule.id}-p-${currentEx}`}
              exercise={q}
              index={currentEx}
              total={practica.length}
              onNext={handleAnswer}
            />
          </AnimatePresence>
          <CelebrationOverlay
            show={showCelebration}
            xpGained={xpEarned}
            streakDays={lastState.streak}
            gemsGained={celebrationGems}
            level={celebrationLevel}
            levelUp={celebrationLevelUp}
            onClose={handleCelebrationClose}
          />
          {heartGateModal}
        </div>
      );
    }

    // ── FASE 3: LA IA TE ENSEÑA ────────────────────────────────────
    if (phase === "ia") {
      return (
        <div className="space-y-4">
          <button
            onClick={() => setView("course")}
            className="flex items-center gap-2 text-surface-400 hover:text-primary-400 text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> {activeModule.title}
          </button>
          {phaseBar}
          <TutorIA
            modulo={activeModule}
            onComplete={() => {
              completePhase("ia", 40);
              advance("prueba");
            }}
          />
        </div>
      );
    }

    // ── FASE 4: PRUEBA FINAL ───────────────────────────────────────
    if (phase === "prueba") {
      return (
        <div className="space-y-4">
          <button
            onClick={() => setView("course")}
            className="flex items-center gap-2 text-surface-400 hover:text-primary-400 text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> {activeModule.title}
          </button>
          {phaseBar}
          <PruebaModulo
            modulo={activeModule}
            onComplete={(aprobado, nota) => {
              completePhase("prueba", aprobado ? 60 : 15);
              if (!aprobado) {
                advance("practica");
              } else {
                setView("course");
                onStateChange();
              }
            }}
          />
          {showCelebration && (
            <CelebrationOverlay
              show={showCelebration}
              xpGained={xpEarned}
              streakDays={lastState.streak}
              gemsGained={celebrationGems}
              level={celebrationLevel}
              levelUp={celebrationLevelUp}
              onClose={handleCelebrationClose}
            />
          )}
        </div>
      );
    }
  }

  return null;
}