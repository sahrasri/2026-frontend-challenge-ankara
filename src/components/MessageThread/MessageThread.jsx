import styles from './MessageThread.module.css';

const PODO = 'Podo';

const URGENCY_LABEL = { low: null, medium: '⚠️ medium', high: '🚨 high' };

const formatTime = (d) =>
  d instanceof Date
    ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '—';

const mentionsPodo = (text) =>
  text?.toLowerCase().includes(PODO.toLowerCase());

const MessageThread = ({ messages = [], participants = [] }) => {
  const [left] = participants;

  const sorted = [...messages].sort((a, b) => {
    const ta = a.timestamp?.getTime() ?? 0;
    const tb = b.timestamp?.getTime() ?? 0;
    return ta - tb;
  });

  return (
    <ol className={styles.thread}>
      {sorted.map((msg) => {
        const isLeft = msg.from === left;
        const isPodoMsg = msg.from === PODO || msg.to === PODO;
        const hasMention = !isPodoMsg && mentionsPodo(msg.text);
        const urgencyHigh = msg.urgency === 'high';

        return (
          <li
            key={msg.id}
            className={[
              styles.row,
              isLeft ? styles.rowLeft : styles.rowRight,
              isPodoMsg ? styles.podo : '',
              hasMention ? styles.mention : '',
              urgencyHigh ? styles.urgent : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={styles.meta}>
              <span className={styles.sender}>{msg.from}</span>
              <span className={styles.time}>{formatTime(msg.timestamp)}</span>
              {URGENCY_LABEL[msg.urgency] && (
                <span className={styles.urgencyBadge}>
                  {URGENCY_LABEL[msg.urgency]}
                </span>
              )}
            </div>
            <div className={styles.bubble}>
              <p className={styles.text}>{msg.text}</p>
              {msg.location && (
                <span className={styles.location}>📍 {msg.location}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default MessageThread;
