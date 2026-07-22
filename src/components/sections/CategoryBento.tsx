import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { DiamondMark } from "@/components/ui/DiamondMark";
import { cn } from "@/lib/cn";

// Browse-by-type entry point — the category tiles both competitors surface.
// Bento layout: a tall SUV tile beside two stacked tiles (Berline, Hybride).
const CATEGORIES = [
  {
    name: "SUV",
    desc: "Cinq modèles, du compact urbain au familial.",
    href: "/modeles",
    image: "/images/vehicles/cutouts/cs55.webp",
    className: "lg:col-span-2 lg:row-span-2",
    imageClassName: "object-[center_75%] p-8 lg:p-12",
  },
  {
    name: "Berline",
    desc: "L’Alsvin, élégante et efficiente.",
    href: "/modeles/alsvin",
    image: "/images/vehicles/cutouts/alsvin.webp",
    className: "lg:col-span-2",
    imageClassName: "object-[80%_center] p-6",
  },
  {
    name: "Hybride rechargeable",
    desc: "Le CS55 PHEV, jusqu’à 1 100 km d’autonomie.",
    href: "/modeles/cs55-phev",
    image: "/images/vehicles/cutouts/cs55-phev.webp",
    className: "lg:col-span-2",
    imageClassName: "object-[80%_center] p-6",
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
            <Reveal
              key={c.name}
              delay={i * 90}
              className={cn("min-w-0", c.className)}
            >
              <Link
                href={c.href}
                className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-[16px] border border-sky bg-linear-to-br from-field to-white p-6 transition-[transform,box-shadow,border-color] duration-200 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-brand hover:shadow-[0_24px_44px_rgba(15,42,77,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 lg:min-h-[240px]"
              >
                {/* Car cutout fills the tile behind the copy. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(60% 70% at 75% 70%, rgba(26,95,208,0.10), transparent 65%)",
                  }}
                />
                <Image
                  src={c.image}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={cn(
                    "pointer-events-none object-contain transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-[1.04]",
                    c.imageClassName,
                  )}
                />
                {/* Keeps the copy legible where the cutout drifts under it. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] bg-linear-to-r from-white via-white/70 to-transparent"
                />

                <div className="relative z-10 max-w-[62%]">
                  <h3 className="font-display text-xl font-bold tracking-[-0.01em] text-ink lg:text-2xl">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.desc}</p>
                </div>

                <span className="relative z-10 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Explorer
                  <DiamondMark className="h-2.5 w-2.5 text-brand transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
