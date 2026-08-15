// ─── Kairo Platform Store ──────────────────────────────────────────────────
// All state persisted in localStorage

import {
  getMondayKey,
  getTodayKey,
  applyGameRewards,
  ensureDailyState,
  MAX_HEARTS,
  GEM_PER_LESSON,
  GEM_PER_PERFECT,
  GEM_PER_QUEST,
  getEffectiveHearts,
  generateDailyQuests,
} from "./gamification";
import { ALL_COURSES } from "./courseData";

export interface UserData {
  name: string;
  email: string;
  joinedAt: string;
  avatar?: string;
  colegio?: string;
  grado?: string;
  pais?: string;
  metas?: string;
  onboarding?: OnboardingData;
}

export interface OnboardingData {
  completedAt?: string;
  age?: number;
  pais?: string;
  colegio?: string;
  nivelEducativo?: "secundaria" | "preuniversitario" | "universidad" | "egresado" | "otro";
  intereses?: string[];
  metasList?: string[];
  examenes?: string[];
  universidades?: string[];
  horasDiarias?: number;
  estiloAprendizaje?: "visual" | "lectura" | "practica" | "mixto";
}

export interface LessonProgress {
  completedAt: string;
  score: number; // 0-100
}

export interface CourseProgress {
  [lessonId: string]: LessonProgress;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "tarea" | "recordatorio" | "ia" | "curso" | "anuncio";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface StudyPlanTask {
  day: number;
  date: string;
  title: string;
  minutes: number;
  type: "repaso" | "teoria" | "ejercicios" | "simulacro" | "descanso";
  done: boolean;
}

export interface ResourceRecommendation {
  type: "banco" | "curso" | "examen" | "documento" | "asistente";
  subject: string;
  title: string;
  description: string;
  route: string;
  icon: string;
}

export interface StudyPlan {
  id: string;
  goal: string;
  days: number;
  createdAt: string;
  tasks: StudyPlanTask[];
  priorities: string[];
  subjects?: string[];
  difficulty?: "basico" | "intermedio" | "avanzado";
  hoursPerDay?: number;
  recommendations?: ResourceRecommendation[];
}

export interface Settings {
  darkMode: boolean;
  language: "es" | "en" | "qu";
  notifications: boolean;
  emailUpdates: boolean;
  publicProfile: boolean;
  voiceEnabled: boolean;
  voiceLang: "es" | "en";
  voiceRate: number;
}

export type GamePlan = "free" | "premium";

export type QuestType = "xp" | "lessons" | "practice" | "perfect" | "streak";

export interface QuestProgress {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
}

export type LeagueDivision =
  "bronce" | "plata" | "oro" | "zafiro" | "esmeralda" | "rubi" | "diamante";

export interface LeagueState {
  division: LeagueDivision;
  weeklyXP: number;
  weekStart: string;
  position: number;
  total: number;
}

export interface PowerUps {
  revive: number;
  timerBoost: number;
}

export interface SRSItem {
  lessonId: string;
  courseId: string;
  interval: number;
  easeFactor: number;
  nextReview: string;
  repetitions: number;
  lastReviewed: string | null;
}

export type ErrorType = "grammar" | "vocabulary" | "collocation" | "pronunciation" | "register";

export interface ErrorEntry {
  id: string;
  studentText: string;
  correctedText: string;
  explanation: string;
  type: ErrorType;
  level?: string; // CEFR estimado
  createdAt: string;
  lessonId?: string;
  resolved?: boolean;
}

export type ExamId = "sat" | "toefl";

export interface VocationalResult {
  scores: Record<string, number>;
  topCode: string;
  careerIds: string[];
  aiSummary: string;
  completedAt: string;
}

export interface ExamAttempt {
  id: string;
  exam: ExamId;
  section: string; // 'reading-writing' | 'math' | 'reading' | 'listening' | 'speaking' | 'writing'
  mode: "practica" | "simulacro";
  score: number; // 0-100 (porcentaje o score normalizado)
  scaledScore?: number; // 400-1600 SAT / 0-120 TOEFL
  correct?: number;
  total?: number;
  minutes: number;
  date: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  subject: string;
  courseId?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface ImportedQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "facil" | "medio" | "dificil";
}

export interface ImportedQuestionBank {
  id: string;
  name: string;
  source: string;
  subject: string;
  difficulty: "facil" | "medio" | "dificil";
  questions: ImportedQuestion[];
  importedAt: string;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // minutes
  date: string;
  startTime: string;
  endTime: string;
  type: "leccion" | "ejercicio" | "repaso" | "simulacro" | "documento" | "asistente";
}

export interface IbFlashcardEntry {
  courseId: string;
  count: number;
  importedAt: string;
  dataJsonSize: number;
}

export interface StoreState {
  user: UserData | null;
  progress: { [courseId: string]: CourseProgress };
  xp: number;
  streak: number;
  lastStudyDate: string;
  chatHistory: ChatMessage[];
  notifications: Notification[];
  studyPlans: StudyPlan[];
  examAttempts: ExamAttempt[];
  admissionChecklist: { [uniId: string]: string[] };
  vocationalTest: VocationalResult | null;
  settings: Settings;
  srsItems: SRSItem[];
  errorBank: ErrorEntry[];
  documents: Document[];
  studySessions: StudySession[];
  questionProgress: Record<string, { correct: number; total: number }>;
  importedBanks: ImportedQuestionBank[];
  ibBanks: import("./ibStore").IbQuestionBank[];
  ibFlashcardEntries: IbFlashcardEntry[];
  ibCourseData: import("./ibStore").IbCourseData[];
  plan: GamePlan;
  gems: number;
  hearts: number;
  lastHeartRefillAt: string;
  streakFreezes: number;
  dailyQuests: QuestProgress[];
  lastQuestDate: string;
  league: LeagueState;
  xpBoostUntil: string | null;
  xpBoostMultiplier: number;
  legendaryLessons: string[];
  mascotOutfit: string;
  mascotOutfits: string[];
  powerups: PowerUps;
  dailyXp: { date: string; xp: number };
  modulePhase: {
    [courseId: string]: { [moduleId: string]: Record<string, boolean> };
  };
  flashcards: FlashcardEntry[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  lastLoginAt: string;
  avatar?: string;
  colegio?: string;
  grado?: string;
  pais?: string;
  metas?: string;
  onboarding?: OnboardingData;
  state: StoreState;
}

export interface KairoDB {
  activeEmail: string | null;
  users: Record<string, UserAccount>;
}

const DB_KEY = "kairo_database";
const STORAGE_KEY = "studymind_state";

const defaultState: StoreState = {
  user: null,
  progress: {},
  xp: 0,
  streak: 0,
  lastStudyDate: "",
  chatHistory: [
    {
      id: "welcome",
      role: "ai",
      text: "¡Hola! Soy tu asistente de estudio IA. Puedo ayudarte con Matemáticas, Física, Química, Historia, Comunicación e Inglés. ¿Qué tema quieres repasar hoy?",
      timestamp: new Date().toISOString(),
    },
  ],
  notifications: [
    {
      id: "welcome",
      type: "anuncio",
      title: "¡Bienvenido a KAIRO!",
      body: "Explora tus cursos, crea un plan de estudio inteligente y desbloquea logros.",
      createdAt: new Date().toISOString(),
      read: false,
    },
  ],
  studyPlans: [],
  examAttempts: [],
  admissionChecklist: {},
  vocationalTest: null,
  settings: {
    darkMode: false,
    language: "es",
    notifications: true,
    emailUpdates: true,
    publicProfile: false,
    voiceEnabled: false,
    voiceLang: "es",
    voiceRate: 1,
  },
  srsItems: [],
  errorBank: [],
  documents: [],
  studySessions: [],
  questionProgress: {},
  importedBanks: [],
  ibBanks: [],
  ibFlashcardEntries: [],
  ibCourseData: [],
  plan: "free",
  gems: 0,
  hearts: 5,
  lastHeartRefillAt: new Date().toISOString(),
  streakFreezes: 0,
  dailyQuests: [],
  lastQuestDate: "",
  league: { division: "bronce", weeklyXP: 0, weekStart: getMondayKey(), position: 1, total: 10 },
  xpBoostUntil: null,
  xpBoostMultiplier: 1,
  legendaryLessons: [],
  mascotOutfit: "base",
  mascotOutfits: ["base"],
  powerups: { revive: 0, timerBoost: 0 },
  dailyXp: { date: getTodayKey(), xp: 0 },
  modulePhase: {},
  flashcards: [],
};

function loadDB(): KairoDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as KairoDB;
      return {
        activeEmail: parsed.activeEmail || null,
        users: parsed.users || {},
      };
    }

