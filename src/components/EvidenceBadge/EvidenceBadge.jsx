import styles from './EvidenceBadge.module.css';

/**
 * Small pill that signals "this row has related notes/tips".
 * Color intensifies with count to catch the detective's eye.
 */
const EvidenceBadge = ({ notes = 0, tips = 0 }) => {
  const total = notes + tips;
  if (total === 0) return null;

  const level = total >= 3 ? 'hot' : total >= 2 ? 'warm' : 'cool';

  return (
    <span
      className={`${styles.badge} ${styles[level]}`}
      title={`${notes} note${notes === 1 ? '' : 's'} · ${tips} tip${tips === 1 ? '' : 's'}`}
      aria-label={`${total} related items`}
    >
      <span className={styles.icon} aria-hidden="true">🔍</span>
      <span className={styles.count}>{total}</span>
    </span>
  );
};

export default EvidenceBadge;
