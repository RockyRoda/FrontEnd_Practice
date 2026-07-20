import type { CarouselSlide, Photo } from "@/lib/types";
import StampButton from "./StampButton";
import styles from "./CarouselTray.module.css";

type Props = {
  slides: CarouselSlide[];
  photos: Photo[];
  onUpdate: (id: string, patch: Partial<CarouselSlide>) => void;
  onRegenerate: (id: string) => void;
};

export default function CarouselTray({ slides, photos, onUpdate, onRegenerate }: Props) {
  const photoById = new Map(photos.map((p) => [p.id, p]));

  return (
    <ol className={styles.list}>
      {slides.map((slide) => {
        const photo = photoById.get(slide.photoId);
        return (
          <li key={slide.id} className={styles.slide}>
            <div className={styles.thumbWrap}>
              {photo && <img src={photo.url} alt="" className={styles.thumb} />}
              <span className={styles.frame}>{slide.frame}</span>
            </div>
            <div className={styles.copy}>
              <input
                className={styles.headline}
                value={slide.headline}
                onChange={(e) => onUpdate(slide.id, { headline: e.target.value })}
                aria-label="Slide headline"
              />
              <textarea
                className={styles.caption}
                value={slide.caption}
                onChange={(e) => onUpdate(slide.id, { caption: e.target.value })}
                rows={2}
                aria-label="Slide caption"
              />
              <StampButton
                approved={slide.approved}
                onToggle={() => onUpdate(slide.id, { approved: !slide.approved })}
                onRegenerate={() => onRegenerate(slide.id)}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
