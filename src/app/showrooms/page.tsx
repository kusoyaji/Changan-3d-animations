import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { showrooms } from "@/content/showrooms";

export const metadata: Metadata = {
  title: "Showrooms",
  description:
    "Trouvez le showroom Changan le plus proche : adresses, horaires et contact de nos points de vente au Maroc.",
};

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export default function ShowroomsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(70% 90% at 85% 0%, rgba(45,116,230,0.35), transparent 60%), radial-gradient(60% 60% at 0% 100%, rgba(26,95,208,0.18), transparent 65%)",
          }}
        />
        <Container className="relative z-10 py-20 lg:py-28">
          <Reveal>
            <Eyebrow tone="dark">Nos points de vente</Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.02em]">
              Le réseau Changan au Maroc
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 max-w-[52ch] text-[clamp(1rem,1.5vw,1.2rem)] text-sky">
              Huit showrooms pour la vente, l&apos;entretien et les pièces — trouvez celui le plus
              proche de chez vous.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-field">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {showrooms.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 80}>
                <article className="flex h-full flex-col overflow-hidden rounded-[16px] border border-sky bg-white">
                  <div className="relative aspect-[16/10] w-full bg-panel">
                    <Image
                      src={s.image}
                      alt={`Showroom Changan ${s.city}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-ink">
                      {s.city}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.address}</p>

                    <dl className="mt-4 space-y-2 text-sm">
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">Horaires</dt>
                        <dd className="mt-0.5 text-ink/80">{s.hours}</dd>
                      </div>
                      {s.sav ? (
                        <div>
                          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">SAV</dt>
                          <dd className="mt-0.5 text-ink/80">{s.sav}</dd>
                        </div>
                      ) : null}
                    </dl>

                    <div className="mt-5 flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={telHref(s.phone)}
                        className="font-mono text-sm font-semibold text-azure transition-colors duration-150 hover:text-azure-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
                      >
                        {s.phone}
                      </a>
                      {s.directionLink ? (
                        <a
                          href={s.directionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto inline-flex items-center gap-1.5 rounded-[10px] border-[1.5px] border-sky px-4 py-2 text-sm font-semibold text-brand transition-colors duration-150 ease-[var(--ease-out)] hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
                        >
                          Itinéraire
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
