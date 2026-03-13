import { useState } from "react";
import { getPosterUrl } from "../../services/tmdb";
import { getGenreInfo, getPlaceholderGradient } from "../../utils/genres";
import { PlayIcon, DotsIcon, HeartIcon } from "../ui/Icons";
import { useApp } from "../../context/AppContext";
import styles from "./MovieCard.module.css";

export default function MovieCard({ movie, onSelect, size = "md" }) {
  const [hovered, setHovered] = useState(false);
  const { toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(movie.id);
  const genre = getGenreInfo(movie.genre_ids || []);
  const imgUrl = getPosterUrl(movie.poster_path, "md");

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div
      className={`${styles.card} ${styles[size]} ${hovered ? styles.hovered : ""}`}
      style={!imgUrl ? { background: getPlaceholderGradient(movie.id) } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect?.(movie)}
    >
      {imgUrl && (
        <img
          src={imgUrl}
          alt={movie.title || movie.name}
          className={styles.img}
          loading="lazy"
        />
      )}

      {/* Gradient overlay */}
      <div className={styles.overlay} />

      {/* Genre badge */}
      <div className={styles.genre} style={{ background: genre.color }}>
        {genre.label}
      </div>

      {/* Favorite button */}
      <button
        className={`${styles.favBtn} ${fav ? styles.favActive : ""}`}
        onClick={handleFav}
        aria-label="Favorite"
      >
        <HeartIcon size={13} filled={fav} />
      </button>

      {/* Dots menu */}
      <button className={`${styles.dotsBtn} ${hovered ? styles.visible : ""}`}>
        <DotsIcon size={14} />
      </button>

      {/* Bottom content */}
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <div className={styles.textBlock}>
            <p className={`${styles.title} clamp-2`}>{movie.title || movie.name}</p>
            {size !== "sm" && (
              <p className={`${styles.desc} clamp-1`}>{movie.overview}</p>
            )}
          </div>
          <button
            className={styles.playBtn}
            onClick={(e) => { e.stopPropagation(); onSelect?.(movie); }}
            aria-label="Play"
          >
            <PlayIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
