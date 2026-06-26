import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DiamondMark } from "@/components/ui/DiamondMark";
import { Reveal } from "@/components/ui/Reveal";

const STATS = [
  { value: "1 100 km", label: "Autonomie" },
  { value: "4,5 L/100", label: "Consommation mixte" },
  { value: "540°", label: "Caméra" },
] as const;

export function HybridHighlight() {
  return (
    <section className="bg-ink py-20 text-white lg:py-28">
      <Container>
        <div className="max-w-[640px]">
          <Reveal>
            {/* Eyebrow reimplemented in a light treatment: the shared `Eyebrow`
                primitive hardcodes `text-brand`, which is too dark for the
                navy background here (only ~1.6:1 contrast on #0F2A4D). The
                label uses white/85 (~10.8:1, well past AA) while the diamond
                accent stays azure for a touch of brand color. */}
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
              Un moteur thermique et un bloc électrique travaillent ensemble
              pour offrir une autonomie longue distance, une consommation
              maîtrisée et une conduite assistée à 360°.
            </p>
          </Reveal>
        </div>

        <Reveal delay={220}>
          <div className="mt-12 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1.5 py-6 sm:px-8 sm:py-8 sm:first:pl-0 sm:last:pr-0"
              >
                <span className="font-display text-[clamp(1.8rem,3.5vw,2.5rem)] font-bold tracking-[-0.02em] text-white">
                  {stat.value}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-10">
            <Button href="/hybride">Découvrir l&apos;hybride</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
