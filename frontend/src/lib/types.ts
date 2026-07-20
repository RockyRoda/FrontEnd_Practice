export type Photo = {
  id: string;
  url: string;
  name: string;
};

export type ListingSpecs = {
  address: string;
  market: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  mlsNumber: string;
  features: string;
};

export type AgentVoice = {
  agentName: string;
  brokerage: string;
  toneWords: string;
  signOff: string;
};

export type IntakeData = {
  photos: Photo[];
  specs: ListingSpecs;
  voice: AgentVoice;
};

export type CarouselSlide = {
  id: string;
  frame: string;
  photoId: string;
  headline: string;
  caption: string;
  approved: boolean;
};

export type CaptionVariant = {
  id: string;
  label: string;
  description: string;
  text: string;
  approved: boolean;
};

export type ReelBeat = {
  id: string;
  timecode: string;
  shot: string;
  voiceover: string;
  approved: boolean;
};

export type GeneratedPackage = {
  carousel: CarouselSlide[];
  captions: CaptionVariant[];
  reel: ReelBeat[];
};
