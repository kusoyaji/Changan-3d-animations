import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryCarousel } from "./CategoryCarousel";
import { modelNavItems, type ModelNavItem } from "@/content/modelNav";
import { cn } from "@/lib/cn";

const pick = (slugs: readonly string[]): ModelNavItem[] =>
  slugs
    .map((s) => modelNavItems.find((m) => m.slug === s))
    .filter((m): m is ModelNavItem => Boolean(m));

// Browse-by-type — each tile is a model carousel (crisp cutouts, slide
// transitions). The SUV tile cycles the whole SUV range; Berline and Hybride
// hold a single model each in the current lineup.
const CATEGORIES = [
  {
    name: "SUV",
    slugs: ["cs55-phev", "cs55", "cs35-plus", "cs15", "uni-k"],
    className: "lg:col-span-2 lg:row-span-2",
    imageClassName: "object-[center_62%] lg:p-12",
  },
  {
    name: "Berline",
    slugs: ["alsvin"],
    className: "lg:col-span-2",
    imageClassName: "object-[center_center]",
  },
  {
    name: "Hybride rechargeable",
    slugs: ["cs55-phev"],
    className: "lg:col-span-2",
    imageClassName: "object-[center_center]",
  },
] as const;

export function CategoryBento() {
  return (
    <section className="bg-panel">
      <Container className="py-20 lg:py-28">
        <Reveal>
          <Eyebrow>Par catégorie</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
            Trouvez selon vos besoins
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.name} delay={i * 90} className={cn("min-w-0", c.className)}>
              <CategoryCarousel
                category={c.name}
                models={pick(c.slugs)}
                className="min-h-[260px]"
                imageClassName={c.imageClassName}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
