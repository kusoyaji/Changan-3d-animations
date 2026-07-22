import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { FramedImage } from "@/components/ui/FramedImage";
import type { Feature } from "@/content/types";

export function FeatureSection({
  eyebrow,
  heading,
  features,
  alt = false,
}: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly features: Feature[];
  readonly alt?: boolean;
}) {
  if (features.length === 0) {
    return null;
  }

  return (
    <section className={alt ? "bg-panel" : "bg-field"}>
      <Container className="py-16 lg:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-[-0.02em] text-ink">
          {heading}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14">
          {features.map((feature) => (
            <Reveal key={feature.title}>
              <figure className="group relative overflow-hidden rounded-[16px] bg-ink">
                <FramedImage
                  src={feature.image}
                  alt={feature.title}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  imgClassName="transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.01em] text-white lg:text-2xl">
                    {feature.title}
                  </h3>
                  {feature.text ? (
                    <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-white/85">{feature.text}</p>
                  ) : null}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
