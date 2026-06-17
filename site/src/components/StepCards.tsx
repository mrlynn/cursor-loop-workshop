import React from 'react';

export interface StepCard {
  /** Short orange eyebrow label — e.g. "PLAN", "BUILD" */
  accent?: string;
  title: string;
  description: string;
}

export interface StepCardsProps {
  steps: StepCard[];
  title?: string;
}

export default function StepCards({
  steps,
  title,
}: StepCardsProps): React.ReactElement {
  return (
    <section className="cursor-step-cards" aria-label={title ?? 'Steps'}>
      {title ? <h2 className="cursor-step-cards__title">{title}</h2> : null}
      <div className="cursor-step-cards__grid">
        {steps.map((step, index) => (
          <article key={step.title} className="cursor-step-card">
            <div className="cursor-step-card__meta">
              <span className="cursor-step-card__number">{index + 1}</span>
              {step.accent ? (
                <span className="cursor-step-card__accent">{step.accent}</span>
              ) : null}
            </div>
            <h3 className="cursor-step-card__heading">{step.title}</h3>
            <p className="cursor-step-card__description">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
