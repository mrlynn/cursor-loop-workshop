/** Shape of `customFields.lms` in docusaurus.config.ts */
export interface LmsConfig {
  courseId: string;
  trackablePageIds: string[];
  /** Ordered doc ids for presenter mode keyboard nav */
  presenterPageIds?: string[];
  workshopTitle?: string;
}

export function parseLmsConfig(customFields: Record<string, unknown> | undefined): LmsConfig | null {
  const lms = customFields?.lms;
  if (!lms || typeof lms !== 'object') {
    return null;
  }
  const cfg = lms as Partial<LmsConfig>;
  if (!cfg.courseId || !Array.isArray(cfg.trackablePageIds)) {
    return null;
  }
  return {
    courseId: cfg.courseId,
    trackablePageIds: cfg.trackablePageIds,
    presenterPageIds: cfg.presenterPageIds,
    workshopTitle: cfg.workshopTitle,
  };
}
