"use client";

import { useMemo, useState } from "react";
import type { AgentVoice, CaptionVariant, CarouselSlide, GeneratedPackage, ListingSpecs, Photo, ReelBeat } from "@/lib/types";
import { regenerateCaption, regenerateCarouselSlide, regenerateReelBeat } from "@/lib/generate";
import ContactSheet from "./ContactSheet";
import CarouselTray from "./CarouselTray";
import CaptionTray from "./CaptionTray";
import ReelTray from "./ReelTray";
import styles from "./PackageView.module.css";

type Props = {
  photos: Photo[];
  specs: ListingSpecs;
  voice: AgentVoice;
  pkg: GeneratedPackage;
  onChange: (pkg: GeneratedPackage) => void;
  onReset: () => void;
};

type Tab = "carousel" | "captions" | "reel";

const TABS: { id: Tab; label: string; count: (pkg: GeneratedPackage) => number }[] = [
  { id: "carousel", label: "Carousel", count: (p) => p.carousel.length },
  { id: "captions", label: "Caption set", count: (p) => p.captions.length },
  { id: "reel", label: "Reel script", count: (p) => p.reel.length },
];

function packageToText(pkg: GeneratedPackage): string {
  const parts: string[] = [];
  const approvedCarousel = pkg.carousel.filter((s) => s.approved);
  if (approvedCarousel.length) {
    parts.push("CAROUSEL");
    approvedCarousel.forEach((s) => parts.push(`[${s.frame}] ${s.headline} — ${s.caption}`));
  }
  const approvedCaptions = pkg.captions.filter((c) => c.approved);
  if (approvedCaptions.length) {
    parts.push("\nCAPTIONS");
    approvedCaptions.forEach((c) => parts.push(`— ${c.label} —\n${c.text}`));
  }
  const approvedReel = pkg.reel.filter((b) => b.approved);
  if (approvedReel.length) {
    parts.push("\nREEL SCRIPT");
    approvedReel.forEach((b) => parts.push(`${b.timecode}  ${b.shot}\n"${b.voiceover}"`));
  }
  return parts.join("\n");
}

export default function PackageView({ photos, specs, voice, pkg, onChange, onReset }: Props) {
  const [tab, setTab] = useState<Tab>("carousel");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const approvedCount = useMemo(
    () =>
      pkg.carousel.filter((s) => s.approved).length +
      pkg.captions.filter((c) => c.approved).length +
      pkg.reel.filter((b) => b.approved).length,
    [pkg],
  );

  const updateSlide = (id: string, patch: Partial<CarouselSlide>) => {
    onChange({ ...pkg, carousel: pkg.carousel.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  };
  const regenerateSlide = (id: string) => {
    onChange({
      ...pkg,
      carousel: pkg.carousel.map((s) => (s.id === id ? regenerateCarouselSlide(s, specs) : s)),
    });
  };

  const updateCaption = (id: string, patch: Partial<CaptionVariant>) => {
    onChange({ ...pkg, captions: pkg.captions.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  };
  const regenerateCaptionVariant = (id: string) => {
    onChange({
      ...pkg,
      captions: pkg.captions.map((c) => (c.id === id ? regenerateCaption(c, specs, voice) : c)),
    });
  };

  const updateBeat = (id: string, patch: Partial<ReelBeat>) => {
    onChange({ ...pkg, reel: pkg.reel.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
  };
  const regenerateBeat = (id: string) => {
    onChange({ ...pkg, reel: pkg.reel.map((b) => (b.id === id ? regenerateReelBeat(b, specs) : b)) });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(packageToText(pkg));
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2000);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.sheetHead}>
        <ContactSheet photos={photos} developed />
      </div>

      <div className={styles.toolbar}>
        <nav className={styles.tabs} aria-label="Content package sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id}
            >
              {t.label}
              <span className={styles.count}>{t.count(pkg)}</span>
            </button>
          ))}
        </nav>
        <div className={styles.actions}>
          <span className={styles.approvedCount}>{approvedCount} approved</span>
          <button type="button" className={styles.copy} onClick={handleCopy}>
            {copyState === "copied" ? "Copied" : "Copy approved"}
          </button>
          <button type="button" className={styles.reset} onClick={onReset}>
            Start a new roll
          </button>
        </div>
      </div>

      {tab === "carousel" && (
        <CarouselTray slides={pkg.carousel} photos={photos} onUpdate={updateSlide} onRegenerate={regenerateSlide} />
      )}
      {tab === "captions" && (
        <CaptionTray captions={pkg.captions} onUpdate={updateCaption} onRegenerate={regenerateCaptionVariant} />
      )}
      {tab === "reel" && <ReelTray beats={pkg.reel} onUpdate={updateBeat} onRegenerate={regenerateBeat} />}
    </div>
  );
}
