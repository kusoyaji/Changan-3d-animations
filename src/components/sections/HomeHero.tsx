import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getModel } from "@/content/models";

const SPECS = [
  { value: "CS55 PHEV", label: "Hybride rechargeable" },
  { value: "1 100 km", label: "d'autonomie" },
  { value: "8 villes", label: "8 showrooms" },
] as const;

export function HomeHero() {
  const model = getModel("cs55-phev")!;

  return (
    <section className="relative overflow-hidden bg-field">
      {/* Soft blue radial glow behind the car + a light wash top-left, matching the approved mockup. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(80% 70% at 72% 58%, rgba(26,95,208,0.10), transparent 60%), radial-gradient(60% 80% at 18% 0%, #ffffff, transparent 55%)",
        }}
      />

      <Container className="relative z-10 pt-14 pb-8 lg:min-h-[560px] lg:pt-24 lg:pb-[160px]">
        <div className="max-w-[540px] lg:relative lg:z-10">
          <Reveal delay={50}>
            <Eyebrow>Conçue pour la route marocaine</Eyebrow>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.1rem)] font-bold leading-[0.98] tracking-[-0.025em] text-ink">
              Le voyage,
              <br />
              réinventé<span className="text-azure">.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-[410px] text-[17px] leading-[1.6] text-muted">
              Une gamme qui réunit design, technologie et confort — de Tanger à
              Dakhla.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button href="/essai">Réserver un essai</Button>
              <Button variant="outline" href="/modeles">
                Explorer la gamme
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Car render: sits in normal flow (scaled down, centered) on mobile so it never
            overlaps the copy or buttons; becomes an absolutely-positioned hero render
            anchored bottom-right from `lg` up, matching the approved desktop mockup. */}
        <Reveal
          delay={180}
          className="pointer-events-none relative z-0 mx-auto mt-6 w-[88%] max-w-[480px] lg:absolute lg:right-0 lg:bottom-[74px] lg:z-[5] lg:mt-0 lg:w-[58%] lg:max-w-none"
        >
          <Image
            src={model.heroDesktop}
            alt="Changan CS55 PHEV"
            width={2150}
            height={1000}
            priority
            className="h-auto w-full drop-shadow-[0_40px_42px_rgba(15,42,77,0.22)]"
          />
        </Reveal>
      </Container>

      <div className="relative z-10 flex flex-wrap items-center gap-y-2 border-t border-sky bg-white/70 px-6 py-3.5 backdrop-blur sm:px-12 lg:absolute lg:inset-x-0 lg:bottom-0">
        {SPECS.map((spec) => (
          <div
            key={spec.value}
            className="flex items-center gap-2.5 border-r border-line py-1 pr-6 last:border-r-0 sm:pr-8 [&:not(:first-child)]:ml-6 sm:[&:not(:first-child)]:ml-8"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rotate-45 rounded-[1px] bg-azure"
            />
            <span className="font-display text-[13px] font-semibold text-ink">
              {spec.value}
            </span>
            <span className="font-body text-xs text-muted">
              {spec.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
