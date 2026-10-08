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
  { emoji: '🗓️', title: 'Agenda', description: 'The 3-hour timetable and 90-minute fast-track.', to: '/docs/agenda' },
  { emoji: '📄', title: 'Audience handout', description: 'Cheat sheet, glossary, quiz, and cloud best practices.', to: '/docs/audience-handout' },
  { emoji: '🎤', title: 'Facilitator guide', description: 'Script, timings, setup checklist, and live attack tips.', to: '/docs/facilitator-guide' },
];

const MODULES: readonly Card[] = [
  { emoji: '🍽️', title: '1 · API Essentials & Demo', description: 'The waiter analogy, HTTP verbs, JSON, status codes, and Swagger UI.', to: '/docs/modules/api-fundamentals' },
  { emoji: '🛡️', title: '2 · DevSecOps & Shift Left', description: 'Automating SAST, SCA, and secret scanning into the CI assembly line.', to: '/docs/modules/introduction-to-devsecops' },
  { emoji: '🔐', title: '3 · API Security Deep Dive', description: 'OWASP Top 10, BOLA, mass assignment, constant-time auth, and rate limits.', to: '/docs/modules/api-security' },
  { emoji: '☁️', title: '4 · Cloud Integration', description: 'API Gateways, Cloud IAM, Secrets Manager, and containerized deployment.', to: '/docs/modules/cloud-integration' },
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
          <p className={styles.heroMeta}>3 hours · DevSecOps · API Security · Cloud Integration</p>
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
