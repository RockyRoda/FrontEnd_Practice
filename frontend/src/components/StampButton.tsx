import styles from "./controls.module.css";

type Props = {
  approved: boolean;
  onToggle: () => void;
  onRegenerate?: () => void;
};

export default function StampButton({ approved, onToggle, onRegenerate }: Props) {
  return (
    <div className={styles.row}>
      {onRegenerate && (
        <button
          type="button"
          className={styles.regen}
          onClick={onRegenerate}
          aria-label="Redevelop this line"
          title="Redevelop this line"
        >
          ⟲
        </button>
      )}
      <button
        type="button"
        className={`${styles.stamp} ${approved ? styles.stampApproved : ""}`}
        onClick={onToggle}
        aria-pressed={approved}
      >
        {approved ? "Approved" : "Approve"}
      </button>
    </div>
  );
}
