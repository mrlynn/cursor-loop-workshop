import React, {useState} from 'react';

export type FeedbackLoopOwner = 'human' | 'hybrid' | 'verifier' | 'verifier-async';

export interface JourneyStage {
  id: string;
  title: string;
  subtitle: string;
  rung?: string;
  autonomy: number;
  feedbackLoop: FeedbackLoopOwner;
  loopLabel: string;
  cursorSurface: string;
  whenToUse: string;
  escalateTo?: string;
  accent: string;
}

export interface AutonomyJourneyDiagramProps {
  title?: string;
  subtitle?: string;
  stages?: JourneyStage[];
  defaultStage?: string;
}

const DEFAULT_STAGES: JourneyStage[] = [
  {
    id: 'tab',
    title: 'Tab',
    subtitle: 'Next-edit completion',
    autonomy: 5,
    feedbackLoop: 'human',
    loopLabel: 'You accept or reject each suggestion',
    cursorSurface: 'Tab v2 — single-file prediction',
    whenToUse: 'Line-level completions in flow. No files created, no terminal.',
    escalateTo: 'Inline Edit when the change spans a selection',
    accent: '#78787E',
  },
  {
    id: 'inline',
    title: 'Inline / Cmd+K',
    subtitle: 'Scoped rewrite',
    rung: '0',
    autonomy: 15,
    feedbackLoop: 'human',
    loopLabel: 'You judge each edit',
    cursorSurface: 'Inline Edit / Smart Rewrites',
    whenToUse: 'Rewrite a selection in place. Still one-shot unless you re-prompt.',
    escalateTo: 'Composer when multiple files must move together',
    accent: '#916031',
  },
  {
    id: 'chat-composer',
    title: 'Chat & Composer',
    subtitle: 'Prompt mode',
    rung: '0',
    autonomy: 25,
    feedbackLoop: 'human',
    loopLabel: 'You are the feedback loop',
    cursorSurface: 'Chat · Composer',
    whenToUse: 'Exploration, coordinated multi-file diffs with human review between turns.',
    escalateTo: 'Agent mode when you need search, terminal, or multi-step execution',
    accent: '#A88D02',
  },
  {
    id: 'agent',
    title: 'Agent mode',
    subtitle: 'Supervised execution',
    rung: '1',
    autonomy: 50,
    feedbackLoop: 'hybrid',
    loopLabel: 'Agent acts; you approve steps',
    cursorSurface: 'Agent mode — tools + terminal',
    whenToUse: 'Multi-step tasks with human approval each iteration. Agent can run tests but you still close the loop.',
    escalateTo: 'Loop Engineering when a verifier can decide pass/fail',
    accent: '#F76D18',
  },
  {
    id: 'loop-engineering',
    title: 'Loop Engineering',
    subtitle: 'Verifier-driven loop',
    rung: '2',
    autonomy: 70,
    feedbackLoop: 'verifier',
    loopLabel: 'Verifier closes the loop',
    cursorSurface: 'Agent + rules + skills',
    whenToUse: 'Act → verify → correct → repeat until green. Rules encode discipline; verifier is the signal.',
    escalateTo: 'Cloud agent when the task is long-running and budgeted',
    accent: '#E8601B',
  },
  {
    id: 'cloud',
    title: 'Cloud / Background',
    subtitle: 'Async loop',
    rung: '3',
    autonomy: 85,
    feedbackLoop: 'verifier-async',
    loopLabel: 'Loop runs in worktree; you review PR',
    cursorSurface: 'Background / Cloud Agents',
    whenToUse: 'Long-running loops with termination budget. Human reviews the PR at the end.',
    escalateTo: 'AI-first SDLC as team practice across all phases',
    accent: '#2268FF',
  },
  {
    id: 'ai-sdlc',
    title: 'AI-first SDLC',
    subtitle: 'Practice, not a product button',
    autonomy: 100,
    feedbackLoop: 'verifier-async',
    loopLabel: 'Loops + review layers across the lifecycle',
    cursorSurface: 'Plan · Build · Debug · Review × rules · skills · Bugbot',
    whenToUse: 'Right mode per task; loops where verifiers exist; layered review before merge.',
    accent: '#2C9F28',
  },
];

