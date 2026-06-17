import React from 'react';

export interface FaqSectionProps {
  /** Orange mono label, e.g. "Setup" */
  eyebrow: string;
  /** Section heading shown in nav and above items */
  title: string;
  /** Anchor id for jump links — defaults to slugified title */
  id?: string;
  children: React.ReactNode;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function FaqSection({
  eyebrow,
  title,
  id,
  children,
}: FaqSectionProps): React.ReactElement {
  const sectionId = id ?? slugify(title);

  return (
    <section
      className="cursor-faq-section"
      id={sectionId}
      aria-labelledby={`${sectionId}-title`}>
      <header className="cursor-faq-section__header">
        <span className="cursor-eyebrow">{eyebrow}</span>
        <h2 className="cursor-faq-section__title" id={`${sectionId}-title`}>
          {title}
        </h2>
      </header>
      <div className="cursor-faq-section__items">{children}</div>
    </section>
  );
}