    // Migration: If legacy studymind_state exists, migrate it into KairoDB
    const legacyRaw = localStorage.getItem(STORAGE_KEY);
    if (legacyRaw) {
      const legacyState = JSON.parse(legacyRaw) as Partial<StoreState>;
      if (legacyState.user && legacyState.user.email) {
        const emailKey = legacyState.user.email.toLowerCase();
        const mergedState: StoreState = {
          ...defaultState,
          ...legacyState,
        };
        const db: KairoDB = {
          activeEmail: emailKey,
          users: {
            [emailKey]: {
              id: "usr_" + Math.random().toString(36).slice(2, 9),
              name: legacyState.user.name || "Estudiante",
              email: legacyState.user.email,
              joinedAt: legacyState.user.joinedAt || new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              avatar: legacyState.user.avatar,
              state: mergedState,
            },
          },
        };
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        return db;
      }
    }
  } catch {}

  return { activeEmail: null, users: {} };
}

function saveDB(db: KairoDB): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    if (db.activeEmail && db.users[db.activeEmail]) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db.users[db.activeEmail].state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export function loadState(): StoreState {
  const db = loadDB();
  if (db.activeEmail && db.users[db.activeEmail]) {
    const acc = db.users[db.activeEmail];
    const parsed = acc.state || {};
    const merged: StoreState = {
      ...defaultState,
      ...parsed,
      user: {
        name: acc.name,
        email: acc.email,
        joinedAt: acc.joinedAt,
        avatar: acc.avatar || parsed.user?.avatar,
        colegio: acc.colegio || parsed.user?.colegio,
        grado: acc.grado || parsed.user?.grado,
        pais: acc.pais || parsed.user?.pais,
        metas: acc.metas || parsed.user?.metas,
        onboarding: acc.onboarding || parsed.user?.onboarding,
      },
      settings: { ...defaultState.settings, ...(parsed.settings || {}) },
      chatHistory:
        parsed.chatHistory && parsed.chatHistory.length > 0
          ? parsed.chatHistory
          : defaultState.chatHistory,
      notifications: parsed.notifications || defaultState.notifications,
      studyPlans: parsed.studyPlans || [],
      examAttempts: parsed.examAttempts || [],
      errorBank: parsed.errorBank || [],
      questionProgress: parsed.questionProgress || {},
      importedBanks: parsed.importedBanks || [],
      ibBanks: parsed.ibBanks || [],
      ibFlashcardEntries: parsed.ibFlashcardEntries || [],
      ibCourseData: parsed.ibCourseData || [],
      admissionChecklist: parsed.admissionChecklist || {},
      vocationalTest: parsed.vocationalTest ?? null,
    };
    return merged;
  }
  return { ...defaultState, user: null };
}

export function saveState(state: StoreState): void {
  const db = loadDB();
  if (db.activeEmail && db.users[db.activeEmail]) {
    db.users[db.activeEmail].state = state;
    if (state.user) {
      db.users[db.activeEmail].name = state.user.name;
      db.users[db.activeEmail].avatar = state.user.avatar;
      db.users[db.activeEmail].onboarding = state.user.onboarding;
    }
    saveDB(db);
  } else if (state.user?.email) {
    const emailKey = state.user.email.toLowerCase();
    db.activeEmail = emailKey;
    db.users[emailKey] = {
      id: "usr_" + Math.random().toString(36).slice(2, 9),
      name: state.user.name,
      email: state.user.email,
      joinedAt: state.user.joinedAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      avatar: state.user.avatar,
      onboarding: state.user.onboarding,
      state,
    };
    saveDB(db);
  }
}

