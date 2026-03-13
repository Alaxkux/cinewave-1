import { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { SearchIcon, BellIcon, ChevronDown, MenuIcon } from "../ui/Icons";
import styles from "./TopNav.module.css";

const NAV_ITEMS = ["Movies", "TV Series", "Animation", "Mystery", "More"];

export default function TopNav({ onSearch }) {
  const { activeNav, setActiveNav, setSidebarOpen } = useApp();
  const [inputVal, setInputVal] = useState("");
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);

  const handleInput = (e) => {
    const val = e.target.value;
    setInputVal(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch?.(val), 350);
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <header className={styles.topNav}>
      {/* Mobile menu button */}
      <button className={styles.mobileMenu} onClick={() => setSidebarOpen((o) => !o)} aria-label="Menu">
        <MenuIcon size={22} />
      </button>

      {/* Search */}
      <div className={`${styles.search} ${focused ? styles.focused : ""}`}>
        <SearchIcon size={15} />
        <input
          type="text"
          placeholder="Search movies, shows..."
          value={inputVal}
          onChange={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {inputVal && (
          <button
            className={styles.clearBtn}
            onClick={() => { setInputVal(""); onSearch?.(""); }}
          >
            ×
          </button>
        )}
      </div>

      {/* Nav tabs */}
      <nav className={styles.navTabs}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            className={`${styles.tab} ${activeNav === item ? styles.activeTab : ""}`}
            onClick={() => setActiveNav(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right controls */}
      <div className={styles.rightControls}>
        <button className={styles.iconBtn} aria-label="Notifications">
          <BellIcon size={19} />
          <span className={styles.notifDot} />
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>A</div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Arfi Maulana</span>
            <span className={styles.profileHandle}>@arfimaulana</span>
          </div>
          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}
