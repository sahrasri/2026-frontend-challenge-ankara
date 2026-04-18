import { useMemo } from 'react';
import styles from './CheckinTimeline.module.css';

const PODO_NAME = 'Podo';

const formatDate = (d) =>
  d instanceof Date
    ? d.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      })
    : 'Unknown date';

const formatTime = (d) =>
  d instanceof Date
    ? d.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const dayKey = (d) =>
  d instanceof Date
    ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    : 'unknown';

/**
 * CheckinTimeline
 * Sorts check-ins chronologically and groups by day.
 * Podo rows are styled with the orange accent and pinned with 🐾.
 */
const CheckinTimeline = ({ checkins = [] }) => {
  const grouped = useMemo(() => {
    const sorted = [...checkins].sort((a, b) => {
      const ta = a.timestamp ? a.timestamp.getTime() : 0;
      const tb = b.timestamp ? b.timestamp.getTime() : 0;
      return ta - tb;
    });

    const groups = new Map();
    sorted.forEach((c) => {
      const key = dayKey(c.timestamp);
      const group = groups.get(key) ?? {
        key,
        date: c.timestamp,
        items: [],
      };
      group.items.push(c);
      groups.set(key, group);
    });
    return Array.from(groups.values());
  }, [checkins]);

  if (!grouped.length) {
    return (
      <div className={styles.empty}>No check-ins available to display.</div>
    );
  }

  return (
    <div className={styles.timeline}>
      {grouped.map((group) => (
        <section key={group.key} className={styles.dayGroup}>
          <header className={styles.dayHeader}>
            <span className={styles.dayLabel}>{formatDate(group.date)}</span>
            <span className={styles.dayCount}>
              {group.items.length} check-in
              {group.items.length === 1 ? '' : 's'}
            </span>
          </header>

          <ol className={styles.list}>
            {group.items.map((item) => {
              const isPodo = item.personName === PODO_NAME;
              const mentionsPodo =
                !isPodo &&
                item.note?.toLowerCase().includes(PODO_NAME.toLowerCase());
              return (
                <li
                  key={item.id}
                  className={`${styles.row} ${isPodo ? styles.podoRow : ''} ${mentionsPodo ? styles.mentionRow : ''}`}
                >
                  <div className={styles.time}>
                    <span className={styles.timeValue}>
                      {formatTime(item.timestamp)}
                    </span>
                  </div>

                  <div className={styles.marker} aria-hidden="true">
                    <span className={styles.dot} />
                  </div>

                  <div className={styles.content}>
                    <div className={styles.topLine}>
                      <span className={styles.person}>
                        {isPodo && (
                          <span className={styles.podoTag}>🐾 Podo</span>
                        )}
                        {!isPodo && item.personName}
                      </span>
                      <span className={styles.location}>
                        📍 {item.location}
                      </span>
                    </div>
                    {item.note && <p className={styles.note}>{item.note}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
};

export default CheckinTimeline;
