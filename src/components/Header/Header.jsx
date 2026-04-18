import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/checkins', label: 'Check-ins' },
  { to: '/messages', label: 'Messages' },
  { to: '/sightings', label: 'Sightings' },
  { to: '/notes', label: 'Notes' },
  { to: '/tips', label: 'Tips' },
];

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand} aria-label="Home">
        <span className={styles.mark} aria-hidden="true">
          🔍
        </span>
        <span className={styles.brandText}>
          Find<span className={styles.brandAccent}>Podo</span>
        </span>
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Header;
