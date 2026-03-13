import MovieCard from "../cards/MovieCard";
import styles from "./MovieRow.module.css";

export default function MovieRow({ title, movies = [], onSelect, loading = false }) {
  return (
    <div className={styles.row}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button className={styles.seeAll}>See all</button>
      </div>
      <div className={`${styles.scrollRow} scroll-row`}>
        {loading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className={`${styles.skeletonCard} skeleton`} />
            ))
          : movies.map((m) => (
              <MovieCard key={m.id} movie={m} onSelect={onSelect} />
            ))}
      </div>
    </div>
  );
}
