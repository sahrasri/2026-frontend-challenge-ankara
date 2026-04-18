import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './PersonMap.module.css';

const PODO = 'Podo';
const PODO_COLOR = '#f97316';
const OTHER_COLOR = '#2563eb';

const buildPinIcon = ({ count, hasPodo }) => {
  const color = hasPodo ? PODO_COLOR : OTHER_COLOR;
  const size = hasPodo ? 44 : 36;
  const ring = hasPodo
    ? 'box-shadow:0 0 0 4px rgba(249,115,22,0.25),0 6px 14px rgba(15,23,42,0.18);'
    : 'box-shadow:0 4px 10px rgba(15,23,42,0.18);';

  const html = `
    <div class="${styles.pinWrap}" style="width:${size}px;height:${size}px;">
      <div class="${styles.pin}" style="background:${color};${ring}">
        ${hasPodo ? '🐾' : count}
      </div>
      ${count > 1 ? `<span class="${styles.count}">${hasPodo ? `+${count - 1}` : count}</span>` : ''}
    </div>
  `;

  return L.divIcon({
    className: styles.divIcon,
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const groupByLocation = (sightings) => {
  const map = new Map();
  sightings.forEach((s) => {
    if (!s.coordinates) return;
    const key = `${s.coordinates.lat.toFixed(5)},${s.coordinates.lng.toFixed(5)}`;
    const entry = map.get(key) ?? {
      key,
      location: s.location,
      coordinates: s.coordinates,
      sightings: [],
      hasPodo: false,
    };
    entry.sightings.push(s);
    if (s.personName === PODO || s.seenWith === PODO) entry.hasPodo = true;
    map.set(key, entry);
  });
  return Array.from(map.values());
};

const formatTime = (d) =>
  d instanceof Date
    ? d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const SightingMap = ({ sightings = [] }) => {
  const groups = useMemo(() => groupByLocation(sightings), [sightings]);

  const center = useMemo(() => {
    if (!groups.length) return [39.9334, 32.8597];
    const podo = groups.find((g) => g.hasPodo);
    if (podo) return [podo.coordinates.lat, podo.coordinates.lng];
    return [groups[0].coordinates.lat, groups[0].coordinates.lng];
  }, [groups]);

  const bounds = useMemo(() => {
    if (groups.length < 2) return null;
    return groups.map((g) => [g.coordinates.lat, g.coordinates.lng]);
  }, [groups]);

  if (!groups.length) {
    return (
      <div className={styles.emptyMap}>
        No coordinates available for these sightings.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <MapContainer
        className={styles.map}
        center={center}
        zoom={13}
        bounds={bounds ?? undefined}
        boundsOptions={{ padding: [40, 40] }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {groups.map((group) => (
          <Marker
            key={group.key}
            position={[group.coordinates.lat, group.coordinates.lng]}
            icon={buildPinIcon({
              count: group.sightings.length,
              hasPodo: group.hasPodo,
            })}
          >
            <Tooltip direction="top" offset={[0, -12]}>
              <strong>{group.location}</strong> · {group.sightings.length} sighting{group.sightings.length === 1 ? '' : 's'}
            </Tooltip>
            <Popup>
              <div className={styles.popup}>
                <p className={styles.popupTitle}>📍 {group.location}</p>
                <ul className={styles.popupList}>
                  {group.sightings.map((s) => {
                    const involvesPodo = s.personName === PODO || s.seenWith === PODO;
                    return (
                      <li
                        key={s.id}
                        className={involvesPodo ? styles.podoRow : ''}
                        style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}
                      >
                        <span className={styles.popupName}>
                          {s.personName} &amp; {s.seenWith}
                        </span>
                        <span className={styles.popupTime}>
                          {formatTime(s.timestamp)}
                        </span>
                        {s.note && (
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                            {s.note}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className={styles.legend} aria-label="Map legend">
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: PODO_COLOR }} />
          Podo involved
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: OTHER_COLOR }} />
          Others
        </span>
      </div>
    </div>
  );
};

export default SightingMap;
