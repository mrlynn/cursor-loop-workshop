import React from 'react';
import Link from '@docusaurus/Link';
import {useLearningProgress} from './useLearningProgress';
import CourseComplete from './CourseComplete';

export type WorkshopLevel = '101' | '201' | '301';

export interface CourseModule {
  /** Stable id — must match `pageId` on linked lessons for progress tracking */
  id: string;
  title: string;
  href: string;
  description?: string;
  /** e.g. "45 min" */
  duration?: string;
  level?: WorkshopLevel;
}

export interface CoursePathProps {
  /** Shared id across CoursePath, PageProgress, checklists — e.g. "cursor-101" */
  courseId: string;
  title?: string;
  subtitle?: string;
  modules: CourseModule[];
}

const LEVEL_LABEL: Record<WorkshopLevel, string> = {
  '101': 'Foundations',
  '201': 'Workflows',
  '301': 'Advanced',
};

export default function CoursePath({
  courseId,
  title = 'Your learning path',
  subtitle,
  modules,
}: CoursePathProps): React.ReactElement {
  const {isPageComplete, completionPercent, ready} =
    useLearningProgress(courseId);
  const trackableIds = modules.map((m) => m.id);
  const percent = ready ? completionPercent(trackableIds) : 0;

  return (
    <section className="cursor-course-path" aria-label={title}>
      <header className="cursor-course-path__header">
        <div>
          <p className="cursor-eyebrow">Curriculum</p>
          <h2 className="cursor-course-path__title">{title}</h2>
          {subtitle ? (
            <p className="cursor-course-path__subtitle">{subtitle}</p>
          ) : null}
        </div>
        <div className="cursor-course-path__progress" aria-live="polite">
          <span className="cursor-course-path__progress-label">Progress</span>
          <div
            className="cursor-course-path__progress-bar"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}>
            <div
              className="cursor-course-path__progress-fill"
              style={{width: `${percent}%`}}
            />
          </div>
          <span className="cursor-course-path__progress-value">{percent}%</span>
        </div>
      </header>

      <ol className="cursor-course-path__list">
        {modules.map((module, index) => {
          const complete = ready && isPageComplete(module.id);
          return (
            <li
              key={module.id}
              className={`cursor-course-path__item${complete ? ' cursor-course-path__item--complete' : ''}`}>
              <div className="cursor-course-path__marker" aria-hidden="true">
                <span className="cursor-course-path__step">{index + 1}</span>
              </div>
              <article className="cursor-course-path__card">
                <div className="cursor-course-path__card-meta">
                  {module.level ? (
                    <span className="cursor-course-path__level">
                      {module.level} · {LEVEL_LABEL[module.level]}
                    </span>
                  ) : null}
                  {module.duration ? (
                    <span className="cursor-course-path__duration">
                      {module.duration}
                    </span>
                  ) : null}
                  {complete ? (
                    <span className="cursor-course-path__badge">Complete</span>
                  ) : null}
                </div>
                <h3 className="cursor-course-path__card-title">
                  <Link to={module.href}>{module.title}</Link>
                </h3>
                {module.description ? (
                  <p className="cursor-course-path__card-desc">
                    {module.description}
                  </p>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>

      <CourseComplete courseId={courseId} modules={modules} />
    </section>
  );
}
