export type ColorVariant = { label: string; hex: string; image: string };
export type Feature = { title: string; text?: string; image: string; mobileImage?: string };
export type Spec = { group: string; label: string; value: string };
export type CinematicBeat = { at: number; eyebrow: string; title: string; text?: string };
export type Cinematic3D = {
  frameCount: number;
  mobileFrameCount: number;
  framePath: string; // template containing "{i}" (zero-padded to 4), e.g. "/images/.../desktop/{i}.avif"
  mobileFramePath: string;
  poster: string;
  webpFallback?: boolean;
  beats: CinematicBeat[];
};
export type Model = {
  slug: string;
  name: string;
  nameplate: string;
  tagline: string;
  logo?: string;
  heroDesktop: string;
  heroMobile: string;
  colorVariants: ColorVariant[];
  comfort: Feature[];
  equipment: Feature[];
  gallery: string[];
  specs: Spec[];
  pdf?: string;
  price?: string;
  hasSpin: boolean;
  spinFrames?: string[];
  cinematic3d?: Cinematic3D;
};
export type Showroom = {
  slug: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  sav?: string;
  image: string;
  directionLink?: string;
  mapEmbed?: string;
};
