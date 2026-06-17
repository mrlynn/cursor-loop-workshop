import React from 'react';

export interface FaqNavItem {
  id: string;
  label: string;
}

export interface FaqNavProps {
  items: FaqNavItem[];
}

/**
 * Jump-nav for FAQ sections — place directly under the section banner.
 */
export default function FaqNav({items}: FaqNavProps): React.ReactElement {
  return (
    <nav className="cursor-faq-nav" aria-label="FAQ topics">
      <ul className="cursor-faq-nav__list">
        {items.map((item) => (
          <li key={item.id}>
            <a className="cursor-faq-nav__link" href={`#${item.id}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
