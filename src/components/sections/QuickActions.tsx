import Link from "next/link";
import { Container } from "@/components/ui/Container";

// Primary-journey band sitting directly under the hero — the pattern both
// Dacia and Renault lead with (essai / reprise / concessionnaire / configurer).
// Surfaces the "Configurer" entry point into the model configurator.
const ACTIONS = [
  {
    href: "/essai",
    label: "Réserver un essai",
    sub: "Prenez le volant",
    icon: (
      <>
        <path d="M8 2v4M16 2v4M3 10h18" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="m9 16 2 2 4-4" />
      </>
    ),
  },
  {
    href: "/reprise",
    label: "Estimer ma reprise",
    sub: "Valeur de votre véhicule",
    icon: (
      <>
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        <path d="M3 21v-5h5" />
      </>
    ),
  },
  {
    href: "/showrooms",
    label: "Trouver un showroom",
    sub: "8 villes au Maroc",
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    href: "/modeles",
    label: "Configurer",
    sub: "Couleurs & finitions",
    icon: (
      <>
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
        <path d="M1 14h6M9 8h6M17 16h6" />
      </>
    ),
  },
] as const;

export function QuickActions() {
  return (
    <section className="border-b border-sky bg-panel">
      <Container className="grid grid-cols-1 divide-y divide-sky sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
        {ACTIONS.map((a, i) => (
          <Link
            key={a.href}
            href={a.href}
            className={`group flex items-center gap-4 py-5 transition-colors duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 lg:px-6 lg:py-6 ${
              i > 0 ? "sm:border-t sm:border-sky lg:border-t-0 lg:border-l" : ""
            } ${i === 1 ? "sm:border-t-0" : ""}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-field text-brand transition-colors duration-150 ease-[var(--ease-out)] group-hover:bg-brand group-hover:text-white">
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
                {a.icon}
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink transition-colors duration-150 group-hover:text-brand">
                {a.label}
              </span>
              <span className="block truncate text-xs text-muted">{a.sub}</span>
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-brand transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        ))}
      </Container>
    </section>
  );
}
