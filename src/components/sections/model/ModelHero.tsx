import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import type { Model } from "@/content/types";

export function ModelHero({ model }: { model: Model }) {
  const headline = model.tagline || model.name;
  // The tagline copy (e.g. "Plus loin, en silence.") already carries its own
  // closing punctuation; only the bare name fallback needs the azure accent
  // dot appended, so we never end up with a double "..".
  const endsWithPunctuation = /[.!?]$/.test(headline);

  return (
    <section className="relative overflow-hidden bg-field">
      {/* Soft blue radial glow behind the car + a light wash top-left, matching the ATLAS hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(80% 70% at 72% 58%, rgba(26,95,208,0.10), transparent 60%), radial-gradient(60% 80% at 18% 0%, #ffffff, transparent 55%)",
        }}
      />

      <Container className="relative z-10 grid gap-10 pt-14 pb-16 lg:grid-cols-2 lg:items-center lg:pt-24 lg:pb-24">
        <div className="max-w-[540px]">
          <Reveal delay={50}>
            <Eyebrow>Changan {model.name}</Eyebrow>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-6 font-brand text-sm uppercase tracking-[0.14em] text-brand">
              {model.nameplate}
            </p>
          </Reveal>

          <Reveal delay={160}>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-bold leading-[1.0] tracking-[-0.02em] text-ink">
              {endsWithPunctuation ? headline.slice(0, -1) : headline}
              <span className="text-azure">{endsWithPunctuation ? headline.slice(-1) : "."}</span>
            </h1>
          </Reveal>

          {model.price ? (
            <Reveal delay={260}>
              <p className="mt-6 font-mono text-sm text-muted">
                À partir de {model.price}
              </p>
            </Reveal>
          ) : null}

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button href="/essai">Réserver un essai</Button>
              <Button variant="outline" href="#specifications">
                Voir les spécifications
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180} className="relative aspect-[16/10] w-full">
          <Image
            src={model.heroDesktop}
            alt={model.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain drop-shadow-[0_40px_42px_rgba(15,42,77,0.22)]"
          />
        </Reveal>
      </Container>
    </section>
  );
}
