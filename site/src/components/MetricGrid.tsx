import React from 'react';

export interface Metric {
  value: string;
  label: string;
  description?: string;
}

export interface MetricGridProps {
  metrics: Metric[];
  columns?: 2 | 3 | 4;
  title?: string;
  subtitle?: string;
}

export default function MetricGrid({
  metrics,
  columns = 4,
  title,
  subtitle,
}: MetricGridProps): React.ReactElement {
  return (
    <section
      className={`cursor-metric-grid cursor-metric-grid--cols-${columns}`}
      aria-label={title ?? 'Metrics'}>
      {(title || subtitle) && (
        <header className="cursor-metric-grid__header">
          {title ? <h2 className="cursor-metric-grid__title">{title}</h2> : null}
          {subtitle ? (
            <p className="cursor-metric-grid__subtitle">{subtitle}</p>
          ) : null}
        </header>
      )}
      <div className="cursor-metric-grid__tiles">
        {metrics.map((metric) => (
          <article key={metric.label} className="cursor-metric-tile">
            <div className="cursor-metric-tile__value">{metric.value}</div>
            <div className="cursor-metric-tile__label">{metric.label}</div>
            {metric.description ? (
              <p className="cursor-metric-tile__description">{metric.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
