import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

// Shared dark intro banner for interior pages (Showrooms uses the same
// treatment inline). Azure glow on ink, staggered reveal.
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
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
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.02em]">
            {title}
          </h1>
        </Reveal>
        {intro ? (
          <Reveal delay={200}>
            <p className="mt-5 max-w-[54ch] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.5] text-sky">
              {intro}
            </p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
