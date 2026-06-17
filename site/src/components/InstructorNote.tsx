import React from 'react';

export interface InstructorNoteProps {
  title?: string;
  /** Minutes to allow for this segment in a live session */
  timing?: string;
  children: React.ReactNode;
}

/**
 * Facilitator callout for instructor-led workshops.
 * Styled distinctly from learner content; collapse by default in self-paced mode.
 */
export default function InstructorNote({
  title = 'Instructor note',
  timing,
  children,
}: InstructorNoteProps): React.ReactElement {
  return (
    <details className="cursor-instructor-note">
      <summary className="cursor-instructor-note__summary">
        <span className="cursor-instructor-note__badge">Facilitator</span>
        <span className="cursor-instructor-note__title">{title}</span>
        {timing ? (
          <span className="cursor-instructor-note__timing">{timing}</span>
        ) : null}
      </summary>
      <div className="cursor-instructor-note__body">{children}</div>
    </details>
  );
}
