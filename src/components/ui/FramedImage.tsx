"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

// Sizes its own frame to the image's TRUE aspect ratio, measured on load. With
// object-cover on a frame that matches the image, the picture fills edge-to-edge
// with zero crop and zero stretch — "exactly the right size" for any source.
// `fallbackRatio` (w/h) sets the frame before the image reports its dimensions,
// so there is no layout jump for images that already match it.
export function FramedImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  fallbackRatio = 1.5,
  className,
  imgClassName,
}: {
  readonly src: string;
  readonly alt: string;
  readonly sizes?: string;
  readonly priority?: boolean;
  readonly fallbackRatio?: number;
  readonly className?: string;
  readonly imgClassName?: string;
}) {
  const [ratio, setRatio] = useState<number | null>(null);
  return (
    <div
      className={cn("relative w-full overflow-hidden bg-panel", className)}
      style={{ aspectRatio: String(ratio ?? fallbackRatio) }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imgClassName)}
        onLoad={(e) => {
          const el = e.currentTarget;
          if (el.naturalWidth && el.naturalHeight) setRatio(el.naturalWidth / el.naturalHeight);
        }}
      />
    </div>
  );
}
