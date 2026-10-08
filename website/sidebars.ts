import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// Doc ids drop the numeric prefix: docs/modules/01-what-is-an-api.md -> modules/what-is-an-api
const sidebars: SidebarsConfig = {
  workshop: [
    {
      type: 'category',
      label: 'Start here',
      collapsible: false,
      items: [
        { type: 'doc', id: 'agenda', label: '🗓️ Agenda' },
        { type: 'doc', id: 'audience-handout', label: '📄 Audience handout' },
        { type: 'doc', id: 'facilitator-guide', label: '🎤 Facilitator guide' },
      ],
    },
    {
      type: 'category',
      label: 'Modules',
      collapsible: false,
      items: [
        { type: 'doc', id: 'modules/what-is-an-api', label: '1 · What is an API?' },
        { type: 'doc', id: 'modules/apis-in-daily-life', label: '2 · APIs in daily life' },
        { type: 'doc', id: 'modules/apis-for-society-and-economy', label: '3 · Society & economy' },
        { type: 'doc', id: 'modules/building-an-api', label: "4 · Let's build an API" },
        { type: 'doc', id: 'modules/api-security', label: '5 · API security' },
        { type: 'doc', id: 'modules/devops-basics', label: '6 · DevOps basics' },
      ],
    },
  ],
};

export default sidebars;
