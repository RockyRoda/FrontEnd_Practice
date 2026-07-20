import type { Photo } from "@/lib/types";
import { frameNumber } from "@/lib/generate";
import styles from "./ContactSheet.module.css";

type Props = {
  photos: Photo[];
  developed: boolean;
};

export default function ContactSheet({ photos, developed }: Props) {
  return (
    <div className={styles.sheet} aria-label="Listing contact sheet">
      <div className={styles.perforation} aria-hidden="true" />
      <ul className={styles.strip}>
        {photos.map((photo, i) => (
          <li key={photo.id} className={styles.frame}>
            <img
              src={photo.url}
              alt=""
              className={`${styles.image} ${developed ? styles.developed : styles.negative}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            />
            <span className={styles.frameNumber}>{frameNumber(i)}</span>
          </li>
        ))}
      </ul>
      <div className={styles.perforation} aria-hidden="true" />
    </div>
  );
}
