import React, {useState} from 'react';
import type {CourseModule} from './CoursePath';
import {useLearningProgress} from './useLearningProgress';

export interface CourseCompleteProps {
  courseId: string;
  modules: CourseModule[];
  workshopTitle?: string;
}

/** Shown when all CoursePath modules are marked complete. */
export default function CourseComplete({
  courseId,
  modules,
  workshopTitle = 'Workshop',
}: CourseCompleteProps): React.ReactElement | null {
  const {isPageComplete, ready} = useLearningProgress(courseId);
  const [copied, setCopied] = useState(false);

  if (!ready) {
    return null;
  }

  const allDone = modules.every((m) => isPageComplete(m.id));
  if (!allDone) {
    return null;
  }

  const summary = [
    `${workshopTitle} — completion summary`,
    '',
    `Completed ${modules.length} lessons:`,
    ...modules.map((m, i) => `${i + 1}. ${m.title}`),
    '',
    `Date: ${new Date().toLocaleDateString()}`,
  ].join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  return (
    <aside className="cursor-course-complete" aria-live="polite">
      <p className="cursor-eyebrow">Milestone</p>
      <h2 className="cursor-course-complete__title">Workshop complete</h2>
      <p className="cursor-course-complete__body">
        You finished every lesson in this path. Copy a completion summary for
        your manager or learning record.
      </p>
      <button
        type="button"
        className="cursor-lms-button"
        onClick={handleCopy}>
        {copied ? 'Copied summary' : 'Copy completion summary'}
      </button>
    </aside>
  );
}
