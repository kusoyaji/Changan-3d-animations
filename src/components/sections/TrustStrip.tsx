import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { showrooms } from "@/content/showrooms";

// Reassurance strip — non-interactive trust signals (garantie, réseau,
// service), the pattern both Dacia and Renault close their homepages with.
// Distinct from QuickActions: centered items, badge icons, no arrows.
const ITEMS = [
  {
    title: "Garantie 6 ans",
    sub: "Ou kilométrage illimité",
    icon: (
      <>
        <path d="M12 3 4 6v6c0 4.4 3.4 7.9 8 9 4.6-1.1 8-4.6 8-9V6l-8-3z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: `${showrooms.length} showrooms`,
    sub: "Partout au Maroc",
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    title: "Pièces d’origine",
    sub: "Service dans chaque showroom",
    icon: (
      <>
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.2-.4-.4-2.2 2.6-2.6z" />
      </>
    ),
  },
] as const;

export function TrustStrip() {
  return (
    <section className="border-y border-sky bg-field">
      <Container className="py-12 lg:py-14">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand ring-1 ring-sky">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    {item.icon}
                  </svg>
                </span>
                <div>
                  <p className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{item.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
