/** localStorage keys for self-paced workshop progress (no server required). */

const PREFIX = 'cursor-lms:';

export function courseKey(courseId: string, suffix: string): string {
  return `${PREFIX}${courseId}:${suffix}`;
}

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private browsing */
  }
}

export function readCompletedPages(courseId: string): string[] {
  return readJson<string[]>(courseKey(courseId, 'completed'), []);
}

export function writeCompletedPages(courseId: string, pages: string[]): void {
  writeJson(courseKey(courseId, 'completed'), pages);
}

export function togglePageComplete(
  courseId: string,
  pageId: string,
  complete: boolean,
): string[] {
  const current = new Set(readCompletedPages(courseId));
  if (complete) {
    current.add(pageId);
  } else {
    current.delete(pageId);
  }
  const next = [...current];
  writeCompletedPages(courseId, next);
  return next;
}

export function readChecklistState(
  courseId: string,
  checklistId: string,
): Record<string, boolean> {
  return readJson<Record<string, boolean>>(
    courseKey(courseId, `checklist:${checklistId}`),
    {},
  );
}

export function writeChecklistState(
  courseId: string,
  checklistId: string,
  state: Record<string, boolean>,
): void {
  writeJson(courseKey(courseId, `checklist:${checklistId}`), state);
}

export function readQuizPassed(courseId: string, quizId: string): boolean {
  return readJson<{passed: boolean}>(
    courseKey(courseId, `quiz:${quizId}`),
    {passed: false},
  ).passed;
}

export function writeQuizPassed(
  courseId: string,
  quizId: string,
  passed: boolean,
): void {
  writeJson(courseKey(courseId, `quiz:${quizId}`), {passed});
}
