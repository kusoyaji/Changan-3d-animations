import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export interface ModelCtaProps {
  name: string;
}

export function ModelCta({ name }: ModelCtaProps) {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28">
      {/* Azure glow radiating from the upper-right, easing into ink — gives the
          band depth without resorting to a flat two-stop linear gradient. */}
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
            Envie d&apos;essayer le {name}&nbsp;?
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Button href="/essai">Réserver un essai</Button>
            <Button variant="outline" href="/showrooms">
              Trouver un showroom
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