export function saveUser(name: string, email: string): StoreState {
  const emailKey = email.trim().toLowerCase();
  const db = loadDB();
  const now = new Date().toISOString();
  const existing = db.users[emailKey];

  const userState: StoreState = existing
    ? existing.state
    : {
        ...defaultState,
        notifications: [
          {
            id: "welcome_" + Date.now(),
            type: "anuncio",
            title: "¡Bienvenido a KAIRO!",
            body: "Explora tus cursos, crea tu plan de estudio con IA y potencia tu aprendizaje.",
            createdAt: now,
            read: false,
          },
          ...defaultState.notifications,
        ],
      };

  userState.user = {
    name: name.trim(),
    email: email.trim(),
    joinedAt: existing?.joinedAt || now,
    avatar: existing?.avatar || userState.user?.avatar,
    colegio: existing?.colegio || userState.user?.colegio,
    grado: existing?.grado || userState.user?.grado,
    pais: existing?.pais || userState.user?.pais,
    metas: existing?.metas || userState.user?.metas,
    onboarding: existing?.onboarding || userState.user?.onboarding,
  };

  const today = new Date().toDateString();
  if (userState.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    userState.streak = userState.lastStudyDate === yesterday ? userState.streak + 1 : 1;
    userState.lastStudyDate = today;
  }

  db.users[emailKey] = {
    id: existing?.id || "usr_" + Math.random().toString(36).slice(2, 9),
    name: name.trim(),
    email: email.trim(),
    joinedAt: existing?.joinedAt || now,
    lastLoginAt: now,
    avatar: userState.user.avatar,
    colegio: userState.user.colegio,
    grado: userState.user.grado,
    pais: userState.user.pais,
    metas: userState.user.metas,
    onboarding: userState.user.onboarding,
    state: userState,
  };

  db.activeEmail = emailKey;
  saveDB(db);
  return userState;
}

export function loginUser(email: string): StoreState | null {
  const emailKey = email.trim().toLowerCase();
  const db = loadDB();
  if (db.users[emailKey]) {
    db.activeEmail = emailKey;
    db.users[emailKey].lastLoginAt = new Date().toISOString();
    saveDB(db);
    return loadState();
  }
  return null;
}

export function logoutUser(): void {
  const db = loadDB();
  db.activeEmail = null;
  saveDB(db);
}

export function getRegisteredAccounts(): UserAccount[] {
  const db = loadDB();
  return Object.values(db.users).sort(
    (a, b) => new Date(b.lastLoginAt).getTime() - new Date(a.lastLoginAt).getTime(),
  );
}

export function getActiveUserAccount(): UserAccount | null {
  const db = loadDB();
  return db.activeEmail && db.users[db.activeEmail] ? db.users[db.activeEmail] : null;
}

export function updateUser(patch: Partial<UserData>): StoreState {
  const state = loadState();
  state.user = {
    ...(state.user || { name: "", email: "", joinedAt: new Date().toISOString() }),
    ...patch,
  };
  saveState(state);
  return state;
}

export function updateSettings(patch: Partial<Settings>): StoreState {
  const state = loadState();
  state.settings = { ...state.settings, ...patch };
  saveState(state);
  return state;
}

export function addNotification(n: Omit<Notification, "id" | "createdAt" | "read">): StoreState {
  const state = loadState();
  state.notifications = [
    {
      ...n,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      read: false,
    },
    ...state.notifications,
  ].slice(0, 50);
  saveState(state);
  return state;
}

export function scheduleSmartNotification(): string | null {
  const state = loadState();
  if (!state.settings.notifications) return null;
  if (typeof window !== "undefined" && !("Notification" in window)) return null;
  if (Notification.permission !== "granted") return null;

  const now = new Date();
  const hour = now.getHours();

  let title = "";
  let body = "";

  if (hour >= 6 && hour <= 9) {
    title = "🌅 ¡Buenos días!";
    body = "Es hora de estudiar. ¿Qué vas a aprender hoy?";
  } else if (hour >= 12 && hour <= 14) {
    title = "☀️ Hora del descanso";
    body = "Haz una pausa y repasa lo que estudiaste esta mañana.";
  } else if (hour >= 18 && hour <= 21) {
    title = "🌙 ¡Buenas noches!";
    body = "Revisa tus temas débiles antes de dormir. Mejor retención.";
  } else if (hour >= 21 || hour <= 5) {
    title = "😴 ¿Ya descansaste?";
    body = "Tu cerebro necesita sueño para consolidar lo aprendido.";
  } else {
    return null;
  }

  const srsDue = getSRSReviewItems();
  if (srsDue.length > 0) {
    body += ` Tienes ${srsDue.length} tarjeta${srsDue.length > 1 ? "s" : ""} pendiente${srsDue.length > 1 ? "s" : ""} para repasar.`;
  }

  const notification = new Notification(title, { body, icon: "/logo-192.png" });
  notification.onclick = () => {
    window.focus();
  };

  addNotification({
    type: "recordatorio",
    title,
    body,
  });

  return title;
}

export function requestNotificationPermission(): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "default") {
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") {
        addNotification({
          type: "anuncio",
          title: "🔔 Notificaciones activadas",
          body: "Recibirás recordatorios para estudiar y repasar.",
        });
      }
    });
  }
  return false;
}

export function getWeakTopicsForDashboard(state: StoreState) {
  const topics: Array<{
    subjectId: string;
    subjectTitle: string;
    strength: number;
    totalQuestions: number;
    correctQuestions: number;
    lessonsToReview: string[];
  }> = [];
  for (const course of ALL_COURSES) {
    const progress = getSubjectProgress(state, course.id);
    if (progress.total < 3) continue;
    const strength = progress.pct;
    if (strength < 70) {
      const lessonsToReview = Object.keys(state.progress[course.id] || {})
        .filter((lid) => {
          const lp = state.progress[course.id]?.[lid];
          return lp && lp.score < 70;
        })
        .slice(0, 3);
      topics.push({
        subjectId: course.id,
        subjectTitle: course.title,
        strength,
        totalQuestions: progress.total,
        correctQuestions: progress.correct,
        lessonsToReview,
      });
    }
  }
  topics.sort((a, b) => a.strength - b.strength);
  return topics.slice(0, 5);
}

export function getSmartNotificationSuggestion(state: StoreState): string | null {
  const srsDue = getSRSReviewItems();
  if (srsDue.length > 0) {
    return `Tienes ${srsDue.length} tarjeta${srsDue.length > 1 ? "s" : ""} de repaso pendiente${srsDue.length > 1 ? "s" : ""}. ¡No las olvides!`;
  }
  const weakTopics = getWeakTopicsForDashboard(state);
  if (weakTopics.length > 0 && weakTopics[0].strength < 50) {
    return `Tu tema más débil es ${weakTopics[0].subjectTitle} (${weakTopics[0].strength}%). Dedica 10 minutos a repasarlo.`;
  }
  if (state.streak >= 3 && state.streak % 3 === 0) {
    return `¡Llevas ${state.streak} días de racha! 🔥 Sigue así.`;
  }
  return null;
}

export function markNotificationRead(id: string): StoreState {
  const state = loadState();
  state.notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveState(state);
  return state;
}

export function markAllNotificationsRead(): StoreState {
  const state = loadState();
  state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
  saveState(state);
  return state;
}

