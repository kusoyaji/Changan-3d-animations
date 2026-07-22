"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DiamondMark } from "@/components/ui/DiamondMark";
import { modelNavItems } from "@/content/modelNav";
import { cn } from "@/lib/cn";

// Desktop "Modèles" mega-menu: hovering (or focusing) the trigger opens a
// panel with the model list on the left and a live preview — crossfading
// cutout, key specs, price, CTA — on the right. CSS-transition motion only
// (opacity + transform), keyboard + Escape + outside-click aware.
export function ModelsMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(modelNavItems[0]?.slug ?? "");
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openMenu = () => {
    cancelClose();
    setOpen(true);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const activeItem = modelNavItems.find((m) => m.slug === active) ?? modelNavItems[0];

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-[6px] text-[15px] text-ink/80 transition-colors duration-150 ease-[var(--ease-out)] hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 data-[open=true]:text-brand"
        data-open={open}
      >
        Modèles
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn(
            "h-4 w-4 transition-transform duration-200 ease-[var(--ease-out)]",
            open ? "rotate-180" : "rotate-0",
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Panel */}
      <div
        role="menu"
        aria-label="Modèles Changan"
        className={cn(
          "absolute left-0 top-full z-50 mt-3 w-[min(90vw,760px)] origin-top-left rounded-[20px] border border-sky bg-white/95 p-3 shadow-[0_30px_70px_rgba(15,42,77,0.20)] backdrop-blur-xl transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0",
        )}
      >
        <div className="grid grid-cols-[minmax(0,232px)_1fr] gap-3">
          {/* Model list. */}
          <ul className="flex flex-col gap-0.5">
            {modelNavItems.map((m) => {
              const on = m.slug === active;
              return (
                <li key={m.slug}>
                  <Link
                    href={`/modeles/${m.slug}`}
                    role="menuitem"
                    tabIndex={open ? 0 : -1}
                    onMouseEnter={() => setActive(m.slug)}
                    onFocus={() => setActive(m.slug)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center justify-between rounded-[12px] px-4 py-3 transition-colors duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure",
                      on ? "bg-field" : "hover:bg-field/60",
                    )}
                  >
                    <span
                      className={cn(
                        "font-brand text-lg tracking-wide transition-colors duration-150",
                        on ? "text-brand" : "text-ink/80 group-hover:text-ink",
                      )}
                    >
                      {m.nameplate}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={cn(
                        "h-4 w-4 text-brand transition-all duration-200 ease-[var(--ease-out)]",
                        on ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
                      )}
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Live preview. */}
          <Link
            href={`/modeles/${activeItem.slug}`}
            onClick={() => setOpen(false)}
            className="group relative flex flex-col overflow-hidden rounded-[16px] border border-sky bg-field focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            {/* Crossfading cutout on a soft brand glow. */}
            <div className="relative h-[172px] w-full overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(70% 80% at 70% 60%, rgba(26,95,208,0.14), transparent 62%)",
                }}
              />
              {modelNavItems.map((m) => (
                <Image
                  key={m.slug}
                  src={m.image}
                  alt=""
                  aria-hidden={m.slug !== active}
                  fill
                  sizes="560px"
                  className={cn(
                    "object-contain p-4 transition-opacity duration-300 ease-[var(--ease-out)]",
                    m.slug === active ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </div>

            {/* Info — re-keyed so it re-animates on model change. */}
            <div key={activeItem.slug} className="border-t border-sky bg-white/70 p-5">
              <div
                style={{ animation: "fade-up 300ms var(--ease-out) both" }}
                className="motion-reduce:animate-none"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
                    {activeItem.name}
                  </span>
                  {activeItem.price ? (
                    <span className="font-mono text-xs text-muted">dès {activeItem.price}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-snug text-muted">{activeItem.tagline}</p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {activeItem.highlights.map((h) => (
                    <div key={h.label} className="border-l border-sky pl-3">
                      <div className="font-display text-base font-bold leading-tight text-ink">
                        {h.value}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                        {h.label}
                      </div>
                    </div>
                  ))}
                </div>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Découvrir le {activeItem.name}
                  <DiamondMark className="h-2.5 w-2.5 text-brand transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-2 border-t border-sky px-4 pt-3">
          <Link
            href="/modeles"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors duration-150 hover:text-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
          >
            Toute la gamme
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
