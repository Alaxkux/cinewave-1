import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AppContext = createContext(null);

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

export function AppProvider({ children }) {
  const [activePage, setActivePage]         = useState("home");
  const [activeNav, setActiveNav]           = useState("Movies");
  const [searchQuery, setSearchQuery]       = useState("");
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [favorites, setFavorites]           = useState(() => load("cw_favorites", []));
  const [downloads, setDownloads]           = useState(() => load("cw_downloads", []));
  const [continueWatching, setContinueWatching] = useState(() => load("cw_continue", []));
  const [seeAllData, setSeeAllData]         = useState(null); // { title, movies }
  const [user, setUser] = useState(() => load("cw_user", {
    name: "Arfi Maulana",
    handle: "@arfimaulana",
    email: "arfi@example.com",
    avatar: null,
  }));

  // Persist to localStorage
  useEffect(() => save("cw_favorites", favorites),       [favorites]);
  useEffect(() => save("cw_downloads", downloads),       [downloads]);
  useEffect(() => save("cw_continue",  continueWatching),[continueWatching]);
  useEffect(() => save("cw_user",      user),            [user]);

  // Favorites
  const toggleFavorite = useCallback((movie) => {
    setFavorites(prev =>
      prev.find(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie]
    );
  }, []);
  const isFavorite = useCallback((id) => favorites.some(m => m.id === id), [favorites]);

  // Downloads
  const toggleDownload = useCallback((movie) => {
    setDownloads(prev =>
      prev.find(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, { ...movie, downloadedAt: Date.now(), size: `${(Math.random() * 1.5 + 0.3).toFixed(1)} GB` }]
    );
  }, []);
  const isDownloaded = useCallback((id) => downloads.some(m => m.id === id), [downloads]);

  // Continue watching
  const addToContinueWatching = useCallback((movie) => {
    setContinueWatching(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      return [{ ...movie, progress: movie.progress || 10, subtitle: movie.subtitle || "Continue watching" }, ...filtered].slice(0, 12);
    });
  }, []);

  const updateProgress = useCallback((id, progress) => {
    setContinueWatching(prev => prev.map(m => m.id === id ? { ...m, progress } : m));
  }, []);

  // See All
  const openSeeAll = useCallback((title, movies) => {
    setSeeAllData({ title, movies });
    setActivePage("seeall");
  }, []);

  const closeSeeAll = useCallback(() => {
    setSeeAllData(null);
    setActivePage("home");
  }, []);

  // User
  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AppContext.Provider value={{
      activePage, setActivePage,
      activeNav, setActiveNav,
      searchQuery, setSearchQuery,
      sidebarOpen, setSidebarOpen,
      favorites, toggleFavorite, isFavorite,
      downloads, toggleDownload, isDownloaded,
      continueWatching, addToContinueWatching, updateProgress,
      seeAllData, openSeeAll, closeSeeAll,
      user, updateUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
