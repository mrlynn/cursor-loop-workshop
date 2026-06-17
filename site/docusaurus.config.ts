import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Loop Engineering × Cursor',
  tagline: 'Move from prompt mode to agentic loops with verifiable feedback',
  favicon: 'img/cursor-favicon.ico',
  url: 'https://mrlynn.github.io',
  baseUrl: '/cursor-loop-workshop/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    lms: {
      courseId: 'loop-engineering',
      workshopTitle: 'Loop Engineering — From Prompts to Agentic Loops',
      trackablePageIds: [
        'getting-started/overview',
        'loop-fundamentals/overview',
        'loop-fundamentals/tasks-and-verifiers',
        'rules-and-skills/overview',
        'rules-and-skills/creating-loop-rules',
        'the-harness/overview',
        'measurement/overview',
        'hands-on-labs/first-loop-lab',
      ],
      presenterPageIds: [
        'intro',
        'getting-started/overview',
        'getting-started/developer-journey',
        'getting-started/autonomy-ladder',
        'loop-fundamentals/overview',
        'loop-fundamentals/tasks-and-verifiers',
        'rules-and-skills/overview',
        'rules-and-skills/creating-loop-rules',
        'the-harness/overview',
        'measurement/overview',
        'measurement/comparison-arm',
        'hands-on-labs/first-loop-lab',
        'faq',
      ],
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/mrlynn/cursor-loop-workshop/tree/main/site/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    navbar: {
      title: 'Loop Engineering',
      logo: {
        alt: 'Cursor Logo',
        src: 'img/cursor-logo-dark.png',
        srcDark: 'img/cursor-logo-white.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Workshop',
        },
        {
          href: 'https://github.com/mrlynn/cursor-loop-workshop',
          label: 'GitHub',
          position: 'right',
          className: 'navbar__link--external',
        },
        {
          href: 'https://cursor.com/docs',
          label: 'cursor.com/docs',
          position: 'right',
          className: 'navbar__link--external',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {label: 'Workshop repo', href: 'https://github.com/mrlynn/cursor-loop-workshop'},
            {label: 'Cursor Docs', href: 'https://cursor.com/docs'},
            {label: 'Agent Skills', href: 'https://cursor.com/docs/context/skills'},
            {label: 'Rules', href: 'https://cursor.com/docs/context/rules'},
          ],
        },
        {
          title: 'Support',
          items: [
            {label: 'Forum', href: 'https://forum.cursor.com'},
            {label: 'Changelog', href: 'https://cursor.com/changelog'},
          ],
        },
      ],
      copyright: `Loop Engineering Framework · Built with Cursor · ${new Date().getFullYear()}`,
    },

    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'typescript', 'python', 'json', 'yaml'],
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
