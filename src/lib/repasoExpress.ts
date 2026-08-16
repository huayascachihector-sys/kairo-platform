import type { StoreState } from "./store";
import { getSubjectProgress, getWeakTopicsForDashboard } from "./store";
import { ALL_COURSES } from "./courseData";
import type { Exercise } from "./courseData";

export interface WeakTopic {
  subjectId: string;
  subjectTitle: string;
  strength: number;
  totalQuestions: number;
  correctQuestions: number;
  lessonsToReview: string[];
}

export interface RepasoSession {
  id: string;
  createdAt: string;
  topics: WeakTopic[];
  questions: RepasoQuestion[];
  currentIndex: number;
  score: number;
  completed: boolean;
}

export interface RepasoQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "facil" | "medio" | "dificil";
}

function getWeakTopics(state: StoreState): WeakTopic[] {
  const topics: WeakTopic[] = [];
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

function generateQuestionsFromLessons(
  courseId: string,
  lessonIds: string[],
  count: number = 5,
): RepasoQuestion[] {
  const course = ALL_COURSES.find((c) => c.id === courseId);
  if (!course) return [];

  const allLessons = course.units
    ? course.units.flatMap((u) => u.modules.flatMap((m) => m.lessons))
    : course.modules.flatMap((m) => m.lessons);

  const targetLessons = allLessons.filter((l) => lessonIds.includes(l.id));
  const allExercises: { exercise: Exercise; lessonId: string; lessonTitle: string }[] = [];

  for (const lesson of targetLessons) {
    for (const ex of lesson.exercises || []) {
      allExercises.push({ exercise: ex, lessonId: lesson.id, lessonTitle: lesson.title });
    }
    if (lesson.variants) {
      for (const v of lesson.variants) {
        if (v.type === "choice") {
          allExercises.push({ exercise: v.data, lessonId: lesson.id, lessonTitle: lesson.title });
        }
      }
    }
  }

  const shuffled = allExercises.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((item, i) => ({
    id: `rq_${courseId}_${item.lessonId}_${i}`,
    topicId: courseId,
    topicTitle: course.title,
    question: item.exercise.question,
    options: item.exercise.options,
    correct: item.exercise.correct,
    explanation: item.exercise.explanation,
    difficulty: item.exercise.hints && item.exercise.hints.length > 2 ? "dificil" : "medio",
  }));
}

export function generateRepasoSession(state: StoreState): RepasoSession {
  const weakTopics = getWeakTopics(state);
  if (weakTopics.length === 0) {
    const allTopics: WeakTopic[] = ALL_COURSES.map((c) => {
      const p = getSubjectProgress(state, c.id);
      return {
        subjectId: c.id,
        subjectTitle: c.title,
        strength: p.pct,
        totalQuestions: p.total,
        correctQuestions: p.correct,
        lessonsToReview: Object.keys(state.progress[c.id] || {}).slice(0, 3),
      };
    }).filter((t) => t.totalQuestions > 0);
    allTopics.sort((a, b) => a.strength - b.strength);
    weakTopics.push(...allTopics.slice(0, 3));
  }

  const questions: RepasoQuestion[] = [];
  for (const topic of weakTopics) {
    const qns = generateQuestionsFromLessons(topic.subjectId, topic.lessonsToReview, 3);
    questions.push(...qns);
  }

  const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 10);

  return {
    id: `repaso_${Date.now()}`,
    createdAt: new Date().toISOString(),
    topics: weakTopics,
    questions: shuffled,
    currentIndex: 0,
    score: 0,
    completed: false,
  };
}

export function getSessionFromStorage(id: string): RepasoSession | null {
  try {
    const raw = localStorage.getItem(`kairo_repaso_${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as RepasoSession;
  } catch {
    return null;
  }
}

export function saveSessionToStorage(session: RepasoSession): void {
  try {
    localStorage.setItem(`kairo_repaso_${session.id}`, JSON.stringify(session));
  } catch {}
}

export function getRecentSessions(): RepasoSession[] {
  const sessions: RepasoSession[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("kairo_repaso_")) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const session = JSON.parse(raw) as RepasoSession;
          if (session.completed) sessions.push(session);
        }
      } catch {}
    }
  }
  return sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
}