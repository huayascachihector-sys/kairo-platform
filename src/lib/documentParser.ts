import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;

export interface ParsedDocument {
  name: string;
  type: string;
  data: string;
  pageCount?: number;
  wordCount: number;
  error?: string;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB
const MAX_CHARS = 50000;

async function parsePDF(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer.slice(0) }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(' ');
    pages.push(text);
  }
  const full = pages.join('\n\n').slice(0, MAX_CHARS);
  return {
    name: file.name,
    type: file.type,
    data: full,
    pageCount: pdf.numPages,
    wordCount: full.split(/\s+/).filter(Boolean).length,
  };
}

async function parseTextFile(file: File): Promise<ParsedDocument> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = (reader.result as string).slice(0, MAX_CHARS);
      resolve({
        name: file.name,
        type: file.type,
        data: text,
        wordCount: text.split(/\s+/).filter(Boolean).length,
      });
    };
    reader.onerror = () => resolve({
      name: file.name, type: file.type, data: '',
      wordCount: 0, error: 'No se pudo leer el archivo.',
    });
    reader.readAsText(file);
  });
}

export async function parseDocument(file: File): Promise<ParsedDocument> {
  if (file.size > MAX_FILE_SIZE) {
    return {
      name: file.name, type: file.type, data: '',
      wordCount: 0, error: `El archivo excede el límite de 15 MB.`,
    };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isPDF = file.type === 'application/pdf' || ext === 'pdf';

  if (isPDF) {
    try {
      return await parsePDF(file);
    } catch {
      return {
        name: file.name, type: file.type, data: '',
        wordCount: 0, error: 'No se pudo extraer texto de este PDF. Puede estar escaneado o protegido.',
      };
    }
  }

  return parseTextFile(file);
}
