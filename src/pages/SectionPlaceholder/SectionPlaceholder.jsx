import { Link } from 'react-router-dom';
import styles from './SectionPlaceholder.module.css';

/**
 * SectionPlaceholder
 * Temporary landing for each investigation section while the detail views
 * are still being built. Shown at /checkins, /messages, /sightings, etc.
 */
const SectionPlaceholder = ({ title, description, icon, accent = 'blue' }) => {
  return (
    <main className={`${styles.page} ${styles[`accent_${accent}`]}`}>
      <Link to="/" className={styles.back}>
        ← Back to dashboard
      </Link>

      <div className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        <span className={styles.tag}>Coming up next</span>
      </div>
    </main>
  );
};

export default SectionPlaceholder;
