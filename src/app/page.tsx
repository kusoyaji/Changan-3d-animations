import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/HomeHero";
import { Lineup } from "@/components/sections/Lineup";
import { HybridHighlight } from "@/components/sections/HybridHighlight";
import { ShowroomTeaser } from "@/components/sections/ShowroomTeaser";
import { LeadCta } from "@/components/sections/LeadCta";

export const metadata: Metadata = {
  title: "Changan Maroc — Voitures, SUV & hybrides",
  description:
    "Découvrez la gamme Changan au Maroc : SUV, berlines et hybrides rechargeables. Réservez un essai dans l'un de nos 8 showrooms partout au Maroc.",
};

export default function Home() {
  return (
    <>
      <HomeHero />
      <Lineup />
      <HybridHighlight />
      <ShowroomTeaser />
      <LeadCta />
    </>
  );
}
