"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const telHref = `tel:${site.phone.replace(/[^+\d]/g, "")}`;

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-40 border-b border-sky bg-field/80 backdrop-blur"
    >
      <Container
        className={cn(
          "flex items-center justify-between transition-[padding] duration-150 ease-[var(--ease-out)]",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <Link
          href="/"
          className="flex items-center rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
        >
          <Image src="/images/logo-blue.svg" alt="Changan" width={700} height={501} className="h-7 w-auto" priority />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] text-ink/80 transition-colors duration-150 ease-[var(--ease-out)] hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 rounded-[6px]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <a
            href={telHref}
            className="hidden text-[15px] font-semibold text-brand sm:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 rounded-[6px]"
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
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-nav" className="border-t border-sky bg-field/95 backdrop-blur lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <nav aria-label="Navigation mobile" className="flex flex-col">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center text-[15px] text-ink/80 transition-colors duration-150 ease-[var(--ease-out)] hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 rounded-[6px]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <a
              href={telHref}
              className="flex min-h-11 items-center text-[15px] font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 rounded-[6px]"
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
