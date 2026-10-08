import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import path from 'node:path';
import { themes as prismThemes } from 'prism-react-renderer';
import remarkRepoLinks from './plugins/remark-repo-links.mjs';

// ---------------------------------------------------------------------------
// GitHub Pages settings. Override with env vars when deploying a fork,
// e.g. SITE_URL=https://me.github.io BASE_URL=/my-fork/ npm run build
// ---------------------------------------------------------------------------
const GITHUB_ORG = 'just-another-dev88';
const GITHUB_REPO = 'api-workshop';
const GITHUB_BRANCH = 'main';
const REPO_URL = `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`;

const repoRoot = path.resolve(__dirname, '..');
const docsDir = path.join(repoRoot, 'docs');

const config: Config = {
  title: 'API Workshop',
  tagline: 'How the apps we use every day talk to each other',
  favicon: 'img/favicon.svg',

  url: process.env.SITE_URL ?? `https://${GITHUB_ORG}.github.io`,
  baseUrl: process.env.BASE_URL ?? `/${GITHUB_REPO}/`,
  organizationName: GITHUB_ORG,
  projectName: GITHUB_REPO,
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  markdown: {
    // .md files are parsed as plain CommonMark (not MDX), so the existing docs
    // render as-is: `{json}` snippets, <https://autolinks> and <details> all work.
    format: 'detect',
    mermaid: true,
    hooks: { onBrokenMarkdownLinks: 'throw' },
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          // Reuse the existing /docs folder - no content is duplicated.
          path: docsDir,
          sidebarPath: './sidebars.ts',
          editUrl: ({ docPath }) => `${REPO_URL}/edit/${GITHUB_BRANCH}/docs/${docPath}`,
          showLastUpdateTime: false,
          beforeDefaultRemarkPlugins: [
            [remarkRepoLinks, { docsDir, repoRoot, repoUrl: REPO_URL, branch: GITHUB_BRANCH }],
          ],
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: { respectPrefersColorScheme: true },
    docs: { sidebar: { hideable: true } },
    navbar: {
      title: 'API Workshop',
      logo: { alt: 'API Workshop logo', src: 'img/favicon.svg' },
      items: [
        { type: 'doc', docId: 'agenda', label: 'Agenda', position: 'left' },
        { type: 'docSidebar', sidebarId: 'workshop', label: 'Modules', position: 'left' },
        { type: 'doc', docId: 'audience-handout', label: 'Handout', position: 'left' },
        { type: 'doc', docId: 'facilitator-guide', label: 'Facilitator', position: 'left' },
        { href: REPO_URL, label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Workshop',
          items: [
            { label: 'Agenda', to: '/docs/agenda' },
            { label: 'Audience handout', to: '/docs/audience-handout' },
            { label: 'Facilitator guide', to: '/docs/facilitator-guide' },
          ],
        },
        {
          title: 'Code',
          items: [
            { label: 'Todo API demo', href: `${REPO_URL}/tree/${GITHUB_BRANCH}/demo` },
            { label: 'GitHub repository', href: REPO_URL },
          ],
        },
      ],
      copyright: `API Workshop · Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'powershell', 'python', 'json', 'yaml', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
