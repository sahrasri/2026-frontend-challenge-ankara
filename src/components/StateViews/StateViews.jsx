import styles from './StateViews.module.css';

export const LoadingView = ({ label = 'Loading clues…' }) => (
  <div className={styles.container} role="status" aria-live="polite">
    <span className={styles.spinner} aria-hidden="true" />
    <p className={styles.text}>{label}</p>
  </div>
);

export const ErrorView = ({ error, onRetry }) => (
  <div className={`${styles.container} ${styles.error}`} role="alert">
    <p className={styles.errorTitle}>Something went wrong.</p>
    {error?.message && <p className={styles.errorBody}>{error.message}</p>}
    {onRetry && (
      <button className={styles.retry} onClick={onRetry} type="button">
        Try again
      </button>
    )}
  </div>
);

export const EmptyView = ({ label = 'No records yet.' }) => (
  <div className={styles.container}>
    <p className={styles.text}>{label}</p>
  </div>
);
