import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getBackdropUrl, getPosterUrl } from "../../services/tmdb";
import { getGenreLabel, getGenreInfo } from "../../utils/genres";
import { PlayIcon, HeartIcon, DownloadIcon, StarIcon, CloseIcon } from "../../components/ui/Icons";
import { toast } from "../../components/ui/Toast";
import MovieRow from "../../components/sections/MovieRow";
import styles from "./MovieDetail.module.css";

export default function MovieDetailPage() {
  const { movieDetail, setActivePage, toggleFavorite, isFavorite, toggleDownload, isDownloaded, addToContinueWatching } = useApp();
  const [showPlayer, setShowPlayer] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([
    { id: 1, user: "CineFan99",   rating: 5, text: "Absolutely brilliant. One of the best films of the decade.", time: "2 days ago" },
    { id: 2, user: "MovieBuff_X", rating: 4, text: "Great film, stunning visuals and an incredible score.", time: "1 week ago" },
  ]);

  const movie = movieDetail;
  if (!movie) return null;

  const fav = isFavorite(movie.id);
  const dl  = isDownloaded(movie.id);
  const backdropUrl = getBackdropUrl(movie.backdrop_path, "original");
  const posterUrl   = getPosterUrl(movie.poster_path, "lg");
  const genres      = getGenreLabel(movie.genre_ids || movie.genres?.map(g => g.id) || []);
  const rating      = movie.vote_average?.toFixed(1);
  const year        = movie.release_date?.slice(0, 4);

  const handleWatch = () => {
    addToContinueWatching({ ...movie, subtitle: "Continue watching", progress: 5 });
    setShowPlayer(true);
    toast.success(`Started watching "${movie.title || movie.name}"`);
  };

  const handleFav = () => {
    toggleFavorite(movie);
    toast.success(fav ? "Removed from saved" : `Saved "${movie.title || movie.name}"`);
  };

  const handleDl = () => {
    toggleDownload(movie);
    toast.info(dl ? "Download removed" : `Downloading "${movie.title || movie.name}"…`);
  };

  const submitReview = () => {
    if (!review.trim() || !userRating) return;
    setReviews(prev => [{ id: Date.now(), user: "You", rating: userRating, text: review, time: "just now" }, ...prev]);
    setReview("");
    setUserRating(0);
    toast.success("Review posted!");
  };

  const SIMILAR = Array.from({ length: 6 }, (_, i) => ({
    id: 9000 + i, title: ["The Matrix", "Inception", "Interstellar", "Dune", "Blade Runner 2049", "Arrival"][i],
    overview: "A visually stunning sci-fi epic.", genre_ids: movie.genre_ids || [878],
    poster_path: null, backdrop_path: null,
    vote_average: 7 + (i % 3) * 0.5, release_date: "2023-01-01",
  }));

  return (
    <div className={styles.page}>
      {/* Video Player Overlay */}
      {showPlayer && (
        <div className={styles.playerOverlay}>
          <div className={styles.player}>
            <div className={styles.playerScreen}>
              <div className={styles.playerPlaceholder}>
                <PlayIcon size={48} />
                <p>Now Playing</p>
                <h3>{movie.title || movie.name}</h3>
              </div>
              {/* Fake player controls */}
              <div className={styles.playerControls}>
                <div className={styles.playerProgress}>
                  <div className={styles.playerBar}><div className={styles.playerFill} style={{width:"5%"}} /></div>
                  <span className={styles.playerTime}>0:05 / 2:05:30</span>
                </div>
                <div className={styles.playerBtns}>
                  <button className={styles.skipBtn}>⏮ 10s</button>
                  <button className={styles.playPauseBtn}><PlayIcon size={22} /></button>
                  <button className={styles.skipBtn}>10s ⏭</button>
                  <button className={styles.skipIntroBtn}>Skip Intro →</button>
                  <button className={styles.closePlayerBtn} onClick={() => setShowPlayer(false)}><CloseIcon size={16}/></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero backdrop */}
      <div className={styles.heroWrap}>
        {backdropUrl
          ? <img src={backdropUrl} alt="" className={styles.heroImg} />
          : <div className={styles.heroPlaceholder} />
        }
        <div className={styles.heroOverlay} />
        <button className={styles.backBtn} onClick={() => setActivePage("home")}>← Back</button>
      </div>

      {/* Main content */}
      <div className={styles.body}>
        <div className={styles.mainRow}>
          {/* Poster */}
          {posterUrl && <img src={posterUrl} alt="" className={styles.poster} />}

          {/* Info */}
          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title || movie.name}</h1>
            <div className={styles.meta}>
              {rating && <span className={styles.rating}><StarIcon size={13}/> {rating}</span>}
              {year   && <span className={styles.tag}>{year}</span>}
              {movie.runtime && <span className={styles.tag}>{movie.runtime}m</span>}
              <span className={styles.tag}>HD</span>
            </div>
            {genres.length > 0 && (
              <div className={styles.genres}>
                {genres.map(g => <span key={g} className={styles.genreTag}>{g}</span>)}
              </div>
            )}
            <p className={styles.overview}>{movie.overview}</p>
            <div className={styles.actions}>
              <button className={styles.watchBtn} onClick={handleWatch}><PlayIcon size={15}/> Watch Now</button>
              <button className={`${styles.favBtn} ${fav ? styles.favActive : ""}`} onClick={handleFav}>
                <HeartIcon size={15} filled={fav}/> {fav ? "Saved" : "Save"}
              </button>
              <button className={`${styles.dlBtn} ${dl ? styles.dlActive : ""}`} onClick={handleDl}>
                <DownloadIcon size={15}/> {dl ? "Downloaded" : "Download"}
              </button>
            </div>
          </div>
        </div>

        {/* User rating */}
        <div className={styles.ratingSection}>
          <h3 className={styles.sectionTitle}>Rate this movie</h3>
          <div className={styles.stars}>
            {[1,2,3,4,5].map(s => (
              <button
                key={s}
                className={`${styles.star} ${s <= (hoverRating || userRating) ? styles.starActive : ""}`}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => { setUserRating(s); toast.success(`Rated ${s}/5 ⭐`); }}
              >★</button>
            ))}
            {userRating > 0 && <span className={styles.ratingLabel}>{userRating}/5</span>}
          </div>
          <div className={styles.reviewForm}>
            <textarea
              className={styles.reviewInput}
              placeholder="Write a review…"
              value={review}
              onChange={e => setReview(e.target.value)}
              rows={3}
            />
            <button className={styles.reviewSubmit} onClick={submitReview}>Post Review</button>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className={styles.reviewsSection}>
            <h3 className={styles.sectionTitle}>Reviews</h3>
            <div className={styles.reviewsList}>
              {reviews.map(r => (
                <div key={r.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAvatar}>{r.user[0]}</div>
                    <div>
                      <p className={styles.reviewUser}>{r.user}</p>
                      <div className={styles.reviewStars}>
                        {"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}
                      </div>
                    </div>
                    <span className={styles.reviewTime}>{r.time}</span>
                  </div>
                  <p className={styles.reviewText}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar movies */}
        <div className={styles.similarSection}>
          <MovieRow title="Similar Movies" movies={SIMILAR} onSelect={() => {}} />
        </div>
      </div>
    </div>
  );
}
