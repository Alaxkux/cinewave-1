import { useState } from "react";
import { useApp } from "../../context/AppContext";
import MovieCard from "../../components/cards/MovieCard";
import MovieModal from "../../components/ui/MovieModal";
import EmptyState from "../../components/ui/EmptyState";
import styles from "./Browse.module.css";

const GENRES = [
  { id: 28,   label: "Action",     color: "#FF4E4E", emoji: "💥" },
  { id: 12,   label: "Adventure",  color: "#FF9B4E", emoji: "🗺️" },
  { id: 16,   label: "Animation",  color: "#A855F7", emoji: "🎨" },
  { id: 35,   label: "Comedy",     color: "#F59E0B", emoji: "😂" },
  { id: 80,   label: "Crime",      color: "#EF4444", emoji: "🔫" },
  { id: 18,   label: "Drama",      color: "#3B82F6", emoji: "🎭" },
  { id: 14,   label: "Fantasy",    color: "#8B5CF6", emoji: "🧙" },
  { id: 27,   label: "Horror",     color: "#6B7280", emoji: "👻" },
  { id: 9648, label: "Mystery",    color: "#6366F1", emoji: "🔍" },
  { id: 10749,label: "Romance",    color: "#F43F5E", emoji: "💕" },
  { id: 878,  label: "Sci-Fi",     color: "#0EA5E9", emoji: "🚀" },
  { id: 53,   label: "Thriller",   color: "#84CC16", emoji: "😰" },
];

const SORT_OPTIONS = ["Popularity", "Rating", "Newest", "Oldest"];

const mk = (id, title, genreIds) => ({
  id, title, overview: "An exciting movie you will love.",
  genre_ids: genreIds, poster_path: null, backdrop_path: null,
  vote_average: 6 + (id % 4) * 0.5, release_date: "2024-01-01",
});

const DEMO_MOVIES = Array.from({ length: 24 }, (_, i) =>
  mk(500 + i, ["Inception","Dune","Avatar","The Matrix","Interstellar","Tenet",
    "Blade Runner","Contact","Arrival","Gravity","Prometheus","Alien",
    "The Thing","Annihilation","Ex Machina","Her","Moon","Solaris",
    "2001 Space Odyssey","District 9","Children of Men","Looper","Oblivion","Coherence"][i % 24],
  [GENRES[i % GENRES.length].id])
);

export default function BrowsePage() {
  const { setActivePage } = useApp();
  const [activeGenre, setActiveGenre] = useState(null);
  const [sortBy, setSortBy] = useState("Popularity");
  const [selected, setSelected] = useState(null);

  const filtered = activeGenre
    ? DEMO_MOVIES.filter(m => m.genre_ids.includes(activeGenre))
    : DEMO_MOVIES;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Rating")   return b.vote_average - a.vote_average;
    if (sortBy === "Newest")   return b.id - a.id;
    if (sortBy === "Oldest")   return a.id - b.id;
    return 0;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backBtn} onClick={() => setActivePage("home")}>← Back</button>
          <h1 className={styles.title}>Browse by Genre</h1>
        </div>
      </div>

      {/* Genre chips */}
      <div className={styles.genreRow}>
        <button
          className={`${styles.chip} ${!activeGenre ? styles.chipActive : ""}`}
          onClick={() => setActiveGenre(null)}
        >All</button>
        {GENRES.map(g => (
          <button
            key={g.id}
            className={`${styles.chip} ${activeGenre === g.id ? styles.chipActive : ""}`}
            style={activeGenre === g.id ? { background: g.color, borderColor: g.color } : {}}
            onClick={() => setActiveGenre(prev => prev === g.id ? null : g.id)}
          >
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {/* Sort bar */}
      <div className={styles.toolbar}>
        <span className={styles.count}>{sorted.length} titles</span>
        <div className={styles.sortWrap}>
          <span className={styles.sortLabel}>Sort:</span>
          {SORT_OPTIONS.map(s => (
            <button
              key={s}
              className={`${styles.sortBtn} ${sortBy === s ? styles.sortActive : ""}`}
              onClick={() => setSortBy(s)}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {sorted.length === 0
        ? <EmptyState type="search" title="No movies in this genre" sub="Try selecting a different genre" />
        : (
          <div className={styles.grid}>
            {sorted.map(m => <MovieCard key={m.id} movie={m} onSelect={setSelected} size="md" />)}
          </div>
        )
      }

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
