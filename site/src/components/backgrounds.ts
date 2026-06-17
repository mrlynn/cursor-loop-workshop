/**
 * Painterly presentation backgrounds — hosted in static/img/backgrounds/
 * after Step 6 download. Matches Cursor enterprise deck asset IDs.
 */
export const BACKGROUND_IDS = [
  'bg_1',
  'bg_2',
  'bg_3',
  'bg_4',
  'bg_5',
  'bg_6',
  'bg_7',
  'bg_8',
  'bg_9',
] as const;

export type BackgroundId = (typeof BACKGROUND_IDS)[number];

export type TextTreatment = 'light' | 'dark';

export interface BackgroundMeta {
  id: BackgroundId;
  description: string;
  textTreatment: TextTreatment;
  /** Default section slug → background mapping for generated sites */
  sections?: string[];
}

export const BACKGROUNDS: Record<BackgroundId, BackgroundMeta> = {
  bg_1: {
    id: 'bg_1',
    description: 'Hudson River Valley sunset',
    textTreatment: 'light',
    sections: ['intro', 'closing'],
  },
  bg_2: {
    id: 'bg_2',
    description: 'Hokusai ink landscape',
    textTreatment: 'dark',
    sections: ['agenda', 'roadmap'],
  },
  bg_3: {
    id: 'bg_3',
    description: 'Alpine lake, violet mountains',
    textTreatment: 'dark',
    sections: ['agent-mode'],
  },
  bg_4: {
    id: 'bg_4',
    description: 'Coastal cove, pale sky',
    textTreatment: 'light',
    sections: ['bugbot', 'review'],
  },
  bg_5: {
    id: 'bg_5',
    description: 'Path with lone figure',
    textTreatment: 'dark',
    sections: ['getting-started'],
  },
  bg_6: {
    id: 'bg_6',
    description: 'Misty mountain ridges',
    textTreatment: 'dark',
    sections: ['admin', 'security'],
  },
  bg_7: {
    id: 'bg_7',
    description: 'Open seascape, distant sail',
    textTreatment: 'light',
    sections: ['faq', 'resources'],
  },
  bg_8: {
    id: 'bg_8',
    description: 'Alpine lake alternate crop',
    textTreatment: 'dark',
  },
  bg_9: {
    id: 'bg_9',
    description: 'Watercolor harbor',
    textTreatment: 'dark',
    sections: ['labs', 'workshop'],
  },
};

/** Section folder slug → recommended statement/hero background */
export const SECTION_BACKGROUND_MAP: Record<string, BackgroundId> = {
  'getting-started': 'bg_5',
  'loop-fundamentals': 'bg_3',
  'rules-and-skills': 'bg_9',
  'the-harness': 'bg_6',
  measurement: 'bg_4',
  'hands-on-labs': 'bg_9',
  'agent-mode': 'bg_3',
  bugbot: 'bg_4',
  'admin-security': 'bg_6',
  admin: 'bg_6',
  faq: 'bg_7',
  'understand-the-codebase': 'bg_5',
  'rules-skills': 'bg_9',
  'review-bugbot': 'bg_4',
};

export function backgroundUrl(id: BackgroundId): string {
  return `/img/backgrounds/${id}.jpg`;
}

export function backgroundForSection(sectionSlug: string): BackgroundId {
  return SECTION_BACKGROUND_MAP[sectionSlug] ?? 'bg_6';
}

/** First path segment of a docs plugin id, e.g. `agent-mode/overview` → `agent-mode`. */
export function sectionSlugFromDocId(docId: string): string {
  const [section] = docId.split('/');
  return section ?? docId;
}

export function backgroundForDocId(docId: string): BackgroundId {
  return backgroundForSection(sectionSlugFromDocId(docId));
}
