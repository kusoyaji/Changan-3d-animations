import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DiamondMark } from "@/components/ui/DiamondMark";
import { PageHero } from "@/components/sections/PageHero";
import { LeadFormEmbed } from "@/components/sections/LeadFormEmbed";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Réserver un essai",
  description:
    "Réservez un essai routier Changan dans le showroom de votre choix. Prenez le volant du modèle qui vous intéresse en quelques minutes.",
};

const STEPS = [
  {
    title: "Choisissez votre modèle",
    text: "Indiquez le véhicule qui vous intéresse et le showroom le plus proche de chez vous.",
  },
  {
    title: "Sélectionnez un créneau",
    text: "Nos conseillers vous rappellent pour confirmer la date et l’heure de votre essai.",
  },
  {
    title: "Prenez le volant",
    text: "Vivez l’expérience de conduite Changan, accompagné d’un conseiller dédié.",
  },
];

export default function EssaiPage() {
  return (
    <>
      <PageHero
        eyebrow="Essai routier"
        title="Réservez votre essai Changan"
        intro="Prenez le volant du modèle de votre choix. Renseignez le formulaire, un conseiller vous recontacte pour organiser votre essai dans le showroom le plus proche."
      />

      <section className="bg-field">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
            {/* How it works. */}
            <Reveal className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold tracking-[-0.02em] text-ink">
                Comment ça marche
              </h2>
              <ol className="mt-8 space-y-7">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10 rounded-[16px] border border-sky bg-white p-6">
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-brand">
                  <DiamondMark className="h-3.5 w-3.5 text-brand" />
                  Une question&nbsp;?
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  Appelez-nous directement, nous sommes là pour vous accompagner.
                </p>
                <a
                  href={site.phoneHref}
                  className="mt-3 inline-block font-display text-xl font-bold text-azure transition-colors duration-150 hover:text-azure-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
                >
                  {site.phone}
                </a>
              </div>
            </Reveal>

            {/* Zoho form. */}
            <Reveal delay={120}>
              <LeadFormEmbed src={site.leadForms.essai} title="Formulaire de réservation d’essai Changan" />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
