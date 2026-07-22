import { DiamondMark } from "./DiamondMark";

// `tone="dark"` recolors the eyebrow for placement on dark (ink) backgrounds,
// where the default brand blue would fail contrast.
export function Eyebrow({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const color = tone === "dark" ? "text-azure-hi" : "text-brand";
  return (
    <span className={`inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] ${color}`}>
      <DiamondMark className={`h-3.5 w-3.5 ${color}`} />
      {children}
    </span>
  );
}
