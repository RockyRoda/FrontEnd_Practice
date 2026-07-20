import type { ReelBeat } from "@/lib/types";
import StampButton from "./StampButton";
import styles from "./ReelTray.module.css";

type Props = {
  beats: ReelBeat[];
  onUpdate: (id: string, patch: Partial<ReelBeat>) => void;
  onRegenerate: (id: string) => void;
};

export default function ReelTray({ beats, onUpdate, onRegenerate }: Props) {
  return (
    <div className={styles.log}>
      <div className={styles.headRow}>
        <span>Timecode</span>
        <span>Shot</span>
        <span>Voiceover</span>
        <span />
      </div>
      {beats.map((beat) => {
        const locked = beat.id === "hook" || beat.id === "outro";
        return (
          <div key={beat.id} className={styles.beatRow}>
            <span className={styles.timecode}>{beat.timecode}</span>
            <input
              className={styles.shot}
              value={beat.shot}
              onChange={(e) => onUpdate(beat.id, { shot: e.target.value })}
              aria-label="Shot description"
            />
            <input
              className={styles.voiceover}
              value={beat.voiceover}
              onChange={(e) => onUpdate(beat.id, { voiceover: e.target.value })}
              aria-label="Voiceover line"
            />
            <StampButton
              approved={beat.approved}
              onToggle={() => onUpdate(beat.id, { approved: !beat.approved })}
              onRegenerate={locked ? undefined : () => onRegenerate(beat.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
