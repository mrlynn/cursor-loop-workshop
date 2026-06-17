import React, {useCallback, useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {
  readChecklistState,
  readQuizPassed,
} from './progressStorage';
import {useLearningProgress} from './useLearningProgress';
import type {ChecklistItem} from './InteractiveChecklist';

export interface ModuleRecapNext {
  title: string;
  href: string;
  duration?: string;
}

export interface ModuleRecapProps {
  courseId: string;
  /** Section or module name — e.g. "Agent Mode" */
  module?: string;
  title?: string;
  /** Observable skills from ## What you'll learn */
  objectives: string[];
  /** Tie to on-page InteractiveChecklist */
  checklistId?: string;
  checklistItems?: ChecklistItem[];
  /** Tie to on-page KnowledgeCheck */
  quizId?: string;
  nextModule?: ModuleRecapNext;
}

type RecapStatus = 'pending' | 'done' | 'optional';

function statusIcon(status: RecapStatus): string {
  if (status === 'done') {
    return '✓';
  }
  if (status === 'optional') {
    return '·';
  }
  return '○';
}

export default function ModuleRecap({
  courseId,
  module,
  title = 'Module recap',
  objectives,
  checklistId,
  checklistItems = [],
  quizId,
  nextModule,
}: ModuleRecapProps): React.ReactElement {
  const {metadata} = useDoc();
  const {isPageComplete, ready: progressReady} = useLearningProgress(courseId);
  const [checklistDone, setChecklistDone] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (checklistId && checklistItems.length > 0) {
      const state = readChecklistState(courseId, checklistId);
      const allChecked = checklistItems.every((item) => state[item.id]);
      setChecklistDone(allChecked);
    }
    if (quizId) {
      setQuizPassed(readQuizPassed(courseId, quizId));
    }
    setReady(true);
  }, [checklistId, checklistItems, courseId, quizId]);

  useEffect(() => {
    refresh();
    window.addEventListener('cursor-lms-progress', refresh);
    return () => window.removeEventListener('cursor-lms-progress', refresh);
  }, [refresh]);

  const lessonComplete = progressReady && isPageComplete(metadata.id);

  const checklistStatus: RecapStatus =
    !checklistId || checklistItems.length === 0
      ? 'optional'
      : ready && checklistDone
        ? 'done'
        : 'pending';

  const quizStatus: RecapStatus = !quizId
    ? 'optional'
    : ready && quizPassed
      ? 'done'
      : 'pending';

  const lessonStatus: RecapStatus = lessonComplete ? 'done' : 'pending';

  const requiredDone =
    lessonStatus === 'done' &&
    (checklistStatus === 'done' || checklistStatus === 'optional') &&
    (quizStatus === 'done' || quizStatus === 'optional');

  return (
    <section className="cursor-module-recap" aria-label={title}>
      <header className="cursor-module-recap__header">
        {module ? <p className="cursor-eyebrow">{module}</p> : null}
        <h2 className="cursor-module-recap__title">{title}</h2>
      </header>

      <div className="cursor-module-recap__objectives">
        <h3 className="cursor-module-recap__section-title">You can now</h3>
        <ul className="cursor-module-recap__list">
          {objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </div>

      <div className="cursor-module-recap__status">
        <h3 className="cursor-module-recap__section-title">Your progress</h3>
        <ul className="cursor-module-recap__checklist">
          <li
            className={`cursor-module-recap__status-item cursor-module-recap__status-item--${lessonStatus}`}>
            <span className="cursor-module-recap__status-icon" aria-hidden="true">
              {statusIcon(lessonStatus)}
            </span>
            Lesson marked complete
          </li>
          {checklistId && checklistItems.length > 0 ? (
            <li
              className={`cursor-module-recap__status-item cursor-module-recap__status-item--${checklistStatus}`}>
              <span className="cursor-module-recap__status-icon" aria-hidden="true">
                {statusIcon(checklistStatus)}
              </span>
              Checklist verified
            </li>
          ) : null}
          {quizId ? (
            <li
              className={`cursor-module-recap__status-item cursor-module-recap__status-item--${quizStatus}`}>
              <span className="cursor-module-recap__status-icon" aria-hidden="true">
                {statusIcon(quizStatus)}
              </span>
              Knowledge check passed
            </li>
          ) : null}
        </ul>
      </div>

      {requiredDone && nextModule ? (
        <aside className="cursor-module-recap__next">
          <p className="cursor-module-recap__next-label">Up next</p>
          <h3 className="cursor-module-recap__next-title">
            <Link to={nextModule.href}>{nextModule.title}</Link>
          </h3>
          {nextModule.duration ? (
            <p className="cursor-module-recap__next-duration">{nextModule.duration}</p>
          ) : null}
        </aside>
      ) : nextModule ? (
        <p className="cursor-module-recap__hint">
          Finish the checklist, knowledge check, and lesson completion above to unlock the
          next module link.
        </p>
      ) : null}
    </section>
  );
}
