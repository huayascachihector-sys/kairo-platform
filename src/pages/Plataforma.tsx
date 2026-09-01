import { useState, useEffect, lazy, Suspense } from "react";
import {
  BookOpen,
  ChartBar as BarChart3,
  Sparkles,
  Calendar,
  Award,
  Menu,
  X,
  Settings,
  ChevronRight,
  LogOut,
  LibraryBig,
  Zap,
  FlaskConical,
  User,
  Wand as Wand2,
  Bell,
  Globe,
  Compass,
  Star,
  FileText,
  MessageSquare,
  FolderOpen,
  Target,
  Trophy,
  Store,
  Clapperboard,
  Layers,
  Languages,
  Microscope,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loadState, saveUser, logoutUser, ensureGameState, type StoreState } from "../lib/store";
import { GameBar } from "../components/plataforma/GameBar";

const Dashboard = lazy(() => import("./plataforma/Dashboard"));
const PremiumDashboard = lazy(() => import("./plataforma/PremiumDashboard"));
const MisCursos = lazy(() => import("./plataforma/MisCursos"));
const CursoViewer = lazy(() => import("./plataforma/CursoViewer"));
const AsistenteIA = lazy(() => import("./plataforma/AsistenteIA"));
const Horario = lazy(() => import("./plataforma/Horario"));
const Logros = lazy(() => import("./plataforma/Logros"));
const BancoPreguntas = lazy(() => import("./plataforma/BancoPreguntas"));
const TacticasCiencia = lazy(() => import("./plataforma/TacticasCiencia"));
const CopilotoInvestigacion = lazy(() => import("./plataforma/CopilotoInvestigacion"));
const ExamenesInternacionales = lazy(() => import("./plataforma/ExamenesInternacionales"));
const PlanEstudio = lazy(() => import("./plataforma/PlanEstudio"));
const Perfil = lazy(() => import("./plataforma/Perfil"));
const Configuracion = lazy(() => import("./plataforma/Configuracion"));
const Notificaciones = lazy(() => import("./plataforma/Notificaciones"));
const Carreras = lazy(() => import("./plataforma/Carreras"));
const Becas = lazy(() => import("./plataforma/Becas"));
const Entrevista = lazy(() => import("./plataforma/Entrevista"));
const Ensayo = lazy(() => import("./plataforma/Ensayo"));
const MiDocumentos = lazy(() => import("./plataforma/MiDocumentos"));
const EnglishTutor = lazy(() => import("./plataforma/EnglishTutor"));
const PracticeHub = lazy(() => import("./plataforma/PracticeHub"));
const Tienda = lazy(() => import("./plataforma/Tienda"));
const Ligas = lazy(() => import("./plataforma/Ligas"));
const Flashcards = lazy(() => import("./plataforma/Flashcards"));
const RepasoExpress = lazy(() => import("./plataforma/RepasoExpress"));
const LaboratorioInteractivo = lazy(() => import("./plataforma/LaboratorioInteractivo"));

type View =
  | "dashboard"
  | "cursos"
  | "curso-detail"
  | "plan"
  | "asistente"
  | "horario"
  | "banco"
  | "tacticas"
  | "copiloto"
  | "examenes"
  | "logros"
  | "carreras"
  | "notif"
  | "perfil"
  | "config"
  | "becas"
  | "entrevista"
  | "ensayo"
  | "mis-documentos"
  | "english-tutor"
  | "practice-hub"
  | "tienda"
  | "ligas"
  | "repaso-express"
  | "flashcards"
  | "laboratorio";

interface NavItem {
  id: View;
  label: string;
  icon: any;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Inicio",
    items: [{ id: "dashboard", label: "Mi Progreso", icon: BarChart3 }],
  },
  {
    title: "Estudiar",
    items: [
      { id: "cursos", label: "Mis Cursos", icon: BookOpen },
      { id: "plan", label: "Plan Inteligente", icon: Wand2 },
      { id: "repaso-express", label: "Repaso Express", icon: Zap },
      { id: "flashcards", label: "Flashcards", icon: Layers },
      { id: "horario", label: "Horario", icon: Calendar },
    ],
  },
  {
    title: "Practicar",
    items: [
      { id: "practice-hub", label: "Centro de Práctica", icon: Target },
      { id: "laboratorio", label: "Laboratorio Virtual", icon: FlaskConical },
      { id: "banco", label: "Banco de Preguntas", icon: LibraryBig },
      { id: "tacticas", label: "Tácticas de Ciencia", icon: Zap },
      { id: "examenes", label: "Exámenes de Admisión", icon: Globe },
      { id: "english-tutor", label: "English Tutor", icon: Languages },
      { id: "asistente", label: "Asistente IA", icon: Sparkles },
      { id: "copiloto", label: "Copiloto IB", icon: Microscope },
    ],
  },
  {
    title: "Preparación",
    items: [
      { id: "carreras", label: "Carreras", icon: Compass },
      { id: "becas", label: "Becas", icon: Star },
      { id: "ensayo", label: "Ensayos", icon: FileText },
      { id: "entrevista", label: "Entrevistas", icon: MessageSquare },
    ],
  },
  {
    title: "Comunidad",
    items: [
      { id: "ligas", label: "Ligas", icon: Trophy },
      { id: "logros", label: "Logros", icon: Award },
      { id: "tienda", label: "Tienda", icon: Store },
    ],
  },
];

