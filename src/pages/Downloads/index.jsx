import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getPosterUrl } from "../../services/tmdb";
import { getGenreInfo, getPlaceholderGradient } from "../../utils/genres";
import { PlayIcon, DownloadIcon } from "../../components/ui/Icons";
import MovieModal from "../../components/ui/MovieModal";
import EmptyState from "../../components/ui/EmptyState";
import { toast } from "../../components/ui/Toast";
import styles from "./Downloads.module.css";

export default function DownloadsPage() {
  const { downloads, toggleDownload, setActivePage } = useApp();
  const [selected, setSelected] = useState(null);
  const totalSize = downloads.reduce((acc, m) => acc + parseFloat(m.size || 0), 0).toFixed(1);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>DOWNLOADS</h1>
        <p className={styles.pageSubtitle}>Movies and shows saved for offline viewing</p>
        {downloads.length > 0 && (
          <p className={styles.storageInfo}>{downloads.length} file{downloads.length !== 1 ? "s" : ""} · {totalSize} GB used</p>
        )}
      </div>

      {downloads.length === 0 ? (
        <EmptyState
          type="downloads"
          action="Find Movies to Download"
          onAction={() => setActivePage("home")}
        />
      ) : (
        <div className={styles.grid}>
          {downloads.map(movie => {
            const imgUrl = getPosterUrl(movie.poster_path, "md");
            const genre  = getGenreInfo(movie.genre_ids || []);
            return (
              <div key={movie.id} className={styles.card} onClick={() => setSelected(movie)}>
                <div className={styles.cardThumb} style={!imgUrl ? { background: getPlaceholderGradient(movie.id) } : {}}>
                  {imgUrl && <img src={imgUrl} alt={movie.title} loading="lazy" />}
                  <div className={styles.cardOverlay} />
                  <div className={styles.badge} style={{ background: genre.color }}>{genre.label}</div>
                  <div className={styles.downloadedBadge}><DownloadIcon size={10}/> Saved</div>
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardInfoTop}>
                    <div>
                      <p className={styles.cardTitle}>{movie.title || movie.name}</p>
                      <p className={styles.cardMeta}>{genre.label} · {movie.size}</p>
                    </div>
                    <button className={styles.playBtn} onClick={(e) => { e.stopPropagation(); setSelected(movie); }}>
                      <PlayIcon size={13}/>
                    </button>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDownload(movie);
                      toast.info(`Removed "${movie.title || movie.name}" from downloads`);
                    }}
                  >Remove download</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
