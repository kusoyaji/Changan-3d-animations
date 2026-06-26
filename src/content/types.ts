export type ColorVariant = { label: string; hex: string; image: string };
export type Feature = { title: string; text?: string; image: string };
export type Spec = { group: string; label: string; value: string };
export type Model = {
  slug: string;
  name: string;
  nameplate: string;
  tagline: string;
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
};
export type Showroom = {
  slug: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  mapEmbed?: string;
};
