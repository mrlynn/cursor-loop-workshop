import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsible: false,
      items: [
        'intro',
        'quick-reference',
        'bring-your-own-repo',
        'getting-started/overview',
        'getting-started/developer-journey',
        'getting-started/autonomy-ladder',
        'getting-started/environment-setup',
      ],
    },
    {
      type: 'category',
      label: '🔄 Loop Fundamentals',
      items: [
        'loop-fundamentals/overview',
        'loop-fundamentals/tasks-and-verifiers',
        'loop-fundamentals/termination-budget',
      ],
    },
    {
      type: 'category',
      label: '📐 Rules & Skills',
      items: [
        'rules-and-skills/overview',
        'rules-and-skills/creating-loop-rules',
        'rules-and-skills/loop-skills',
      ],
    },
    {
      type: 'category',
      label: '🔧 The Harness',
      items: [
        'the-harness/overview',
        'the-harness/cli-harness',
        'the-harness/hooks-and-guardrails',
      ],
    },
    {
      type: 'category',
      label: '📊 Measurement',
      items: [
        'measurement/overview',
        'measurement/comparison-arm',
        'measurement/metrics-and-evidence',
      ],
    },
    {
      type: 'category',
      label: '🧪 Hands-on Labs',
      items: [
        'hands-on-labs/overview',
        'hands-on-labs/first-loop-lab',
        'hands-on-labs/prompt-vs-loop-demo',
      ],
    },
    {
      type: 'category',
      label: '❓ FAQ',
      items: ['faq'],
    },
  ],
};

export default sidebars;
