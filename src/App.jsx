import { useState, useCallback, useRef } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import TopNav from "./components/layout/TopNav";
import BottomNav from "./components/layout/BottomNav";
import PageTransition from "./components/ui/PageTransition";
import { ToastProvider } from "./components/ui/Toast";
import Onboarding from "./components/ui/Onboarding";
import Home from "./pages/Home";
import SavedPage from "./pages/Saved";
import DownloadsPage from "./pages/Downloads";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import SeeAllPage from "./pages/SeeAll";
import MovieDetailPage from "./pages/MovieDetail";
import BrowsePage from "./pages/Browse";
import "./styles/global.css";
import styles from "./App.module.css";

function AppShell() {
  const { activePage, user, updateUser } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef(null);
  const contentRef  = useRef(null);

  const handleSearch = useCallback((q) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(q), 300);
  }, []);

  const handleSearchFocus = useCallback(() => {}, []);

  // Show onboarding on first visit
  const showOnboarding = !user?.onboarded;

  const renderPage = () => {
    switch (activePage) {
      case "favorites": return <div className={styles.pageContainer}><SavedPage /></div>;
      case "downloads": return <div className={styles.pageContainer}><DownloadsPage /></div>;
      case "profile":   return <div className={styles.pageContainer}><ProfilePage /></div>;
      case "settings":  return <div className={styles.pageContainer}><SettingsPage /></div>;
      case "seeall":    return <div className={styles.pageContainer}><SeeAllPage /></div>;
      case "detail":    return <MovieDetailPage />;
      case "browse":    return <div className={styles.pageContainer}><BrowsePage /></div>;
      default:          return <Home searchQuery={searchQuery} contentRef={contentRef} />;
    }
  };

  return (
    <div className={styles.app}>
      {/* Onboarding overlay */}
      {showOnboarding && (
        <Onboarding onComplete={() => updateUser({ onboarded: true })} />
      )}

      <Sidebar />

      <div className={styles.main}>
        <TopNav onSearch={handleSearch} onSearchFocus={handleSearchFocus} />
        <div className={styles.content} ref={contentRef}>
          <PageTransition pageKey={activePage}>
            {renderPage()}
          </PageTransition>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav onSearchTap={() => {
        const inp = document.querySelector("input[placeholder*='Search']");
        inp?.focus();
      }} />

      {/* Global toast container */}
      <ToastProvider />
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
