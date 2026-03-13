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

  const renderPage = () => {
    switch (activePage) {
      case "favorites": return <SavedPage />;
      case "downloads": return <DownloadsPage />;
      case "profile":   return <ProfilePage />;
      case "settings":  return <SettingsPage />;
      case "seeall":    return <SeeAllPage />;
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
