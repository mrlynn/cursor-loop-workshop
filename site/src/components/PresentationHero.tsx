import React from 'react';
import {
  backgroundUrl,
  type BackgroundId,
  type TextTreatment,
  BACKGROUNDS,
} from './backgrounds';

export interface PresentationHeroProps {
  title: string;
  subtitle?: string;
  /** Painterly background id — default bg_1 (intro / title slide) */
  background?: BackgroundId;
  /** dark = white text + black overlay; light = dark text + white overlay */
  textTreatment?: TextTreatment;
  footerLabel?: string;
}

export default function PresentationHero({
  title,
  subtitle,
  background = 'bg_1',
  textTreatment,
  footerLabel,
}: PresentationHeroProps): React.ReactElement {
  const treatment = textTreatment ?? BACKGROUNDS[background].textTreatment;
  const isLightText = treatment === 'light';

  return (
    <header
      className={`cursor-presentation-hero cursor-presentation-hero--${treatment}`}
      style={{backgroundImage: `url(${backgroundUrl(background)})`}}
      aria-label="Page hero">
      <div className="cursor-presentation-hero__overlay" aria-hidden="true" />
      <div className="cursor-presentation-hero__content">
        <h1 className="cursor-presentation-hero__title">{title}</h1>
        {subtitle ? (
          <p className="cursor-presentation-hero__subtitle">{subtitle}</p>
        ) : null}
      </div>
      <div className="cursor-presentation-hero__footer">
        <img
          src={isLightText ? '/img/cursor-logo-white.png' : '/img/cursor-logo-dark.png'}
          alt="Cursor"
          className="cursor-presentation-hero__logo"
          width={28}
          height={32}
        />
        {footerLabel ? (
          <span className="cursor-presentation-hero__footer-label">{footerLabel}</span>
        ) : null}
      </div>
    </header>
  );
}
