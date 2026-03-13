import { useState, useCallback, useRef } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import TopNav from "./components/layout/TopNav";
import Home from "./pages/Home";
import SavedPage from "./pages/Saved";
import DownloadsPage from "./pages/Downloads";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import SeeAllPage from "./pages/SeeAll";
import "./styles/global.css";
import styles from "./App.module.css";

function AppShell() {
  const { activePage } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef(null);

  const handleSearch = useCallback((q) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(q), 300);
  }, []);

  const isHome = activePage === "home" || activePage === "seeall";

  const renderPage = () => {
    switch (activePage) {
      case "favorites": return <div className={styles.pageContainer}><SavedPage /></div>;
      case "downloads": return <div className={styles.pageContainer}><DownloadsPage /></div>;
      case "profile":   return <div className={styles.pageContainer}><ProfilePage /></div>;
      case "settings":  return <div className={styles.pageContainer}><SettingsPage /></div>;
      case "seeall":    return <div className={styles.pageContainer}><SeeAllPage /></div>;
      default:          return <Home searchQuery={searchQuery} />;
    }
  };

  return (
    <div className={styles.app}>
      <Sidebar />
      <div className={styles.main}>
        <TopNav onSearch={handleSearch} />
        <div className={styles.content}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
