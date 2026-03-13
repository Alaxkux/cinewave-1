import { useState, useEffect } from "react";
import { getBackdropUrl } from "../../services/tmdb";
import { getGenreLabel, getPlaceholderGradient } from "../../utils/genres";
import { PlayIcon, DownloadIcon, DotsIcon, ChevronLeft, ChevronRight } from "../ui/Icons";
import styles from "./HeroSection.module.css";

export default function HeroSection({ movies = [], onSelect }) {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const movie = movies[index] || null;

  const navigate = (dir) => {
    if (transitioning || movies.length < 2) return;
    setTransitioning(true);
    setTimeout(() => {
      setIndex((i) => (i + dir + movies.length) % movies.length);
      setTransitioning(false);
    }, 200);
  };

  // Auto-rotate every 8s
  useEffect(() => {
    if (movies.length < 2) return;
    const t = setInterval(() => navigate(1), 8000);
    return () => clearInterval(t);
  }, [movies.length, transitioning]);

  if (!movie) {
    return (
      <div className={styles.hero} style={{ background: getPlaceholderGradient(0) }}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, "lg");
  const genres = getGenreLabel(movie.genre_ids || []);
  const rating = movie.vote_average?.toFixed(1);

  return (
    <div className={`${styles.hero} ${transitioning ? styles.transitioning : ""}`}>
      {/* Background */}
      {backdropUrl ? (
        <img
          key={movie.id}
          src={backdropUrl}
          alt=""
          className={styles.backdrop}
        />
      ) : (
        <div
          className={styles.backdropPlaceholder}
          style={{ background: getPlaceholderGradient(movie.id) }}
        />
      )}

      {/* Overlays */}
      <div className={styles.overlayGradient} />
      <div className={styles.overlayBottom} />

      {/* Top-left badge */}
      <div className={styles.trendingBadge}>
        <span className={styles.trendingDot}>●</span>
        Now Trending
      </div>

      {/* Rating badge */}
      {rating && (
        <div className={styles.ratingBadge}>
          ⭐ {rating}
        </div>
      )}

      {/* Carousel arrows */}
      {movies.length > 1 && (
        <div className={styles.arrows}>
          <button className={styles.arrow} onClick={() => navigate(-1)} aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <button className={styles.arrow} onClick={() => navigate(1)} aria-label="Next">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Dots */}
      {movies.length > 1 && (
        <div className={styles.dots}>
          {movies.slice(0, 6).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => { setTransitioning(true); setTimeout(() => { setIndex(i); setTransitioning(false); }, 200); }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        {genres.length > 0 && (
          <div className={styles.genres}>
            {genres.map((g) => (
              <span key={g} className={styles.genreTag}>{g}</span>
            ))}
          </div>
        )}

        <h1 className={styles.title}>{movie.title || movie.name}</h1>

        <p className={styles.overview}>{movie.overview}</p>

        <div className={styles.actions}>
          <button
            className={styles.watchBtn}
            onClick={() => onSelect?.(movie)}
          >
            <PlayIcon size={16} /> Watch Now
          </button>
          <button className={styles.downloadBtn}>
            <DownloadIcon size={16} /> Download
          </button>
          <button className={styles.moreBtn}>
            <DotsIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
