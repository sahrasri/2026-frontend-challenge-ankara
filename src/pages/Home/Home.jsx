import InvestigationCard from '../../components/InvestigationCard/InvestigationCard';
import styles from './Home.module.css';

const investigationSections = [
  {
    title: 'Where was everyone?',
    description:
      'Check-ins and appearances — see who showed up where and when.',
    to: '/checkins',
    icon: '📍',
    accent: 'blue',
  },
  {
    title: 'Messages',
    description:
      'Conversations exchanged between people around the time Podo went missing.',
    to: '/messages',
    icon: '💬',
    accent: 'orange',
  },
  {
    title: 'Who is seen with who?',
    description:
      'Sightings connecting people together at specific places and times.',
    to: '/sightings',
    icon: '👥',
    accent: 'yellow',
  },
];

function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Case file · #PODO-001</span>
        <h1 className={styles.title}>
          Where is <span className={styles.accent}>Podo?</span>
          <br />
          Let's find out.
        </h1>
        <p className={styles.lead}>
          After the event, Podo was seen with different people at different
          places. Pick a thread below and start pulling.
        </p>
        <p className={styles.hint}>
          🔍 Personal notes &amp; anonymous tips are wired into each section —
          click any row in a timeline or list to reveal what the evidence board
          knows.
        </p>
      </section>

      <section aria-label="Investigation sections" className={styles.grid}>
        {investigationSections.map((section, i) => (
          <InvestigationCard
            key={section.to}
            index={i + 1}
            title={section.title}
            description={section.description}
            to={section.to}
            icon={section.icon}
            accent={section.accent}
          />
        ))}
      </section>
    </main>
  );
}

export default Home;
