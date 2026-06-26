import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  variant?: "primary" | "outline";
  href?: string;
  className?: string;
  children: React.ReactNode;
};
const base =
  "inline-flex items-center justify-center rounded-[10px] px-7 py-4 text-[15px] font-semibold transition-[transform,background-color,box-shadow] duration-150 ease-[var(--ease-out)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2";
const variants = {
  primary: "bg-azure text-white shadow-[0_8px_22px_rgba(26,95,208,0.28)] hover:bg-azure-hi",
  outline: "border-[1.5px] border-sky text-brand bg-white hover:border-brand",
};
export function Button({ variant = "primary", href, className, children }: Props) {
  const cls = cn(base, variants[variant], className);
  return href ? <Link href={href} className={cls}>{children}</Link> : <button className={cls}>{children}</button>;
}
