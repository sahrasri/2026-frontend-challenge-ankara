import { useMemo } from 'react';
import styles from './MessageTimeline.module.css';

const PODO = 'Podo';

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
    ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '—';

const dayKey = (d) =>
  d instanceof Date
    ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    : 'unknown';

const MessageTimeline = ({ messages = [] }) => {
  const grouped = useMemo(() => {
    const sorted = [...messages].sort(
      (a, b) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0)
    );

    const groups = new Map();
    sorted.forEach((msg) => {
      const key = dayKey(msg.timestamp);
      const group = groups.get(key) ?? { key, date: msg.timestamp, items: [] };
      group.items.push(msg);
      groups.set(key, group);
    });
    return Array.from(groups.values());
  }, [messages]);

  if (!grouped.length) return null;

  return (
    <div className={styles.timeline}>
      {grouped.map((group) => (
        <section key={group.key} className={styles.dayGroup}>
          <header className={styles.dayHeader}>
            <span className={styles.dayLabel}>{formatDate(group.date)}</span>
            <span className={styles.dayCount}>
              {group.items.length} message{group.items.length === 1 ? '' : 's'}
            </span>
          </header>

          <ol className={styles.list}>
            {group.items.map((msg) => {
              const involvesPodo = msg.from === PODO || msg.to === PODO;
              const mentionsPodo =
                !involvesPodo &&
                msg.text?.toLowerCase().includes(PODO.toLowerCase());

              return (
                <li
                  key={msg.id}
                  className={[
                    styles.row,
                    involvesPodo ? styles.podoRow : '',
                    mentionsPodo ? styles.mentionRow : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className={styles.time}>
                    <span className={styles.timeValue}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>

                  <div className={styles.marker} aria-hidden="true">
                    <span className={styles.dot} />
                  </div>

                  <div className={styles.content}>
                    <div className={styles.topLine}>
                      <span className={styles.route}>
                        <span className={styles.person}>{msg.from}</span>
                        <span className={styles.arrow}>→</span>
                        <span className={styles.person}>{msg.to}</span>
                      </span>
                      {msg.location && (
                        <span className={styles.location}>📍 {msg.location}</span>
                      )}
                      {msg.urgency && msg.urgency !== 'low' && (
                        <span className={`${styles.urgency} ${styles[`urgency_${msg.urgency}`]}`}>
                          {msg.urgency}
                        </span>
                      )}
                    </div>
                    <p className={styles.text}>{msg.text}</p>
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

export default MessageTimeline;
