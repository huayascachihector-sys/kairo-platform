import type { ParsedIbQuestion } from './htmlQuestionParser';

const DB_NAME = 'kairo_ib_flashcards';
const DB_VERSION = 1;
const STORE_NAME = 'flashcards';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveFlashcards(
  courseId: string,
  flashcards: ParsedIbQuestion[]
): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  const key = `course_${courseId}`;
  const existing = await new Promise<any>((resolve) => {
    const get = store.get(key);
    get.onsuccess = () => resolve(get.result);
    get.onerror = () => resolve(null);
  });

  const data = {
    id: key,
    courseId,
    flashcards,
    count: flashcards.length,
    savedAt: new Date().toISOString(),
    version: 2,
  };

  if (existing) {
    store.put({ ...existing, ...data });
  } else {
    store.add(data);
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadFlashcards(
  courseId: string
): Promise<ParsedIbQuestion[] | null> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  const key = `course_${courseId}`;
  return new Promise((resolve) => {
    const req = store.get(key);
    req.onsuccess = () => {
      const result = req.result;
      if (result && Array.isArray(result.flashcards)) {
        resolve(result.flashcards as ParsedIbQuestion[]);
      } else {
        resolve(null);
      }
    };
    req.onerror = () => resolve(null);
  });
}

export async function removeFlashcards(courseId: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.delete(`course_${courseId}`);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFlashcardCounts(): Promise<Record<string, number>> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const counts: Record<string, number> = {};

  return new Promise((resolve) => {
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const data = cursor.value;
        if (data.courseId && typeof data.count === 'number') {
          counts[data.courseId] = data.count;
        }
        cursor.continue();
      } else {
        resolve(counts);
      }
    };
    req.onerror = () => resolve(counts);
  });
}

export async function getAllFlashcardCourses(): Promise<string[]> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const courses: string[] = [];

  return new Promise((resolve) => {
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const data = cursor.value;
        if (data.courseId && !courses.includes(data.courseId)) {
          courses.push(data.courseId);
        }
        cursor.continue();
      } else {
        resolve(courses);
      }
    };
    req.onerror = () => resolve(courses);
  });
}
