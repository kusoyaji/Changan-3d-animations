"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import type { ColorVariant } from "@/content/types";

export function ColorVariantSwitcher({
  variants,
  name,
}: {
  variants: ColorVariant[];
  name: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (variants.length === 0) {
    return null;
  }

  const selected = variants[selectedIndex];

  return (
    <section className="bg-field">
      <Container className="py-16 lg:py-24">
        <Eyebrow>Couleurs</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-[-0.02em] text-ink">
          Choisissez votre teinte
        </h2>

        <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-panel">
          <Image
            src={selected.image}
            alt={`${name} — ${selected.label}`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain p-6 opacity-100 transition-opacity duration-300 ease-[var(--ease-out)]"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
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
                  "flex h-11 w-11 items-center justify-center rounded-full transition-[box-shadow] duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2",
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
      </Container>
    </section>
  );
}
