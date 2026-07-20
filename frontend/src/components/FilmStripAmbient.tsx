import styles from "./FilmStripAmbient.module.css";

const SWATCHES = ["sand", "tide", "brass", "safelight", "ink"] as const;

export default function FilmStripAmbient() {
  return (
    <div className={styles.strip} aria-hidden="true">
      <div className={styles.perf} />
      {SWATCHES.map((tone, i) => (
        <div key={tone} className={`${styles.swatch} ${styles[tone]}`} style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
      <div className={styles.perf} />
    </div>
  );
}
