import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCheckins } from '../../api/checkins.crud';
import { useAsyncData } from '../../hooks/useAsyncData';
import { normalizeResponse, normalizeCheckin } from '../../utils/normalize';
import PersonMap from '../../components/Map/PersonMap';
import CheckinTimeline from '../../components/Timeline/CheckinTimeline';
import {
  LoadingView,
  ErrorView,
  EmptyView,
} from '../../components/StateViews/StateViews';
import styles from './Checkins.module.css';

const PODO_NAME = 'Podo';

const Checkins = () => {
  const { data, loading, error, refetch } = useAsyncData(getCheckins);

  const checkins = useMemo(
    () => normalizeResponse(data, normalizeCheckin),
    [data]
  );

  const stats = useMemo(() => {
    const uniquePeople = new Set(checkins.map((c) => c.personName));
    const uniqueLocations = new Set(
      checkins.map((c) => c.location).filter(Boolean)
    );
    const podoSightings = checkins.filter((c) => c.personName === PODO_NAME);
    const podoLast = podoSightings
      .filter((c) => c.timestamp)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    return {
      total: checkins.length,
      people: uniquePeople.size,
      locations: uniqueLocations.size,
      podoCount: podoSightings.length,
      podoLast,
    };
  }, [checkins]);

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Back to dashboard
      </Link>

      <header className={styles.header}>
        <span className={styles.eyebrow}>01 · Check-ins</span>
        <h1 className={styles.title}>Where was everyone?</h1>
        <p className={styles.lead}>
          Pins on the map show how many people checked in at each location.
          Podo is highlighted in orange.
        </p>
      </header>

      {loading && <LoadingView label="Pulling check-in records…" />}

      {!loading && error && (
        <ErrorView error={error} onRetry={refetch} />
      )}

      {!loading && !error && checkins.length === 0 && (
        <EmptyView label="No check-ins recorded yet." />
      )}

      {!loading && !error && checkins.length > 0 && (
        <>
          <section className={styles.statsRow} aria-label="Summary">
            <StatCard label="Total check-ins" value={stats.total} />
            <StatCard label="People involved" value={stats.people} />
            <StatCard label="Locations" value={stats.locations} />
            <StatCard
              label="Podo sightings"
              value={stats.podoCount}
              accent="orange"
              hint={
                stats.podoLast
                  ? `Last seen at ${stats.podoLast.location}`
                  : 'Not spotted yet'
              }
            />
          </section>

          <section className={styles.mapSection} aria-label="Map of check-ins">
            <h2 className={styles.sectionTitle}>Map</h2>
            <PersonMap checkins={checkins} />
          </section>

          <section className={styles.timelineSection} aria-label="Timeline">
            <h2 className={styles.sectionTitle}>Timeline</h2>
            <CheckinTimeline checkins={checkins} />
          </section>
        </>
      )}
    </main>
  );
};

const StatCard = ({ label, value, hint, accent }) => (
  <div
    className={`${styles.stat} ${
      accent === 'orange' ? styles.statAccent : ''
    }`}
  >
    <span className={styles.statValue}>{value}</span>
    <span className={styles.statLabel}>{label}</span>
    {hint && <span className={styles.statHint}>{hint}</span>}
  </div>
);

export default Checkins;
