import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DiamondMark } from "@/components/ui/DiamondMark";
import { Reveal } from "@/components/ui/Reveal";

const STATS = [
  { value: "1 100 km", label: "Autonomie" },
  { value: "4,5 L/100", label: "Consommation mixte" },
  { value: "540°", label: "Caméra" },
] as const;

// The hybrid tech story — a two-column cinematic band: copy + key figures on
// the left, the PHEV cutout floating on an azure glow on the right. Replaces
// the earlier text-only strip so the section carries real product imagery.
export function HybridHighlight() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 80% at 82% 45%, rgba(45,116,230,0.30), transparent 62%), radial-gradient(50% 60% at 0% 100%, rgba(26,95,208,0.16), transparent 65%)",
        }}
      />

      <Container className="relative z-10 grid items-center gap-10 py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:py-28">
        {/* Copy + stats. */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-white/85">
              <DiamondMark className="h-3.5 w-3.5 text-azure-hi" />
              Intelligence hybride
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
              La technologie hybride rechargeable
            </h2>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-5 max-w-[480px] text-[17px] leading-[1.6] text-white/70">
              Un moteur thermique et un bloc électrique travaillent ensemble pour offrir une
              autonomie longue distance, une consommation maîtrisée et une conduite assistée à 360°.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-10 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1.5 py-5 sm:px-6 sm:py-6 sm:first:pl-0 sm:last:pr-0"
                >
                  <span className="font-display text-[clamp(1.7rem,3vw,2.3rem)] font-bold tracking-[-0.02em] text-white">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-10">
              <Button href="/modeles/cs55-phev">Découvrir le CS55 PHEV</Button>
            </div>
          </Reveal>
        </div>

        {/* PHEV cutout on glow. */}
        <Reveal delay={120} className="order-1 lg:order-2">
          <div className="relative aspect-[16/10] w-full">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(closest-side, rgba(45,116,230,0.28), transparent 78%)",
              }}
            />
            <Image
              src="/images/vehicles/cutouts/cs55-phev.webp"
              alt="Changan CS55 PHEV"
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.45)]"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