export function saveStudyPlan(plan: StudyPlan): StoreState {
  const state = loadState();
  state.studyPlans = [plan, ...state.studyPlans].slice(0, 10);
  saveState(state);
  return state;
}

export function toggleStudyPlanTask(planId: string, day: number, title: string): StoreState {
  const state = loadState();
  state.studyPlans = state.studyPlans.map((p) =>
    p.id !== planId
      ? p
      : {
          ...p,
          tasks: p.tasks.map((t) =>
            t.day === day && t.title === title ? { ...t, done: !t.done } : t,
          ),
        },
  );
  saveState(state);
  return state;
}

export function deleteStudyPlan(planId: string): StoreState {
  const state = loadState();
  state.studyPlans = state.studyPlans.filter((p) => p.id !== planId);
  saveState(state);
  return state;
}

export function exportData(): string {
  return JSON.stringify(loadState(), null, 2);
}

export function deleteAccount(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("sm_darkmode");
  } catch {}
}

export function completeLesson(courseId: string, lessonId: string, score: number): StoreState {
  const state = loadState();
  if (!state.progress[courseId]) state.progress[courseId] = {};
  const alreadyDone = !!state.progress[courseId][lessonId];
  state.progress[courseId][lessonId] = {
    completedAt: new Date().toISOString(),
    score,
  };
  const gained = alreadyDone ? Math.round(25 + score * 0.25) : Math.round(50 + score * 0.5);
  const quests: Array<{ type: "lessons" | "perfect"; amount: number }> = [
    { type: "lessons", amount: 1 },
  ];
  if (score >= 90) quests.push({ type: "perfect", amount: 1 });
  applyGameRewards(state, {
    xp: gained,
    quests,
    gems: alreadyDone ? 2 : score >= 90 ? GEM_PER_PERFECT : GEM_PER_LESSON,
  });
  saveState(state);
  return state;
}

export function completeModulePhase(
  courseId: string,
  moduleId: string,
  fase: string,
  otorgaXp = 0,
): StoreState {
  const state = loadState();
  if (!state.modulePhase[courseId]) state.modulePhase[courseId] = {};
  if (!state.modulePhase[courseId][moduleId]) state.modulePhase[courseId][moduleId] = {};
  const yaCompletada = !!state.modulePhase[courseId][moduleId][fase];
  state.modulePhase[courseId][moduleId][fase] = true;
  if (otorgaXp > 0 && !yaCompletada) {
    applyGameRewards(state, { xp: otorgaXp, quests: [], gems: 0 });
  }
  saveState(state);
  return state;
}

export function getModulePhaseProgress(
  courseId: string,
  moduleId: string,
): Record<string, boolean> {
  const state = loadState();
  return state.modulePhase[courseId]?.[moduleId] ?? {};
}

export function saveChatMessage(msg: ChatMessage): void {
  const state = loadState();
  state.chatHistory = [...(state.chatHistory || []), msg];
  if (state.chatHistory.length > 100) {
    state.chatHistory = state.chatHistory.slice(-100);
  }
  saveState(state);
}

export function getCourseCompletionPct(courseId: string, totalLessons: number): number {
  const state = loadState();
  const done = Object.keys(state.progress[courseId] || {}).length;
  return totalLessons === 0 ? 0 : Math.round((done / totalLessons) * 100);
}

export function getWeeklyMinutes(): number[] {
  const state = loadState();
  const buckets = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  Object.values(state.progress).forEach((cp) => {
    Object.values(cp).forEach((lp) => {
      const d = new Date(lp.completedAt);
      const diffDays = Math.floor((d.getTime() - monday.getTime()) / 86400000);
      if (diffDays >= 0 && diffDays < 7) {
        buckets[diffDays] += 15;
      }
    });
  });

  (state.examAttempts || []).forEach((a) => {
    const d = new Date(a.date);
    const diffDays = Math.floor((d.getTime() - monday.getTime()) / 86400000);
    if (diffDays >= 0 && diffDays < 7) {
      buckets[diffDays] += a.minutes;
    }
  });
  return buckets;
}

// ─── Exámenes Internacionales ────────────────────────────────────────────────
export function recordExamAttempt(a: Omit<ExamAttempt, "id" | "date">): StoreState {
  const state = loadState();
  state.examAttempts = [
    ...(state.examAttempts || []),
    { ...a, id: Math.random().toString(36).slice(2), date: new Date().toISOString() },
  ].slice(-200);
  applyGameRewards(state, { xp: Math.round(20 + a.score * 0.4) });
  saveState(state);
  return state;
}

export function getExamAttempts(state: StoreState, exam: ExamId, section?: string): ExamAttempt[] {
  return (state.examAttempts || [])
    .filter((a) => a.exam === exam && (!section || a.section === section))
    .sort((x, y) => +new Date(x.date) - +new Date(y.date));
}

export function getExamSummary(state: StoreState, exam: ExamId) {
  const attempts = getExamAttempts(state, exam);
  const best = attempts.reduce((m, a) => Math.max(m, a.scaledScore ?? 0), 0);
  const avg = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
    : 0;
  const minutes = attempts.reduce((s, a) => s + a.minutes, 0);
  return { attempts: attempts.length, best, avg, minutes, pct: Math.min(100, avg) };
}

export function getTotalStats(state: StoreState) {
  let totalLessons = 0;
  let totalScore = 0;
  Object.values(state.progress).forEach((cp) => {
    const lessons = Object.values(cp);
    totalLessons += lessons.length;
    lessons.forEach((l) => (totalScore += l.score));
  });
  const avgScore = totalLessons > 0 ? Math.round(totalScore / totalLessons) : 0;
  const hours = Math.round((totalLessons * 15) / 60);
  return { totalLessons, avgScore, hours };
}

