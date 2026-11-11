#!/usr/bin/env node
// ─── KAIRO Premium — regenera manifest.json desde los HTMLs de la carpeta ────
//
// Escanea public/cursos-premium/<materia>/ (recursivo), lee el <title> y la
// <meta description> de cada HTML y genera public/cursos-premium/manifest.json.
//
// Uso:
//   npm run premium:scan            # regenera el manifest
//   npm run premium:scan -- --dry   # solo muestra lo detectado (no escribe)

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "..", "..");
const PREMIUM_DIR = join(ROOT, "public", "cursos-premium");
const MANIFEST_PATH = join(PREMIUM_DIR, "manifest.json");
const SUBJECTS = ["matematicas", "fisica", "historia", "sociedad-digital"];
const SUBJECT_LABELS = {
  matematicas: "Matemáticas",
  fisica: "Física",
  historia: "Historia",
  "sociedad-digital": "Sociedad Digital",
};
const DRY = process.argv.includes("--dry");

function walkHtml(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkHtml(p));
    else if (extname(entry).toLowerCase() === ".html") out.push(p);
  }
  return out;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]).replace(/\s+/g, " ").trim() : "";
}

function extractDescription(html) {
  const m =
    html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  return m ? decodeEntities(m[1]).replace(/\s+/g, " ").trim() : "";
}

function cleanTitle(raw, filename) {
  let t = raw || basename(filename, extname(filename));
  t = t.replace(/\s+/g, " ").trim();
  // Quitar sufijos de materia ("– Física IB", "· Physics IB", "— IB History", ...)
  t = t.replace(
    /\s*[–—|·]\s*(?:IB\s+)?(?:Física|Matem[áa]ticas?|Historia|Sociedad Digital|Mathematics|Physics|History|Digital Society)\s*(?:IB)?.*$/i,
    "",
  );
  // Quitar marcador de descarga duplicada "(1)", "(2)" al final
  t = t.replace(/\s*\(\d+\)\s*$/, "");
  t = t.replace(/\.html$/i, "");
  // "L_Hôpital" → "L'Hôpital" (underscore entre letras)
  t = t.replace(/([A-Za-zÀ-ÿ])_([A-Za-zÀ-ÿ])/g, "$1'$2");
  return t.trim() || basename(filename, extname(filename));
}

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function detectLevel(file, title) {
  const s = `${file} ${title}`.toUpperCase();
  if (/\bNS\b|NIVEL SUPERIOR|\bHL\b/.test(s)) return "HL";
  return "SL";
}

function moduleNumber(file) {
  const base = basename(file);
  const m = base.match(/M[oó]dulo\s*(\d+)/i) || file.match(/M[oó]dulo\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : 999;
}

function naturalSort(a, b) {
  return a.localeCompare(b, "es", { numeric: true, sensitivity: "base" });
}

const usedIds = new Set();
function uniqueId(subject, title, file) {
  const num = moduleNumber(file);
  const prefix = num !== 999 ? `m${String(num).padStart(2, "0")}-` : "";
  let base = `${subject}-${prefix}${slugify(title)}` || `${subject}-curso`;
  let id = base;
  let n = 2;
  while (usedIds.has(id)) {
    id = `${base}-${n++}`;
  }
  usedIds.add(id);
  return id;
}

const courses = [];
let order = 0;

for (const subject of SUBJECTS) {
  const dir = join(PREMIUM_DIR, subject);
  const files = walkHtml(dir).sort((a, b) =>
    naturalSort(moduleNumber(a) + "-" + a, moduleNumber(b) + "-" + b),
  );
  for (const abs of files) {
    const html = readFileSync(abs, "utf8");
    const rel = abs
      .slice(PREMIUM_DIR.length + 1)
      .split("\\")
      .join("/");
    const rawTitle = extractTitle(html);
    const title = cleanTitle(rawTitle, abs);
    const description = extractDescription(html);
    courses.push({
      id: uniqueId(subject, title, abs),
      title,
      subject,
      level: detectLevel(rel, title),
      file: rel,
      description:
        description || `Curso premium de ${SUBJECT_LABELS[subject]} del IB Diploma Programme.`,
      durationMin: 45,
      order: ++order,
    });
  }
}

const manifest = { version: 1, courses };

console.log(`\nDetectados ${courses.length} cursos:\n`);
for (const c of courses) {
  console.log(`  [${SUBJECT_LABELS[c.subject]} · ${c.level}] ${c.title}\n      → ${c.file}`);
}

if (DRY) {
  console.log("\n(--dry) No se escribió el manifest.");
} else {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`\n✓ manifest.json actualizado (${courses.length} cursos).`);
}
