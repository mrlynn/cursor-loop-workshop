/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * Modified for Cursor presentation docs layout.
 */
import React from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import PresentationControls from '@site/src/components/PresentationControls';
import styles from './styles.module.css';
import presentationStyles from './presentation-layout.module.css';

function useDocTOC(isPresentation: boolean) {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();
  const hidden =
    frontMatter.hide_table_of_contents ||
    (isPresentation && frontMatter.presentation_toc === false);
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;
  return {hidden, mobile, desktop};
}

export default function DocItemLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const {metadata, frontMatter} = useDoc();
  const isPresentation = Boolean(frontMatter.presentation_layout);
  const docTOC = useDocTOC(isPresentation);
  const showToc = !docTOC.hidden && docTOC.desktop;

  return (
    <div className="row">
      <div
        className={clsx(
          'col',
          !docTOC.hidden && !isPresentation && styles.docItemCol,
          isPresentation &&
            (showToc
              ? presentationStyles.presentationColWithToc
              : presentationStyles.presentationCol),
        )}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div
          className={clsx(
            styles.docItemContainer,
            isPresentation && presentationStyles.presentationDoc,
          )}>
          <article>
            {!isPresentation && <DocBreadcrumbs />}
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
        <PresentationControls />
      </div>
      {showToc && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
