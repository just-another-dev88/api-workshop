import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import type { ReactNode } from 'react';
import styles from './index.module.css';

interface Card {
  emoji: string;
  title: string;
  description: string;
  to: string;
}

const START_HERE: readonly Card[] = [
  { emoji: '🗓️', title: 'Agenda', description: 'The 3-hour timetable at a glance.', to: '/docs/agenda' },
  { emoji: '📄', title: 'Audience handout', description: 'Cheat sheet, glossary, quiz and further learning.', to: '/docs/audience-handout' },
  { emoji: '🎤', title: 'Facilitator guide', description: 'Script, timings, setup checklist and FAQs.', to: '/docs/facilitator-guide' },
];

const MODULES: readonly Card[] = [
  { emoji: '🍽️', title: '1 · What is an API?', description: 'An API is a waiter between apps.', to: '/docs/modules/what-is-an-api' },
  { emoji: '📱', title: '2 · APIs in daily life', description: 'One app = many APIs working together.', to: '/docs/modules/apis-in-daily-life' },
  { emoji: '🌍', title: '3 · Society & economy', description: 'How APIs create services, jobs and transparency.', to: '/docs/modules/apis-for-society-and-economy' },
  { emoji: '🛠️', title: "4 · Let's build an API", description: 'A real Todo API you can try in the browser.', to: '/docs/modules/building-an-api' },
  { emoji: '🔐', title: '5 · API security', description: 'Keys, checks, limits and locks.', to: '/docs/modules/api-security' },
  { emoji: '🚀', title: '6 · DevOps basics', description: 'The assembly line from laptop to internet.', to: '/docs/modules/devops-basics' },
];

function CardGrid({ cards }: { cards: readonly Card[] }): ReactNode {
  return (
    <ul className={styles.grid}>
      {cards.map((card) => (
        <li key={card.to}>
          <Link className={styles.card} to={card.to}>
            <span className={styles.emoji} aria-hidden="true">
              {card.emoji}
            </span>
            <span className={styles.cardTitle}>{card.title}</span>
            <span className={styles.cardText}>{card.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <header className={styles.hero}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>
            🔌 {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.heroMeta}>3 hours · beginner-friendly · APIs, security &amp; DevOps</p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/agenda">
              Start the workshop
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/audience-handout">
              Get the handout
            </Link>
          </div>
        </div>
      </header>
      <main className="container margin-vert--lg">
        <section aria-labelledby="start-here">
          <Heading as="h2" id="start-here">
            Start here
          </Heading>
          <CardGrid cards={START_HERE} />
        </section>
        <section aria-labelledby="modules" className="margin-top--lg">
          <Heading as="h2" id="modules">
            Modules
          </Heading>
          <CardGrid cards={MODULES} />
        </section>
      </main>
    </Layout>
  );
}
