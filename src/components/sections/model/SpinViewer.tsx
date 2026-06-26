"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

// Every this many pixels of horizontal drag advances the spin by one frame.
const PX_PER_FRAME = 24;

export function SpinViewer({
  frames,
  name,
}: {
  frames: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const dragState = useRef<{ startX: number; startIndex: number } | null>(null);

  // Preload every frame on mount so the drag/slider interaction never shows
  // a blank or stale image while a frame loads.
  useEffect(() => {
    if (frames.length < 2) return;
    const preloaded = frames.map((src) => {
      const img = new window.Image();
      img.src = src;
      return img;
    });
    return () => {
      preloaded.length = 0;
    };
  }, [frames]);

  if (frames.length < 2) {
    return null;
  }

  const frameCount = frames.length;
  const wrap = (n: number) => ((n % frameCount) + frameCount) % frameCount;

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // jsdom (used in tests) doesn't implement pointer capture, so guard the
    // call — real browsers always have it.
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragState.current = { startX: event.clientX, startIndex: index };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.startX;
    const steps = Math.trunc(deltaX / PX_PER_FRAME);
    setIndex(wrap(drag.startIndex + steps));
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragState.current = null;
  }

  return (
    <section className="bg-field">
      <Container className="py-16 lg:py-24">
        <Eyebrow>Vue 360°</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-[-0.02em] text-ink">
          Tournez autour du véhicule
        </h2>

        <div
          data-testid="spin-surface"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative mt-10 aspect-[16/9] w-full touch-none select-none overflow-hidden rounded-[16px] bg-panel"
        >
          <div data-testid="spin-frame" data-frame={index} className="absolute inset-0">
            <Image
              src={frames[index]}
              alt={`${name} — vue 360°`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority={index === 0}
              className="object-contain p-6"
            />
          </div>
        </div>

        <p className="mt-4 font-mono text-sm text-muted">Glissez pour faire pivoter</p>

        <input
          type="range"
          min={0}
          max={frameCount - 1}
          step={1}
          value={index}
          onChange={(event) => setIndex(Number(event.target.value))}
          aria-label="Faire pivoter le véhicule"
          className={cn(
            "mt-4 h-2 w-full max-w-xs cursor-pointer appearance-none rounded-full bg-line accent-azure",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2",
          )}
        />
      </Container>
    </section>
  );
}
