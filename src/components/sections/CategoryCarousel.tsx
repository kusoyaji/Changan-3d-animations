"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DiamondMark } from "@/components/ui/DiamondMark";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import type { ModelNavItem } from "@/content/modelNav";

const INTERVAL = 4200;

// One category tile: a crisp car carousel over its models. The cutout owns a
// dedicated viewport (no scrim washing it out); model name, price, dots and
// the CTA live in a clean footer bar below, so nothing overlays the car.
// Auto-advances when it holds more than one model; swipe / arrows / dots /
// keyboard drive it manually; reduced-motion disables autoplay + movement.
export function CategoryCarousel({
  category,
  models,
  className,
  imageClassName,
}: {
  category: string;
  models: ModelNavItem[];
  className?: string;
  imageClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const swipeX = useRef<number | null>(null);
  const multi = models.length > 1;

  useEffect(() => {
    if (reduced || paused || !multi) return;
    const id = setInterval(() => setActive((a) => (a + 1) % models.length), INTERVAL);
    return () => clearInterval(id);
  }, [reduced, paused, multi, models.length, active]);

  if (models.length === 0) return null;

  const go = (i: number) => setActive(((i % models.length) + models.length) % models.length);
  const current = models[active];

  return (
    <div
      className={cn(
        "group relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-[16px] border border-sky bg-linear-to-br from-field to-white transition-[box-shadow,border-color] duration-200 ease-[var(--ease-out)] hover:border-brand hover:shadow-[0_24px_44px_rgba(15,42,77,0.12)]",
        className,
      )}
      aria-roledescription={multi ? "carousel" : undefined}
      aria-label={`Modèles ${category}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (!multi) return;
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      {/* Crisp car viewport. */}
      <div
        className="relative flex-1 touch-pan-y select-none"
        onPointerDown={(e) => {
          if (multi) swipeX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipeX.current === null) return;
          const dx = e.clientX - swipeX.current;
          swipeX.current = null;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(58% 68% at 60% 72%, rgba(26,95,208,0.10), transparent 66%)",
          }}
        />

        {models.map((m, i) => (
          <div
            key={m.slug}
            aria-hidden={i !== active}
            className={cn(
              "absolute inset-0 transform-gpu transition-[opacity,transform] duration-500 ease-[var(--ease-out)]",
              i === active ? "opacity-100 translate-x-0" : "pointer-events-none opacity-0 translate-x-[3%]",
            )}
          >
            <Image
              src={m.image}
              alt={m.name}
              fill
              draggable={false}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className={cn("object-contain p-6 lg:p-8", imageClassName)}
            />
          </div>
        ))}

        {/* Category pill. */}
        <span className="pointer-events-none absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-brand ring-1 ring-sky backdrop-blur">
          <DiamondMark className="h-2.5 w-2.5 text-brand" />
          {category}
        </span>

        {/* Arrows (multi only). */}
        {multi ? (
          <>
            <button
              type="button"
              aria-label="Modèle précédent"
              onClick={() => go(active - 1)}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-ink opacity-0 shadow-[0_6px_16px_rgba(15,42,77,0.16)] ring-1 ring-sky backdrop-blur transition-opacity duration-200 ease-[var(--ease-out)] hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure group-hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Modèle suivant"
              onClick={() => go(active + 1)}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-ink opacity-0 shadow-[0_6px_16px_rgba(15,42,77,0.16)] ring-1 ring-sky backdrop-blur transition-opacity duration-200 ease-[var(--ease-out)] hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure group-hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {/* Footer: model + price + dots + CTA (own background, never over the car). */}
      <div className="flex items-center justify-between gap-4 border-t border-sky bg-white/70 px-5 py-4">
        <div className="min-w-0">
          <p className="truncate font-brand text-lg tracking-wide text-ink">{current.nameplate}</p>
          {current.price ? <p className="font-mono text-xs text-brand">dès {current.price}</p> : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {multi ? (
            <div role="tablist" aria-label={`Modèles ${category}`} className="flex items-center gap-1.5">
              {models.map((m, i) => (
                <button
                  key={m.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={m.name}
                  onClick={() => go(i)}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2",
                    i === active ? "w-5 bg-brand" : "w-2 bg-sky hover:bg-brand/50",
                  )}
                />
              ))}
            </div>
          ) : null}

          <Link
            href={`/modeles/${current.slug}`}
            aria-label={`Découvrir le ${current.name}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-[6px] text-sm font-semibold text-brand transition-colors duration-150 ease-[var(--ease-out)] hover:text-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
          >
            Découvrir
            <DiamondMark className="h-2.5 w-2.5 text-brand transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
