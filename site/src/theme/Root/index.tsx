import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {LearningProgressProvider} from '@site/src/components/LearningProgressContext';
import {parseLmsConfig} from '@site/src/components/lmsConfig';

export default function Root({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  const lms = parseLmsConfig(siteConfig.customFields as Record<string, unknown>);

  if (!lms?.courseId) {
    return <>{children}</>;
  }

  return (
    <LearningProgressProvider courseId={lms.courseId}>
      {children}
    </LearningProgressProvider>
  );
}
