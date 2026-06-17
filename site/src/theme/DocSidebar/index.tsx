/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * Modified: always mount DocSidebarMobile so NavbarSecondaryMenuFiller
 * registers on every viewport (fixes empty mobile hamburger menu on hydration).
 */
import React, {type ReactNode} from 'react';
import {useWindowSize} from '@docusaurus/theme-common';
import DocSidebarDesktop from '@theme/DocSidebar/Desktop';
import DocSidebarMobile from '@theme/DocSidebar/Mobile';
import type {Props} from '@theme/DocSidebar';

export default function DocSidebar(props: Props): ReactNode {
  const windowSize = useWindowSize();

  const shouldRenderSidebarDesktop =
    windowSize === 'desktop' || windowSize === 'ssr';

  return (
    <>
      {shouldRenderSidebarDesktop && <DocSidebarDesktop {...props} />}
      {/* Always mount — filler must register before the hamburger opens */}
      <DocSidebarMobile {...props} />
    </>
  );
}
