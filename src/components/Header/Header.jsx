import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">MyApp</Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/">Ana Sayfa</Link>
      </nav>
    </header>
  );
};

export default Header;
