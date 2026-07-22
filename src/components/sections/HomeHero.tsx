"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { allModels } from "@/content/models";
import { useReducedMotion } from "@/lib/useReducedMotion";

const INTERVAL = 6000;

// Hero as a model slider: an oversized no-background cutout owns the right
// side of the fold (full-bleed to the viewport edge on desktop), backed by a
// giant nameplate watermark. Slides move directionally (new car glides in
// from the right, old one exits left) using transform+opacity only; the
// bottom switcher doubles as an autoplay progress bar.
export function HomeHero() {
  const models = allModels;
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const swipeX = useRef<number | null>(null);

  const go = (i: number) => {
    const next = ((i % models.length) + models.length) % models.length;
    if (next === active) return;
    setPrev(active);
    setActive(next);
  };

  useEffect(() => {
    if (reduced || paused || models.length < 2) return;
    const id = setInterval(() => {
      setActive((a) => {
        setPrev(a);
        return (a + 1) % models.length;
      });
    }, INTERVAL);
    return () => clearInterval(id);
  }, [reduced, paused, models.length, active]);

  const m = models[active];

  // Directional slide states: incoming waits right, outgoing exits left.
  const slideCls = (i: number) =>
    i === active
      ? "opacity-100 translate-x-0 scale-100"
      : i === prev
        ? "opacity-0 -translate-x-[3%] scale-100"
        : "opacity-0 translate-x-[5%] scale-[0.985]";

  return (
    <section
      className="relative overflow-hidden bg-field"
      aria-roledescription="carousel"
      aria-label="Gamme Changan"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(75% 85% at 74% 60%, rgba(26,95,208,0.14), transparent 62%), radial-gradient(60% 80% at 15% 0%, #ffffff, transparent 55%)",
        }}
      />

      {/* Car stage — in-flow full-width on mobile, full-bleed right half on desktop. */}
      <div
        className="relative z-0 h-[38svh] min-h-[250px] w-full touch-pan-y select-none sm:h-[46svh] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[61vw]"
        onPointerDown={(e) => (swipeX.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipeX.current === null) return;
          const dx = e.clientX - swipeX.current;
          swipeX.current = null;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        {/* Giant nameplate watermark behind the car. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[4%] flex justify-center overflow-hidden lg:top-[8%] lg:justify-end lg:pr-[3vw]"
        >
          <span
            key={active}
            className="whitespace-nowrap font-display font-bold uppercase leading-none tracking-[-0.04em] text-ink/[0.06]"
            style={{
              // Fit the watermark to the stage no matter the nameplate length
              // ("UNI-K" gets huge, "CS55 PHEV" still fits uncut).
              fontSize: `min(15vw, ${(100 / Math.max(m.nameplate.length, 4)).toFixed(1)}vw, 12rem)`,
              ...(reduced ? {} : { animation: "fade-up 900ms var(--ease-out) both" }),
            }}
          >
            {m.nameplate}
          </span>
        </div>

        {models.map((model, i) => (
          <div
            key={model.slug}
            aria-hidden={i !== active}
            className={`absolute inset-0 transform-gpu transition-[opacity,transform] duration-700 ease-[var(--ease-out)] lg:top-8 lg:bottom-24 ${slideCls(i)}`}
          >
            <Image
              src={model.heroDesktop}
              alt={model.name}
              fill
              priority={i === 0}
              draggable={false}
              sizes="(min-width: 1024px) 61vw, 100vw"
              className="object-contain object-[center_72%] drop-shadow-[0_44px_46px_rgba(15,42,77,0.24)] lg:object-[68%_60%]"
            />
          </div>
        ))}
      </div>

      {/* Copy — re-keyed per slide so it re-animates in with a soft stagger. */}
      <Container className="relative z-10 pt-2 pb-36 lg:flex lg:min-h-[88svh] lg:flex-col lg:justify-center lg:pt-16 lg:pb-44">
        <div className="max-w-[560px] lg:max-w-[440px] xl:max-w-[520px]">
          <div key={active}>
            <div style={reduced ? undefined : { animation: "fade-up 550ms var(--ease-out) both" }}>
              <Eyebrow>La gamme Changan</Eyebrow>
            </div>
            <h1
              className="mt-5 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.025em] text-ink"
              style={reduced ? undefined : { animation: "fade-up 550ms var(--ease-out) 60ms both" }}
            >
              {m.name}
            </h1>
            <p
              className="mt-4 max-w-[420px] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.5] text-muted"
              style={reduced ? undefined : { animation: "fade-up 550ms var(--ease-out) 120ms both" }}
            >
              {m.tagline}
            </p>
            {m.price ? (
              <p
                className="mt-5 font-mono text-sm text-muted"
                style={reduced ? undefined : { animation: "fade-up 550ms var(--ease-out) 180ms both" }}
              >
                À partir de {m.price}
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Button href={`/modeles/${m.slug}`}>Découvrir</Button>
            <Button variant="outline" href="/essai">
              Réserver un essai
            </Button>
          </div>
        </div>
      </Container>

      {/* Model switcher / autoplay progress. */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-sky bg-white/70 backdrop-blur-md">
        <Container>
          <div role="tablist" aria-label="Choisir un modèle" className="flex gap-5 overflow-x-auto py-4 lg:gap-8">
            {models.map((model, i) => {
              const isActive = i === active;
              return (
                <button
                  key={model.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => go(i)}
                  className="group flex shrink-0 cursor-pointer flex-col gap-2 text-left focus-visible:outline-none lg:flex-1"
                >
                  <span className="flex items-center gap-3">
                    <Image
                      src={model.heroDesktop}
                      alt=""
                      aria-hidden="true"
                      width={72}
                      height={34}
                      draggable={false}
                      style={{ height: 32, width: "auto" }}
                      className={`hidden object-contain transition-opacity duration-200 ease-[var(--ease-out)] lg:block ${
                        isActive ? "opacity-100" : "opacity-55 group-hover:opacity-90"
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap text-sm font-semibold transition-colors duration-200 ease-[var(--ease-out)] ${
                        isActive ? "text-brand" : "text-muted group-hover:text-ink"
                      } group-focus-visible:text-brand`}
                    >
                      {model.name}
                    </span>
                  </span>
                  <span className="hidden h-[3px] w-full overflow-hidden rounded-full bg-sky lg:block">
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
