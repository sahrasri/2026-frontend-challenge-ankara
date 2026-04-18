import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCheckins } from "../../api/checkins.crud";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useEvidence } from "../../hooks/useEvidence";
import { normalizeResponse, normalizeCheckin } from "../../utils/normalize";
import { filterCheckins } from "../../utils/filters";
import SearchFilter from "../../components/SearchFilter/SearchFilter";
import PersonMap from "../../components/Map/PersonMap";
import CheckinTimeline from "../../components/Timeline/CheckinTimeline";
import EvidencePanel from "../../components/EvidencePanel/EvidencePanel";
import {
  LoadingView,
  ErrorView,
  EmptyView,
} from "../../components/StateViews/StateViews";
import styles from "./Checkins.module.css";

const formatTime = (d) =>
  d instanceof Date
    ? d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const PODO_NAME = "Podo";

const Checkins = () => {
  const { data, loading, error, refetch } = useAsyncData(getCheckins);
  const { findRelated } = useEvidence();
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({
    personFilter: "",
    locationFilter: "",
    startDate: "",
    endDate: "",
  });

  const checkins = useMemo(
    () => normalizeResponse(data, normalizeCheckin),
    [data],
  );

  const filteredCheckins = useMemo(
    () => filterCheckins(checkins, filters),
    [checkins, filters],
  );

  const uniquePeople = useMemo(
    () => [...new Set(checkins.map((c) => c.personName))].sort(),
    [checkins],
  );

  const uniqueLocations = useMemo(
    () =>
      [
        ...new Set(
          checkins.map((c) => c.location).filter((l) => l && l !== "Unknown"),
        ),
      ].sort(),
    [checkins],
  );

  const evidenceByCheckin = useMemo(() => {
    const map = new Map();
    filteredCheckins.forEach((c) => {
      map.set(
        c.id,
        findRelated({
          persons: [c.personName],
          location: c.location,
          timestamp: c.timestamp,
        }),
      );
    });
    return map;
  }, [filteredCheckins, findRelated]);

  const selectedEvidence = selected ? evidenceByCheckin.get(selected.id) : null;

  const stats = useMemo(() => {
    const uniquePeopleInView = new Set(
      filteredCheckins.map((c) => c.personName),
    );
    const uniqueLocationsInView = new Set(
      filteredCheckins.map((c) => c.location).filter(Boolean),
    );
    const podoSightings = filteredCheckins.filter(
      (c) => c.personName === PODO_NAME,
    );
    const podoLast = podoSightings
      .filter((c) => c.timestamp)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    return {
      total: filteredCheckins.length,
      people: uniquePeopleInView.size,
      locations: uniqueLocationsInView.size,
      podoCount: podoSightings.length,
      podoLast,
    };
  }, [filteredCheckins]);

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Back to dashboard
      </Link>

      <header className={styles.header}>
        <span className={styles.eyebrow}>01 · Check-ins</span>
        <h1 className={styles.title}>Where was everyone?</h1>
        <p className={styles.lead}>
          Pins on the map show how many people checked in at each location. Podo
          is highlighted in orange.
        </p>
      </header>

      {loading && <LoadingView label="Pulling check-in records…" />}

      {!loading && error && <ErrorView error={error} onRetry={refetch} />}

      {!loading && !error && checkins.length === 0 && (
        <EmptyView label="No check-ins recorded yet." />
      )}

      {!loading && !error && checkins.length > 0 && (
        <>
          <SearchFilter
            onFilterChange={setFilters}
            people={uniquePeople}
            locations={uniqueLocations}
            showPeople={true}
            showTime={true}
            showLocation={true}
          />
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
                  : "Not spotted yet"
              }
            />
          </section>

          <section className={styles.mapSection} aria-label="Map of check-ins">
            <h2 className={styles.sectionTitle}>Map</h2>
            <PersonMap checkins={filteredCheckins} />
          </section>

          <section className={styles.timelineSection} aria-label="Timeline">
            <h2 className={styles.sectionTitle}>Timeline</h2>
            <p className={styles.hint}>
              🔍 Click a row to see related personal notes &amp; anonymous tips.
            </p>
            {filteredCheckins.length === 0 ? (
              <p className={styles.noResults}>
                No check-ins match your search criteria.
              </p>
            ) : (
              <CheckinTimeline
                checkins={filteredCheckins}
                onRowClick={setSelected}
                evidenceByItemId={evidenceByCheckin}
              />
            )}
          </section>
        </>
      )}

      <EvidencePanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.personName} @ ${selected.location}` : ""}
        subtitle={selected ? formatTime(selected.timestamp) : ""}
        notes={selectedEvidence?.notes ?? []}
        tips={selectedEvidence?.tips ?? []}
      />
    </main>
  );
};

const StatCard = ({ label, value, hint, accent }) => (
  <div
    className={`${styles.stat} ${accent === "orange" ? styles.statAccent : ""}`}
  >
    <span className={styles.statValue}>{value}</span>
    <span className={styles.statLabel}>{label}</span>
    {hint && <span className={styles.statHint}>{hint}</span>}
  </div>
);

export default Checkins;
