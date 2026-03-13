import styles from "./Footer.module.css";

const LINKS = {
  Company: ["About Us", "FAQ", "Content", "Account", "Help Center", "Gift Us", "Jobs"],
  Support: ["FAQ", "Privacy Policy", "Terms of Service", "Support", "Press", "Copyright Notice", "Cookie Preference"],
  Legal: ["Legal", "Investor Relations", "Redeem", "Legal", "Watch Anywhere", "Speed Test"],
  Manage: ["Watch Anywhere", "Manage Profiles"],
};

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className={styles.footer}>
      {/* Back to Top */}
      <div className={styles.backToTop}>
        <button className={styles.backBtn} onClick={scrollToTop}>
          Back to Top <span className={styles.backArrow}>▲</span>
        </button>
      </div>

      <div className={styles.inner}>
        {/* Logo + tagline */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🌊</span>
            <span className={styles.logoText}>CINEWAVE</span>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([col, items]) => (
          <div key={col} className={styles.col}>
            {items.map(item => (
              <a key={item} href="#" className={styles.link}>{item}</a>
            ))}
          </div>
        ))}

        {/* Right: Language + Location + Socials */}
        <div className={styles.colRight}>
          <div className={styles.selectWrap}>
            <select className={styles.select}>
              <option>Language</option>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className={styles.selectWrap}>
            <select className={styles.select}>
              <option>Location</option>
              <option>Nigeria</option>
              <option>United States</option>
              <option>United Kingdom</option>
            </select>
          </div>
          <div className={styles.socials}>
            {[
              { icon: "📸", label: "Instagram" },
              { icon: "🐦", label: "Twitter" },
              { icon: "📘", label: "Facebook" },
              { icon: "▶️", label: "YouTube" },
            ].map(({ icon, label }) => (
              <a key={label} href="#" className={styles.socialBtn} aria-label={label}>{icon}</a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        © 2024 Cinewave Entertainment. All Rights Reserved.
      </div>
    </footer>
  );
}
