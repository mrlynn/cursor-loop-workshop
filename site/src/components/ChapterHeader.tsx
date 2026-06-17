import React from 'react';
import {
  backgroundUrl,
  type BackgroundId,
  type TextTreatment,
  BACKGROUNDS,
} from './backgrounds';
import {useDocTitle, useSectionBackground} from './sectionContext';

export interface ChapterHeaderProps {
  /** Defaults to frontmatter `title` */
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  /** Painterly background — defaults from section folder via `sectionSlug` or doc path */
  background?: BackgroundId;
  /** Override section folder slug for background lookup (e.g. `agent-mode`) */
  sectionSlug?: string;
  textTreatment?: TextTreatment;
}

/**
 * Compact painterly header for interior lab / how-to pages (~24vh).
 * Pair with `hide_title: true` and optional `presentation_layout: true`.
 */
export default function ChapterHeader({
  title: titleProp,
  eyebrow,
  subtitle,
  background: backgroundProp,
  sectionSlug,
  textTreatment,
}: ChapterHeaderProps): React.ReactElement {
  const title = useDocTitle(titleProp);
  const background = useSectionBackground({
    sectionSlug,
    background: backgroundProp,
  });
  const treatment = textTreatment ?? BACKGROUNDS[background].textTreatment;

  return (
    <header
      className={`cursor-chapter-header cursor-chapter-header--${treatment}`}
      style={{backgroundImage: `url(${backgroundUrl(background)})`}}
      aria-label="Chapter header">
      <div className="cursor-chapter-header__overlay" aria-hidden="true" />
      <div className="cursor-chapter-header__content">
        {eyebrow ? <span className="cursor-eyebrow">{eyebrow}</span> : null}
        <h1 className="cursor-chapter-header__title">{title}</h1>
        {subtitle ? (
          <p className="cursor-chapter-header__subtitle">{subtitle}</p>
        ) : null}
      </div>
    </header>
  );
}
