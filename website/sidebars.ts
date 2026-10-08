import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// Doc ids drop the numeric prefix: docs/modules/01-api-fundamentals.md -> modules/api-fundamentals
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
        { type: 'doc', id: 'modules/api-fundamentals', label: '1 · API essentials & demo' },
        { type: 'doc', id: 'modules/introduction-to-devsecops', label: '2 · DevSecOps & Shift Left' },
        { type: 'doc', id: 'modules/api-security', label: '3 · API security deep dive' },
        { type: 'doc', id: 'modules/cloud-integration', label: '4 · Cloud integration' },
      ],
    },
  ],
};

export default sidebars;
