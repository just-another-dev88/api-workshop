import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  workshop: [
    {
      type: 'category',
      label: 'Start here',
      collapsible: false,
      items: [
        { type: 'doc', id: 'agenda', label: '🗓️ Agenda (2 Hours)' },
        { type: 'doc', id: 'audience-handout', label: '📄 Audience handout' },
        { type: 'doc', id: 'facilitator-guide', label: '🎤 Facilitator guide' },
      ],
    },
    {
      type: 'category',
      label: 'Modules',
      collapsible: false,
      items: [
        { type: 'doc', id: 'modules/devsecops', label: '1 · DevSecOps (30 min)' },
        { type: 'doc', id: 'modules/api-security', label: '2 · API Security (45 min)' },
        { type: 'doc', id: 'modules/cloud-integration', label: '3 · Cloud Integration (45 min)' },
      ],
    },
  ],
};

export default sidebars;
