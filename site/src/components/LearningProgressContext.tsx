import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  readCompletedPages,
  togglePageComplete,
} from './progressStorage';

const PROGRESS_EVENT = 'cursor-lms-progress';

export function notifyLearningProgressChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }
}

interface LearningProgressContextValue {
  courseId: string;
  completedPages: string[];
  ready: boolean;
  isPageComplete: (pageId: string) => boolean;
  setPageComplete: (pageId: string, complete: boolean) => void;
  completionPercent: (trackablePageIds: string[]) => number;
}

const LearningProgressContext =
  createContext<LearningProgressContextValue | null>(null);

export function LearningProgressProvider({
  courseId,
  children,
}: {
  courseId: string;
  children: React.ReactNode;
}): React.ReactElement {
  const [completedPages, setCompletedPages] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setCompletedPages(readCompletedPages(courseId));
  }, [courseId]);

  useEffect(() => {
    refresh();
    setReady(true);

    const onProgress = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (event.key?.startsWith('cursor-lms:')) {
        refresh();
      }
    };

    window.addEventListener(PROGRESS_EVENT, onProgress);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, onProgress);
      window.removeEventListener('storage', onStorage);
    };
  }, [courseId, refresh]);

  const setPageComplete = useCallback(
    (pageId: string, complete: boolean) => {
      const next = togglePageComplete(courseId, pageId, complete);
      setCompletedPages(next);
      notifyLearningProgressChanged();
    },
    [courseId],
  );

  const isPageComplete = useCallback(
    (pageId: string) => completedPages.includes(pageId),
    [completedPages],
  );

  const completionPercent = useCallback(
    (trackablePageIds: string[]) => {
      if (trackablePageIds.length === 0) {
        return 0;
      }
      const done = trackablePageIds.filter((id) =>
        completedPages.includes(id),
      ).length;
      return Math.round((done / trackablePageIds.length) * 100);
    },
    [completedPages],
  );

  const value = useMemo(
    () => ({
      courseId,
      completedPages,
      ready,
      isPageComplete,
      setPageComplete,
      completionPercent,
    }),
    [
      courseId,
      completedPages,
      ready,
      isPageComplete,
      setPageComplete,
      completionPercent,
    ],
  );

  return (
    <LearningProgressContext.Provider value={value}>
      {children}
    </LearningProgressContext.Provider>
  );
}

export function useLearningProgressContext(): LearningProgressContextValue | null {
  return useContext(LearningProgressContext);
}
