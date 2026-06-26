import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lineup } from "@/components/sections/Lineup";

export const metadata: Metadata = {
  title: "Modèles",
  description:
    "Découvrez la gamme complète de véhicules Changan au Maroc : SUV, berlines et hybrides rechargeables.",
};

export default function ModelesPage() {
  return (
    <>
      <section className="bg-field py-12 lg:py-16">
        <Container>
          <Eyebrow>Modèles</Eyebrow>
          <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
            La gamme Changan
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Explorez tous les modèles Changan disponibles au Maroc. Des SUV compacts aux véhicules hybrides rechargeables, trouvez celui qui vous convient.
          </p>
        </Container>
      </section>
      <Lineup />
    </>
  );
}