const LOOP_OWNER_LABEL: Record<FeedbackLoopOwner, string> = {
  human: 'Human closes loop',
  hybrid: 'Human + agent',
  verifier: 'Verifier closes loop',
  'verifier-async': 'Verifier + async review',
};

export default function AutonomyJourneyDiagram({
  title = 'The developer journey',
  subtitle = 'Autonomy increases left to right. Loop ownership shifts from you to the verifier.',
  stages = DEFAULT_STAGES,
  defaultStage = 'chat-composer',
}: AutonomyJourneyDiagramProps): React.ReactElement {
  const [activeId, setActiveId] = useState(defaultStage);
  const active = stages.find((s) => s.id === activeId) ?? stages[0];

  return (
    <figure className="cursor-journey" aria-label={title}>
      <figcaption className="cursor-journey__header">
        <p className="cursor-journey__eyebrow">Autonomy continuum</p>
        <h3 className="cursor-journey__title">{title}</h3>
        <p className="cursor-journey__subtitle">{subtitle}</p>
      </figcaption>

      <div className="cursor-journey__track-wrap">
        <div className="cursor-journey__track" role="list">
          {stages.map((stage, index) => {
            const isActive = stage.id === activeId;
            const isPast =
              stages.findIndex((s) => s.id === activeId) >= index;
            return (
              <button
                key={stage.id}
                type="button"
                role="listitem"
                className={[
                  'cursor-journey__node',
                  isActive ? 'cursor-journey__node--active' : '',
                  isPast ? 'cursor-journey__node--past' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{'--stage-accent': stage.accent} as React.CSSProperties}
                onClick={() => setActiveId(stage.id)}
                aria-pressed={isActive}
                aria-label={`${stage.title}: ${stage.subtitle}`}>
                <span className="cursor-journey__node-rung">
                  {stage.rung != null ? `Rung ${stage.rung}` : '—'}
                </span>
                <span
                  className="cursor-journey__node-dot"
                  style={{height: `${20 + stage.autonomy * 0.55}px`}}
                />
                <span className="cursor-journey__node-title">{stage.title}</span>
                <span className="cursor-journey__node-sub">{stage.subtitle}</span>
              </button>
            );
          })}
        </div>

        <svg
          className="cursor-journey__loop-arc"
          viewBox="0 0 800 48"
          preserveAspectRatio="none"
          aria-hidden="true">
          <defs>
            <linearGradient id="journey-loop-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78787E" stopOpacity="0.2" />
              <stop offset="45%" stopColor="#F76D18" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2C9F28" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <path
            d="M 40 40 Q 200 4, 400 20 T 760 12"
            fill="none"
            stroke="url(#journey-loop-grad)"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <polygon points="752,8 760,12 754,18" fill="#2C9F28" opacity="0.8" />
        </svg>
        <p className="cursor-journey__loop-caption">
          Loop discipline intensifies → Agent mode onward. Loop Engineering makes the cycle
          machine-checkable.
        </p>
      </div>

      <div
        className="cursor-journey__detail"
        style={{'--stage-accent': active.accent} as React.CSSProperties}>
        <div className="cursor-journey__detail-meta">
          <span className="cursor-journey__detail-surface">{active.cursorSurface}</span>
          {active.rung != null && (
            <span className="cursor-journey__detail-rung">Rung {active.rung}</span>
          )}
        </div>
        <h4 className="cursor-journey__detail-title">{active.title}</h4>
        <p className="cursor-journey__detail-loop">
          <strong>Feedback loop:</strong> {LOOP_OWNER_LABEL[active.feedbackLoop]} —{' '}
          {active.loopLabel}
        </p>
        <p className="cursor-journey__detail-use">{active.whenToUse}</p>
        {active.escalateTo && (
          <p className="cursor-journey__detail-escalate">
            <span className="cursor-journey__detail-escalate-label">Escalate when</span>
            {active.escalateTo}
          </p>
        )}
      </div>
    </figure>
  );
}
