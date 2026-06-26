import { DiamondMark } from "./DiamondMark";
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-brand">
      <DiamondMark className="h-3.5 w-3.5 text-brand" />
      {children}
    </span>
  );
}
