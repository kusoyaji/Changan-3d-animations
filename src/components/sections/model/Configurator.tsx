"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { ColorVariant, Spec } from "@/content/types";

function groupSpecs(specs: Spec[]) {
  const groups = new Map<string, Spec[]>();
  for (const spec of specs) {
    const existing = groups.get(spec.group);
    if (existing) existing.push(spec);
    else groups.set(spec.group, [spec]);
  }
  return groups;
}

// Merged "Couleurs" + "Spécifications" into a single configurator section:
// a color-selectable car on the left (crossfading between finishes) and the
// grouped technical sheet on the right, so the two decisions read as one.
// Keeps the `#specifications` anchor the hero CTA scrolls to.
export function Configurator({
  variants,
  specs,
  pdf,
  name,
  id,
}: {
  variants: ColorVariant[];
  specs: Spec[];
  pdf?: string;
  name: string;
  id?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasColors = variants.length > 0;
  const hasSpecs = specs.length > 0;
  if (!hasColors && !hasSpecs && !pdf) return null;

  const selected = variants[selectedIndex];
  const groups = groupSpecs(specs);

  return (
    <section id={id ?? "specifications"} className="bg-field">
      <Container className="py-16 lg:py-24">
        <Reveal>
          <Eyebrow>Configuration</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-[-0.02em] text-ink">
            Couleurs &amp; caractéristiques
          </h2>
        </Reveal>

        <div
          className={cn(
            "mt-12 grid gap-10 lg:gap-14",
            hasColors && (hasSpecs || pdf) ? "lg:grid-cols-12" : "",
          )}
        >
          {/* Colour picker — sticky on desktop so the car stays framed while
              the spec sheet scrolls alongside it. */}
          {hasColors ? (
            <Reveal delay={80} className="lg:col-span-7 lg:self-start lg:sticky lg:top-24">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-sky bg-panel">
                {variants.map((variant, index) => (
                  <Image
                    key={variant.label}
                    src={variant.image}
                    alt={index === selectedIndex ? `${name} — ${variant.label}` : ""}
                    aria-hidden={index !== selectedIndex}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className={cn(
                      "object-contain p-6 transition-opacity duration-300 ease-[var(--ease-out)]",
                      index === selectedIndex ? "opacity-100" : "opacity-0",
                    )}
                  />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="min-w-[7rem] font-mono text-xs uppercase tracking-[0.12em] text-muted">
                  {selected.label}
                </span>
                <div className="flex flex-wrap gap-3">
                  {variants.map((variant, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={variant.label}
                        type="button"
                        aria-label={variant.label}
                        aria-pressed={isSelected}
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                          "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-[box-shadow,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2",
                          isSelected
                            ? "ring-2 ring-azure ring-offset-2"
                            : "ring-1 ring-sky hover:ring-2 hover:ring-brand",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="h-7 w-7 rounded-full border border-sky"
                          style={{ background: variant.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ) : null}

          {/* Technical sheet. */}
          {hasSpecs || pdf ? (
            <Reveal delay={hasColors ? 160 : 80} className={hasColors ? "lg:col-span-5" : ""}>
              {groups.size > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
                  {Array.from(groups.entries()).map(([group, groupItems]) => (
                    <div key={group}>
                      <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-brand">
                        {group}
                      </h3>
                      <dl className="mt-3">
                        {groupItems.map((spec) => (
                          <div
                            key={spec.label}
                            className="flex items-baseline justify-between gap-4 border-t border-line py-3"
                          >
                            <dt className="text-muted">{spec.label}</dt>
                            <dd className="text-right font-display text-ink">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              ) : null}

              {pdf ? (
                <div className="mt-10">
                  <Button href={pdf}>Télécharger la fiche technique</Button>
                </div>
              ) : null}
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
