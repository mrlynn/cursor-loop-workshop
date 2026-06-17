import React from 'react';

export interface LabPanelProps {
  title: string;
  /** e.g. "20 min" */
  duration?: string;
  /** e.g. "Agent mode basics" */
  module?: string;
  prerequisites?: string[];
  successCriteria?: string[];
  children?: React.ReactNode;
}

export default function LabPanel({
  title,
  duration,
  module,
  prerequisites = [],
  successCriteria = [],
  children,
}: LabPanelProps): React.ReactElement {
  return (
    <section className="cursor-lab-panel" aria-label={title}>
      <header className="cursor-lab-panel__header">
        <p className="cursor-eyebrow">Hands-on lab</p>
        <h2 className="cursor-lab-panel__title">{title}</h2>
        <div className="cursor-lab-panel__meta">
          {module ? (
            <span className="cursor-lab-panel__tag">{module}</span>
          ) : null}
          {duration ? (
            <span className="cursor-lab-panel__tag">{duration}</span>
          ) : null}
        </div>
      </header>

      {prerequisites.length > 0 ? (
        <div className="cursor-lab-panel__block">
          <h3 className="cursor-lab-panel__block-title">Prerequisites</h3>
          <ul className="cursor-lab-panel__list">
            {prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {children ? (
        <div className="cursor-lab-panel__body">{children}</div>
      ) : null}

      {successCriteria.length > 0 ? (
        <div className="cursor-lab-panel__block cursor-lab-panel__block--success">
          <h3 className="cursor-lab-panel__block-title">Done when</h3>
          <ul className="cursor-lab-panel__list">
            {successCriteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
