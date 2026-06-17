import React, {useState} from 'react';

export type OperatingModeId = 'plan' | 'build' | 'debug' | 'review';

export interface OperatingMode {
  id: OperatingModeId | string;
  title: string;
  useWhen: string;
  example?: string;
  avoid?: string;
  escalateTo?: string;
}

export interface OperatingModeCardsProps {
  title?: string;
  subtitle?: string;
  modes?: OperatingMode[];
  /** Initially selected mode — defaults to first card */
  defaultMode?: OperatingModeId | string;
}

const DEFAULT_MODES: OperatingMode[] = [
  {
    id: 'plan',
    title: 'Plan',
    useWhen: 'Exploring code and narrowing scope before any edits.',
    example: 'Map @src/api/ handlers for checkout. List files only — do not edit.',
    avoid: 'Jumping straight to Agent mode on code you have not read.',
    escalateTo: 'Build when scope is clear and files are named.',
  },
  {
    id: 'build',
    title: 'Build',
    useWhen: 'Generating or editing code with scoped prompts.',
    example:
      'In @src/auth/refresh.ts, add a test that reproduces early expiry. Fix with minimal diff.',
    avoid: 'Vague goals like "fix the auth bug" without @ scope or verification.',
    escalateTo: 'Debug when the agent cannot reproduce the failure.',
  },
  {
    id: 'debug',
    title: 'Debug',
    useWhen: 'Reproducing failures with logs, stack traces, and evidence.',
    example:
      'Here is the failing test output. Trace the refresh path and propose the smallest fix.',
    avoid: 'Accepting speculative fixes without a repro test.',
    escalateTo: 'Review after you have a green verification command.',
  },
  {
    id: 'review',
    title: 'Review',
    useWhen: 'Reading every diff line, running tests, triaging Bugbot.',
    example:
      'Read the full diff. Reject scope creep. Run npm test before merge.',
    avoid: 'Accepting the first agent diff without reading unrelated files.',
    escalateTo: 'Build again only after restating constraints in a fresh thread.',
  },
];

const MODE_ACCENTS: Record<string, string> = {
  plan: '#8C89E7',
  build: '#F76D18',
  debug: '#2268FF',
  review: '#2C9F28',
};

export default function OperatingModeCards({
  title = 'Operating modes at a glance',
  subtitle = 'Pick the right mode before you prompt. Click a card for examples.',
  modes = DEFAULT_MODES,
  defaultMode,
}: OperatingModeCardsProps): React.ReactElement {
  const [selectedId, setSelectedId] = useState(
    defaultMode ?? modes[0]?.id ?? 'plan',
  );

  const selected =
    modes.find((mode) => mode.id === selectedId) ?? modes[0];

  return (
    <section className="cursor-operating-modes" aria-label={title}>
      <header className="cursor-operating-modes__header">
        <p className="cursor-eyebrow">SDLC modes</p>
        <h2 className="cursor-operating-modes__title">{title}</h2>
        {subtitle ? (
          <p className="cursor-operating-modes__subtitle">{subtitle}</p>
        ) : null}
      </header>

      <div
        className="cursor-operating-modes__grid"
        role="tablist"
        aria-label="Cursor operating modes">
        {modes.map((mode) => {
          const isSelected = mode.id === selectedId;
          const accent = MODE_ACCENTS[mode.id] ?? '#E8601B';
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`cursor-mode-panel-${mode.id}`}
              className={`cursor-operating-modes__card${isSelected ? ' cursor-operating-modes__card--selected' : ''}`}
              style={{'--mode-accent': accent} as React.CSSProperties}
              onClick={() => setSelectedId(mode.id)}>
              <span className="cursor-operating-modes__card-label">{mode.title}</span>
              <span className="cursor-operating-modes__card-hint">{mode.useWhen}</span>
            </button>
          );
        })}
      </div>

      {selected ? (
        <article
          id={`cursor-mode-panel-${selected.id}`}
          role="tabpanel"
          className="cursor-operating-modes__panel"
          style={{'--mode-accent': MODE_ACCENTS[selected.id] ?? '#E8601B'} as React.CSSProperties}>
          <h3 className="cursor-operating-modes__panel-title">{selected.title}</h3>
          <p className="cursor-operating-modes__panel-use">{selected.useWhen}</p>

          {selected.example ? (
            <div className="cursor-operating-modes__block">
              <h4 className="cursor-operating-modes__block-title">Example</h4>
              <p className="cursor-operating-modes__block-text">{selected.example}</p>
            </div>
          ) : null}

          {selected.avoid ? (
            <div className="cursor-operating-modes__block cursor-operating-modes__block--avoid">
              <h4 className="cursor-operating-modes__block-title">Avoid</h4>
              <p className="cursor-operating-modes__block-text">{selected.avoid}</p>
            </div>
          ) : null}

          {selected.escalateTo ? (
            <div className="cursor-operating-modes__block">
              <h4 className="cursor-operating-modes__block-title">Escalate to</h4>
              <p className="cursor-operating-modes__block-text">{selected.escalateTo}</p>
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
