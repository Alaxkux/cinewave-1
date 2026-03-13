import { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { SearchIcon, BellIcon, ChevronDown, MenuIcon, PersonIcon, SettingsIcon, DownloadIcon, HeartIcon } from "../ui/Icons";
import styles from "./TopNav.module.css";

const NAV_ITEMS = ["Movies", "TV Series", "Animation", "Mystery", "More"];

export default function TopNav({ onSearch }) {
  const { activeNav, setActiveNav, setSidebarOpen, user, setActivePage, activePage } = useApp();
  const [inputVal, setInputVal]   = useState("");
  const [focused, setFocused]     = useState(false);
  const [dropdown, setDropdown]   = useState(false);
  const debounceRef = useRef(null);
  const dropRef = useRef(null);

  const handleInput = (e) => {
    const val = e.target.value;
    setInputVal(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch?.(val), 350);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (!dropRef.current?.contains(e.target)) setDropdown(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const goTo = (page) => { setActivePage(page); setDropdown(false); };

  return (
    <header className={styles.topNav}>
      {/* Mobile hamburger */}
      <button className={styles.mobileMenu} onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">
        <MenuIcon size={22} />
      </button>

      {/* Search */}
      <div className={`${styles.search} ${focused ? styles.focused : ""}`}>
        <SearchIcon size={15} />
        <input
          type="text"
          placeholder="Search movies..."
          value={inputVal}
          onChange={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {inputVal && (
          <button className={styles.clearBtn} onClick={() => { setInputVal(""); onSearch?.(""); }}>×</button>
        )}
      </div>

      {/* Desktop nav tabs */}
      <nav className={styles.navTabs}>
        {NAV_ITEMS.map(item => (
          <button
            key={item}
            className={`${styles.tab} ${activeNav === item && activePage === "home" ? styles.activeTab : ""}`}
            onClick={() => { setActiveNav(item); setActivePage("home"); }}
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

        {/* Profile dropdown */}
        <div className={styles.profileWrap} ref={dropRef}>
          <div className={styles.profile} onClick={() => setDropdown(d => !d)}>
            <div className={styles.avatar}>
              {user.avatar
                ? <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                : user.name?.[0]?.toUpperCase()
              }
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{user.name}</span>
              <span className={styles.profileHandle}>{user.handle}</span>
            </div>
            <span className={styles.chevron}><ChevronDown size={15} /></span>
          </div>

          {dropdown && (
            <div className={styles.dropdown}>
              <div className={styles.dropHeader}>
                <div className={styles.dropAvatar}>
                  {user.avatar
                    ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    : user.name?.[0]?.toUpperCase()
                  }
                </div>
                <div>
                  <p className={styles.dropName}>{user.name}</p>
                  <p className={styles.dropHandle}>{user.handle}</p>
                </div>
              </div>
              <div className={styles.dropDivider} />
              <button className={styles.dropItem} onClick={() => goTo("profile")}><PersonIcon size={15} /> My Profile</button>
              <button className={styles.dropItem} onClick={() => goTo("favorites")}><HeartIcon size={15} /> Saved Items</button>
              <button className={styles.dropItem} onClick={() => goTo("downloads")}><DownloadIcon size={15} /> Downloads</button>
              <button className={styles.dropItem} onClick={() => goTo("settings")}><SettingsIcon size={15} /> Settings</button>
              <div className={styles.dropDivider} />
              <button className={`${styles.dropItem} ${styles.dropLogout}`}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
