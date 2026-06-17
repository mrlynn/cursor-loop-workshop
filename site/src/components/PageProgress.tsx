import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useLearningProgress} from './useLearningProgress';

export interface PageProgressProps {
  courseId: string;
  /** Override doc id — defaults to current page `metadata.id` */
  pageId?: string;
  label?: string;
}

/**
 * Lesson completion control — persists to localStorage for self-paced learners.
 * Pair with matching `id` values in `<CoursePath modules={...} />`.
 */
export default function PageProgress({
  courseId,
  pageId,
  label = 'Mark lesson complete',
}: PageProgressProps): React.ReactElement {
  const {metadata} = useDoc();
  const resolvedPageId = pageId ?? metadata.id;
  const {isPageComplete, setPageComplete, ready} =
    useLearningProgress(courseId);
  const complete = ready && isPageComplete(resolvedPageId);

  return (
    <div
      className={`cursor-page-progress${complete ? ' cursor-page-progress--complete' : ''}`}
      aria-live="polite">
      <p className="cursor-page-progress__hint">
        {complete
          ? 'Lesson marked complete. Progress updates on the course path.'
          : 'Finished this lesson? Mark it complete to track your path.'}
      </p>
      <button
        type="button"
        className="cursor-lms-button"
        disabled={!ready}
        onClick={() => setPageComplete(resolvedPageId, !complete)}>
        {complete ? 'Mark incomplete' : label}
      </button>
    </div>
  );
}
