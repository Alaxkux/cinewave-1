import { useState, useCallback, useRef } from "react";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import TopNav from "./components/layout/TopNav";
import Home from "./pages/Home";
import "./styles/global.css";

function AppShell() {
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef(null);

  const handleSearch = useCallback((q) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(q), 300);
  }, []);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      background: "var(--bg-primary)",
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopNav onSearch={handleSearch} />
        <Home searchQuery={searchQuery} />
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
