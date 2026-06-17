import {useCallback, useEffect, useState} from 'react';
import {
  readCompletedPages,
  togglePageComplete,
} from './progressStorage';
import {
  notifyLearningProgressChanged,
  useLearningProgressContext,
} from './LearningProgressContext';

/** Client-side hook for course completion state (hydration-safe). */
export function useLearningProgress(courseId: string): {
  completedPages: string[];
  isPageComplete: (pageId: string) => boolean;
  setPageComplete: (pageId: string, complete: boolean) => void;
  completionPercent: (trackablePageIds: string[]) => number;
  ready: boolean;
} {
  const context = useLearningProgressContext();
  const [completedPages, setCompletedPages] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const useContextProvider = context?.courseId === courseId;

  useEffect(() => {
    if (useContextProvider) {
      return;
    }
    setCompletedPages(readCompletedPages(courseId));
    setReady(true);

    const onProgress = () => setCompletedPages(readCompletedPages(courseId));
    window.addEventListener('cursor-lms-progress', onProgress);
    return () => window.removeEventListener('cursor-lms-progress', onProgress);
  }, [courseId, useContextProvider]);

  const setPageCompleteLocal = useCallback(
    (pageId: string, complete: boolean) => {
      const next = togglePageComplete(courseId, pageId, complete);
      setCompletedPages(next);
      notifyLearningProgressChanged();
    },
    [courseId],
  );

  if (useContextProvider && context) {
    return {
      completedPages: context.completedPages,
      isPageComplete: context.isPageComplete,
      setPageComplete: context.setPageComplete,
      completionPercent: context.completionPercent,
      ready: context.ready,
    };
  }

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

  return {
    completedPages,
    isPageComplete,
    setPageComplete: setPageCompleteLocal,
    completionPercent,
    ready,
  };
}
