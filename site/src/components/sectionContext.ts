import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {
  backgroundForSection,
  sectionSlugFromDocId,
  type BackgroundId,
} from './backgrounds';

export function useSectionSlug(override?: string): string {
  const {metadata} = useDoc();
  return override ?? sectionSlugFromDocId(metadata.id);
}

export function useSectionBackground(
  options: {sectionSlug?: string; background?: BackgroundId} = {},
): BackgroundId {
  const sectionSlug = useSectionSlug(options.sectionSlug);
  return options.background ?? backgroundForSection(sectionSlug);
}

export function useDocTitle(override?: string): string {
  const {metadata, frontMatter} = useDoc();
  return override ?? (frontMatter.title as string) ?? metadata.title;
}
