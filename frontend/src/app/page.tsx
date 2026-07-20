"use client";

import { useRef, useState } from "react";
import type { AgentVoice, GeneratedPackage, ListingSpecs, Photo } from "@/lib/types";
import { generatePackage } from "@/lib/generate";
import IntakeForm from "@/components/IntakeForm";
import FilmStripAmbient from "@/components/FilmStripAmbient";
import ContactSheet from "@/components/ContactSheet";
import DevelopingOverlay from "@/components/DevelopingOverlay";
import PackageView from "@/components/PackageView";
import styles from "./page.module.css";

type Phase = "intake" | "developing" | "package";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intake");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [specs, setSpecs] = useState<ListingSpecs | null>(null);
  const [voice, setVoice] = useState<AgentVoice | null>(null);
  const [pkg, setPkg] = useState<GeneratedPackage | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDevelop = (data: { photos: Photo[]; specs: ListingSpecs; voice: AgentVoice }) => {
    setPhotos(data.photos);
    setSpecs(data.specs);
    setVoice(data.voice);
    setPhase("developing");
    timeoutRef.current = setTimeout(() => {
      setPkg(generatePackage(data.photos, data.specs, data.voice));
      setPhase("package");
    }, 1300);
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("intake");
    setPhotos([]);
    setSpecs(null);
    setVoice(null);
    setPkg(null);
  };

  return (
    <main className={styles.main}>
      <header className={styles.topbar}>
        <span className={styles.wordmark}>Darkroom</span>
        <span className={styles.tagline}>content packages for resort-market listings</span>
      </header>

      {phase === "intake" && (
        <div className={styles.intakeGrid}>
          <div className={styles.hero}>
            <FilmStripAmbient />
            <div className={styles.heroCopy}>
              <h1 className={styles.headline}>
                Every listing walks in as a roll of film.
                <br />
                It walks out ready to post.
              </h1>
              <p className={styles.subhead}>
                Load the photos, drop in the specs, and Darkroom develops a full content package — carousel,
                captions, and a Reel script — in your voice, framed for the buyer who&rsquo;s already dreaming about
                the view. Approve what&rsquo;s ready. Edit what&rsquo;s not. Never stare at a blank caption box
                again.
              </p>
            </div>
          </div>
          <IntakeForm onDevelop={handleDevelop} />
        </div>
      )}

      {phase === "developing" && (
        <div className={styles.developing}>
          <ContactSheet photos={photos} developed={false} />
          <DevelopingOverlay />
        </div>
      )}

      {phase === "package" && pkg && specs && voice && (
        <PackageView photos={photos} specs={specs} voice={voice} pkg={pkg} onChange={setPkg} onReset={handleReset} />
      )}
    </main>
  );
}
