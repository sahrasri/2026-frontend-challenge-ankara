import { Link } from 'react-router-dom';
import styles from './InvestigationCard.module.css';

/**
 * InvestigationCard
 * Reusable card used on the investigation dashboard.
 * Accepts title, description, to (route), icon (emoji/node) and accent color.
 *
 * Props:
 *  - title: string (required)
 *  - description: string
 *  - to: string — route path (required)
 *  - icon: ReactNode — small icon/emoji shown in the header
 *  - accent: 'blue' | 'orange' | 'yellow'
 *  - index: number — shown as a small step badge (optional)
 */
const InvestigationCard = ({
  title,
  description,
  to,
  icon,
  accent = 'blue',
  index,
}) => {
  if (!title || !to) {
    return null;
  }

  const accentClass = styles[`accent_${accent}`] ?? styles.accent_blue;

  return (
    <Link
      to={to}
      className={`${styles.card} ${accentClass}`}
      aria-label={`Open ${title}`}
    >
      <div className={styles.header}>
        <span className={styles.iconBadge} aria-hidden="true">
          {icon}
        </span>
        {typeof index === 'number' && (
          <span className={styles.index}>0{index}</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <div className={styles.footer}>
        <span className={styles.cta}>
          Explore
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </Link>
  );
};

export default InvestigationCard;
