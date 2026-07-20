import styles from "./DevelopingOverlay.module.css";

export default function DevelopingOverlay() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.sweep} />
      <span className={styles.label}>Developing…</span>
    </div>
  );
}
