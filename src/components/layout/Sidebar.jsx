import { useApp } from "../../context/AppContext";
import {
  HomeIcon, HeartIcon, DownloadIcon,
  PersonIcon, SettingsIcon,
} from "../ui/Icons";
import styles from "./Sidebar.module.css";

const SIDEBAR_ITEMS = [
  { id: "home",      icon: HomeIcon,     label: "Home" },
  { id: "favorites", icon: HeartIcon,    label: "Favorites" },
  { id: "downloads", icon: DownloadIcon, label: "Downloads" },
  { id: "profile",   icon: PersonIcon,   label: "Profile" },
  { id: "settings",  icon: SettingsIcon, label: "Settings" },
];

export default function Sidebar() {
  const { activeSidebar, setActiveSidebar } = useApp();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <span>🎬</span>
      </div>

      <nav className={styles.nav}>
        {SIDEBAR_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`${styles.navItem} ${activeSidebar === id ? styles.active : ""}`}
            onClick={() => setActiveSidebar(id)}
            title={label}
            aria-label={label}
          >
            <Icon size={20} />
            {activeSidebar === id && <span className={styles.activeDot} />}
          </button>
        ))}
      </nav>
    </aside>
  );
}
