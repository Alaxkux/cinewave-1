import { useState, useCallback, useEffect } from "react";
import { useTMDB } from "../hooks/useTMDB";
import { useApp } from "../context/AppContext";
import HeroSection from "../components/sections/HeroSection";
import MovieRow from "../components/sections/MovieRow";
import SearchResults from "../components/sections/SearchResults";
import { TrailersPanel, ContinueWatchingPanel } from "../components/sections/SidePanels";
import MovieModal from "../components/ui/MovieModal";
import styles from "./Home.module.css";

const mk = (id, title, overview, genreIds) => ({
  id, title, overview, genre_ids: genreIds,
  poster_path: null, backdrop_path: null,
  vote_average: parseFloat((6.5 + (id % 3) * 0.8).toFixed(1)),
  release_date: "2024-01-01",
});

const DEMO_TRENDING = [
  mk(1, "Spider-Man: Across the Spider-Verse", "Miles Morales catapults across the Multiverse.", [16, 12, 28]),
  mk(2, "Oppenheimer", "The story of J. Robert Oppenheimer and the atomic bomb.", [18, 36]),
  mk(3, "Guardians of the Galaxy Vol. 3", "Peter Quill rallies his team on a mission to protect the universe.", [28, 12, 35]),
];
const DEMO_POPULAR = [
  mk(4, "The Flash", "Barry Allen uses his super speed to change the past.", [14, 28]),
  mk(5, "Manifest", "A commercial airliner suddenly reappears after being missing.", [9648, 18]),
  mk(6, "Elemental", "Ember and Wade live in a city where elements live together.", [16, 35]),
  mk(7, "Interstellar", "A farmer sets out on a time travel journey to save Earth.", [878, 18]),
  mk(8, "Avatar: The Way of Water", "Jake Sully lives with his newfound family on Pandora.", [878, 12]),
  mk(9, "John Wick: Chapter 4", "John Wick uncovers a path to defeating The High Table.", [28, 53]),
];
const DEMO_TRAILERS = [
  mk(10, "The Last Kingdom: Seven Kings Must Die", "In the wake of King Edward's death.", [36, 28]),
  mk(11, "The Super Mario Bros. Movie", "Brothers Mario and Luigi transported to a magical world.", [16, 35]),
  mk(12, "Indiana Jones: Dial of Destiny", "Indiana Jones races to retrieve a legendary dial.", [12, 28]),
];
const DEMO_CONTINUE = [
  { ...mk(13, "Dark Season 3", "", [9648, 878]), subtitle: "Episode 2", progress: 65 },
  { ...mk(14, "Transformers", "", [28, 878]), subtitle: "Episode 1", progress: 30 },
  { ...mk(15, "Lupin Season 2", "", [9648, 80]), subtitle: "Episode 3", progress: 80 },
  { ...mk(16, "Avatar: The Way...", "", [878, 12]), subtitle: "Episode 1", progress: 15 },
];

export default function Home({ searchQuery }) {
  const { data, loading, hasKey, search } = useTMDB();
  const { continueWatching, activeNav } = useApp();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const trending  = hasKey && data.trending.length  ? data.trending  : DEMO_TRENDING;
  const popular   = hasKey && data.popular.length   ? data.popular   : DEMO_POPULAR;
  const trailers  = hasKey && data.trailers.length  ? data.trailers  : DEMO_TRAILERS;
  const tvShows   = hasKey && data.tvShows.length   ? data.tvShows   : DEMO_POPULAR.slice(0, 4);
  const animation = hasKey && data.animation.length ? data.animation : DEMO_POPULAR.filter(m => m.genre_ids.includes(16));
  const mystery   = hasKey && data.mystery.length   ? data.mystery   : DEMO_POPULAR.filter(m => m.genre_ids.includes(9648));
  const cwMovies  = continueWatching.length > 0 ? continueWatching : DEMO_CONTINUE;

  const navRows = {
    "Movies":    [{ title: "You might like", list: popular }, { title: "Top Rated", list: [...popular].sort((a,b) => b.vote_average - a.vote_average) }],
    "TV Series": [{ title: "Popular TV Shows", list: tvShows }, { title: "Trending Now", list: trending }],
    "Animation": [{ title: "Animation Movies", list: animation }, { title: "Also Popular", list: popular }],
    "Mystery":   [{ title: "Mystery & Thriller", list: mystery }, { title: "Also Popular", list: popular }],
    "More":      [{ title: "Popular", list: popular }, { title: "Trending", list: trending }],
  };
  const rows = navRows[activeNav] || navRows["Movies"];

  useEffect(() => {
    if (!searchQuery) { setSearchResults([]); return; }
    setSearchLoading(true);
    search(searchQuery).then(res => {
      setSearchResults(res.length > 0 ? res : DEMO_POPULAR);
      setSearchLoading(false);
    });
  }, [searchQuery, search]);

  return (
    <div className={styles.layout}>
      {/* LEFT: Trailers + Continue Watching */}
      <aside className={styles.aside}>
        <TrailersPanel movies={trailers} onSelect={setSelectedMovie} />
        <ContinueWatchingPanel movies={cwMovies} onSelect={setSelectedMovie} />
      </aside>

      {/* CENTER+RIGHT: Hero + Rows */}
      <main className={styles.main}>
        {searchQuery ? (
          <SearchResults query={searchQuery} results={searchResults} loading={searchLoading} onSelect={setSelectedMovie} />
        ) : (
          <>
            <HeroSection movies={trending} onSelect={setSelectedMovie} />
            {rows.map(({ title, list }) => (
              <MovieRow key={title} title={title} movies={list} loading={loading} onSelect={setSelectedMovie} />
            ))}
          </>
        )}
      </main>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
}
