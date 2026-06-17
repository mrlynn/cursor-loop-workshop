import {useMemo} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {parseLmsConfig, type LmsConfig} from './lmsConfig';

export function useLmsConfig(): LmsConfig | null {
  const {siteConfig} = useDocusaurusContext();
  return useMemo(
    () => parseLmsConfig(siteConfig.customFields as Record<string, unknown>),
    [siteConfig.customFields],
  );
}
