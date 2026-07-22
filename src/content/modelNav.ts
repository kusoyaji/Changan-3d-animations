import { allModels } from "./models";
import type { Model } from "./types";

export type NavHighlight = { value: string; label: string };
export type ModelNavItem = {
  slug: string;
  name: string;
  nameplate: string;
  tagline: string;
  price?: string;
  image: string;
  highlights: NavHighlight[];
};

// Derive the three key figures shown in the navbar preview / model cards from
// a model's existing spec sheet — no duplicated data. Power comes from the
// first spec carrying a "…CH" value; transmission and efficiency from labels.
export function modelHighlights(m: Model): NavHighlight[] {
  const byLabel = (label: string) => m.specs.find((s) => s.label === label)?.value;
  const out: NavHighlight[] = [];

  const powerRaw = m.specs.find((s) => /\d+\s*CH/i.test(s.value))?.value;
  const power = powerRaw?.match(/(\d+)\s*CH/i)?.[1];
  if (power) out.push({ value: `${power} CH`, label: "Puissance" });

  const transmission = byLabel("Boîte automatique");
  if (transmission) out.push({ value: transmission, label: "Transmission" });

  const autonomy = byLabel("Autonomie électrique");
  const conso = byLabel("Consommation");
  if (autonomy) out.push({ value: autonomy, label: "Autonomie élec." });
  else if (conso) out.push({ value: conso.replace(/\s*\/\s*100\s*Km/i, ""), label: "Consommation" });

  return out;
}

export const modelNavItems: ModelNavItem[] = allModels.map((m) => ({
  slug: m.slug,
  name: m.name,
  nameplate: m.nameplate,
  tagline: m.tagline,
  price: m.price,
  image: m.heroDesktop,
  highlights: modelHighlights(m),
}));
