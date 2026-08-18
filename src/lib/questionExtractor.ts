import type { ImportedQuestion, ImportedQuestionBank } from './store';
import type { IbQuestionBank } from './ibStore';

export interface ExtractionResult {
  success: boolean;
  bank?: Omit<ImportedQuestionBank, 'id' | 'importedAt'>;
  error?: string;
}

export interface IbExtractionResult {
  success: boolean;
  bank?: Omit<IbQuestionBank, 'id' | 'importedAt'>;
  error?: string | null;
}

export async function extractQuestionsFromText(
  text: string,
  sourceName: string
): Promise<ExtractionResult> {
  try {
    const res = await fetch('/api/extract-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceName, mode: 'standard' }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Error del servidor' };
    }

    const questions: ImportedQuestion[] = data.questions || [];

    if (questions.length === 0) {
      return {
        success: false,
        error: 'No se encontraron preguntas en el contenido. Verifica que el archivo contenga preguntas de opción múltiple.',
      };
    }

    const validQuestions = questions.filter(
      (q: ImportedQuestion) =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        typeof q.correct === 'number' &&
        q.correct >= 0 &&
        q.correct < q.options.length
    );

    if (validQuestions.length === 0) {
      return {
        success: false,
        error: 'Las preguntas extraídas no tienen un formato válido. Revisa el contenido del archivo.',
      };
    }

    const difficultyCounts = { facil: 0, medio: 0, dificil: 0 };
    for (const q of validQuestions) {
      const d = q.difficulty || 'medio';
      if (difficultyCounts[d] !== undefined) difficultyCounts[d]++;
    }

    const dominantDifficulty = (Object.entries(difficultyCounts) as [string, number][])
      .sort((a, b) => b[1] - a[1])[0][0] as 'facil' | 'medio' | 'dificil';

    const bank: Omit<ImportedQuestionBank, 'id' | 'importedAt'> = {
      name: sourceName.replace(/\.zip$/i, ''),
      source: 'importado',
      subject: 'Importado',
      difficulty: dominantDifficulty,
      questions: validQuestions.slice(0, 200),
    };

    return { success: true, bank };
  } catch (err) {
    console.error('[questionExtractor]', err);
    return { success: false, error: 'Error de conexión al extraer preguntas.' };
  }
}

export async function extractIbQuestionsFromText(
  text: string,
  courseId: string,
  courseName: string,
  folderName: string
): Promise<IbExtractionResult> {
  try {
    const res = await fetch('/api/extract-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceName: folderName, mode: 'ib' }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Error del servidor' };
    }

    const questions: ImportedQuestion[] = data.questions || [];

    if (questions.length === 0) {
      return { success: false, error: null, bank: undefined };
    }

    const validQuestions = questions.filter(
      (q: ImportedQuestion) =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        typeof q.correct === 'number' &&
        q.correct >= 0 &&
        q.correct < q.options.length
    );

    if (validQuestions.length === 0) {
      return { success: false, error: null, bank: undefined };
    }

    const bank: Omit<IbQuestionBank, 'id' | 'importedAt'> = {
      courseId,
      courseName,
      folderName,
      questions: validQuestions.slice(0, 200),
    };

    return { success: true, bank };
  } catch (err) {
    console.error('[questionExtractor]', err);
    return { success: false, error: 'Error de conexión al extraer preguntas IB.' };
  }
}
