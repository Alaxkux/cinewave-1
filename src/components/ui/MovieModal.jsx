import { useEffect, useState } from "react";
import { getBackdropUrl, getPosterUrl } from "../../services/tmdb";
import { getGenreInfo, getGenreLabel } from "../../utils/genres";
import { PlayIcon, CloseIcon, HeartIcon, DownloadIcon, StarIcon } from "../ui/Icons";
import { useApp } from "../../context/AppContext";
import { useMovieDetails } from "../../hooks/useTMDB";
import styles from "./MovieModal.module.css";

export default function MovieModal({ movie, onClose }) {
  const { toggleFavorite, isFavorite, addToContinueWatching } = useApp();
  const { movie: details, videos } = useMovieDetails(movie?.id);
  const [playingTrailer, setPlayingTrailer] = useState(false);

  const fav = isFavorite(movie?.id);
  const displayMovie = details || movie;
  const backdropUrl = getBackdropUrl(displayMovie?.backdrop_path, "lg");
  const posterUrl = getPosterUrl(displayMovie?.poster_path, "md");
  const genres = getGenreLabel(displayMovie?.genre_ids || displayMovie?.genres?.map(g => g.id) || []);
  const trailer = videos?.[0];
  const rating = displayMovie?.vote_average?.toFixed(1);
  const year = displayMovie?.release_date?.slice(0, 4);
  const runtime = displayMovie?.runtime;

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleWatch = () => {
    addToContinueWatching({ ...displayMovie, subtitle: "Continue watching" });
    if (trailer) setPlayingTrailer(true);
  };

  if (!movie) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Hero */}
        <div className={styles.hero}>
          {playingTrailer && trailer ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className={styles.trailer}
              allow="autoplay; fullscreen"
              title="Trailer"
            />
          ) : (
            <>
              {backdropUrl ? (
                <img src={backdropUrl} alt="" className={styles.heroImg} />
              ) : (
                <div className={styles.heroPlaceholder} />
              )}
              <div className={styles.heroOverlay} />
              {trailer && (
                <button className={styles.trailerBtn} onClick={handleWatch}>
                  <PlayIcon size={22} />
                  <span>Play Trailer</span>
                </button>
              )}
            </>
          )}

          {/* Close */}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Poster + Info */}
          <div className={styles.mainInfo}>
            {posterUrl && (
              <img src={posterUrl} alt="" className={styles.poster} />
            )}
            <div className={styles.info}>
              <h2 className={styles.title}>{displayMovie?.title || displayMovie?.name}</h2>

              <div className={styles.meta}>
                {rating && (
                  <span className={styles.rating}>
                    <StarIcon size={13} /> {rating}
                  </span>
                )}
                {year && <span className={styles.metaTag}>{year}</span>}
                {runtime && <span className={styles.metaTag}>{runtime}m</span>}
              </div>

              {genres.length > 0 && (
                <div className={styles.genres}>
                  {genres.map((g) => (
                    <span key={g} className={styles.genreTag}>{g}</span>
                  ))}
                </div>
              )}

              <p className={styles.overview}>{displayMovie?.overview}</p>

              <div className={styles.actions}>
                <button className={styles.watchBtn} onClick={handleWatch}>
                  <PlayIcon size={15} />
                  {trailer ? "Watch Trailer" : "Watch Now"}
                </button>
                <button
                  className={`${styles.favBtn} ${fav ? styles.favActive : ""}`}
                  onClick={() => toggleFavorite(displayMovie)}
                >
                  <HeartIcon size={16} filled={fav} />
                  {fav ? "Saved" : "Save"}
                </button>
                <button className={styles.dlBtn}>
                  <DownloadIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
