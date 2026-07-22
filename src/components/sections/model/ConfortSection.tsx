"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Feature } from "@/content/types";

const INTERVAL = 5000;

// Full-section slideshow: comfort images cover the whole section and crossfade
// into one another; a bottom tab bar drives the transitions and doubles as an
// autoplay progress indicator. Images cover the full section by design.
export function ConfortSection({
  eyebrow,
  heading,
  items,
}: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: Feature[];
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || paused || items.length < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), INTERVAL);
    return () => clearInterval(id);
  }, [reduced, paused, items.length, active]);

  if (items.length === 0) return null;

  const go = (i: number) => setActive(((i % items.length) + items.length) % items.length);

  return (
    <section
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink text-white lg:snap-start"
      aria-roledescription="carousel"
      aria-label={heading}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      {/* Crossfading image stack — full coverage. */}
      {items.map((item, i) => (
        <div
          key={item.title}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-[800ms] ease-[var(--ease-out)] ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
            style={
              i === active && !reduced
                ? { animation: "ken-burns 7s ease-out forwards" }
                : undefined
            }
          />
        </div>
      ))}

      {/* Scrims: darken top (heading) and bottom (tabs) for legibility. */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/85 via-ink/15 to-ink/45" />

      <Container className="relative z-10 pt-24 lg:pt-28">
        <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-[15ch] font-display text-[clamp(1.9rem,4vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          {heading}
        </h2>
      </Container>

      {/* Bottom tab bar with per-tab autoplay progress. */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <Container className="pb-8 lg:pb-12">
          <div className="flex gap-4 lg:gap-8" role="tablist" aria-label={heading}>
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => go(i)}
                  className="group flex flex-1 flex-col text-left focus-visible:outline-none"
                >
                  <span
                    className={`mb-3 text-sm font-medium transition-colors duration-200 ease-[var(--ease-out)] lg:text-base ${
                      isActive ? "text-white" : "text-white/45 group-hover:text-white/75"
                    } group-focus-visible:text-white`}
                  >
                    {item.title}
                  </span>
                  <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                    <span
                      key={isActive ? `on-${active}` : "off"}
                      className="block h-full origin-left bg-azure"
                      style={{
                        transform: isActive ? (paused || reduced ? "scaleX(1)" : undefined) : "scaleX(0)",
                        animation: isActive && !paused && !reduced ? `grow-x ${INTERVAL}ms linear forwards` : "none",
                      }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>
    </section>
  );
}
