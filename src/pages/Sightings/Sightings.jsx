import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getSightings } from '../../api/sightings.crud';
import { useAsyncData } from '../../hooks/useAsyncData';
import { normalizeResponse, normalizeSighting } from '../../utils/normalize';
import SightingMap from '../../components/Map/SightingMap';
import {
  LoadingView,
  ErrorView,
  EmptyView,
} from '../../components/StateViews/StateViews';
import styles from './Sightings.module.css';

const PODO = 'Podo';

const formatTime = (d) =>
  d instanceof Date
    ? d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const Sightings = () => {
  const { data, loading, error, refetch } = useAsyncData(getSightings);

  const sightings = useMemo(
    () => normalizeResponse(data, normalizeSighting),
    [data]
  );

  const stats = useMemo(() => {
    const people = new Set();
    sightings.forEach((s) => { people.add(s.personName); people.add(s.seenWith); });
    const withPodo = sightings.filter(
      (s) => s.personName === PODO || s.seenWith === PODO
    );
    const locations = new Set(sightings.map((s) => s.location).filter(Boolean));
    return { total: sightings.length, people: people.size, withPodo: withPodo.length, locations: locations.size };
  }, [sightings]);

  const sorted = useMemo(
    () =>
      [...sightings].sort(
        (a, b) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0)
      ),
    [sightings]
  );

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>← Back to dashboard</Link>

      <header className={styles.header}>
        <span className={styles.eyebrow}>03 · Sightings</span>
        <h1 className={styles.title}>Who is seen with who?</h1>
        <p className={styles.lead}>
          Sightings connecting people together at specific places and times.
          Podo pins are shown in orange.
        </p>
      </header>

      {loading && <LoadingView label="Loading sightings…" />}
      {!loading && error && <ErrorView error={error} onRetry={refetch} />}
      {!loading && !error && sightings.length === 0 && (
        <EmptyView label="No sightings recorded yet." />
      )}

      {!loading && !error && sightings.length > 0 && (
        <>
          <section className={styles.statsRow} aria-label="Summary">
            <StatCard label="Total sightings" value={stats.total} />
            <StatCard label="People involved" value={stats.people} />
            <StatCard label="Locations" value={stats.locations} />
            <StatCard label="Sightings with Podo" value={stats.withPodo} accent="orange" />
          </section>

          <section aria-label="Sightings map">
            <h2 className={styles.sectionTitle}>Map</h2>
            <SightingMap sightings={sightings} />
          </section>

          <section aria-label="Sightings list">
            <h2 className={styles.sectionTitle}>All sightings</h2>
            <ol className={styles.list}>
              {sorted.map((s) => {
                const involvesPodo = s.personName === PODO || s.seenWith === PODO;
                return (
                  <li
                    key={s.id}
                    className={`${styles.row} ${involvesPodo ? styles.podoRow : ''}`}
                  >
                    <div className={styles.rowMain}>
                      <span className={styles.pair}>
                        <span className={involvesPodo && s.personName === PODO ? styles.podoName : styles.name}>
                          {s.personName}
                        </span>
                        <span className={styles.amp}>&amp;</span>
                        <span className={involvesPodo && s.seenWith === PODO ? styles.podoName : styles.name}>
                          {s.seenWith}
                        </span>
                      </span>
                      <span className={styles.meta}>
                        <span className={styles.location}>📍 {s.location}</span>
                        <span className={styles.time}>{formatTime(s.timestamp)}</span>
                      </span>
                    </div>
                    {s.note && <p className={styles.note}>{s.note}</p>}
                  </li>
                );
              })}
            </ol>
          </section>
        </>
      )}
    </main>
  );
};

const StatCard = ({ label, value, accent }) => (
  <div className={`${styles.stat} ${accent === 'orange' ? styles.statAccent : ''}`}>
    <span className={styles.statValue}>{value}</span>
    <span className={styles.statLabel}>{label}</span>
  </div>
);

export default Sightings;
