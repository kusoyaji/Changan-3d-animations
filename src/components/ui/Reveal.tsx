"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Always start at `false` so client hydration matches the server-rendered
  // markup (the server can't read matchMedia); the effect below syncs from
  // the real browser preference right after mount.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    // Respect reduced-motion: reveal immediately instead of gating on scroll.
    // This also keeps full-page captures (visual tests, print, etc.) from
    // freezing below-the-fold content at opacity 0. This is a one-time sync
    // from an external system (matchMedia) on mount, not render-driven state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time sync from matchMedia on mount
      setShown(true);
      return;
    }
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn(className)}
      style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(20px)",
        transition: "opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out)", transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
