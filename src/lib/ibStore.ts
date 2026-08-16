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

export interface IbFlashcard {
  id: string;
  courseId: string;
  examCode: string;
  session: string;
  level: string;
  paper: string;
  commandTerm: string;
  marks: number;
  questionHtml: string;
  markschemeHtml: string;
  topic: string;
  subtopic: string;
  parts: string[];
}

export interface IbCourseData {
  courseId: string;
  courseName: string;
  totalFlashcards: number;
  topics: { topic: string; subtopic: string; count: number }[];
  importedAt: string;
  version: number;
}
