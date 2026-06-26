import type { Model } from "../types";
import { cs55Phev } from "./cs55-phev";

// Stubs for the remaining five — full data filled in the Models phase.
const stub = (slug: string, name: string, hero: string): Model => ({
  slug,
  name,
  nameplate: name,
  tagline: "",
  heroDesktop: hero,
  heroMobile: hero,
  colorVariants: [],
  comfort: [],
  equipment: [],
  gallery: [],
  specs: [],
  hasSpin: false,
});

export const allModels: Model[] = [
  cs55Phev,
  stub("cs55", "CS55", "/images/vehicles/cs55.webp"),
  stub("cs35-plus", "CS35 PLUS", "/images/vehicles/cs35.webp"),
  stub("cs15", "CS15", "/images/vehicles/cs15.webp"),
  stub("uni-k", "UNI-K", "/images/vehicles/unik.webp"),
  stub("alsvin", "ALSVIN", "/images/vehicles/alsvin.webp"),
];

export const modelSlugs = allModels.map((m) => m.slug);

export const getModel = (slug: string) => allModels.find((m) => m.slug === slug);
