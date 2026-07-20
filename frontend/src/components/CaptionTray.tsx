import type { CaptionVariant } from "@/lib/types";
import StampButton from "./StampButton";
import styles from "./CaptionTray.module.css";

type Props = {
  captions: CaptionVariant[];
  onUpdate: (id: string, patch: Partial<CaptionVariant>) => void;
  onRegenerate: (id: string) => void;
};

export default function CaptionTray({ captions, onUpdate, onRegenerate }: Props) {
  return (
    <div className={styles.stack}>
      {captions.map((variant) => (
        <article key={variant.id} className={styles.card}>
          <header className={styles.header}>
            <div>
              <h3 className={styles.label}>{variant.label}</h3>
              <p className={styles.description}>{variant.description}</p>
            </div>
            <StampButton
              approved={variant.approved}
              onToggle={() => onUpdate(variant.id, { approved: !variant.approved })}
              onRegenerate={() => onRegenerate(variant.id)}
            />
          </header>
          <textarea
            className={styles.text}
            value={variant.text}
            onChange={(e) => onUpdate(variant.id, { text: e.target.value })}
            rows={variant.id === "quick-hit" ? 4 : 5}
            aria-label={`${variant.label} caption`}
          />
        </article>
      ))}
    </div>
  );
}