// ─── Achievements ─────────────────────────────────────────────────────────────
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  check: (state: StoreState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_lesson",
    title: "Primer Paso",
    description: "Completa tu primera lección",
    icon: "🎯",
    xpReward: 100,
    check: (s) => Object.values(s.progress).some((cp) => Object.keys(cp).length > 0),
  },
  {
    id: "streak_3",
    title: "Constancia",
    description: "Estudia 3 días seguidos",
    icon: "🔥",
    xpReward: 150,
    check: (s) => s.streak >= 3,
  },
  {
    id: "streak_7",
    title: "Semana Perfecta",
    description: "Estudia 7 días seguidos",
    icon: "⚡",
    xpReward: 300,
    check: (s) => s.streak >= 7,
  },
  {
    id: "xp_500",
    title: "Acumulador",
    description: "Gana 500 XP",
    icon: "💎",
    xpReward: 200,
    check: (s) => s.xp >= 500,
  },
  {
    id: "xp_1000",
    title: "Experto",
    description: "Gana 1000 XP",
    icon: "🏆",
    xpReward: 500,
    check: (s) => s.xp >= 1000,
  },
  {
    id: "xp_2500",
    title: "Maestro",
    description: "Gana 2500 XP",
    icon: "👑",
    xpReward: 1000,
    check: (s) => s.xp >= 2500,
  },
  {
    id: "perfect_score",
    title: "Perfeccionista",
    description: "Saca 100/100 en un ejercicio",
    icon: "⭐",
    xpReward: 200,
    check: (s) =>
      Object.values(s.progress).some((cp) => Object.values(cp).some((l) => l.score === 100)),
  },
  {
    id: "five_lessons",
    title: "Estudiante Aplicado",
    description: "Completa 5 lecciones",
    icon: "📚",
    xpReward: 250,
    check: (s) =>
      Object.values(s.progress).reduce((acc, cp) => acc + Object.keys(cp).length, 0) >= 5,
  },
  {
    id: "ten_lessons",
    title: "Estudiante Dedicado",
    description: "Completa 10 lecciones",
    icon: "📖",
    xpReward: 500,
    check: (s) =>
      Object.values(s.progress).reduce((acc, cp) => acc + Object.keys(cp).length, 0) >= 10,
  },
  {
    id: "two_courses",
    title: "Multidisciplinario",
    description: "Empieza 2 cursos distintos",
    icon: "🌟",
    xpReward: 300,
    check: (s) => Object.values(s.progress).filter((cp) => Object.keys(cp).length > 0).length >= 2,
  },
  {
    id: "all_courses",
    title: "Políglota Académico",
    description: "Inicia un curso en cada materia",
    icon: "🌍",
    xpReward: 1000,
    check: (s) =>
      Object.keys(s.progress).filter((cp) => Object.keys(s.progress[cp]).length > 0).length >= 4,
  },
  {
    id: "plan_created",
    title: "Estratega",
    description: "Crea tu primer plan de estudio inteligente",
    icon: "🧠",
    xpReward: 150,
    check: (s) => s.studyPlans.length > 0,
  },
  {
    id: "exam_taken",
    title: "Examinador",
    description: "Rindes tu primer simulacro",
    icon: "📝",
    xpReward: 200,
    check: (s) => s.examAttempts.length > 0,
  },
  {
    id: "essay_written",
    title: "Comunicador",
    description: "Escribes tu primer ensayo de práctica",
    icon: "✍️",
    xpReward: 150,
    check: (s) =>
      s.chatHistory.some((m) => m.role === "user" && m.text.toLowerCase().includes("ensayo")),
  },
  {
    id: "diag_complete",
    title: "Autoconocimiento",
    description: "Usas el diagnóstico de rendimiento",
    icon: "🧪",
    xpReward: 100,
    check: (s) =>
      s.chatHistory.some((m) => m.role === "user" && m.text.toLowerCase().includes("diagnostico")),
  },
  {
    id: "becas_explored",
    title: "Becario",
    description: "Exploras becas por primera vez",
    icon: "💰",
    xpReward: 75,
    check: (s) =>
      s.chatHistory.some((m) => m.role === "user" && m.text.toLowerCase().includes("beca")),
  },
  {
    id: "interview_done",
    title: "Entrevistador",
    description: "Practicas entrevistas de admisión",
    icon: "🎤",
    xpReward: 100,
    check: (s) =>
      s.chatHistory.some((m) => m.role === "user" && m.text.toLowerCase().includes("entrevista")),
  },
  {
    id: "biologia_done",
    title: "Biólogo",
    description: "Completa tu primera lección de Biología",
    icon: "🧬",
    xpReward: 100,
    check: (s) => s.progress["biologia"] && Object.keys(s.progress["biologia"]).length > 0,
  },
  {
    id: "computacion_done",
    title: "Programador",
    description: "Completa tu primera lección de Computación",
    icon: "💻",
    xpReward: 100,
    check: (s) => s.progress["computacion"] && Object.keys(s.progress["computacion"]).length > 0,
  },
  {
    id: "streak_30",
    title: "Legendaria",
    description: "Estudia 30 días seguidos — ¡Imposible!",
    icon: "🌟",
    xpReward: 2000,
    check: (s) => s.streak >= 30,
  },
];

export function toggleAdmissionTask(uniId: string, taskId: string): StoreState {
  const state = loadState();
  const done = state.admissionChecklist[uniId] || [];
  state.admissionChecklist[uniId] = done.includes(taskId)
    ? done.filter((t) => t !== taskId)
    : [...done, taskId];
  saveState(state);
  return state;
}

