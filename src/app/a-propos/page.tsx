import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DiamondMark } from "@/components/ui/DiamondMark";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { allModels } from "@/content/models";
import { showrooms } from "@/content/showrooms";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Changan au Maroc : plus de 160 ans d’ingénierie, une gamme de SUV, berlines et hybrides rechargeables, et un réseau de showrooms partout au Royaume.",
};

const STATS = [
  { value: "1862", label: "Origines industrielles" },
  { value: "160+", label: "Années d’ingénierie" },
  { value: String(allModels.length), label: "Modèles au Maroc" },
  { value: String(showrooms.length), label: "Showrooms au Royaume" },
] as const;

const COMMITMENTS = [
  {
    title: "Garantie 6 ans",
    text: "Six ans ou kilométrage illimité sur l’ensemble de la gamme, pour rouler l’esprit tranquille.",
  },
  {
    title: "Réseau national",
    text: `${showrooms.length} showrooms au Maroc pour la vente, l’entretien et l’accompagnement, au plus près de chez vous.`,
  },
  {
    title: "Service & pièces d’origine",
    text: "Un service après-vente qualifié et des pièces d’origine disponibles dans chaque showroom.",
  },
] as const;

const STORY = [
  {
    eyebrow: "Héritage",
    title: "Une histoire industrielle centenaire",
    text: "Fondée en 1862, Changan compte parmi les plus anciens constructeurs automobiles de Chine. Plus d’un siècle et demi d’ingénierie ont forgé un savoir-faire reconnu, de ses premiers véhicules utilitaires aux modèles électrifiés d’aujourd’hui.",
    image: "/images/model/about/story-1.webp",
    imageAlt: "Véhicules Changan des débuts de la marque",
  },
  {
    eyebrow: "Innovation",
    title: "La recherche au cœur de la marque",
    text: "Changan investit massivement dans la recherche et le développement, avec des centres d’ingénierie répartis dans le monde. Design, motorisations hybrides rechargeables et technologies d’aide à la conduite : chaque modèle bénéficie de cette exigence.",
    image: "/images/model/about/about-2.webp",
    imageAlt: "Centre de recherche et développement Changan",
  },
  {
    eyebrow: "Au Maroc",
    title: "Une marque proche de vous",
    text: "Au Maroc, Changan déploie une gamme pensée pour tous les usages et un réseau de showrooms pour la vente, l’entretien et les pièces. Des équipes dédiées vous accompagnent, de l’essai à l’entretien de votre véhicule.",
    image: "/images/model/about/brand-1.webp",
    imageAlt: "Famille auprès d’un véhicule Changan",
  },
] as const;

export default function AProposPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Changan au Maroc"
        intro="Plus de 160 ans d’ingénierie automobile au service de votre quotidien : SUV, berlines et hybrides rechargeables, portés par un réseau national de showrooms."
      />

      {/* Heritage stat strip. */}
      <section className="bg-ink text-white">
        <Container className="py-14 lg:py-16">
          <div className="grid grid-cols-2 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1.5 py-6 sm:px-8 sm:py-4 sm:first:pl-0 sm:last:pr-0"
              >
                <span className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold tracking-[-0.02em] text-white">
                  {stat.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Alternating story blocks. */}
      <section className="bg-field">
        <Container className="space-y-20 py-16 lg:space-y-28 lg:py-24">
          {STORY.map((block, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={block.title}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal className={flip ? "lg:order-2" : ""}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] border border-sky bg-panel">
                    <Image
                      src={block.image}
                      alt={block.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>

                <Reveal delay={120} className={flip ? "lg:order-1" : ""}>
                  <span className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                    <DiamondMark className="h-3.5 w-3.5 text-brand" />
                    {block.eyebrow}
                  </span>
                  <h2 className="mt-4 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold leading-[1.08] tracking-[-0.02em] text-ink">
                    {block.title}
                  </h2>
                  <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.6] text-muted">
                    {block.text}
                  </p>
                </Reveal>
              </div>
            );
          })}
        </Container>
      </section>

      {/* Commitments. */}
      <section className="border-t border-sky bg-panel">
        <Container className="py-16 lg:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-brand">
              <DiamondMark className="h-3.5 w-3.5 text-brand" />
              Nos engagements
            </span>
            <h2 className="mt-4 max-w-[20ch] font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold leading-[1.08] tracking-[-0.02em] text-ink">
              Une marque qui vous accompagne
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COMMITMENTS.map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <div className="flex h-full flex-col rounded-[16px] border border-sky bg-white p-7">
                  <DiamondMark className="h-5 w-5 text-azure" />
                  <h3 className="mt-5 font-display text-xl font-bold tracking-[-0.01em] text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA. */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(70% 90% at 85% 0%, rgba(45,116,230,0.35), transparent 60%), radial-gradient(60% 60% at 0% 100%, rgba(26,95,208,0.18), transparent 65%)",
          }}
        />
        <Container className="relative z-10 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-[640px] font-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
              Découvrez la gamme Changan
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mx-auto mt-5 max-w-[480px] text-[17px] leading-[1.6] text-white/70">
              Explorez nos modèles ou trouvez le showroom le plus proche pour un essai.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Button href="/modeles">Voir les modèles</Button>
              <Button variant="outline" href="/showrooms">
                Trouver un showroom
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
