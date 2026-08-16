export interface ParsedIbQuestion {
  id: string;
  courseId: string;
  questionHtml: string;
  markschemeHtml: string;
  examCode: string;
  session: string;
  level: string;
  paper: string;
  commandTerm: string;
  marks: number;
  topic: string;
  subtopic: string;
  parts: string[];
  syllabusIds: string[];
}

const MARKSCHEME_PATTERN = /\((?:M|A|R|G|N|ft)\d*(?:\.\d+)?\)|\[(?:total\s+)?\d+\s*marks\]|\\\(M\d+|\\\(A\d+/i;

const META_LABELS: Record<string, string> = {
  'Reference code': 'examCode',
  'Date': 'session',
  'Level': 'level',
  'Paper': 'paper',
  'Command term': 'commandTerm',
  'Marks available': 'marks',
};

function extractMeta(html: string, label: string): string {
  const re = new RegExp(
    `<td\\s+class=['"]info_label['"][^>]*>\\s*${escapeRegex(label)}\\s*<\\/td>\\s*<td\\s+class=['"]info_value['"][^>]*>([^<]*)`,
    'i'
  );
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractAllMeta(html: string): Record<string, string> {
  const re = /<td\s+class=['"]info_label['"][^>]*>([\s\S]*?)<\/td>\s*<td\s+class=['"]info_value['"][^>]*>([\s\S]*?)<\/td>/gi;
  const result: Record<string, string> = {};
  let m;
  while ((m = re.exec(html)) !== null) {
    const label = m[1].replace(/<[^>]+>/g, '').trim();
    const value = m[2].replace(/<[^>]+>/g, '').trim();
    result[label] = value;
  }
  return result;
}

interface QuestionBlock {
  style: string;
  html: string;
  partLabel: string;
}

function extractQuestionBlocks(html: string): QuestionBlock[] {
  const blocks: QuestionBlock[] = [];
  const re = /<div\s+class=['"]question['"]([^>]*)>([\s\S]*?)<div\s+class=['"]question_part_label['"][^>]*>\s*([a-z]+)\s*\.\s*<\/div>\s*<\/div>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    blocks.push({
      style: (m[1] || '').trim(),
      html: m[2].trim(),
      partLabel: m[3],
    });
  }
  return blocks;
}

function extractSpecifications(html: string): string[] {
  const specs: string[] = [];
  const re = /<div\s+class=['"]specification['"][^>]*>([\s\S]*?)<\/div>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    specs.push(m[1].trim());
  }
  return specs;
}

function extractSyllabusSections(html: string): { topic: string; subtopic: string; ids: string[] } {
  const sections: { topic: string; subtopic: string }[] = [];
  const ids: string[] = [];

  const sectionRe = /<div\s+class=['"]syllabus_section['"][^>]*>([\s\S]*?)<\/div>/gi;
  let m;
  while ((m = sectionRe.exec(html)) !== null) {
    const content = m[1];
    const linkRe = /<a\s+href=["'][^"']*syllabus_sections\/(\d+)\.html["'][^>]*>([\s\S]*?)<\/a>/gi;
    let lm;
    while ((lm = linkRe.exec(content)) !== null) {
      ids.push(lm[1]);
      const text = lm[2].replace(/<[^>]+>/g, '').trim();
      if (text.startsWith('Topic')) {
        sections.push({ topic: text, subtopic: '' });
      } else {
        if (sections.length > 0 && !sections[sections.length - 1].subtopic) {
          sections[sections.length - 1].subtopic = text;
        }
      }
    }
  }

  const topic = sections.find(s => s.topic)?.topic || '';
  const subtopic = sections.find(s => s.subtopic)?.subtopic || '';

  return { topic, subtopic, ids: [...new Set(ids)] };
}

export function parseIbQuestionPage(html: string, courseId: string): ParsedIbQuestion | null {
  try {
    const meta = extractAllMeta(html);
    const examCode = meta['Reference code'] || '';
    if (!examCode) return null;

    const session = meta['Date'] || '';
    const level = meta['Level'] || '';
    const paper = meta['Paper'] || '';
    const commandTerm = meta['Command term'] || '';
    const marks = parseInt(meta['Marks available'] || '0', 10) || 0;

    const { topic, subtopic, ids } = extractSyllabusSections(html);
    const specs = extractSpecifications(html);
    const allBlocks = extractQuestionBlocks(html);

    if (allBlocks.length === 0) return null;

    const examReportIdx = html.search(/<h2[^>]*>\s*Examiners\s+report\s*<\/h2>/i);
    const syllabusIdx = html.search(/<h2[^>]*>\s*Syllabus\s+sections\s*<\/h2>/i);
    const cutoffIdx = Math.min(
      examReportIdx >= 0 ? examReportIdx : html.length,
      syllabusIdx >= 0 ? syllabusIdx : html.length
    );

    const blocksBeforeCutoff = allBlocks.filter(b => html.indexOf(b.html) < cutoffIdx);
    const questionBlocks: QuestionBlock[] = [];
    const markschemeBlocks: QuestionBlock[] = [];

    for (const block of blocksBeforeCutoff) {
      const hasMarkscheme = MARKSCHEME_PATTERN.test(block.html);
      const hasPaddingRight = /padding-right\s*:\s*20px/i.test(block.style);
      if (hasMarkscheme && !hasPaddingRight) {
        markschemeBlocks.push(block);
      } else {
        questionBlocks.push(block);
      }
    }

    const parts = questionBlocks.map(b => b.partLabel).filter((v, i, a) => a.indexOf(v) === i);

    const specsHtml = specs
      .map(s => `<div class="specification">${s}</div>`)
      .join('\n');
    const questionHtml = [
      specsHtml,
      ...questionBlocks.map(b => `<div class="question">${b.html}</div>`),
    ].filter(Boolean).join('\n');
    const markschemeHtml = markschemeBlocks
      .map(b => `<div class="markscheme">${b.html}</div>`)
      .join('\n');

    const id = `${courseId}_${examCode.replace(/[^a-zA-Z0-9]/g, '_')}`;

    return {
      id,
      courseId,
      questionHtml,
      markschemeHtml,
      examCode,
      session,
      level,
      paper,
      commandTerm,
      marks,
      topic,
      subtopic,
      parts,
      syllabusIds: ids,
    };
  } catch (err) {
    console.warn('[htmlQuestionParser] failed to parse page', err);
    return null;
  }
}

export function parseAllQuestionsInZip(
  zipEntries: { filename: string; text: string }[],
  courseId: string
): ParsedIbQuestion[] {
  const results: ParsedIbQuestion[] = [];
  for (const entry of zipEntries) {
    if (!entry.filename.endsWith('.html')) continue;
    if (!entry.filename.includes('/questions/')) continue;
    const parsed = parseIbQuestionPage(entry.text, courseId);
    if (parsed) results.push(parsed);
  }
  return results;
}
