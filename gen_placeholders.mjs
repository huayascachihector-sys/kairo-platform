// Genera un placeholder .mp4 (marca KAIRO + título de lección) para todas las
// lecciones que aún no tienen video, usando el ffmpeg del venv del backend.
// Uso: node _gen_placeholders.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const FFMPEG =
  "agentedevideos/servicio_video/venv/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe";
const OUT = "public/videos";

// Importamos la data de cursos/lecciones
const { ALL_COURSES } = await import("./src/lib/courseData.ts");

const lessons = [];
for (const c of ALL_COURSES || []) {
  const mods = c.units ? c.units.flatMap((u) => u.modules) : c.modules;
  for (const mod of mods) {
    for (const l of mod.lessons) {
      lessons.push({ course: c.id, lesson: l.id, title: l.title });
    }
  }
}

let generated = 0;
let skipped = 0;

for (const { course, lesson, title } of lessons) {
  const courseClean = course.replace(/[^a-zA-Z0-9-]/g, "");
  const lessonClean = lesson.replace(/[^a-zA-Z0-9-]/g, "");
  const target = join(OUT, courseClean, lessonClean + ".mp4");
  if (existsSync(target)) {
    skipped++;
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  // Texto: "KAIRO" + título sanitizado (escape para ffmpeg)
  const safeTitle = title.replace(/'/g, " ").replace(/:/g, " ");
  const text = `KAIRO - ${safeTitle}`;
  try {
    execFileSync(
      FFMPEG,
      [
        "-y",
        "-f", "lavfi",
        "-i", "color=c=0x1e1b2e:s=1280x720:d=6",
        "-vf",
        `drawtext=text='${text}':x=(w-text_w)/2:y=(h-text_h)/2:fontcolor=0xffffff:fontsize=42:borderw=4:bordercolor=0x000000`,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        target,
      ],
      { stdio: "ignore" },
    );
    generated++;
  } catch (e) {
    console.error("FAIL", target, String(e.message || e).slice(0, 200));
  }
}

console.log(`Placeholders generados: ${generated}`);
console.log(`Omitidos (ya existían): ${skipped}`);