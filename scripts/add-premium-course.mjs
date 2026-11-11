#!/usr/bin/env node
// ─── KAIRO Premium — agrega un curso HTML al catálogo premium IB ────────────
//
// Uso:
//   npm run premium:add -- --subject matematicas --title "Funciones Cuadráticas" \
//        --file ./mi-curso.html --level SL --desc "Descripción corta" --duration 45
//
// Copia el HTML a public/cursos-premium/<subject>/ y actualiza manifest.json.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { resolve, basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "..", "..");
const PREMIUM_DIR = join(ROOT, "public", "cursos-premium");
const MANIFEST_PATH = join(PREMIUM_DIR, "manifest.json");
const SUBJECTS = ["matematicas", "fisica", "historia", "sociedad-digital"];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const usage =
  'Uso: npm run premium:add -- --subject <materia> --title "Título" --file ./curso.html [--level SL|HL] [--desc "..."] [--duration 45]';

const subject = args.subject || fail(`Falta --subject. Materias: ${SUBJECTS.join(", ")}. ${usage}`);
if (!SUBJECTS.includes(subject)) {
  fail(`Materia inválida "${subject}". Usa una de: ${SUBJECTS.join(", ")}`);
}
const title = args.title || fail(`Falta --title. ${usage}`);
const filePath = args.file || fail(`Falta --file (ruta al HTML). ${usage}`);
const level = args.level === "HL" ? "HL" : "SL";
const description = args.desc || "";
const durationMin = Number(args.duration) > 0 ? Number(args.duration) : 30;

if (!existsSync(filePath)) fail(`No existe el archivo: ${filePath}`);
if (extname(filePath).toLowerCase() !== ".html") fail("El archivo debe ser un .html");

const srcAbs = resolve(filePath);
const fileSlug = slugify(basename(filePath, extname(filePath)));
const id = args.id ? slugify(args.id) : `${subject}-${fileSlug}`;
const destDir = join(PREMIUM_DIR, subject);
const destPath = join(destDir, basename(filePath));

// Copiar el HTML
mkdirSync(destDir, { recursive: true });
copyFileSync(srcAbs, destPath);

// Leer / actualizar manifest
let manifest = { version: 1, courses: [] };
if (existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  } catch {
    console.warn("! manifest.json corrupto, se regenerará");
  }
}
if (!Array.isArray(manifest.courses)) manifest.courses = [];

const entry = {
  id,
  title,
  subject,
  level,
  file: `${subject}/${basename(filePath)}`,
  description,
  durationMin,
  order: manifest.courses.length + 1,
};

const existingIdx = manifest.courses.findIndex((c) => c.id === id);
if (existingIdx >= 0) {
  manifest.courses[existingIdx] = entry;
  console.log(`↻ Curso actualizado: ${id}`);
} else {
  manifest.courses.push(entry);
  console.log(`+ Curso agregado: ${id}`);
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(`  HTML → public/cursos-premium/${entry.file}`);
console.log(`  Manifest actualizado (${manifest.courses.length} cursos)`);
console.log(`  Verlo en: #/cursos-premium/${id}`);
