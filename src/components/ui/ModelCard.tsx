import Image from "next/image";
import Link from "next/link";
import type { Model } from "@/content/types";
import { modelHighlights } from "@/content/modelNav";
import { DiamondMark } from "./DiamondMark";

export function ModelCard({ model }: { model: Model }) {
  const specs = modelHighlights(model);

  return (
    <Link
      href={`/modeles/${model.slug}`}
      className="group flex flex-col rounded-[16px] border border-sky bg-panel p-6 transition-[transform,box-shadow,border-color] duration-200 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-brand hover:shadow-[0_24px_40px_rgba(15,42,77,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-white">
        <Image
          src={model.heroDesktop}
          alt={model.name}
          fill
          className="object-contain p-2 transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate font-brand text-xl tracking-wide text-ink">
          {model.nameplate}
        </span>
        {model.price ? (
          <span className="shrink-0 whitespace-nowrap text-right font-mono text-sm text-brand">
            dès {model.price}
          </span>
        ) : null}
      </div>

      {specs.length > 0 ? (
        <ul className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-muted">
          {specs.map((s, i) => (
            <li key={s.label} className="inline-flex items-center gap-2.5">
              {i > 0 ? <span aria-hidden="true" className="text-sky">·</span> : null}
              <span className="text-ink/70">{s.value}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="min-w-0 truncate text-sm text-muted">{model.tagline}</span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand">
          Découvrir
          <DiamondMark className="h-2.5 w-2.5 text-brand transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
