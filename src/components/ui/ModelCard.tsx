import Image from "next/image";
import Link from "next/link";
import type { Model } from "@/content/types";
import { DiamondMark } from "./DiamondMark";

export function ModelCard({ model }: { model: Model }) {
  return (
    <Link
      href={`/modeles/${model.slug}`}
      className="group block rounded-[16px] border border-sky bg-panel p-6 transition-[transform,box-shadow,border-color] duration-200 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-brand hover:shadow-[0_24px_40px_rgba(15,42,77,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2"
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

      <div className="mt-5 flex items-center justify-between">
        <span className="font-brand text-xl tracking-wide text-ink">
          {model.nameplate}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Découvrir
          <DiamondMark className="h-2.5 w-2.5 text-brand" />
        </span>
      </div>
    </Link>
  );
}
