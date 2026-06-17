import React from 'react';

export interface FaqItemProps {
  question: string;
  children: React.ReactNode;
  /** Open by default — use sparingly (e.g. first item in a section) */
  defaultOpen?: boolean;
}

export default function FaqItem({
  question,
  children,
  defaultOpen = false,
}: FaqItemProps): React.ReactElement {
  return (
    <details className="cursor-faq-item" open={defaultOpen || undefined}>
      <summary className="cursor-faq-item__question">{question}</summary>
      <div className="cursor-faq-item__answer">{children}</div>
    </details>
  );
}
