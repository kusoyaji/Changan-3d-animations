"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Cinematic3D } from "@/content/types";

// Total scroll length of the pinned experience (viewport heights).
const PIN_VH = 600;
// How fast the displayed progress eases toward the scroll target (0..1 per frame).
const LERP = 0.1;

function frameUrl(template: string, i: number, ext?: string) {
  const padded = String(i).padStart(4, "0");
  const url = template.replace("{i}", padded);
  return ext ? url.replace(/\.[a-z0-9]+$/i, `.${ext}`) : url;
}

// Probe AVIF by actually loading the first frame; fall back to WebP if it
// won't decode. Returns the extension to use for all frames (or undefined to
// keep the template's own extension when no webp fallback is configured).
function pickExt(template: string, webpFallback?: boolean): Promise<string | undefined> {
  if (!webpFallback) return Promise.resolve(undefined);
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve("avif");
    img.onerror = () => resolve("webp");
    img.src = frameUrl(template, 0, "avif");
  });
}

// SSR-safe media-query subscription (avoids setState-in-effect + hydration mismatch).
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener?.("change", cb);
      return () => mq.removeEventListener?.("change", cb);
    },
    [query],
  );
  const getSnapshot = () =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : false;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function CinematicSequence({
  data,
  name,
}: {
  data?: Cinematic3D;
  name: string;
}) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const trackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const capRefs = useRef<Array<HTMLDivElement | null>>([]);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);

  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [progressPct, setProgressPct] = useState(0); // load %

  const hasData = !!data && data.frameCount >= 2;

  // Lazy-mount: only begin work when the section is near the viewport.
  useEffect(() => {
    if (!hasData || reduced) return;
    const el = trackRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { rootMargin: "200% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasData, reduced]);

  // Preload the active frame set once in view.
  useEffect(() => {
    if (!hasData || reduced || !inView || typeof window === "undefined") return;
    let cancelled = false;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const count = isMobile ? data!.mobileFrameCount : data!.frameCount;
    const template = isMobile ? data!.mobileFramePath : data!.framePath;

    (async () => {
      const ext = await pickExt(template, data!.webpFallback);
      if (cancelled) return;
      const imgs: HTMLImageElement[] = [];
      let loaded = 0;
      await Promise.all(
        Array.from({ length: count }, (_, i) => {
          return new Promise<void>((resolve) => {
            const img = new window.Image();
            img.decoding = "async";
            img.onload = img.onerror = () => {
              loaded += 1;
              if (!cancelled) setProgressPct(Math.round((loaded / count) * 100));
              resolve();
            };
            img.src = frameUrl(template, i, ext);
            imgs[i] = img;
          });
        }),
      );
      if (cancelled) return;
      framesRef.current = imgs;
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [hasData, reduced, inView, data]);

  // Scroll-driven rAF render loop (no React state churn per frame).
  useEffect(() => {
    if (!hasData || reduced || !ready) return;
    const canvas = canvasRef.current;
    const track = trackRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !track || !ctx) return;

    const frames = framesRef.current;
    const N = frames.length;
    const beats = data!.beats ?? [];
    let target = 0;
    let cur = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      canvas!.width = Math.max(1, Math.round(w * dpr));
      canvas!.height = Math.max(1, Math.round(h * dpr));
    }
    function drawCover(img: HTMLImageElement) {
      if (!img || !img.width) return;
      const cw = canvas!.width;
      const ch = canvas!.height;
      const ir = img.width / img.height;
      const cr = cw / ch;
      let dw = cw;
      let dh = ch;
      if (ir > cr) dh = cw / ir;
      else dw = ch * ir;
      ctx!.clearRect(0, 0, cw, ch);
      ctx!.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }
    function measure() {
      const total = track!.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-track!.getBoundingClientRect().top, 0), total);
      target = total > 0 ? scrolled / total : 0;
    }
    function tick() {
      cur += (target - cur) * LERP;
      if (Math.abs(target - cur) < 0.0002) cur = target;
      const idx = Math.min(N - 1, Math.max(0, Math.round(cur * (N - 1))));
      drawCover(frames[idx]);
      for (let i = 0; i < beats.length; i++) {
        const el = capRefs.current[i];
        if (!el) continue;
        const d = Math.abs(cur - beats[i].at);
        const op = Math.max(0, 1 - d * 6);
        el.style.opacity = op.toFixed(3);
        el.style.transform = `translateY(${((1 - op) * 16).toFixed(1)}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    resize();
    measure();
    cur = target;
    const onScroll = () => measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [hasData, reduced, ready, data]);

  if (!hasData) return null;

  // Static fallback: reduced motion → just the poster, no pinning/scrub.
  if (reduced) {
    return (
      <section className="bg-ink text-white" aria-label={`${name} — vue extérieure et habitacle`}>
        <Container className="py-16 lg:py-24">
          <Eyebrow>Vue 360°</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-[-0.02em]">
            {name} sous tous les angles
          </h2>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[16px]">
            <Image src={data!.poster} alt={`${name} — vue extérieure`} fill sizes="100vw" className="object-cover" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-ink text-white" aria-label={`${name} — vue 360° et habitacle`}>
      <div ref={trackRef} className="relative" style={{ height: `${PIN_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          {/* Poster + loading state until frames are decoded */}
          {!ready && (
            <div className="absolute inset-0">
              <Image src={data!.poster} alt={`${name} — vue extérieure`} fill priority sizes="100vw" className="object-cover opacity-80" />
              <div className="absolute bottom-8 left-0 right-0 text-center font-mono text-xs tracking-[0.14em] text-white/70">
                CHARGEMENT {progressPct}%
              </div>
            </div>
          )}
          {/* Beat captions */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[8vh] px-[8vw]">
            <h2 className="sr-only">{name} — vue 360° et habitacle</h2>
            {data!.beats.map((b, i) => (
              <div
                key={b.eyebrow}
                ref={(el) => {
                  capRefs.current[i] = el;
                }}
                className="absolute inset-x-[8vw] bottom-0 opacity-0"
              >
                <div className="flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.2em] text-azure-hi">
                  {b.eyebrow}
                </div>
                <p className="mt-2 font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-none tracking-[-0.02em]">
                  {b.title}
                </p>
                {b.text && <p className="mt-2 max-w-[40ch] text-[clamp(1rem,1.6vw,1.3rem)] text-sky">{b.text}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
