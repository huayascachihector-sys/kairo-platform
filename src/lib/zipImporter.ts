import JSZip from 'jszip';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { parseAllQuestionsInZip, type ParsedIbQuestion } from './htmlQuestionParser';

GlobalWorkerOptions.workerSrc = workerUrl;

export interface ZipEntry {
  filename: string;
  text: string;
  size: number;
  ext: string;
}

export interface FolderGroup {
  folderName: string;
  entries: ZipEntry[];
  totalChars: number;
}

const MAX_PDF_CHARS = 50000;
const MAX_TOTAL_CHARS_PER_FOLDER = 150000;

const TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'csv', 'json', 'xml', 'html', 'htm',
  'log', 'ini', 'cfg', 'tex', 'rtf', 'yaml', 'yml',
  'toml', 'conf',
]);

async function extractPdfText(arrayBuffer: ArrayBuffer, filename: string): Promise<string> {
  try {
    const pdf = await getDocument({ data: arrayBuffer.slice(0) }).promise;
    const pages: string[] = [];
    const maxPages = Math.min(pdf.numPages, 20);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(' ');
      pages.push(text);
      const total = pages.join('\n\n').length;
      if (total > MAX_PDF_CHARS) break;
    }
    return pages.join('\n\n').slice(0, MAX_PDF_CHARS);
  } catch (err) {
    console.warn(`[zipImporter] failed to parse PDF: ${filename}`, err);
    return '';
  }
}

export async function extractZip(file: File): Promise<{
  entries: ZipEntry[];
  totalSize: number;
  skipped: string[];
}> {
  const zip = new JSZip();
  const data = await zip.loadAsync(file);

  const entries: ZipEntry[] = [];
  const skipped: string[] = [];
  let totalSize = 0;

  const promises = Object.keys(data.files).map(async (path) => {
    const entry = data.files[path];
    if (entry.dir) return;

    const ext = path.split('.').pop()?.toLowerCase() || '';

    try {
      if (ext === 'pdf') {
        const arrayBuffer = await entry.async('arraybuffer');
        const text = await extractPdfText(arrayBuffer, path);
        if (text.trim().length > 20) {
          entries.push({ filename: path, text, size: arrayBuffer.byteLength, ext });
        } else {
          skipped.push(path);
        }
      } else if (TEXT_EXTENSIONS.has(ext)) {
        const text = await entry.async('string');
        if (text.trim().length > 0) {
          entries.push({ filename: path, text, size: text.length, ext });
        }
      } else {
        skipped.push(path);
      }
    } catch {
      skipped.push(path);
    }
  });

  await Promise.all(promises);

  return { entries, totalSize, skipped };
}

export function groupByFolder(entries: ZipEntry[]): {
  groups: FolderGroup[];
  ungrouped: ZipEntry[];
  courseFolders: string[];
} {
  const folderMap = new Map<string, ZipEntry[]>();
  const ungrouped: ZipEntry[] = [];

  for (const e of entries) {
    const parts = e.filename.replace(/\\/g, '/').split('/');
    if (parts.length >= 2) {
      const folder = parts[0];
      if (!folderMap.has(folder)) folderMap.set(folder, []);
      folderMap.get(folder)!.push(e);
    } else {
      ungrouped.push(e);
    }
  }

  const groups: FolderGroup[] = [];
  const courseFolders: string[] = [];

  for (const [folderName, folderEntries] of folderMap) {
    let totalChars = 0;
    const limited: ZipEntry[] = [];
    for (const e of folderEntries) {
      if (totalChars >= MAX_TOTAL_CHARS_PER_FOLDER) {
        break;
      }
      limited.push(e);
      totalChars += e.text.length;
    }
    groups.push({ folderName, entries: limited, totalChars });
    courseFolders.push(folderName);
  }

  return { groups, ungrouped, courseFolders };
}

export function mergeGroupText(group: FolderGroup): string {
  return group.entries
    .map((e) => `--- ${e.filename} ---\n${e.text}`)
    .join('\n\n');
}

export interface HtmlEditionInfo {
  edition: string;
  courseSlug: string;
  courseName: string;
  questionCount: number;
  entryPaths: string[];
}

const EDITION_PATTERNS = [
  { prefix: '5. Fifth Edition - TOPIC', label: '5th Edition Topic' },
  { prefix: '4. Fourth Edition - TOPIC', label: '4th Edition Topic' },
  { prefix: '5. Fifth Edition - PAPER', label: '5th Edition Paper' },
  { prefix: '6. Sixth Edition - 2025 Sciences', label: '6th Edition 2025' },
];

const COURSE_SLUG_PATTERN = /questionbanks\/(\d+-[a-z][a-z0-9-]+)\/questions\/\d+\.html$/i;

export interface HtmlCourseGroup {
  edition: string;
  courseSlug: string;
  courseName: string;
  entries: ZipEntry[];
  questionCount: number;
}

export function detectHtmlCourses(entries: ZipEntry[]): HtmlCourseGroup[] {
  const groups = new Map<string, HtmlCourseGroup>();

  for (const e of entries) {
    if (!e.filename.endsWith('.html')) continue;
    const normalized = e.filename.replace(/\\/g, '/');

    let edition = '';
    for (const ep of EDITION_PATTERNS) {
      if (normalized.includes(ep.prefix)) {
        edition = ep.label;
        break;
      }
    }
    if (!edition) continue;

    const match = normalized.match(COURSE_SLUG_PATTERN);
    if (!match) continue;
    const slug = match[1];

    const key = `${edition}::${slug}`;
    if (!groups.has(key)) {
      groups.set(key, {
        edition,
        courseSlug: slug,
        courseName: slugToName(slug),
        entries: [],
        questionCount: 0,
      });
    }
    groups.get(key)!.entries.push(e);
    groups.get(key)!.questionCount++;
  }

  return [...groups.values()];
}

function slugToName(slug: string): string {
  const parts = slug.replace(/^\d+-/, '').split('-');
  return parts
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function parseHtmlCourseQuestions(course: HtmlCourseGroup): ParsedIbQuestion[] {
  const courseSlug = course.courseSlug.replace(/^\d+-/, '');
  const allQs: ParsedIbQuestion[] = [];
  for (const entry of course.entries) {
    const parsed = parseAllQuestionsInZip([entry], courseSlug);
    allQs.push(...parsed);
  }
  return allQs;
}

export function slugToCourseId(slug: string): string {
  const clean = slug.replace(/^\d+-dp-/, '');
  return clean.replace(/-and-/g, '-').replace(/-/g, '-');
}
