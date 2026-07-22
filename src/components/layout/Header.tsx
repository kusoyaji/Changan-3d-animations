"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ModelsMenu } from "@/components/layout/ModelsMenu";
import { modelNavItems } from "@/content/modelNav";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const telHref = `tel:${site.phone.replace(/[^+\d]/g, "")}`;
  // Everything except "Modèles" (rendered as the mega-menu / accordion).
  const flatNav = site.nav.filter((item) => item.href !== "/modeles");

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-40 border-b border-sky bg-field/80 backdrop-blur"
    >
      <Container
        className={cn(
          "flex items-center justify-between transition-[padding] duration-150 ease-[var(--ease-out)]",
          scrolled ? "py-2" : "py-4",
        )}
      >
        <Link
          href="/"
          className="flex items-center rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
        >
          <Image
            src="/images/logo-blue.svg"
            alt="Changan"
            width={700}
            height={501}
            priority
            className={cn(
              "w-auto transition-[height] duration-150 ease-[var(--ease-out)]",
              scrolled ? "h-9" : "h-12",
            )}
          />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 lg:flex">
          <ModelsMenu />
          {flatNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[6px] text-[15px] text-ink/80 transition-colors duration-150 ease-[var(--ease-out)] hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <a
            href={telHref}
            className="hidden rounded-[6px] text-[15px] font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 sm:inline-flex"
          >
            {site.phone}
          </a>
          <Button href="/essai" className="hidden lg:inline-flex">
            Réserver un essai
          </Button>

          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-sky bg-field/95 backdrop-blur lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {/* Models accordion. */}
            <button
              type="button"
              aria-expanded={modelsOpen}
              onClick={() => setModelsOpen((v) => !v)}
              className="flex min-h-11 items-center justify-between rounded-[6px] text-[15px] font-medium text-ink transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
            >
              Modèles
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={cn(
                  "h-5 w-5 transition-transform duration-200 ease-[var(--ease-out)]",
                  modelsOpen ? "rotate-180" : "rotate-0",
                )}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)]",
                modelsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <ul className="flex flex-col gap-2 py-2">
                  {modelNavItems.map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={`/modeles/${m.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-[12px] border border-sky bg-white/70 p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                      >
                        <span className="relative h-12 w-20 shrink-0 overflow-hidden rounded-[8px] bg-field">
                          <Image
                            src={m.image}
                            alt=""
                            aria-hidden="true"
                            fill
                            sizes="80px"
                            className="object-contain p-1"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-brand text-base tracking-wide text-ink">
                            {m.nameplate}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {m.highlights.map((h) => h.value).join(" · ")}
                          </span>
                        </span>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/modeles"
                      onClick={() => setOpen(false)}
                      className="flex min-h-11 items-center gap-2 px-1 text-sm font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
                    >
                      Toute la gamme
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <nav aria-label="Navigation mobile" className="flex flex-col">
              {flatNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-[6px] text-[15px] text-ink/80 transition-colors duration-150 ease-[var(--ease-out)] hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <a
              href={telHref}
              className="flex min-h-11 items-center rounded-[6px] text-[15px] font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
            >
              {site.phone}
            </a>
            <span onClick={() => setOpen(false)}>
              <Button href="/essai" className="mt-2 w-full">
                Réserver un essai
              </Button>
            </span>
          </Container>
        </div>
      )}
    </header>
  );
}
