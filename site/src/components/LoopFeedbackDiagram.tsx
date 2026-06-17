import React from 'react';

export interface LoopFeedbackDiagramProps {
  title?: string;
  subtitle?: string;
}

const PROMPT_STEPS = [
  {id: 'goal', label: 'Goal', desc: 'You write the prompt'},
  {id: 'act', label: 'Model output', desc: 'You read the diff'},
  {id: 'judge', label: 'You judge', desc: 'Good enough?'},
  {id: 'repeat', label: 'Re-prompt', desc: 'You ask again'},
];

const LOOP_STEPS = [
  {id: 'goal', label: 'Goal + spec', desc: 'Task + verifier defined'},
  {id: 'act', label: 'Agent acts', desc: 'Edit, run tools'},
  {id: 'verify', label: 'Verifier', desc: 'Test, lint, build'},
  {id: 'correct', label: 'Correct', desc: 'One hypothesis, smallest fix'},
];

export default function LoopFeedbackDiagram({
  title = 'Who closes the feedback loop?',
  subtitle = 'Prompt mode keeps you in the loop. Loop Engineering hands it to a machine-checkable verifier.',
}: LoopFeedbackDiagramProps): React.ReactElement {
  return (
    <figure className="cursor-loop-compare" aria-label={title}>
      <figcaption className="cursor-loop-compare__header">
        <p className="cursor-loop-compare__eyebrow">Loop anatomy</p>
        <h3 className="cursor-loop-compare__title">{title}</h3>
        <p className="cursor-loop-compare__subtitle">{subtitle}</p>
      </figcaption>

      <div className="cursor-loop-compare__grid">
        <div className="cursor-loop-compare__panel cursor-loop-compare__panel--prompt">
          <h4 className="cursor-loop-compare__panel-title">Prompt mode (Rung 0)</h4>
          <p className="cursor-loop-compare__panel-tag">Human closes the loop</p>
          <svg
            className="cursor-loop-compare__ring"
            viewBox="0 0 200 200"
            aria-hidden="true">
            <circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke="#78787E"
              strokeWidth="2"
              strokeDasharray="5 4"
              opacity="0.5"
            />
            {PROMPT_STEPS.map((step, i) => {
              const angle = (i / PROMPT_STEPS.length) * Math.PI * 2 - Math.PI / 2;
              const x = 100 + Math.cos(angle) * 72;
              const y = 100 + Math.sin(angle) * 72;
              const lx = 100 + Math.cos(angle) * 98;
              const ly = 100 + Math.sin(angle) * 98;
              return (
                <g key={step.id}>
                  <circle cx={x} cy={y} r="6" fill="#916031" />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="cursor-loop-compare__svg-label">
                    {step.label}
                  </text>
                </g>
              );
            })}
            <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="cursor-loop-compare__svg-center">
              You
            </text>
          </svg>
          <ul className="cursor-loop-compare__steps">
            {PROMPT_STEPS.map((step) => (
              <li key={step.id}>
                <strong>{step.label}</strong> — {step.desc}
              </li>
            ))}
          </ul>
        </div>

        <div className="cursor-loop-compare__arrow" aria-hidden="true">
          <span>+ verifier</span>
          →
        </div>

        <div className="cursor-loop-compare__panel cursor-loop-compare__panel--loop">
          <h4 className="cursor-loop-compare__panel-title">Loop Engineering (Rung 2+)</h4>
          <p className="cursor-loop-compare__panel-tag">Verifier closes the loop</p>
          <svg
            className="cursor-loop-compare__ring"
            viewBox="0 0 200 200"
            aria-hidden="true">
            <circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke="#E8601B"
              strokeWidth="2.5"
              opacity="0.7"
            />
            {LOOP_STEPS.map((step, i) => {
              const angle = (i / LOOP_STEPS.length) * Math.PI * 2 - Math.PI / 2;
              const x = 100 + Math.cos(angle) * 72;
              const y = 100 + Math.sin(angle) * 72;
              const lx = 100 + Math.cos(angle) * 98;
              const ly = 100 + Math.sin(angle) * 98;
              const fill = step.id === 'verify' ? '#2C9F28' : '#E8601B';
              return (
                <g key={step.id}>
                  <circle cx={x} cy={y} r={step.id === 'verify' ? 8 : 6} fill={fill} />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="cursor-loop-compare__svg-label">
                    {step.label}
                  </text>
                </g>
              );
            })}
            <text x="100" y="96" textAnchor="middle" className="cursor-loop-compare__svg-center">
              Verifier
            </text>
            <text x="100" y="112" textAnchor="middle" className="cursor-loop-compare__svg-center-sub">
              pass / fail
            </text>
          </svg>
          <ul className="cursor-loop-compare__steps">
            {LOOP_STEPS.map((step) => (
              <li key={step.id}>
                <strong>{step.label}</strong> — {step.desc}
              </li>
            ))}
            <li>
              <strong>Repeat</strong> — until green, blocked, or budget
            </li>
          </ul>
        </div>
      </div>

      <p className="cursor-loop-compare__footer">
        A loop is a <strong>prompt plus a verifier</strong> the agent can iterate against.
        Engineering effort shifts from prompt-crafting to verifier-crafting.
      </p>
    </figure>
  );
}
