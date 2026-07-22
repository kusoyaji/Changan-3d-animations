"use client";

import { useState } from "react";

// Styled slot for a client-provided Zoho form iframe. Reserves vertical space
// up-front (no layout shift) and fades the iframe in once it loads, with a
// skeleton shimmer underneath meanwhile. The opacity transition is clamped by
// the global reduced-motion rule.
export function LeadFormEmbed({
  src,
  title,
  minHeight = 1180,
}: {
  src: string;
  title: string;
  minHeight?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return (
      <div className="rounded-[16px] border border-sky bg-panel p-8 text-center">
        <p className="text-muted">Le formulaire sera bientôt disponible.</p>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-[16px] border border-sky bg-white shadow-[0_24px_50px_rgba(15,42,77,0.08)]"
      style={{ minHeight }}
    >
      {!loaded ? (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-panel">
          <div className="space-y-4 p-8">
            <div className="h-3 w-1/3 rounded bg-sky" />
            <div className="h-11 w-full rounded bg-sky/70" />
            <div className="h-11 w-full rounded bg-sky/70" />
            <div className="h-11 w-2/3 rounded bg-sky/70" />
          </div>
        </div>
      ) : null}

      <iframe
        src={src}
        title={title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="relative block h-full w-full transition-opacity duration-500 ease-[var(--ease-out)]"
        style={{ minHeight, opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
