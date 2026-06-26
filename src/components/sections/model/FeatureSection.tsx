import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { Feature } from "@/content/types";

export function FeatureSection({
  eyebrow,
  heading,
  features,
  alt = false,
}: {
  eyebrow: string;
  heading: string;
  features: Feature[];
  alt?: boolean;
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

        <div className="mt-12 flex flex-col gap-16 lg:gap-24">
          {features.map((feature, index) => {
            const isOdd = index % 2 === 1;
            return (
              <Reveal key={feature.title}>
                <div className="grid items-center gap-10 lg:grid-cols-2">
                  <div
                    className={cn(
                      "relative aspect-[4/3] w-full overflow-hidden rounded-[16px]",
                      alt ? "bg-field" : "bg-panel",
                      isOdd && "lg:order-2",
                    )}
                  >
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className={cn(isOdd && "lg:order-1")}>
                    <h3 className="font-display text-2xl font-bold tracking-[-0.01em] text-ink">
                      {feature.title}
                    </h3>
                    {feature.text ? (
                      <p className="mt-4 text-muted">{feature.text}</p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
