import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { DiamondMark } from "@/components/ui/DiamondMark";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { LeadFormEmbed } from "@/components/sections/LeadFormEmbed";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Estimer ma reprise",
  description:
    "Faites estimer la reprise de votre véhicule actuel et déduisez sa valeur de votre prochain Changan. Estimation rapide et sans engagement.",
};

const BENEFITS = [
  {
    title: "Estimation gratuite",
    text: "Recevez une évaluation de votre véhicule sans engagement, sous 48 heures.",
  },
  {
    title: "Valeur déduite",
    text: "Le montant de la reprise vient directement en déduction de votre nouveau Changan.",
  },
  {
    title: "Démarches simplifiées",
    text: "Nous nous occupons du transfert et des formalités administratives pour vous.",
  },
];

export default function ReprisePage() {
  return (
    <>
      <PageHero
        eyebrow="Reprise"
        title="Estimez la reprise de votre véhicule"
        intro="Transformez votre voiture actuelle en apport pour votre prochain Changan. Renseignez ses caractéristiques, nous vous transmettons une estimation sans engagement."
      />

      <section className="bg-field">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
            {/* Benefits + reassurance image. */}
            <Reveal className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-sky bg-panel">
                <Image
                  src="/images/model/trade-in/imgi_52_reprise-1.webp"
                  alt="Remise des clés d’un véhicule en concession Changan"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>

              <ul className="mt-8 space-y-6">
                {BENEFITS.map((b) => (
                  <li key={b.title} className="flex gap-4">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-6 w-6 shrink-0 text-azure"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" className="text-sky" />
                      <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">{b.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted">{b.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-[16px] border border-sky bg-white p-6">
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-brand">
                  <DiamondMark className="h-3.5 w-3.5 text-brand" />
                  Besoin d’aide&nbsp;?
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  Un conseiller vous accompagne pour estimer votre véhicule.
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
              <LeadFormEmbed src={site.leadForms.reprise} title="Formulaire d’estimation de reprise Changan" />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
