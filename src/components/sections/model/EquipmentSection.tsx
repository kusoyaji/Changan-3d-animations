"use client";

import Image from "next/image";
import { useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Feature } from "@/content/types";

// Split panel: a numbered list selects the equipment; the matching image fills
// the ENTIRE opposite half of the section (edge-to-edge, full height) and
// crossfades with a subtle Ken Burns.
export function EquipmentSection({
  eyebrow,
  heading,
  items,
}: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: Feature[];
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <section className="bg-panel lg:snap-start">
      <div className="grid lg:min-h-[100svh] lg:grid-cols-2 lg:items-stretch">
        {/* Selector column (below image on mobile, left on desktop). */}
        <div className="order-2 flex flex-col justify-center px-6 py-14 sm:px-10 lg:order-1 lg:py-20 lg:pl-[max(2rem,calc((100vw-1240px)/2))] lg:pr-14">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-[-0.02em] text-ink">
            {heading}
          </h2>

          <ol className="mt-8 flex flex-col">
            {items.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className={`flex w-full gap-4 border-l-2 py-4 pl-5 text-left transition-colors duration-200 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 ${
                      on ? "border-azure" : "border-line hover:border-sky"
                    }`}
                  >
                    <span className={`mt-1 font-mono text-sm ${on ? "text-azure" : "text-muted"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span
                        className={`block font-display text-lg font-bold tracking-[-0.01em] transition-colors duration-200 lg:text-xl ${
                          on ? "text-ink" : "text-muted"
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.text ? (
                        <span
                          className={`grid transition-all duration-300 ease-[var(--ease-out)] ${
                            on ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <span className="block min-h-0 overflow-hidden text-sm leading-relaxed text-muted">
                            {item.text}
                          </span>
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Image half — fills the whole side, full height, edge-to-edge. */}
        <div className="relative order-1 h-[56vh] w-full overflow-hidden bg-ink lg:order-2 lg:h-auto">
          {items.map((item, i) => (
            <Image
              key={item.title}
              src={item.image}
              alt={item.title}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              aria-hidden={i !== active}
              className={`object-cover object-center transition-opacity duration-500 ease-[var(--ease-out)] ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
              style={i === active && !reduced ? { animation: "ken-burns 7s ease-out forwards" } : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
