import React from 'react';
import {
  backgroundUrl,
  type BackgroundId,
  type TextTreatment,
  BACKGROUNDS,
} from './backgrounds';

export interface StatementBlockProps {
  children: React.ReactNode;
  background?: BackgroundId;
  textTreatment?: TextTreatment;
}

/**
 * Full-bleed statement slide — use between sections for breathing room.
 * One sentence or short paragraph over a painterly background.
 */
export default function StatementBlock({
  children,
  background = 'bg_6',
  textTreatment,
}: StatementBlockProps): React.ReactElement {
  const treatment = textTreatment ?? BACKGROUNDS[background].textTreatment;

  return (
    <aside
      className={`cursor-statement cursor-statement--${treatment}`}
      style={{backgroundImage: `url(${backgroundUrl(background)})`}}
      aria-label="Statement">
      <div className="cursor-statement__overlay" aria-hidden="true" />
      <blockquote className="cursor-statement__quote">{children}</blockquote>
    </aside>
  );
}
