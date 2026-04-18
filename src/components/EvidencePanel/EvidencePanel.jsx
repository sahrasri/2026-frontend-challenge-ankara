import { useEffect } from "react";
import styles from "./EvidencePanel.module.css";

const formatTime = (d) =>
  d instanceof Date
    ? d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/**
 * Slide-in drawer showing the personal notes + anonymous tips that
 * match the investigation item the user clicked on.
 */
const EvidencePanel = ({
  open,
  onClose,
  title,
  subtitle,
  notes = [],
  tips = [],
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const total = notes.length + tips.length;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <aside
        className={styles.panel}
        role="dialog"
        aria-label="Related evidence"
      >
        <header className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.eyebrow}>🔍 Evidence board</span>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className={styles.body}>
          {total === 0 && (
            <div className={styles.empty}>
              <p>No notes or tips match this entry.</p>
              <span className={styles.emptyHint}>
                Try another person, place, or time.
              </span>
            </div>
          )}

          {notes.length > 0 && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>
                📝 Personal Notes
                <span className={styles.count}>{notes.length}</span>
              </h4>
              <ul className={styles.list}>
                {notes.map((n) => (
                  <li
                    key={n.id}
                    className={`${styles.note} ${
                      n.isPerfect ? styles.perfect : ""
                    }`}
                  >
                    {n.isPerfect && (
                      <div className={styles.perfectBadge}>
                        ⚡ Perfect Match
                      </div>
                    )}
                    <header className={styles.itemHeader}>
                      <span className={styles.author}>
                        Note from <strong>{n.author}</strong>
                      </span>
                      <span className={styles.time}>
                        {formatTime(n.timestamp)}
                      </span>
                    </header>
                    {n.location && (
                      <span className={styles.meta}>📍 {n.location}</span>
                    )}
                    <p className={styles.content}>"{n.note}"</p>
                    {n.mentionedPeople && (
                      <span className={styles.mentioned}>
                        Mentions: {n.mentionedPeople}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tips.length > 0 && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>
                🕵️ Anonymous Tips
                <span className={styles.count}>{tips.length}</span>
              </h4>
              <ul className={styles.list}>
                {tips.map((t) => (
                  <li
                    key={t.id}
                    className={`${styles.tip} ${
                      styles[`conf_${t.confidence}`] ?? ""
                    } ${t.isPerfect ? styles.perfect : ""}`}
                  >
                    {t.isPerfect && (
                      <div className={styles.perfectBadge}>
                        ⚡ Perfect Match
                      </div>
                    )}
                    <header className={styles.itemHeader}>
                      <span className={styles.author}>
                        Tip about <strong>{t.suspectName}</strong>
                      </span>
                      <span
                        className={`${styles.confidence} ${
                          styles[`confBadge_${t.confidence}`] ?? ""
                        }`}
                      >
                        {t.confidence}
                      </span>
                    </header>
                    <span className={styles.time}>
                      {formatTime(t.timestamp)}
                    </span>
                    {t.location && (
                      <span className={styles.meta}>📍 {t.location}</span>
                    )}
                    <p className={styles.content}>"{t.tip}"</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>
    </>
  );
};

export default EvidencePanel;
