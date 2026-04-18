import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessages } from '../../api/messages.crud';
import { useAsyncData } from '../../hooks/useAsyncData';
import { normalizeResponse, normalizeMessage } from '../../utils/normalize';
import MessageThread from '../../components/MessageThread/MessageThread';
import MessageTimeline from '../../components/MessageTimeline/MessageTimeline';
import {
  LoadingView,
  ErrorView,
  EmptyView,
} from '../../components/StateViews/StateViews';
import styles from './Messages.module.css';

const threadKey = (from, to) => [from, to].sort().join(' ↔ ');

const Messages = () => {
  const { data, loading, error, refetch } = useAsyncData(getMessages);
  const [activeKey, setActiveKey] = useState(null);

  const messages = useMemo(
    () => normalizeResponse(data, normalizeMessage),
    [data]
  );

  const threads = useMemo(() => {
    const map = new Map();
    messages.forEach((msg) => {
      const key = threadKey(msg.from, msg.to);
      const thread = map.get(key) ?? {
        key,
        participants: [msg.from, msg.to].sort(),
        messages: [],
      };
      thread.messages.push(msg);
      map.set(key, thread);
    });
    return Array.from(map.values()).sort(
      (a, b) =>
        Math.max(...b.messages.map((m) => m.timestamp?.getTime() ?? 0)) -
        Math.max(...a.messages.map((m) => m.timestamp?.getTime() ?? 0))
    );
  }, [messages]);

  const activeThread = threads.find((t) => t.key === activeKey) ?? threads[0];

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Back to dashboard
      </Link>

      <header className={styles.header}>
        <span className={styles.eyebrow}>02 · Messages</span>
        <h1 className={styles.title}>Messages</h1>
        <p className={styles.lead}>
          Conversations exchanged around the time Podo went missing.
        </p>
      </header>

      {loading && <LoadingView label="Loading messages…" />}
      {!loading && error && <ErrorView error={error} onRetry={refetch} />}
      {!loading && !error && messages.length === 0 && (
        <EmptyView label="No messages recorded yet." />
      )}

      {!loading && !error && messages.length > 0 && (
        <>
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              {threads.map((thread) => {
                const isActive =
                  activeKey === thread.key ||
                  (!activeKey && thread === threads[0]);
                const lastMsg = [...thread.messages].sort(
                  (a, b) =>
                    (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0)
                )[0];
                const hasPodo = thread.participants.includes('Podo');
                return (
                  <button
                    key={thread.key}
                    className={[
                      styles.threadBtn,
                      isActive ? styles.threadBtnActive : '',
                      hasPodo ? styles.threadBtnPodo : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setActiveKey(thread.key)}
                  >
                    <span className={styles.threadParticipants}>
                      {thread.participants.join(' & ')}
                    </span>
                    <span className={styles.threadPreview}>
                      {lastMsg?.text?.slice(0, 60)}
                      {lastMsg?.text?.length > 60 ? '…' : ''}
                    </span>
                    <span className={styles.threadCount}>
                      {thread.messages.length} msg
                      {thread.messages.length === 1 ? '' : 's'}
                    </span>
                  </button>
                );
              })}
            </aside>

            <section className={styles.chatPane}>
              {activeThread && (
                <>
                  <header className={styles.chatHeader}>
                    <span className={styles.chatParticipants}>
                      {activeThread.participants.join(' & ')}
                    </span>
                    <span className={styles.chatCount}>
                      {activeThread.messages.length} messages
                    </span>
                  </header>
                  <div className={styles.chatBody}>
                    <MessageThread
                      messages={activeThread.messages}
                      participants={activeThread.participants}
                    />
                  </div>
                </>
              )}
            </section>
          </div>

          <section className={styles.timelineSection}>
            <h2 className={styles.sectionTitle}>Timeline</h2>
            <MessageTimeline messages={messages} />
          </section>
        </>
      )}
    </main>
  );
};

export default Messages;
