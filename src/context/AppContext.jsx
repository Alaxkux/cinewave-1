import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeNav, setActiveNav] = useState("Movies");
  const [activeSidebar, setActiveSidebar] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      return exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
    });
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((m) => m.id === id),
    [favorites]
  );

  const addToContinueWatching = useCallback((movie) => {
    setContinueWatching((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);
      return [movie, ...filtered].slice(0, 6);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeNav, setActiveNav,
        activeSidebar, setActiveSidebar,
        searchQuery, setSearchQuery,
        favorites, toggleFavorite, isFavorite,
        continueWatching, addToContinueWatching,
        sidebarOpen, setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