const NAV_SECONDARY: NavItem[] = [
  { id: "mis-documentos", label: "Mis Documentos", icon: FolderOpen },
  { id: "notif", label: "Notificaciones", icon: Bell },
  { id: "perfil", label: "Mi Perfil", icon: User },
  { id: "config", label: "Configuración", icon: Settings },
];

const ALL_NAV: NavItem[] = [
  ...NAV_GROUPS.flatMap((g) => g.items),
  ...NAV_SECONDARY,
];

const VIEW_IDS = new Set<View>(ALL_NAV.map((n) => n.id));

function getParam(key: string) {
  try {
    const hash = window.location.hash;
    const query = hash.includes("?") ? hash.split("?")[1] : "";
    return new URLSearchParams(query).get(key) || "";
  } catch {
    return "";
  }
}

function loadDarkMode(): boolean {
  try {
    return localStorage.getItem("sm_darkmode") !== "0";
  } catch {
    return true;
  }
}
function saveDarkMode(v: boolean) {
  try {
    localStorage.setItem("sm_darkmode", v ? "1" : "0");
  } catch {}
}

function isStandaloneApp(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true ||
    /wv|electron/i.test(navigator.userAgent)
  );
}

export default function Plataforma() {
  const [view, setView] = useState<View>("dashboard");
  const [activeCourse, setActiveCourse] = useState<string>("");
  const [state, setState] = useState<StoreState>(loadState);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(loadDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    saveDarkMode(darkMode);
  }, [darkMode]);

  useEffect(() => {
    ensureGameState();
    const urlName = getParam("name");
    const urlEmail = getParam("email");
    const current = loadState();

    const deepMatch = window.location.hash.match(
      /^#\/plataforma\/([a-z0-9-]+)(?:\/(.+))?$/i,
    );

    if (!current.user && urlName && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(urlEmail)) {
      saveUser(urlName, urlEmail);
      setState(loadState());
    } else {
      setState(current);
    }

    if (deepMatch) {
      const v = deepMatch[1] as View;
      if (v === "curso-detail" && deepMatch[2]) {
        setActiveCourse(decodeURIComponent(deepMatch[2]));
        setView("curso-detail");
      } else if (VIEW_IDS.has(v)) {
        setView(v);
      }
    }
  }, []);

  const refreshState = () => setState(loadState());

  const navigate = (v: string, extra?: string) => {
    if (v === "cursos" && extra) {
      setActiveCourse(extra);
      setView("curso-detail");
      window.history.replaceState(
        null,
        "",
        `#/plataforma/curso-detail/${encodeURIComponent(extra)}`,
      );
    } else {
      setView(v as View);
      if (v !== "curso-detail") setActiveCourse("");
      const target = v === "dashboard" ? "#/plataforma" : `#/plataforma/${v}`;
      window.history.replaceState(null, "", target);
    }
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const firstName = (state.user?.name || "Estudiante").split(" ")[0];
  const initials = firstName.charAt(0).toUpperCase();
  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const avatarNode = state.user?.avatar ? (
    state.user.avatar.length <= 4 ? (
      <span className="text-lg">{state.user.avatar}</span>
    ) : (
      <img src={state.user.avatar} alt="avatar" className="w-full h-full object-cover" />
    )
  ) : (
    initials
  );

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full pt-6 pb-8 px-4">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <button
          onClick={() => navigate("dashboard")}
          className="flex items-center gap-2.5 text-left flex-1 min-w-0"
          aria-label="Ir al inicio del panel"
        >
          <img src="/logo-light.png" alt="KAIRO Logo" className="h-10 w-auto object-contain" />
        </button>
        {mobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-surface-400" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-4 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map(({ id, label, icon: Icon }) => {
                const isActive = view === id || (id === "cursos" && view === "curso-detail");
                return (
                  <button
                    key={id}
                    onClick={() => navigate(id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm"
                        : "text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <span className="truncate">{label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-4 mt-4 border-t border-surface-100 dark:border-surface-800">
          <p className="px-4 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">
            Mi cuenta
          </p>
          <div className="space-y-1">
            {NAV_SECONDARY.map(({ id, label, icon: Icon }) => {
              const isActive = view === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm"
                      : "text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className="truncate">{label}</span>
                  {id === "notif" && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => {
            logoutUser();
            window.location.hash = "#/registro";
          }}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-surface-400 dark:text-surface-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
        <button
          onClick={() => navigate("perfil")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
            {avatarNode}
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
              {firstName}
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              {state.xp} XP · {state.streak}🔥
            </p>
          </div>
          <Settings className="w-4 h-4 text-surface-400 dark:text-surface-500 group-hover:text-primary-500 transition-colors ml-auto flex-shrink-0" />
        </button>
      </div>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case "repaso-express":
        return <RepasoExpress onNavigate={navigate} />;
      case "flashcards":
        return <Flashcards onNavigate={navigate} />;
      case "dashboard":
        return <PremiumDashboard state={state} onNavigate={navigate} />;
      case "cursos":
        return <MisCursos state={state} onSelectCourse={(id) => navigate("cursos", id)} />;
      case "curso-detail":
        return (
          <CursoViewer
            courseId={activeCourse}
            onBack={() => navigate("cursos")}
            onStateChange={refreshState}
            onPracticeEnglish={() => setView("english-tutor")}
          />
        );
      case "plan":
        return <PlanEstudio onStateChange={refreshState} onNavigate={navigate} />;
      case "asistente":
        return <AsistenteIA />;
      case "english-tutor":
        return <EnglishTutor />;
      case "practice-hub":
        return <PracticeHub onNavigate={navigate} />;
      case "tienda":
        return <Tienda />;
      case "ligas":
        return <Ligas />;
      case "horario":
        return <Horario />;
      case "logros":
        return <Logros state={state} />;
      case "banco":
        return <BancoPreguntas />;
      case "laboratorio":
        return <LaboratorioInteractivo />;
      case "tacticas":
        return <TacticasCiencia onStateChange={refreshState} />;
      case "copiloto":
        return <CopilotoInvestigacion />;
      case "examenes":
        return <ExamenesInternacionales state={state} onStateChange={refreshState} />;
      case "carreras":
        return <Carreras state={state} onStateChange={refreshState} />;
      case "notif":
        return <Notificaciones onStateChange={refreshState} />;
      case "perfil":
        return <Perfil onStateChange={refreshState} />;
      case "config":
        return (
          <Configuracion
            darkMode={darkMode}
            onDarkModeChange={setDarkMode}
            onStateChange={refreshState}
          />
        );
      case "becas":
        return <Becas onNavigate={navigate} />;
      case "ensayo":
        return <Ensayo />;
      case "entrevista":
        return <Entrevista onNavigate={navigate} />;
      case "mis-documentos":
        return <MiDocumentos />;
      default:
        return <Dashboard state={state} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex transition-colors duration-300">
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:cyber-card-dark border-r border-surface-100 fixed top-0 left-0 h-full z-30 transition-colors duration-300">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="absolute left-0 top-0 h-full w-72 bg-white dark:cyber-card-dark shadow-2xl"
            >
              <Sidebar mobile />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64">
        <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-white dark:cyber-card-dark border-b border-surface-100 sticky top-0 z-20 transition-colors duration-300">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 text-surface-700 dark:text-surface-300" />
          </button>
          <span className="font-bold text-surface-900 dark:text-white">
            {ALL_NAV.find((n) => n.id === view || (n.id === "cursos" && view === "curso-detail"))
              ?.label || "Plataforma"}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate("notif")}
              className="relative p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5 text-surface-700 dark:text-surface-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => navigate("perfil")}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden"
              aria-label="Mi perfil"
            >
              {avatarNode}
            </button>
          </div>
        </div>

        <div className="px-4 md:px-8 py-8">
          <div className="mb-6">
            <GameBar onNavigate={navigate} />
          </div>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
              </div>
            }
          >
            {renderView()}
          </Suspense>
        </div>
      </div>
    </div>
  );
}