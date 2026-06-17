import React from 'react';

export interface SdlcRow {
  mode: string;
  accent: string;
  cells: string[];
}

export interface SdlcAutonomyMapProps {
  title?: string;
  subtitle?: string;
  columns?: string[];
  rows?: SdlcRow[];
}

const DEFAULT_COLUMNS = [
  'Tab / Inline',
  'Prompt mode',
  'Agent',
  'Loop Eng.',
  'Cloud',
  'AI SDLC',
];

const DEFAULT_ROWS: SdlcRow[] = [
  {
    mode: 'Plan',
    accent: '#8C89E7',
    cells: [
      'N/A — stay in flow',
      '@file · @folder · read before write',
      'explore sub-agent · codebase search',
      'Plan task spec + verifier design',
      'Async research · worktree',
      'Rules for repo conventions',
    ],
  },
  {
    mode: 'Build',
    accent: '#F76D18',
    cells: [
      'Tab · Inline completion',
      'Composer multi-file diffs',
      'Agent generates + runs builds',
      'Act → verify → correct loop',
      'Background implementation PR',
      'Skills for repeated procedures',
    ],
  },
  {
    mode: 'Debug',
    accent: '#2268FF',
    cells: [
      'Rare — single-line fix',
      'Paste stack trace · ask why',
      'Agent reproduces · reads logs',
      'Verifier = failing test',
      'Long repro loops · budget cap',
      'Debug mode + evidence first',
    ],
  },
  {
    mode: 'Review',
    accent: '#2C9F28',
    cells: [
      'Accept / reject suggestion',
      'You read every diff line',
      'Self-review + agent summary',
      'Regression gates in verifier',
      'Bugbot on async PR',
      'Layered review: self → AI → human',
    ],
  },
];

export default function SdlcAutonomyMap({
  title = 'AI-first SDLC × autonomy continuum',
  subtitle = 'Operating modes apply at every stage. Loops attach where machine-checkable verifiers exist.',
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
}: SdlcAutonomyMapProps): React.ReactElement {
  return (
    <figure className="cursor-sdlc-map" aria-label={title}>
      <figcaption className="cursor-sdlc-map__header">
        <p className="cursor-sdlc-map__eyebrow">SDLC overlay</p>
        <h3 className="cursor-sdlc-map__title">{title}</h3>
        <p className="cursor-sdlc-map__subtitle">{subtitle}</p>
      </figcaption>

      <div className="cursor-sdlc-map__scroll">
        <table className="cursor-sdlc-map__table">
          <thead>
            <tr>
              <th scope="col" className="cursor-sdlc-map__corner">
                Mode
              </th>
              {columns.map((col) => (
                <th key={col} scope="col">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.mode} style={{'--row-accent': row.accent} as React.CSSProperties}>
                <th scope="row" className="cursor-sdlc-map__mode">
                  {row.mode}
                </th>
                {row.cells.map((cell, i) => (
                  <td key={`${row.mode}-${columns[i]}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cursor-sdlc-map__legend">
        <span className="cursor-sdlc-map__legend-item">
          <span className="cursor-sdlc-map__legend-dot" style={{background: '#78787E'}} />
          Human-in-flow
        </span>
        <span className="cursor-sdlc-map__legend-item">
          <span className="cursor-sdlc-map__legend-dot" style={{background: '#F76D18'}} />
          Prompt / supervised
        </span>
        <span className="cursor-sdlc-map__legend-item">
          <span className="cursor-sdlc-map__legend-dot" style={{background: '#E8601B'}} />
          Verifier loop
        </span>
        <span className="cursor-sdlc-map__legend-item">
          <span className="cursor-sdlc-map__legend-dot" style={{background: '#2C9F28'}} />
          AI-first practice
        </span>
      </div>
    </figure>
  );
}
