// ─── Cursos Premium IB — definiciones y carga del manifest ─────────────────
//
// El contenido vive en `public/cursos-premium/` (HTMLs autocontenidos generados
// con IA). Esta capa lee `manifest.json` con fetch y expone helpers tipados.

export type PremiumSubject = "matematicas" | "fisica" | "historia" | "sociedad-digital";

export interface PremiumCourse {
  id: string;
  title: string;
  subject: PremiumSubject;
  level: "SL" | "HL";
  file: string;
  description: string;
  durationMin: number;
  order?: number;
}

interface PremiumManifest {
  version?: number;
  courses: PremiumCourse[];
}

export interface PremiumSubjectMeta {
  id: PremiumSubject;
  label: string;
  ibCourseId: string;
  emoji: string;
  gradient: string;
}

export const PREMIUM_SUBJECTS: PremiumSubjectMeta[] = [
  {
    id: "matematicas",
    label: "Matemáticas",
    ibCourseId: "mathematics-analysis-and-approaches",
    emoji: "∫",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    id: "fisica",
    label: "Física",
    ibCourseId: "physics",
    emoji: "⚡",
    gradient: "from-cyan-500 to-cyan-700",
  },
  {
    id: "historia",
    label: "Historia",
    ibCourseId: "history",
    emoji: "🏛️",
    gradient: "from-amber-500 to-amber-700",
  },
  {
    id: "sociedad-digital",
    label: "Sociedad Digital",
    ibCourseId: "digital-society",
    emoji: "🌐",
    gradient: "from-violet-500 to-violet-700",
  },
];

export function getSubjectMeta(subject: PremiumSubject): PremiumSubjectMeta {
  return PREMIUM_SUBJECTS.find((s) => s.id === subject) ?? PREMIUM_SUBJECTS[0];
}

const MANIFEST_URL = "/cursos-premium/manifest.json";

let cachedManifest: PremiumManifest | null = null;
let pendingFetch: Promise<PremiumCourse[]> | null = null;

function normalizeManifest(data: PremiumManifest | null): PremiumCourse[] {
  if (!data || !Array.isArray(data.courses)) return [];
  const subjects = PREMIUM_SUBJECTS.map((s) => s.id);
  return data.courses
    .filter(
      (c): c is PremiumCourse =>
        typeof c?.id === "string" &&
        typeof c?.title === "string" &&
        typeof c?.file === "string" &&
        subjects.includes(c.subject as PremiumSubject),
    )
    .map(
      (c): PremiumCourse => ({
        ...c,
        level: c.level === "HL" ? "HL" : "SL",
        durationMin: typeof c.durationMin === "number" ? c.durationMin : 30,
        description: typeof c.description === "string" ? c.description : "",
      }),
    )
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.title.localeCompare(b.title));
}

export function premiumCourseUrl(course: PremiumCourse): string {
  const path = course.file.replace(/^\/+/, "");
  // encodeURI (no encodeURIComponent): deja intactos , ( ) y / que los
  // servidores estáticos decodifican con decodeURI; solo escapa espacios y
  // caracteres no ASCII.
  const encoded = encodeURI(path).replace(/#/g, "%23").replace(/\?/g, "%3F");
  return `/cursos-premium/${encoded}`;
}

export async function loadPremiumCourses(): Promise<PremiumCourse[]> {
  if (cachedManifest) return normalizeManifest(cachedManifest);
  if (pendingFetch) return pendingFetch;
  pendingFetch = (async () => {
    try {
      const res = await fetch(MANIFEST_URL);
      if (!res.ok) {
        console.warn(`[cursos-premium] manifest no disponible (${res.status})`);
        return [];
      }
      const data = (await res.json()) as PremiumManifest;
      cachedManifest = data;
      return normalizeManifest(data);
    } catch (err) {
      console.warn("[cursos-premium] no se pudo cargar el manifest", err);
      return [];
    } finally {
      pendingFetch = null;
    }
  })();
  return pendingFetch;
}

export function getPremiumCourse(courses: PremiumCourse[], id: string): PremiumCourse | undefined {
  return courses.find((c) => c.id === id);
}
