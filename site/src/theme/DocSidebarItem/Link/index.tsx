/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * Modified for Cursor LMS sidebar progress badges.
 */
import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type {Props} from '@theme/DocSidebarItem/Link';
import {useLmsConfig} from '@site/src/components/useLmsConfig';
import {useLearningProgress} from '@site/src/components/useLearningProgress';

import styles from './styles.module.css';

function LinkLabel({
  label,
  docId,
}: {
  label: string;
  docId?: string;
}) {
  const lms = useLmsConfig();
  const {isPageComplete, ready} = useLearningProgress(lms?.courseId ?? '');
  const trackable =
    lms &&
    docId &&
    lms.trackablePageIds.includes(docId) &&
    ready &&
    isPageComplete(docId);

  return (
    <span title={label} className={styles.linkLabel}>
      {label}
      {trackable ? (
        <span className="cursor-sidebar-item-complete" aria-label="Lesson complete">
          ✓
        </span>
      ) : null}
    </span>
  );
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): ReactNode {
  const {href, label, className, autoAddBaseUrl} = item;
  const docId = 'docId' in item ? item.docId : undefined;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'menu__link',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        <LinkLabel label={label} docId={docId} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