export function getAdmissionProgress(state: StoreState, uniId: string, total: number) {
  const done = (state.admissionChecklist[uniId] || []).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function saveVocationalResult(result: VocationalResult): StoreState {
  const state = loadState();
  state.vocationalTest = result;
  applyGameRewards(state, { xp: 100 });
  saveState(state);
  return state;
}

export function getUnlockedAchievements(state: StoreState): string[] {
  return ACHIEVEMENTS.filter((a) => a.check(state)).map((a) => a.id);
}

export function addXP(amount: number): StoreState {
  const state = loadState();
  applyGameRewards(state, { xp: amount });
  saveState(state);
  return state;
}

export function addSRSItem(item: SRSItem): StoreState {
  const state = loadState();
  state.srsItems = state.srsItems.filter((si) => si.lessonId !== item.lessonId);
  state.srsItems.push(item);
  saveState(state);
  return state;
}

export function getSRSReviewItems(): SRSItem[] {
  const state = loadState();
  const now = new Date().toISOString();
  return state.srsItems.filter((item) => item.nextReview <= now);
}

export function updateSRSItem(lessonId: string, courseId: string, quality: number): StoreState {
  const state = loadState();
  const existing = state.srsItems.find((si) => si.lessonId === lessonId);
  let item: SRSItem;
  if (existing) {
    const newInterval = Math.max(1, Math.round(existing.interval * existing.easeFactor));
    const newEase = Math.max(1.3, existing.easeFactor + (0.1 - (5 - quality) * 0.08));
    item = {
      ...existing,
      interval: newInterval,
      easeFactor: newEase,
      repetitions: quality >= 3 ? existing.repetitions + 1 : 0,
      lastReviewed: new Date().toISOString(),
      nextReview: new Date(Date.now() + newInterval * 86400000).toISOString(),
    };
  } else {
    item = {
      lessonId,
      courseId,
      interval: 1,
      easeFactor: 2.5,
      nextReview: new Date(Date.now() + 86400000).toISOString(),
      repetitions: 0,
      lastReviewed: new Date().toISOString(),
    };
  }
  state.srsItems = state.srsItems.filter((si) => si.lessonId !== lessonId);
  state.srsItems.push(item);
  saveState(state);
  return state;
}

// ─── Error Bank (English) ───────────────────────────────────────────

export function addErrorEntry(
  entry: Omit<ErrorEntry, "id" | "createdAt" | "resolved">,
): StoreState {
  const state = loadState();
  const newEntry: ErrorEntry = {
    ...entry,
    id: Math.random().toString(36).slice(2, 10),
    createdAt: new Date().toISOString(),
    resolved: false,
  };
  state.errorBank = [newEntry, ...state.errorBank].slice(0, 500);
  saveState(state);
  return state;
}

export function getErrorBank(): ErrorEntry[] {
  return loadState().errorBank;
}

export function getUnresolvedErrorBank(): ErrorEntry[] {
  return loadState().errorBank.filter((e) => !e.resolved);
}

export function markErrorResolved(id: string, resolved = true): StoreState {
  const state = loadState();
  state.errorBank = state.errorBank.map((e) => (e.id === id ? { ...e, resolved } : e));
  saveState(state);
  return state;
}

export function deleteErrorEntry(id: string): StoreState {
  const state = loadState();
  state.errorBank = state.errorBank.filter((e) => e.id !== id);
  saveState(state);
  return state;
}

export function getErrorBankStats() {
  const bank = getErrorBank();
  const byType: Record<ErrorType, number> = {
    grammar: 0,
    vocabulary: 0,
    collocation: 0,
    pronunciation: 0,
    register: 0,
  };
  for (const e of bank) {
    if (e.type in byType) byType[e.type]++;
  }
  const resolved = bank.filter((e) => e.resolved).length;
  return {
    total: bank.length,
    resolved,
    unresolved: bank.length - resolved,
    byType,
    mostFrequent: (Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] as ErrorType) || null,
  };
}

// ─── Documents ──────────────────────────────────────────────────────

export function addDocument(doc: Omit<Document, "id" | "createdAt" | "updatedAt">): StoreState {
  const state = loadState();
  const now = new Date().toISOString();
  const newDoc: Document = {
    ...doc,
    id: Math.random().toString(36).slice(2),
    createdAt: now,
    updatedAt: now,
  };
  state.documents = [newDoc, ...state.documents].slice(0, 200);
  saveState(state);
  return state;
}

export function updateDocument(
  id: string,
  patch: Partial<Pick<Document, "title" | "content" | "subject" | "isPublic">>,
): StoreState {
  const state = loadState();
  state.documents = state.documents.map((d) =>
    d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d,
  );
  saveState(state);
  return state;
}

export function deleteDocument(id: string): StoreState {
  const state = loadState();
  state.documents = state.documents.filter((d) => d.id !== id);
  saveState(state);
  return state;
}

export function getDocumentsBySubject(state: StoreState, subject?: string): Document[] {
  if (!subject) return state.documents;
  return state.documents.filter((d) => d.subject === subject);
}

// ─── Study Sessions ─────────────────────────────────────────────────

export function addStudySession(session: Omit<StudySession, "id">): StoreState {
  const state = loadState();
  const newSession: StudySession = {
    ...session,
    id: Math.random().toString(36).slice(2),
  };
  state.studySessions = [...state.studySessions, newSession].slice(-500);
  applyGameRewards(state, { xp: Math.round(session.duration / 10) });
  saveState(state);
  return state;
}

export function getWeeklyStudyMinutes(state: StoreState): number[] {
  const buckets = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  (state.studySessions || []).forEach((s) => {
    const d = new Date(s.date);
    const diffDays = Math.floor((d.getTime() - monday.getTime()) / 86400000);
    if (diffDays >= 0 && diffDays < 7) {
      buckets[diffDays] += s.duration;
    }
  });
  return buckets;
}

export function getDailyStudyHistory(
  state: StoreState,
): Array<{ date: string; minutes: number; sessions: number }> {
  const last30: Array<{ date: string; minutes: number; sessions: number }> = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const daySessions = (state.studySessions || []).filter((s) => s.date === dateStr);
    const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
    if (totalMinutes > 0) {
      last30.push({ date: dateStr, minutes: totalMinutes, sessions: daySessions.length });
    }
  }
  return last30;
}

// ─── Question Progress ─────────────────────────────────────────────
export function recordQuestionAnswer(questionKey: string, correct: boolean): StoreState {
  const state = loadState();
  const prev = state.questionProgress[questionKey] || { correct: 0, total: 0 };
  state.questionProgress[questionKey] = {
    correct: prev.correct + (correct ? 1 : 0),
    total: prev.total + 1,
  };
  if (correct) applyGameRewards(state, { xp: 5 });
  saveState(state);
  return state;
}

