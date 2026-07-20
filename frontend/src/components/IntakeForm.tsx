"use client";

import { useState } from "react";
import type { AgentVoice, ListingSpecs, Photo } from "@/lib/types";
import PhotoDropzone from "./PhotoDropzone";
import styles from "./IntakeForm.module.css";

type Props = {
  onDevelop: (data: { photos: Photo[]; specs: ListingSpecs; voice: AgentVoice }) => void;
};

const EMPTY_SPECS: ListingSpecs = {
  address: "",
  market: "",
  price: "",
  beds: "",
  baths: "",
  sqft: "",
  mlsNumber: "",
  features: "",
};

const EMPTY_VOICE: AgentVoice = {
  agentName: "",
  brokerage: "",
  toneWords: "",
  signOff: "",
};

export default function IntakeForm({ onDevelop }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [specs, setSpecs] = useState<ListingSpecs>(EMPTY_SPECS);
  const [voice, setVoice] = useState<AgentVoice>(EMPTY_VOICE);

  const canDevelop = photos.length > 0 && specs.features.trim().length > 0;

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (!canDevelop) return;
        onDevelop({ photos, specs, voice });
      }}
    >
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>01 — The roll</legend>
        <PhotoDropzone photos={photos} onChange={setPhotos} />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>02 — Specs &amp; MLS</legend>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Address</span>
            <input
              value={specs.address}
              onChange={(e) => setSpecs({ ...specs, address: e.target.value })}
              placeholder="14 Shoreline Bluff Rd"
            />
          </label>
          <label className={styles.field}>
            <span>Market</span>
            <input
              value={specs.market}
              onChange={(e) => setSpecs({ ...specs, market: e.target.value })}
              placeholder="Lake Tahoe, CA"
            />
          </label>
          <label className={styles.field}>
            <span>Price</span>
            <input
              value={specs.price}
              onChange={(e) => setSpecs({ ...specs, price: e.target.value })}
              placeholder="$2,450,000"
            />
          </label>
          <label className={styles.field}>
            <span>MLS #</span>
            <input
              value={specs.mlsNumber}
              onChange={(e) => setSpecs({ ...specs, mlsNumber: e.target.value })}
              placeholder="TAH-88213"
            />
          </label>
          <label className={styles.field}>
            <span>Beds</span>
            <input value={specs.beds} onChange={(e) => setSpecs({ ...specs, beds: e.target.value })} placeholder="4" />
          </label>
          <label className={styles.field}>
            <span>Baths</span>
            <input value={specs.baths} onChange={(e) => setSpecs({ ...specs, baths: e.target.value })} placeholder="3.5" />
          </label>
          <label className={styles.field}>
            <span>Sq ft</span>
            <input value={specs.sqft} onChange={(e) => setSpecs({ ...specs, sqft: e.target.value })} placeholder="3,200" />
          </label>
        </div>
        <label className={styles.field}>
          <span>Standout features (comma separated)</span>
          <textarea
            className={styles.textarea}
            value={specs.features}
            onChange={(e) => setSpecs({ ...specs, features: e.target.value })}
            placeholder="private dock, wraparound deck, floor-to-ceiling windows, stone fireplace"
            rows={2}
            required
          />
        </label>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>03 — Agent voice</legend>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Agent name</span>
            <input
              value={voice.agentName}
              onChange={(e) => setVoice({ ...voice, agentName: e.target.value })}
              placeholder="Mara Whitfield"
            />
          </label>
          <label className={styles.field}>
            <span>Brokerage</span>
            <input
              value={voice.brokerage}
              onChange={(e) => setVoice({ ...voice, brokerage: e.target.value })}
              placeholder="Bluewater Realty"
            />
          </label>
        </div>
        <label className={styles.field}>
          <span>Tone words</span>
          <input
            value={voice.toneWords}
            onChange={(e) => setVoice({ ...voice, toneWords: e.target.value })}
            placeholder="warm, confident, a little playful"
          />
        </label>
        <label className={styles.field}>
          <span>Sign-off</span>
          <input
            value={voice.signOff}
            onChange={(e) => setVoice({ ...voice, signOff: e.target.value })}
            placeholder="Let's find your view. — Mara"
          />
        </label>
      </fieldset>

      <button type="submit" className={styles.develop} disabled={!canDevelop}>
        Develop the package
      </button>
      {!canDevelop && (
        <p className={styles.hint}>Load at least one photo and list a standout feature to develop.</p>
      )}
    </form>
  );
}
