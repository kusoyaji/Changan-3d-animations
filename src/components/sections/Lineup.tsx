import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ModelCard } from "@/components/ui/ModelCard";
import { allModels } from "@/content/models";

export function Lineup() {
  return (
    <section className="border-t border-sky bg-field py-20 lg:py-28">
      <Container>
        <Reveal>
          <Eyebrow>La gamme</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
            Trouvez votre Changan
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allModels.map((model, i) => (
            <Reveal key={model.slug} delay={i * 70}>
              <ModelCard model={model} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
