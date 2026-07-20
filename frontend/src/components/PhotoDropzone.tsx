"use client";

import { useCallback, useId, useRef, useState } from "react";
import type { Photo } from "@/lib/types";
import styles from "./PhotoDropzone.module.css";

type Props = {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
};

let nextId = 0;

export default function PhotoDropzone({ photos, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const additions: Photo[] = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          id: `photo-${nextId++}`,
          url: URL.createObjectURL(file),
          name: file.name,
        }));
      if (additions.length) onChange([...photos, ...additions]);
    },
    [photos, onChange],
  );

  const removePhoto = (id: string) => {
    onChange(photos.filter((p) => p.id !== id));
  };

  return (
    <div className={styles.wrap}>
      <label
        htmlFor={inputId}
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <span className={styles.dropzoneLabel}>Load the roll</span>
        <span className={styles.dropzoneHint}>Drop listing photos here, or click to browse</span>
        <input
          ref={inputRef}
          id={inputId}
          className={styles.input}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {photos.length > 0 && (
        <ul className={styles.strip}>
          {photos.map((photo, i) => (
            <li key={photo.id} className={styles.frame}>
              <img src={photo.url} alt="" className={styles.thumb} />
              <span className={styles.frameNumber}>{String(i + 1).padStart(2, "0")}</span>
              <button
                type="button"
                className={styles.remove}
                onClick={() => removePhoto(photo.id)}
                aria-label={`Remove ${photo.name}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
