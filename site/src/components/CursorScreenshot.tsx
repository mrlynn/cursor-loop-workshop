import React from 'react';

export interface CursorScreenshotProps {
  /** Path under static/ e.g. /img/screenshots/agent-mode/agent-scoped-prompt.png */
  src: string;
  alt: string;
  caption?: string;
  /** Optional doc page slug this image belongs to (for facilitator notes) */
  doc?: string;
}

/**
 * Branded figure for Cursor product UI screenshots.
 * Use in MDX under ## How it works or ## Step-by-step.
 */
export default function CursorScreenshot({
  src,
  alt,
  caption,
  doc,
}: CursorScreenshotProps): React.ReactElement {
  return (
    <figure className="cursor-screenshot" data-doc={doc}>
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
