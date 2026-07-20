import type {
  AgentVoice,
  CaptionVariant,
  CarouselSlide,
  GeneratedPackage,
  ListingSpecs,
  Photo,
  ReelBeat,
} from "./types";

const FALLBACK_FEATURES = ["the light in this place", "the layout", "the location"];

function splitFeatures(raw: string): string[] {
  const parts = raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : FALLBACK_FEATURES;
}

function cap(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function frameNumber(index: number): string {
  const suffix = String.fromCharCode(65 + (index % 4));
  const num = String(Math.floor(index / 4) + 1).padStart(2, "0");
  return `${num}${suffix}`;
}

function voiceAside(toneWords: string): string {
  const tone = toneWords.toLowerCase();
  if (tone.includes("playful") || tone.includes("fun")) return " (we checked twice)";
  if (tone.includes("luxur") || tone.includes("elevated")) return " — as it should be";
  if (tone.includes("warm") || tone.includes("friendly")) return ". You're going to love it here";
  if (tone.includes("confiden") || tone.includes("bold")) return ". No exaggeration";
  return "";
}

const HEADLINE_TEMPLATES = [
  (f: string) => `${cap(f)}, before the coffee's even done`,
  (f: string) => `This is what ${f} feels like at sunrise`,
  (f: string, m: string) => `${m} living, headlined by ${f}`,
  (f: string) => `The kind of ${f} you stop scrolling for`,
  (f: string) => `Built around ${f}, not just built with it`,
  (_f: string, m: string) => `Home base for ${m} weekends`,
  (f: string) => `Every showing stalls at ${f}`,
  (f: string) => `Say hello to ${f}`,
];

const SLIDE_CAPTION_TEMPLATES = [
  (_f: string) => `This is the corner of the house nobody wants to leave.`,
  (f: string) => `${cap(f)} does a lot of the selling for us.`,
  (_f: string, m: string) => `In ${m}, this is what "come home" looks like.`,
  (_f: string) => `Slow down — this view isn't going anywhere, and neither will you.`,
  (_f: string) => `The kind of detail that shows up in every showing feedback form.`,
  (_f: string) => `Consider this your permission to stop scrolling listings and start packing.`,
  (_f: string, m: string) => `Every resort town has a house like this one. This is ${m}'s.`,
  (f: string) => `Picture waking up to ${f}. That's not a brochure line — it's Tuesday here.`,
];

const CAMERA_DIRECTIONS = [
  "Slow pan across",
  "Push in on",
  "Drone rise over",
  "Handheld walk-through of",
  "Static hold on",
  "Whip pan to",
  "Low-angle glide past",
  "Overhead drop into",
];

const VOICEOVER_TEMPLATES = [
  (f: string) => `This is ${f}.`,
  (f: string) => `${cap(f)} — yeah, it's real.`,
  (f: string) => `You could get used to ${f}.`,
  (f: string) => `Nobody mentions ${f} until they're standing in it.`,
  (f: string) => `${cap(f)}. Enough said.`,
  (_f: string) => `This is why the tour runs long.`,
];

function buildCarousel(photos: Photo[], specs: ListingSpecs): CarouselSlide[] {
  const features = splitFeatures(specs.features);
  return photos.map((photo, i) => {
    const feature = features[i % features.length];
    const headline = pick(HEADLINE_TEMPLATES)(feature, specs.market || "this market");
    const caption = pick(SLIDE_CAPTION_TEMPLATES)(feature, specs.market || "this market");
    return {
      id: photo.id,
      frame: frameNumber(i),
      photoId: photo.id,
      headline: cap(headline),
      caption,
      approved: false,
    };
  });
}

function goldenHourCaption(specs: ListingSpecs, voice: AgentVoice, features: string[]): string {
  const a = features[0] ?? FALLBACK_FEATURES[0];
  const b = features[1] ?? features[0] ?? FALLBACK_FEATURES[1];
  const market = specs.market || "the market";
  const lines = [
    `Golden hour hits different when ${a} is part of the view.`,
    `Add ${b} to the list, and you've stopped house hunting and started daydreaming.`,
    `${market} doesn't hand out listings like this often${voiceAside(voice.toneWords)}.`,
  ];
  const sign = voice.signOff || (voice.agentName ? `— ${voice.agentName}` : "");
  return [...lines, sign].filter(Boolean).join(" ");
}

function quickHitCaption(specs: ListingSpecs, voice: AgentVoice, features: string[]): string {
  const specLine = [specs.price, specs.beds && `${specs.beds} bed`, specs.baths && `${specs.baths} bath`, specs.sqft && `${specs.sqft} sqft`]
    .filter(Boolean)
    .join(" · ");
  const feature = features[0] ?? FALLBACK_FEATURES[0];
  const dm = voice.agentName ? `DM ${voice.agentName} for a private showing.` : "DM for a private showing.";
  return [specLine, specs.market, cap(feature), dm].filter(Boolean).join("\n");
}

function storytellerCaption(specs: ListingSpecs, voice: AgentVoice, features: string[]): string {
  const market = specs.market || "this market";
  const feature = features[0] ?? FALLBACK_FEATURES[0];
  const tone = voice.toneWords
    ? voice.toneWords
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(", ")
    : "easygoing";
  const specLine = [specs.sqft && `${specs.sqft} sqft`, specs.beds && `${specs.beds} beds`, specs.baths && `${specs.baths} baths`]
    .filter(Boolean)
    .join(", ");
  const opener = voice.agentName
    ? `I've shown a lot of houses in ${market}, but this one stopped me at the door.`
    : `This one stops you at the door.`;
  const body = `${cap(feature)} isn't the upgrade here — it's the whole point. It's got the kind of ${tone} energy ${market} doesn't see enough of${specLine ? `, and at ${specLine}, there's room for the whole story to unfold` : ""}.`;
  const sign = voice.signOff || (voice.agentName ? `— ${voice.agentName}${voice.brokerage ? `, ${voice.brokerage}` : ""}` : "");
  return [opener, body, sign].filter(Boolean).join(" ");
}

function buildCaptions(specs: ListingSpecs, voice: AgentVoice): CaptionVariant[] {
  const features = splitFeatures(specs.features);
  return [
    {
      id: "golden-hour",
      label: "Golden Hour",
      description: "Long-form lifestyle framing for the main feed post",
      text: goldenHourCaption(specs, voice, features),
      approved: false,
    },
    {
      id: "quick-hit",
      label: "Quick Hit",
      description: "Short, spec-forward, built for a fast scroll",
      text: quickHitCaption(specs, voice, features),
      approved: false,
    },
    {
      id: "storyteller",
      label: "Storyteller",
      description: `In ${voice.agentName || "the agent"}'s voice — narrative, first person`,
      text: storytellerCaption(specs, voice, features),
      approved: false,
    },
  ];
}

function buildReel(specs: ListingSpecs, voice: AgentVoice): ReelBeat[] {
  const features = splitFeatures(specs.features);
  const beatCount = Math.min(Math.max(features.length, 3), 6);
  const beats: ReelBeat[] = [];

  beats.push({
    id: "hook",
    timecode: "0:00–0:03",
    shot: "Cold open, exterior establishing shot",
    voiceover: `Welcome to ${specs.address || "the listing"}${specs.market ? `, ${specs.market}` : ""}.`,
    approved: false,
  });

  for (let i = 0; i < beatCount; i++) {
    const feature = features[i % features.length];
    const start = 3 + i * 3;
    const end = start + 3;
    beats.push({
      id: `beat-${i}`,
      timecode: `0:${String(start).padStart(2, "0")}–0:${String(end).padStart(2, "0")}`,
      shot: `${pick(CAMERA_DIRECTIONS)} ${feature}`,
      voiceover: pick(VOICEOVER_TEMPLATES)(feature),
      approved: false,
    });
  }

  const outroStart = 3 + beatCount * 3;
  const priceLine = specs.price ? ` Listed at ${specs.price}.` : "";
  const dm = voice.agentName ? `DM ${voice.agentName} to book a showing.` : "DM to book a showing.";
  beats.push({
    id: "outro",
    timecode: `0:${String(outroStart).padStart(2, "0")}–0:${String(outroStart + 3).padStart(2, "0")}`,
    shot: "Title card with price and contact",
    voiceover: `${dm}${priceLine}${voice.signOff ? ` ${voice.signOff}` : ""}`,
    approved: false,
  });

  return beats;
}

export function generatePackage(photos: Photo[], specs: ListingSpecs, voice: AgentVoice): GeneratedPackage {
  return {
    carousel: buildCarousel(photos, specs),
    captions: buildCaptions(specs, voice),
    reel: buildReel(specs, voice),
  };
}

export function regenerateCarouselSlide(slide: CarouselSlide, specs: ListingSpecs): CarouselSlide {
  const features = splitFeatures(specs.features);
  const feature = pick(features);
  return {
    ...slide,
    headline: cap(pick(HEADLINE_TEMPLATES)(feature, specs.market || "this market")),
    caption: pick(SLIDE_CAPTION_TEMPLATES)(feature, specs.market || "this market"),
  };
}

export function regenerateCaption(variant: CaptionVariant, specs: ListingSpecs, voice: AgentVoice): CaptionVariant {
  const features = splitFeatures(specs.features);
  const shuffled = [...features].sort(() => Math.random() - 0.5);
  if (variant.id === "golden-hour") return { ...variant, text: goldenHourCaption(specs, voice, shuffled) };
  if (variant.id === "quick-hit") return { ...variant, text: quickHitCaption(specs, voice, shuffled) };
  return { ...variant, text: storytellerCaption(specs, voice, shuffled) };
}

export function regenerateReelBeat(beat: ReelBeat, specs: ListingSpecs): ReelBeat {
  if (beat.id === "hook" || beat.id === "outro") return beat;
  const features = splitFeatures(specs.features);
  const feature = pick(features);
  return {
    ...beat,
    shot: `${pick(CAMERA_DIRECTIONS)} ${feature}`,
    voiceover: pick(VOICEOVER_TEMPLATES)(feature),
  };
}

export { voiceAside };
