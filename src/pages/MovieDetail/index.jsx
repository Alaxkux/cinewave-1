import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getBackdropUrl, getPosterUrl } from "../../services/tmdb";
import { getGenreLabel } from "../../utils/genres";
import { useMovieDetails } from "../../hooks/useTMDB";
import { PlayIcon, HeartIcon, DownloadIcon, StarIcon } from "../../components/ui/Icons";
import { toast } from "../../components/ui/Toast";
import styles from "./MovieDetail.module.css";

export default function MovieDetailPage() {
  const {
    movieDetail, setActivePage,
    toggleFavorite, isFavorite,
    toggleDownload, isDownloaded,
    addToContinueWatching,
  } = useApp();

  const { movie: details, videos } = useMovieDetails(movieDetail?.id);
  const [userRating,  setUserRating]  = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review,      setReview]      = useState("");
  const [reviews,     setReviews]     = useState([]);

  const movie      = details || movieDetail;
  if (!movie) return null;

  const fav        = isFavorite(movie.id);
  const dl         = isDownloaded(movie.id);
  const backdropUrl= getBackdropUrl(movie.backdrop_path, "original");
  const posterUrl  = getPosterUrl(movie.poster_path, "md");
  const genres     = getGenreLabel(movie.genre_ids || movie.genres?.map(g => g.id) || []);
  const rating     = movie.vote_average?.toFixed(1);
  const year       = movie.release_date?.slice(0, 4);
  const runtime    = movie.runtime ? `${Math.floor(movie.runtime/60)}h ${movie.runtime%60}m` : null;
  const trailer    = videos?.[0];

  const handleWatch = () => {
    addToContinueWatching({ ...movie, subtitle: "Continue watching", progress: 5 });
    if (trailer) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
    }
    toast.success(`Added "${movie.title || movie.name}" to continue watching`);
  };

  const handleFav = () => {
    toggleFavorite(movie);
    toast.success(fav ? "Removed from saved" : `Saved to your list`);
  };

  const handleDl = () => {
    toggleDownload(movie);
    toast.info(dl ? "Download removed" : `Downloading…`);
  };

  const submitReview = () => {
    if (!review.trim() || !userRating) {
      toast.error("Add a rating and write something first");
      return;
    }
    setReviews(prev => [{
      id: Date.now(), user: "You",
      rating: userRating, text: review, time: "just now"
    }, ...prev]);
    setReview(""); setUserRating(0);
    toast.success("Review posted!");
  };

  return (
    <div className={styles.page}>

      {/* ── Backdrop ── */}
      <div className={styles.backdrop}>
        {backdropUrl
          ? <img src={backdropUrl} alt="" className={styles.backdropImg} />
          : <div className={styles.backdropFallback} />
        }
        <div className={styles.backdropOverlay} />
        <button className={styles.backBtn} onClick={() => setActivePage("home")}>← Back</button>
      </div>

      {/* ── Main info row ── */}
      <div className={styles.mainRow}>
        {posterUrl && (
          <img src={posterUrl} alt="" className={styles.poster} />
        )}
        <div className={styles.info}>
          <h1 className={styles.title}>{movie.title || movie.name}</h1>

          {/* All specs on one straight line */}
          <div className={styles.specRow}>
            {rating && (
              <span className={styles.specRating}>
                <StarIcon size={11} /> {rating}
              </span>
            )}
            {year     && <span className={styles.spec}>{year}</span>}
            {runtime  && <span className={styles.spec}>{runtime}</span>}
            <span className={styles.spec}>HD</span>
            {genres.map(g => (
              <span key={g} className={styles.specGenre}>{g}</span>
            ))}
          </div>

          <p className={styles.overview}>{movie.overview}</p>

          {/* Action buttons */}
          <div className={styles.actions}>
            <button className={styles.watchBtn} onClick={handleWatch}>
              <PlayIcon size={14} /> Watch Now
            </button>
            <button
              className={`${styles.actionBtn} ${fav ? styles.actionActive : ""}`}
              onClick={handleFav}
            >
              <HeartIcon size={14} filled={fav} />
              {fav ? "Saved" : "Save"}
            </button>
            <button
              className={`${styles.actionBtn} ${dl ? styles.actionActive : ""}`}
              onClick={handleDl}
            >
              <DownloadIcon size={14} />
              {dl ? "Downloaded" : "Download"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Rate & Review ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Rate this</h3>
        <div className={styles.starsRow}>
          {[1,2,3,4,5].map(s => (
            <button
              key={s}
              className={`${styles.star} ${s <= (hoverRating || userRating) ? styles.starOn : ""}`}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => { setUserRating(s); toast.success(`Rated ${s}/5 ⭐`); }}
            >★</button>
          ))}
          {userRating > 0 && <span className={styles.ratingLabel}>{userRating}/5</span>}
        </div>
        <textarea
          className={styles.reviewInput}
          placeholder="Write a short review…"
          value={review}
          onChange={e => setReview(e.target.value)}
          rows={2}
        />
        <button className={styles.reviewBtn} onClick={submitReview}>Post Review</button>
      </div>

      {/* ── Reviews list ── */}
      {reviews.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Reviews</h3>
          <div className={styles.reviewList}>
            {reviews.map(r => (
              <div key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div className={styles.reviewAvatar}>{r.user[0]}</div>
                  <div className={styles.reviewMeta}>
                    <span className={styles.reviewUser}>{r.user}</span>
                    <span className={styles.reviewStars}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                  </div>
                  <span className={styles.reviewTime}>{r.time}</span>
                </div>
                <p className={styles.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