export function getSubjectProgress(
  state: StoreState,
  subjectId: string,
): { correct: number; total: number; pct: number } {
  let correct = 0;
  let total = 0;
  for (const [key, val] of Object.entries(state.questionProgress)) {
    if (key.startsWith(subjectId)) {
      correct += val.correct;
      total += val.total;
    }
  }
  return { correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
}

export function addImportedBank(bank: Omit<ImportedQuestionBank, "id" | "importedAt">): StoreState {
  const state = loadState();
  state.importedBanks = [
    {
      ...bank,
      id: Math.random().toString(36).slice(2),
      importedAt: new Date().toISOString(),
    },
    ...state.importedBanks,
  ].slice(0, 50);
  saveState(state);
  return state;
}

export function removeImportedBank(id: string): StoreState {
  const state = loadState();
  state.importedBanks = state.importedBanks.filter((b) => b.id !== id);
  saveState(state);
  return state;
}

// ─── IB Question Banks ──────────────────────────────────────────────

export function addIbBank(
  bank: Omit<import("./ibStore").IbQuestionBank, "id" | "importedAt">,
): StoreState {
  const state = loadState();
  state.ibBanks = [
    {
      ...bank,
      id: Math.random().toString(36).slice(2),
      importedAt: new Date().toISOString(),
    },
    ...state.ibBanks,
  ].slice(0, 100);
  saveState(state);
  return state;
}

export function removeIbBank(id: string): StoreState {
  const state = loadState();
  state.ibBanks = state.ibBanks.filter((b) => b.id !== id);
  saveState(state);
  return state;
}

export function getIbBanksByCourse(
  state: StoreState,
  courseId: string,
): import("./ibStore").IbQuestionBank[] {
  return state.ibBanks.filter((b) => b.courseId === courseId);
}

export function getIbCourseStats(
  state: StoreState,
  courseId: string,
): { banks: number; questions: number } {
  const banks = state.ibBanks.filter((b) => b.courseId === courseId);
  const questions = banks.reduce((sum, b) => sum + b.questions.length, 0);
  return { banks: banks.length, questions };
}

// ─── IB Flashcard entries (IndexedDB metadata) ───────────────────────

export function addIbFlashcardEntry(
  courseId: string,
  count: number,
  dataJsonSize: number,
): StoreState {
  const state = loadState();
  state.ibFlashcardEntries = [
    ...state.ibFlashcardEntries.filter((e) => e.courseId !== courseId),
    { courseId, count, importedAt: new Date().toISOString(), dataJsonSize },
  ];
  saveState(state);
  return state;
}

export function removeIbFlashcardEntry(courseId: string): StoreState {
  const state = loadState();
  state.ibFlashcardEntries = state.ibFlashcardEntries.filter((e) => e.courseId !== courseId);
  saveState(state);
  return state;
}

export function getIbFlashcardEntry(
  state: StoreState,
  courseId: string,
): IbFlashcardEntry | undefined {
  return state.ibFlashcardEntries.find((e) => e.courseId === courseId);
}

export function setIbCourseData(data: import("./ibStore").IbCourseData[]): StoreState {
  const state = loadState();
  state.ibCourseData = data;
  saveState(state);
  return state;
}

export function getIbCourseData(
  state: StoreState,
  courseId: string,
): import("./ibStore").IbCourseData | undefined {
  return state.ibCourseData.find((d) => d.courseId === courseId);
}

// ─── Gamificación (KAIRO World-Class) ────────────────────────────────────────

export function setPlan(plan: GamePlan): StoreState {
  const state = loadState();
  state.plan = plan;
  if (plan === "premium") {
    state.hearts = MAX_HEARTS;
    state.lastHeartRefillAt = new Date().toISOString();
  }
  saveState(state);
  return state;
}

export function ensureGameState(): StoreState {
  const state = loadState();
  ensureDailyState(state);
  syncHearts(state);
  saveState(state);
  return state;
}

export function recordPracticeAction(): StoreState {
  const state = loadState();
  applyGameRewards(state, { xp: 2, quests: [{ type: "practice", amount: 1 }] });
  saveState(state);
  return state;
}

export function addGems(amount: number): StoreState {
  const state = loadState();
  state.gems += amount;
  saveState(state);
  return state;
}

export function spendGems(amount: number): boolean {
  const state = loadState();
  if (state.gems < amount) return false;
  state.gems -= amount;
  saveState(state);
  return true;
}

export function syncHearts(state: StoreState): void {
  if (state.plan === "premium") return;
  const effective = getEffectiveHearts(state);
  if (effective >= MAX_HEARTS) {
    if (state.hearts < MAX_HEARTS) {
      state.hearts = MAX_HEARTS;
      state.lastHeartRefillAt = new Date().toISOString();
    }
    return;
  }
  state.hearts = effective;
}

export function spendHeart(): StoreState {
  const state = loadState();
  syncHearts(state);
  if (state.plan === "premium") return state;
  if (state.hearts <= 0) return state;
  state.hearts -= 1;
  if (state.hearts === MAX_HEARTS - 1) {
    state.lastHeartRefillAt = new Date().toISOString();
  }
  saveState(state);
  return state;
}

export function refillHearts(): StoreState {
  const state = loadState();
  state.hearts = MAX_HEARTS;
  state.lastHeartRefillAt = new Date().toISOString();
  saveState(state);
  return state;
}

export function claimQuestReward(questId: string): StoreState {
  const state = loadState();
  ensureDailyState(state);
  const quest = state.dailyQuests.find((q) => q.id === questId);
  if (!quest || !quest.completed || quest.claimed) return state;
  quest.claimed = true;
  applyGameRewards(state, { xp: quest.reward, gems: GEM_PER_QUEST });
  saveState(state);
  return state;
}

export function useStreakFreeze(): StoreState {
  const state = loadState();
  if (state.streakFreezes > 0) {
    state.streakFreezes -= 1;
    saveState(state);
  }
  return state;
}

export function buyShopItem(itemId: string): { ok: boolean; state: StoreState } {
  const state = loadState();
  if (itemId === "refill_hearts") {
    if (state.gems < 100) return { ok: false, state };
    state.gems -= 100;
    state.hearts = MAX_HEARTS;
    state.lastHeartRefillAt = new Date().toISOString();
  } else if (itemId === "streak_freeze") {
    if (state.gems < 200) return { ok: false, state };
    state.gems -= 200;
    state.streakFreezes += 1;
  } else if (itemId === "xp_boost") {
    if (state.gems < 150) return { ok: false, state };
    state.gems -= 150;
    state.xpBoostUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    state.xpBoostMultiplier = 2;
  } else if (itemId === "revive") {
    if (state.gems < 80) return { ok: false, state };
    state.gems -= 80;
    state.powerups.revive += 1;
  } else {
    return { ok: false, state };
  }
  saveState(state);
  return { ok: true, state };
}

export function activateXpBoost(): StoreState {
  const state = loadState();
  state.xpBoostUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  state.xpBoostMultiplier = 2;
  saveState(state);
  return state;
}

export function useRevive(): StoreState {
  const state = loadState();
  if (state.powerups.revive > 0) {
    state.powerups.revive -= 1;
    state.hearts = MAX_HEARTS;
    state.lastHeartRefillAt = new Date().toISOString();
  }
  saveState(state);
  return state;
}

export function setMascotOutfit(outfitId: string): StoreState {
  const state = loadState();
  if (state.mascotOutfits.includes(outfitId)) {
    state.mascotOutfit = outfitId;
  }
  saveState(state);
  return state;
}

export function buyMascotOutfit(outfitId: string): { ok: boolean; state: StoreState } {
  const state = loadState();
  if (state.mascotOutfits.includes(outfitId)) {
    state.mascotOutfit = outfitId;
    saveState(state);
    return { ok: true, state };
  }
  const costs: Record<string, number> = { graduado: 300, superheroe: 500, astronauta: 750 };
  const cost = costs[outfitId] ?? 0;
  if (state.gems < cost) return { ok: false, state };
  state.gems -= cost;
  state.mascotOutfits.push(outfitId);
  state.mascotOutfit = outfitId;
  saveState(state);
  return { ok: true, state };
}

export function markLegendary(lessonId: string): StoreState {
  const state = loadState();
  if (!state.legendaryLessons.includes(lessonId)) {
    state.legendaryLessons.push(lessonId);
    applyGameRewards(state, { xp: 30, gems: 5 });
  }
  saveState(state);
  return state;
}

export function isLegendary(lessonId: string): boolean {
  return loadState().legendaryLessons.includes(lessonId);
}

export function getDailyXpToday(): number {
  const state = loadState();
  ensureDailyState(state);
  return state.dailyXp.xp;
}

export function getGameSummary(state: StoreState) {
  ensureDailyState(state);
  const hearts = getEffectiveHearts(state);
  const heartsLeft = state.plan === "premium" ? Infinity : hearts;
  const questsDone = state.dailyQuests.filter((q) => q.completed).length;
  const questsTotal = state.dailyQuests.length;
  return {
    hearts,
    heartsLeft,
    gems: state.gems,
    streak: state.streak,
    streakFreezes: state.streakFreezes,
    questsDone,
    questsTotal,
    dailyXp: state.dailyXp.xp,
    league: state.league,
    plan: state.plan,
    powerups: state.powerups,
  };
}

export function getDailyQuests(): QuestProgress[] {
  const state = loadState();
  ensureDailyState(state);
  return state.dailyQuests;
}

export function resetLeagueForTesting(): StoreState {
  const state = loadState();
  state.league = {
    division: "bronce",
    weeklyXP: 0,
    weekStart: getMondayKey(),
    position: 1,
    total: 10,
  };
  saveState(state);
  return state;
}

// ─── Flashcards ────────────────────────────────────────────────────

export interface FlashcardEntry {
  id: string;
  lessonId: string;
  courseId: string;
  question: string;
  answer: string;
  difficulty: "facil" | "medio" | "dificil";
  createdAt: string;
  source: "ai" | "manual";
}

export function generateFlashcardsFromLesson(
  lessonId: string,
  courseId: string,
  lessonContent: string
): StoreState {
  const state = loadState();
  const questions = extractFlashcardQuestions(lessonContent, courseId, lessonId);
  state.flashcards = [...(state.flashcards || []), ...questions];
  saveState(state);
  return state;
}

export function generateFlashcardsForCourse(courseId: string): StoreState {
  const state = loadState();
  const course = ALL_COURSES.find((c) => c.id === courseId);
  if (!course) return state;

  const allLessons = course.units
    ? course.units.flatMap((u) => u.modules.flatMap((m) => m.lessons))
    : course.modules.flatMap((m) => m.lessons);

  let newCards: FlashcardEntry[] = [];
  for (const lesson of allLessons) {
    if (lesson.content && lesson.content.trim().length > 0) {
      const questions = extractFlashcardQuestions(lesson.content, courseId, lesson.id);
      newCards.push(...questions);
    }
  }

  state.flashcards = [...(state.flashcards || []), ...newCards];
  saveState(state);
  return state;
}

function extractFlashcardQuestions(
  content: string,
  courseId: string,
  lessonId: string
): FlashcardEntry[] {
  const cards: FlashcardEntry[] = [];

  // Extract definitions (pattern: "Term: definition" or "**Term** - definition")
  const definitionRegex = /\*\*([^*]+)\*\*\s*[-–—]\s*([^.\n]+)/g;
  let match;
  while ((match = definitionRegex.exec(content)) !== null) {
    cards.push({
      id: `fc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      lessonId,
      courseId,
      question: match[1].trim(),
      answer: match[2].trim(),
      difficulty: "medio",
      createdAt: new Date().toISOString(),
      source: "ai",
    });
  }

  // Extract key terms (bold terms that appear in context)
  const boldTerms = content.match(/\*\*([^*]+)\*\*/g) || [];
  const seen = new Set<string>();
  for (const term of boldTerms) {
    const clean = term.replace(/\*/g, "").trim();
    if (clean.length > 3 && clean.length < 60 && !seen.has(clean)) {
      seen.add(clean);
      const contextMatch = content.match(new RegExp(`\\*\\*${clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*[^.]{0,200}`));
      const answer = contextMatch
        ? contextMatch[0].replace(/\*\*/g, "").replace(clean, "").trim().slice(0, 300)
        : "Revisa la lección para la explicación completa.";
      cards.push({
        id: `fc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        lessonId,
        courseId,
        question: clean,
        answer,
        difficulty: "facil",
        createdAt: new Date().toISOString(),
        source: "ai",
      });
    }
  }

  // Extract "Key concept" or "Concepto clave" sections
  const conceptRegex = /(?:concepto clave|key concept|concepto importante|idea principal)[:\s]+\s*([^.\n]+)/gi;
  while ((match = conceptRegex.exec(content)) !== null) {
    cards.push({
      id: `fc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      lessonId,
      courseId,
      question: "¿Cuál es el concepto clave?",
      answer: match[1].trim(),
      difficulty: "medio",
      createdAt: new Date().toISOString(),
      source: "ai",
    });
  }

  return cards;
}

export function getFlashcards(state: StoreState): FlashcardEntry[] {
  return state.flashcards || [];
}

export function getFlashcardsByCourse(state: StoreState, courseId: string): FlashcardEntry[] {
  return (state.flashcards || []).filter((f) => f.courseId === courseId);
}

export function getFlashcardsByLesson(state: StoreState, lessonId: string): FlashcardEntry[] {
  return (state.flashcards || []).filter((f) => f.lessonId === lessonId);
}

export function addFlashcard(flashcard: Omit<FlashcardEntry, "id" | "createdAt">): StoreState {
  const state = loadState();
  const newCard: FlashcardEntry = {
    ...flashcard,
    id: `fc_manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  state.flashcards = [...(state.flashcards || []), newCard];
  saveState(state);
  return state;
}

export function removeFlashcard(id: string): StoreState {
  const state = loadState();
  state.flashcards = (state.flashcards || []).filter((f) => f.id !== id);
  saveState(state);
  return state;
}

export function getFlashcardStats(state: StoreState) {
  const cards = state.flashcards || [];
  return {
    total: cards.length,
    byCourse: cards.reduce((acc, f) => {
      acc[f.courseId] = (acc[f.courseId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    aiGenerated: cards.filter((f) => f.source === "ai").length,
    manual: cards.filter((f) => f.source === "manual").length,
  };
}
