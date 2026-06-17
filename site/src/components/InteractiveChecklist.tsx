import React, {useEffect, useState} from 'react';
import {
  readChecklistState,
  writeChecklistState,
} from './progressStorage';
import {notifyLearningProgressChanged} from './LearningProgressContext';

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface InteractiveChecklistProps {
  courseId: string;
  /** Unique per page — e.g. "agent-mode-prompting-checklist" */
  checklistId: string;
  title?: string;
  items: ChecklistItem[];
  /** When all items checked, optionally mark a lesson page complete */
  pageId?: string;
}

export default function InteractiveChecklist({
  courseId,
  checklistId,
  title = 'Checklist',
  items,
}: InteractiveChecklistProps): React.ReactElement {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChecked(readChecklistState(courseId, checklistId));
    setReady(true);
  }, [courseId, checklistId]);

  const toggle = (itemId: string) => {
    const next = {...checked, [itemId]: !checked[itemId]};
    setChecked(next);
    writeChecklistState(courseId, checklistId, next);
    notifyLearningProgressChanged();
  };

  const doneCount = items.filter((item) => checked[item.id]).length;
  const allDone = ready && doneCount === items.length;

  return (
    <section
      className={`cursor-checklist${allDone ? ' cursor-checklist--complete' : ''}`}
      aria-label={title}>
      <header className="cursor-checklist__header">
        <p className="cursor-eyebrow">Before you continue</p>
        <h2 className="cursor-checklist__title">{title}</h2>
        <p className="cursor-checklist__status" aria-live="polite">
          {ready ? `${doneCount} of ${items.length} complete` : 'Loading…'}
        </p>
      </header>
      <ul className="cursor-checklist__list">
        {items.map((item) => {
          const isChecked = Boolean(checked[item.id]);
          return (
            <li key={item.id} className="cursor-checklist__item">
              <label className="cursor-checklist__label">
                <input
                  type="checkbox"
                  className="cursor-checklist__input"
                  checked={isChecked}
                  onChange={() => toggle(item.id)}
                />
                <span
                  className={`cursor-checklist__box${isChecked ? ' cursor-checklist__box--checked' : ''}`}
                  aria-hidden="true"
                />
                <span className="cursor-checklist__text">{item.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {allDone ? (
        <p className="cursor-checklist__done-msg">
          All items verified. You are ready for the next lesson.
        </p>
      ) : null}
    </section>
  );
}
