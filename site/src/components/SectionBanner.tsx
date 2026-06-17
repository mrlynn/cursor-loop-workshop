import React from 'react';
import {
  backgroundUrl,
  type BackgroundId,
  BACKGROUNDS,
} from './backgrounds';
import {useSectionBackground} from './sectionContext';

export interface AgendaItem {
  label: string;
  number?: number;
}

export interface SectionBannerProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /**
   * light — agenda slide (#F4F2ED), two-column optional
   * dark — insight opener (#141416 card on dark canvas)
   * image — painterly background with overlay; `background` auto-resolves from doc path
   */
  variant?: 'light' | 'dark' | 'image';
  /** Override painterly id; when omitted on `image`, uses section folder mapping */
  background?: BackgroundId;
  /** Override section folder slug for background lookup (e.g. `getting-started`) */
  sectionSlug?: string;
  /** Agenda-style numbered items (light, dark, and image variants) */
  agendaItems?: AgendaItem[];
}

function AgendaList({items}: {items: AgendaItem[]}): React.ReactElement {
  return (
    <ol className="cursor-agenda-list">
      {items.map((item, index) => (
        <li key={item.label} className="cursor-agenda-list__item">
          <span className="cursor-agenda-list__label">{item.label}</span>
          <span className="cursor-agenda-list__number">
            {item.number ?? index + 1}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function SectionBanner({
  eyebrow,
  title,
  subtitle,
  variant = 'dark',
  background: backgroundProp,
  sectionSlug,
  agendaItems,
}: SectionBannerProps): React.ReactElement {
  const resolvedBackground = useSectionBackground({
    sectionSlug,
    background: backgroundProp,
  });

  if (variant === 'image') {
    const treatment = BACKGROUNDS[resolvedBackground].textTreatment;
    const hasAgenda = Boolean(agendaItems?.length);

    return (
      <header
        className={`cursor-section-banner cursor-section-banner--image cursor-section-banner--${treatment}${
          hasAgenda ? ' cursor-section-banner--agenda' : ''
        }`}
        style={{backgroundImage: `url(${backgroundUrl(resolvedBackground)})`}}
        aria-label="Section banner">
        <div className="cursor-section-banner__overlay" aria-hidden="true" />
        <div
          className={
            hasAgenda
              ? 'cursor-section-banner__inner'
              : 'cursor-section-banner__image-content'
          }>
          <div
            className={
              hasAgenda ? 'cursor-section-banner__primary' : undefined
            }>
            {eyebrow ? <span className="cursor-eyebrow">{eyebrow}</span> : null}
            <h1 className="cursor-section-banner__title">{title}</h1>
            {subtitle ? (
              <p className="cursor-section-banner__subtitle">{subtitle}</p>
            ) : null}
          </div>
          {hasAgenda ? <AgendaList items={agendaItems!} /> : null}
        </div>
      </header>
    );
  }

  const isLight = variant === 'light';

  return (
    <header
      className={`cursor-section-banner cursor-section-banner--${variant}${
        agendaItems?.length ? ' cursor-section-banner--agenda' : ''
      }`}
      aria-label="Section banner">
      <div className="cursor-section-banner__inner">
        <div className="cursor-section-banner__primary">
          {eyebrow ? <span className="cursor-eyebrow">{eyebrow}</span> : null}
          <h1 className="cursor-section-banner__title">{title}</h1>
          {subtitle ? (
            <p className="cursor-section-banner__subtitle">{subtitle}</p>
          ) : null}
        </div>
        {agendaItems?.length ? <AgendaList items={agendaItems} /> : null}
      </div>
      {isLight ? (
        <div className="cursor-section-banner__footer">
          <img
            src="/img/cursor-logo-dark.png"
            alt="Cursor"
            className="cursor-section-banner__logo"
            width={28}
            height={32}
          />
        </div>
      ) : null}
    </header>
  );
}
