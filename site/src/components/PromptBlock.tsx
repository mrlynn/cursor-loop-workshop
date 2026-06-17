import React, {useState} from 'react';

export interface PromptBlockProps {
  title?: string;
  /** Prompt text learners paste into Cursor */
  prompt: string;
  language?: string;
}

export default function PromptBlock({
  title = 'Copy this prompt',
  prompt,
  language = 'text',
}: PromptBlockProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: user can select manually */
    }
  };

  return (
    <figure className="cursor-prompt-block">
      <figcaption className="cursor-prompt-block__header">
        <span className="cursor-eyebrow">{title}</span>
        <button
          type="button"
          className="cursor-prompt-block__copy"
          onClick={handleCopy}
          aria-live="polite">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>
      <pre className="cursor-prompt-block__pre">
        <code className={`language-${language}`}>{prompt}</code>
      </pre>
    </figure>
  );
}
