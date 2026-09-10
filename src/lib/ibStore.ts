import type { ImportedQuestion } from './store';

export interface IbQuestionBank {
  id: string;
  courseId: string;
  courseName: string;
  year?: string;
  paper?: string;
  folderName: string;
  questions: ImportedQuestion[];
  importedAt: string;
}

export interface IbCourseData {
  courseId: string;
  courseName: string;
  totalFlashcards: number;
  topics: { topic: string; subtopic: string; count: number }[];
  importedAt: string;
  version: number;
}
