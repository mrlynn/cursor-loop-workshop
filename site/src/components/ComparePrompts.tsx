import React, {useState} from 'react';

export interface PromptExample {
  label: string;
  prompt: string;
}

export interface ComparePromptsProps {
  title?: string;
  bad: PromptExample;
  good: PromptExample;
}

/** Side-by-side vague vs scoped prompts — common Cursor 101 slide pattern. */
export default function ComparePrompts({
  title = 'Good vs vague',
  bad,
  good,
}: ComparePromptsProps): React.ReactElement {
  const [copied, setCopied] = useState<'bad' | 'good' | null>(null);

  const copy = async (side: 'bad' | 'good', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(side);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* manual select fallback */
    }
  };

  return (
    <section className="cursor-compare-prompts" aria-label={title}>
      <header className="cursor-compare-prompts__header">
        <p className="cursor-eyebrow">Prompt discipline</p>
        <h2 className="cursor-compare-prompts__title">{title}</h2>
      </header>
      <div className="cursor-compare-prompts__grid">
        <article className="cursor-compare-prompts__card cursor-compare-prompts__card--bad">
          <div className="cursor-compare-prompts__card-header">
            <span className="cursor-compare-prompts__tag cursor-compare-prompts__tag--bad">
              {bad.label}
            </span>
            <button
              type="button"
              className="cursor-compare-prompts__copy"
              onClick={() => copy('bad', bad.prompt)}>
              {copied === 'bad' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="cursor-compare-prompts__pre">
            <code>{bad.prompt}</code>
          </pre>
        </article>
        <article className="cursor-compare-prompts__card cursor-compare-prompts__card--good">
          <div className="cursor-compare-prompts__card-header">
            <span className="cursor-compare-prompts__tag cursor-compare-prompts__tag--good">
              {good.label}
            </span>
            <button
              type="button"
              className="cursor-compare-prompts__copy"
              onClick={() => copy('good', good.prompt)}>
              {copied === 'good' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="cursor-compare-prompts__pre">
            <code>{good.prompt}</code>
          </pre>
        </article>
      </div>
    </section>
  );
}
