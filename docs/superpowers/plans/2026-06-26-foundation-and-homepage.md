# Foundation + Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js project with the ATLAS design system fully wired (fonts, color tokens, motion), global Header/Footer, and a complete, responsive homepage.

**Architecture:** Next.js App Router (TypeScript) with Tailwind CSS v4 CSS-first theming. Brand assets are served from `public/`. Content is typed data in `src/content/`. Components are split by responsibility: `ui/` primitives, `layout/` chrome, `sections/` page blocks. Motion follows Emil Kowalski's rules (ease-out, ≤300ms, transform/opacity only, reduced-motion honored). Verification combines `next build`, Vitest + React Testing Library unit tests for logic/render, and Playwright visual smoke checks.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, `next/font`, `next/image`, Vitest, @testing-library/react, Playwright.

## Global Constraints

- Framework: **Next.js App Router** + **TypeScript strict** + **Tailwind CSS v4**. No CMS, no database.
- Language: **French only**. All UI copy in French. `<html lang="fr">`. No i18n routing, no RTL.
- Color tokens (verbatim): brand `#134A87`, azure `#1A5FD0`, azure-hi `#2D74E6`, ink `#0F2A4D`, muted `#54637C`, field `#ECF1F8`, panel `#F7FAFD`, sky `#DBE6F5`, white `#FFFFFF`.
- Typography: display **Bricolage Grotesque**, body **Inter Tight**, data/mono **IBM Plex Mono**, brand **ChangAn unitype** (local, `public/changan-font/`, model nameplates/brand moments only).
- Motion: easing `cubic-bezier(0.23, 1, 0.32, 1)`; durations 160/200/300ms; animate only `transform`/`opacity`; press `active:scale-[0.97]`; honor `prefers-reduced-motion`.
- Accessibility: WCAG AA — 4.5:1 contrast, visible `:focus-visible` rings, labeled controls, 44px min touch targets, alt text on meaningful images.
- All raster brand assets rendered via `next/image`. Verify layouts at 375 / 768 / 1024 / 1440px.
- Frequent commits: one commit per task.

---

### Task 1: Scaffold project + tooling

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/lib/__tests__/smoke.test.ts`, `src/lib/cn.ts`
- Note: `create-next-app` scaffolds into the existing directory; keep `public/` and `docs/` intact.

**Interfaces:**
- Produces: `cn(...classes)` class-merge helper in `src/lib/cn.ts`; working `npm run dev|build|test|test:e2e` scripts.

- [ ] **Step 1: Scaffold Next.js into the current directory**

Run (answer prompts: TypeScript yes, ESLint yes, Tailwind yes, `src/` yes, App Router yes, import alias `@/*`):
```bash
npx create-next-app@latest . --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```
If it refuses due to non-empty dir, scaffold in a temp dir and copy `src/`, config files, and `package.json` over (do not overwrite `public/`, `docs/`, `.gitignore`).

- [ ] **Step 2: Add test tooling**

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
npx playwright install chromium
```

- [ ] **Step 3: Add the class-merge helper**

`src/lib/cn.ts`:
```ts
type ClassValue = string | false | null | undefined;
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 4: Configure Vitest**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```
`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```
Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:e2e": "playwright test"`.

- [ ] **Step 5: Write the smoke test**

`src/lib/__tests__/smoke.test.ts`:
```ts
import { cn } from "@/lib/cn";
test("cn filters falsy values", () => {
  expect(cn("a", false, "b", undefined)).toBe("a b");
});
```

- [ ] **Step 6: Run tests + build to verify the toolchain**

Run: `npm run test` — Expected: 1 passed.
Run: `npm run build` — Expected: build completes with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind v4 + test tooling"
```

---

### Task 2: Fonts + ATLAS design tokens

**Files:**
- Create: `src/app/fonts.ts`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Test: `e2e/tokens.spec.ts`

**Interfaces:**
- Produces: exported `bricolage`, `interTight`, `plexMono`, `changan` font objects each exposing `.variable`; Tailwind theme tokens `--color-brand|azure|azure-hi|ink|muted|field|panel|sky`, `--font-display|body|mono|brand`, `--ease-out`, radii.

- [ ] **Step 1: Define fonts**

`src/app/fonts.ts`:
```ts
import { Bricolage_Grotesque, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

export const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500","600","700","800"], variable: "--font-display", display: "swap" });
export const interTight = Inter_Tight({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-body", display: "swap" });
export const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400","500"], variable: "--font-mono", display: "swap" });
export const changan = localFont({
  src: [
    { path: "../../public/changan-font/ChangAnunitype-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/changan-font/ChangAnunitype-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/changan-font/ChangAnunitype-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-brand", display: "swap",
});
```

- [ ] **Step 2: Write the token theme**

Replace `src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-brand: #134A87;
  --color-azure: #1A5FD0;
  --color-azure-hi: #2D74E6;
  --color-ink: #0F2A4D;
  --color-muted: #54637C;
  --color-field: #ECF1F8;
  --color-panel: #F7FAFD;
  --color-sky: #DBE6F5;

  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
  --font-brand: var(--font-brand);

  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --radius-card: 16px;
}

:root { color-scheme: light; }
html { -webkit-font-smoothing: antialiased; }
body { background: var(--color-field); color: var(--color-ink); font-family: var(--font-body), system-ui, sans-serif; }

@keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 3: Apply font variables in the root layout**

In `src/app/layout.tsx`, set `<html lang="fr" className={`${bricolage.variable} ${interTight.variable} ${plexMono.variable} ${changan.variable}`}>` importing the fonts from `./fonts`.

- [ ] **Step 4: Write the token e2e test**

`e2e/tokens.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
test("brand token resolves", async ({ page }) => {
  await page.goto("/");
  const brand = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim()
  );
  expect(brand.toLowerCase()).toBe("#134a87");
});
```
`playwright.config.ts` must set `use.baseURL = "http://localhost:3000"` and a `webServer` running `npm run dev`.

- [ ] **Step 5: Verify**

Run: `npm run build` — Expected: success.
Run: `npm run test:e2e` — Expected: token test passes.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: wire ATLAS fonts and color tokens"
```

---

### Task 3: UI primitives — Button, Container, Eyebrow, DiamondMark, Reveal

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Container.tsx`, `src/components/ui/Eyebrow.tsx`, `src/components/ui/DiamondMark.tsx`, `src/components/ui/Reveal.tsx`
- Test: `src/components/ui/__tests__/Button.test.tsx`, `src/components/ui/__tests__/Reveal.test.tsx`

**Interfaces:**
- Produces:
  - `Button({ variant?: "primary" | "outline"; href?: string; children; className? })` — renders `<a>` when `href` set, else `<button>`.
  - `Container({ children; className? })` — `mx-auto max-w-[1280px] px-6`.
  - `Eyebrow({ children })` — mono, uppercase, brand color, with leading `DiamondMark`.
  - `DiamondMark({ className? })` — rotated-square SVG glyph.
  - `Reveal({ children; delay?: number; as?: keyof JSX.IntrinsicElements })` — fades children up on first view via IntersectionObserver.

- [ ] **Step 1: Write the Button test**

`src/components/ui/__tests__/Button.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

test("renders a link when href is provided", () => {
  render(<Button href="/essai">Réserver un essai</Button>);
  const el = screen.getByRole("link", { name: "Réserver un essai" });
  expect(el).toHaveAttribute("href", "/essai");
});
test("primary variant uses azure background", () => {
  render(<Button>Go</Button>);
  expect(screen.getByRole("button")).toHaveClass("bg-azure");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- Button` — Expected: FAIL (module not found).

- [ ] **Step 3: Implement Button**

`src/components/ui/Button.tsx`:
```tsx
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
```

- [ ] **Step 4: Implement Container, Eyebrow, DiamondMark**

`src/components/ui/Container.tsx`:
```tsx
import { cn } from "@/lib/cn";
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1280px] px-6", className)}>{children}</div>;
}
```
`src/components/ui/DiamondMark.tsx`:
```tsx
export function DiamondMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
```
`src/components/ui/Eyebrow.tsx`:
```tsx
import { DiamondMark } from "./DiamondMark";
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-brand">
      <DiamondMark className="h-3.5 w-3.5 text-brand" />
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Implement Reveal (with reduced-motion test)**

`src/components/ui/__tests__/Reveal.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/ui/Reveal";
beforeAll(() => {
  // jsdom has no IntersectionObserver
  // @ts-expect-error test stub
  global.IntersectionObserver = class { observe(){} disconnect(){} unobserve(){} };
});
test("renders children", () => {
  render(<Reveal><p>Bonjour</p></Reveal>);
  expect(screen.getByText("Bonjour")).toBeInTheDocument();
});
```
`src/components/ui/Reveal.tsx`:
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
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
```

- [ ] **Step 6: Run tests + verify pass**

Run: `npm run test` — Expected: Button + Reveal tests pass.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add UI primitives (Button, Container, Eyebrow, DiamondMark, Reveal)"
```

---

### Task 4: Content model + site/showroom/model data

**Files:**
- Create: `src/content/types.ts`, `src/content/site.ts`, `src/content/showrooms.ts`, `src/content/models/index.ts`, `src/content/models/cs55-phev.ts`
- Test: `src/content/__tests__/content.test.ts`

**Interfaces:**
- Produces:
  - `type Model = { slug; name; nameplate; tagline; heroDesktop; heroMobile; colorVariants; comfort; equipment; gallery; specs; pdf?; price?; hasSpin; spinFrames? }` (see code).
  - `getModel(slug: string): Model | undefined`, `allModels: Model[]`, `modelSlugs: string[]`.
  - `site` (nav, phone, social, leadForms), `showrooms: Showroom[]`.

- [ ] **Step 1: Write the content test**

`src/content/__tests__/content.test.ts`:
```ts
import { allModels, getModel, modelSlugs } from "@/content/models";
import { showrooms } from "@/content/showrooms";
test("six model slugs are defined", () => {
  expect(modelSlugs).toEqual(
    expect.arrayContaining(["cs55-phev","cs55","cs35-plus","cs15","uni-k","alsvin"])
  );
});
test("getModel returns the CS55 PHEV with a hero image", () => {
  const m = getModel("cs55-phev");
  expect(m?.heroDesktop).toMatch(/\.(png|webp|jpg)$/);
});
test("eight showrooms are defined", () => {
  expect(showrooms).toHaveLength(8);
});
```

- [ ] **Step 2: Define types**

`src/content/types.ts`:
```ts
export type ColorVariant = { label: string; hex: string; image: string };
export type Feature = { title: string; text?: string; image: string };
export type Spec = { group: string; label: string; value: string };
export type Model = {
  slug: string; name: string; nameplate: string; tagline: string;
  heroDesktop: string; heroMobile: string;
  colorVariants: ColorVariant[]; comfort: Feature[]; equipment: Feature[];
  gallery: string[]; specs: Spec[]; pdf?: string; price?: string;
  hasSpin: boolean; spinFrames?: string[];
};
export type Showroom = { slug: string; city: string; address: string; phone: string; hours: string; image: string; mapEmbed?: string };
```

- [ ] **Step 3: Implement model registry + CS55 PHEV data**

`src/content/models/cs55-phev.ts` (use real asset paths from `public/`):
```ts
import type { Model } from "../types";
export const cs55Phev: Model = {
  slug: "cs55-phev", name: "CS55 PHEV", nameplate: "CS55 PHEV",
  tagline: "Plus loin, en silence.",
  heroDesktop: "/images/vehicles/cs55-phev-home-v2.png",
  heroMobile: "/images/vehicles/cs55-phev-home-mobile.png",
  colorVariants: [
    { label: "Blanc", hex: "#EDEDED", image: "/images/model/banner/CS55-PHEV changan-blanc-metallic-fond-blanc.png" },
    { label: "Gris clair", hex: "#B9BEC4", image: "/images/model/banner/CS55-PHEV changan-gris-clair-metallic-fond-blanc.png" },
    { label: "Gris foncé", hex: "#54595F", image: "/images/model/banner/CS55-PHEV changan-gris-fonce-metallic-fond-blanc.png" },
    { label: "Noir", hex: "#16181B", image: "/images/model/banner/CS55-PHEV changan-noir-metallic-fond-blanc.png" },
  ],
  comfort: [
    { title: "Écran tactile 12.3\"", image: "/images/model/comfort/CS55 PHEV Ecran tactile 12.3'.jpg" },
    { title: "Toit ouvrant panoramique", image: "/images/model/comfort/CS55 PHEV Toit ouvrant panoramique.jpg" },
    { title: "Caméra 540°", image: "/images/model/comfort/CS55 PHEV Caméra 540°.jpg" },
  ],
  equipment: [
    { title: "Feux avant à LED", image: "/images/model/equipment/CS55-PHEV FEUX AVANT LED.jpg" },
    { title: "Jantes en aluminium", image: "/images/model/equipment/CS55-PHEV JANTES EN ALU.jpg" },
  ],
  gallery: [
    "/images/model/gallery/CS55 PHEV 2 face droite.png",
    "/images/model/gallery/CS55 PHEV arriere.png",
    "/images/model/gallery/CS55PHEV 1 arriere droite.png",
  ],
  specs: [
    { group: "Motorisation", label: "Type", value: "Hybride rechargeable" },
    { group: "Autonomie", label: "Combinée", value: "1 100 km" },
    { group: "Performance", label: "0–100 km/h", value: "8,5 s" },
  ],
  hasSpin: true,
  spinFrames: ["00","01","02","03","04"].map(n => `/images/model/cs55-phev/spin/frame-${n}.webp`),
};
```
`src/content/models/index.ts`:
```ts
import type { Model } from "../types";
import { cs55Phev } from "./cs55-phev";
// Stubs for the remaining five — full data filled in the Models phase.
const stub = (slug: string, name: string, hero: string): Model => ({
  slug, name, nameplate: name, tagline: "", heroDesktop: hero, heroMobile: hero,
  colorVariants: [], comfort: [], equipment: [], gallery: [], specs: [], hasSpin: false,
});
export const allModels: Model[] = [
  cs55Phev,
  stub("cs55", "CS55", "/images/vehicles/cs55.webp"),
  stub("cs35-plus", "CS35 PLUS", "/images/vehicles/cs35.webp"),
  stub("cs15", "CS15", "/images/vehicles/cs15.webp"),
  stub("uni-k", "UNI-K", "/images/vehicles/unik.webp"),
  stub("alsvin", "ALSVIN", "/images/vehicles/alsvin.webp"),
];
export const modelSlugs = allModels.map(m => m.slug);
export const getModel = (slug: string) => allModels.find(m => m.slug === slug);
```

- [ ] **Step 4: Implement site + showrooms data**

`src/content/site.ts`:
```ts
export const site = {
  phone: "+212 5 22 00 00 00",
  nav: [
    { label: "Modèles", href: "/modeles" },
    { label: "Hybride", href: "/hybride" },
    { label: "Showrooms", href: "/showrooms" },
    { label: "Essai", href: "/essai" },
    { label: "Reprise", href: "/reprise" },
  ],
  social: [
    { label: "Facebook", href: "#", icon: "/images/icons/facebook.svg" },
    { label: "Instagram", href: "#", icon: "/images/icons/instagram.svg" },
    { label: "LinkedIn", href: "#", icon: "/images/icons/linkedin.svg" },
  ],
  leadForms: { essai: "", reprise: "", contact: "" }, // iframe URLs supplied later
};
```
`src/content/showrooms.ts` — 8 entries (Casablanca, Rabat, Tanger, Marrakech, Kenitra, Mohammedia, El Jadida, Tetouan) using `/images/model/localisation/showroom-<city>.webp`; address/phone/hours as `"À confirmer"` placeholders (tracked in spec §9). Each: `{ slug, city, address: "À confirmer", phone: site.phone, hours: "Lun–Sam 9h–19h", image }`.

- [ ] **Step 5: Run tests + verify pass**

Run: `npm run test -- content` — Expected: all content tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add typed content model, site, showrooms, CS55 PHEV data"
```

---

### Task 5: Header + MegaNav

**Files:**
- Create: `src/components/layout/Header.tsx`
- Test: `src/components/layout/__tests__/Header.test.tsx`

**Interfaces:**
- Consumes: `site.nav`, `site.phone`; `Button`, `Container`.
- Produces: `<Header />` — sticky, blue logo (`/images/logo-blue.svg` added to `public/images/`), nav links, phone, "Réserver un essai" CTA, mobile menu toggle. Scroll-condense via a `data-scrolled` attribute toggled past 24px.

- [ ] **Step 1: Add the blue logo asset**

Copy `public/images/logo.svg` → `public/images/logo-blue.svg` and replace `fill: #fff` with `fill: #134A87` (matches Header on light background).

- [ ] **Step 2: Write the Header test**

```tsx
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/Header";
test("renders nav links and the primary CTA", () => {
  render(<Header />);
  expect(screen.getByRole("link", { name: "Modèles" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Réserver un essai" })).toBeInTheDocument();
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- Header` — Expected: FAIL (module not found).

- [ ] **Step 4: Implement Header**

`src/components/layout/Header.tsx` — `"use client"`; `Image` for the blue logo (h-7); `nav` mapping `site.nav` (text-ink/80, hover text-brand); phone link `text-brand font-semibold`; `<Button href="/essai">Réserver un essai</Button>`; a mobile hamburger that toggles a `useState` panel (links stacked). Sticky `top-0 z-40 bg-field/80 backdrop-blur border-b border-sky`; on scroll add denser padding. All interactive elements ≥44px, `focus-visible` rings.

- [ ] **Step 5: Run test + verify pass**

Run: `npm run test -- Header` — Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add sticky Header with nav and CTA"
```

---

### Task 6: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Test: `src/components/layout/__tests__/Footer.test.tsx`

**Interfaces:**
- Consumes: `site.social`, `showrooms`, `Container`.
- Produces: `<Footer />` — deep-navy (`bg-ink text-white`) section: brand column, showroom cities list, social icons, legal links + copyright.

- [ ] **Step 1: Write the Footer test**

```tsx
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
test("renders social links and legal", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: /facebook/i })).toBeInTheDocument();
  expect(screen.getByText(/Mentions légales/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails** — `npm run test -- Footer` → FAIL.

- [ ] **Step 3: Implement Footer** — `bg-ink text-white`; columns via `Container`; social icons as `Image` with `aria-label`; cities mapped from `showrooms`; legal links to `/mentions-legales`, `/confidentialite`; `© {year} Changan Maroc`.

- [ ] **Step 4: Run test + verify pass** — `npm run test -- Footer` → PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Footer"
```

---

### Task 7: Root layout assembly

**Files:**
- Modify: `src/app/layout.tsx`
- Test: `e2e/shell.spec.ts`

**Interfaces:**
- Consumes: `Header`, `Footer`, fonts.
- Produces: metadata base (title template `%s · Changan Maroc`, description, `metadataBase`, OG `/images/og.png`), `<Header/> <main> {children} </main> <Footer/>`.

- [ ] **Step 1: Write the shell e2e test**

`e2e/shell.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
test("header and footer render on home", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Réserver un essai" })).toBeVisible();
  await expect(page.getByText(/Mentions légales/i)).toBeVisible();
});
```

- [ ] **Step 2: Implement layout** — compose Header/main/Footer; export `metadata` with the OG config above; keep font variables on `<html lang="fr">`.

- [ ] **Step 3: Verify** — `npm run build` → success; `npm run test:e2e -- shell` → PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: assemble root layout with header, footer, metadata"
```

---

### Task 8: HomeHero (ATLAS)

**Files:**
- Create: `src/components/sections/HomeHero.tsx`
- Test: `src/components/sections/__tests__/HomeHero.test.tsx`

**Interfaces:**
- Consumes: `Container`, `Eyebrow`, `Button`, `Reveal`, `getModel`, `next/image`.
- Produces: `<HomeHero />` — light field, eyebrow "Conçue pour la route marocaine", display headline "Le voyage, réinventé." (period in azure), subtext, primary + outline CTAs, hero render via `Image` (priority), frosted spec strip (CS55 PHEV · 1 100 km · 8 villes). Port from approved `atlas-v3.html`.

- [ ] **Step 1: Write the HomeHero test**

```tsx
import { render, screen } from "@testing-library/react";
import { HomeHero } from "@/components/sections/HomeHero";
test("renders headline and both CTAs", () => {
  render(<HomeHero />);
  expect(screen.getByText(/Le voyage/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Réserver un essai" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explorer la gamme" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails** — `npm run test -- HomeHero` → FAIL.

- [ ] **Step 3: Implement HomeHero** — section with the radial light background (CSS in `globals.css` utility or inline `style`), `Container`, headline using `font-display text-ink text-[clamp(2.4rem,6vw,4.1rem)] font-bold leading-[0.98] tracking-[-0.025em]` with `<span className="text-azure">.</span>`; CTAs `<Button href="/essai">Réserver un essai</Button>` and `<Button variant="outline" href="/modeles">Explorer la gamme</Button>`; hero `Image` `priority` with `alt="Changan CS55 PHEV"`; spec strip as a frosted bar (`bg-white/70 backdrop-blur border-t border-sky`) with mono labels + azure diamonds; entrance via `Reveal` with staggered `delay`.

- [ ] **Step 4: Run test + verify pass** — `npm run test -- HomeHero` → PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add ATLAS HomeHero"
```

---

### Task 9: Lineup + ModelCard

**Files:**
- Create: `src/components/sections/Lineup.tsx`, `src/components/ui/ModelCard.tsx`
- Test: `src/components/sections/__tests__/Lineup.test.tsx`

**Interfaces:**
- Consumes: `allModels`, `Container`, `Eyebrow`, `Reveal`, `next/image`, `next/link`.
- Produces: `<Lineup />` rendering one `<ModelCard model={m} />` per model. `ModelCard` — panel card, model render `Image`, model logo (`/images/vehicles/<slug>-logo.svg` where present, else nameplate in `font-brand`), name, link to `/modeles/<slug>`, hover lift (`hover:-translate-y-1 transition-transform ease-[var(--ease-out)]`).

- [ ] **Step 1: Write the Lineup test**

```tsx
import { render, screen } from "@testing-library/react";
import { Lineup } from "@/components/sections/Lineup";
test("renders a card linking to each of the six models", () => {
  render(<Lineup />);
  expect(screen.getByRole("link", { name: /CS55 PHEV/ })).toHaveAttribute("href", "/modeles/cs55-phev");
  expect(screen.getAllByRole("link", { name: /CS|UNI|ALSVIN/ }).length).toBeGreaterThanOrEqual(6);
});
```

- [ ] **Step 2: Run test to verify it fails** — `npm run test -- Lineup` → FAIL.

- [ ] **Step 3: Implement ModelCard + Lineup** — responsive grid (`grid sm:grid-cols-2 lg:grid-cols-3 gap-6`); section eyebrow "La gamme"; heading "Trouvez votre Changan"; cards from `allModels`.

- [ ] **Step 4: Run test + verify pass** — `npm run test -- Lineup` → PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add model Lineup and ModelCard"
```

---

### Task 10: HybridHighlight, ShowroomTeaser, LeadCta sections

**Files:**
- Create: `src/components/sections/HybridHighlight.tsx`, `src/components/sections/ShowroomTeaser.tsx`, `src/components/sections/LeadCta.tsx`
- Test: `src/components/sections/__tests__/HomeSections.test.tsx`

**Interfaces:**
- Consumes: `Container`, `Eyebrow`, `Button`, `Reveal`, `showrooms`, `next/image`.
- Produces:
  - `<HybridHighlight />` — deep-navy (`bg-ink text-white`) section pitching PHEV; stat trio (1 100 km / 4,5 L / 540°); CTA to `/hybride`.
  - `<ShowroomTeaser />` — "8 villes, 8 showrooms"; city chips from `showrooms`; CTA to `/showrooms`.
  - `<LeadCta />` — azure-to-ink band; "Prêt à prendre le volant ?"; CTAs to `/essai` and `/reprise`.

- [ ] **Step 1: Write the sections test**

```tsx
import { render, screen } from "@testing-library/react";
import { HybridHighlight } from "@/components/sections/HybridHighlight";
import { ShowroomTeaser } from "@/components/sections/ShowroomTeaser";
import { LeadCta } from "@/components/sections/LeadCta";
test("hybrid highlight links to /hybride", () => {
  render(<HybridHighlight />);
  expect(screen.getByRole("link", { name: /hybride/i })).toHaveAttribute("href", "/hybride");
});
test("showroom teaser links to /showrooms", () => {
  render(<ShowroomTeaser />);
  expect(screen.getByRole("link", { name: /showrooms/i })).toHaveAttribute("href", "/showrooms");
});
test("lead CTA offers an essai link", () => {
  render(<LeadCta />);
  expect(screen.getByRole("link", { name: /essai/i })).toHaveAttribute("href", "/essai");
});
```

- [ ] **Step 2: Run test to verify it fails** — `npm run test -- HomeSections` → FAIL.

- [ ] **Step 3: Implement the three sections** per interfaces above, using established primitives and tokens.

- [ ] **Step 4: Run test + verify pass** — `npm run test -- HomeSections` → PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add hybrid, showroom teaser, and lead CTA sections"
```

---

### Task 11: Compose homepage + SEO + visual verification

**Files:**
- Modify: `src/app/page.tsx`
- Create: `e2e/home.spec.ts`

**Interfaces:**
- Consumes: all `sections/*`.
- Produces: homepage composing `HomeHero → Lineup → HybridHighlight → ShowroomTeaser → LeadCta`; page `metadata` (title "Changan Maroc — Voitures, SUV & hybrides", description).

- [ ] **Step 1: Compose `src/app/page.tsx`** — render the five sections in order; export `metadata`.

- [ ] **Step 2: Write the home e2e + visual test**

`e2e/home.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
for (const [w, h] of [[1440,900],[768,1024],[375,812]] as const) {
  test(`home renders at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    await expect(page.getByText(/Le voyage/)).toBeVisible();
    await expect(page.getByRole("link", { name: /CS55 PHEV/ }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({ path: `e2e/__screens__/home-${w}.png`, fullPage: true });
  });
}
```

- [ ] **Step 3: Run full verification**

Run: `npm run build` — Expected: success, no type errors.
Run: `npm run test` — Expected: all unit tests pass.
Run: `npm run test:e2e` — Expected: token, shell, and home specs pass; no horizontal scroll at any breakpoint.

- [ ] **Step 4: Review screenshots**

Open `e2e/__screens__/home-1440.png`, `home-768.png`, `home-375.png`. Confirm: blue logo visible, headline legible, azure CTAs, lineup grid intact, deep-navy sections for rhythm, no overflow. Fix any layout issues and re-run.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: compose homepage with SEO metadata and visual checks"
```

---

## Self-Review

**Spec coverage (against §1–§8 of the design spec):**
- ATLAS tokens/fonts/motion → Tasks 2, 3. ✓
- Sitemap home route + global Header/Footer → Tasks 5, 6, 7, 11. ✓
- Component library subset needed for home (Header, Footer, Hero, LineupGrid/ModelCard, StatStrip, Buttons) → Tasks 3, 5, 6, 8, 9. ✓
- Data model (`content/models`, `content/showrooms`, `content/site`) → Task 4. ✓
- Home template composition → Task 11. ✓
- SEO/perf/a11y (metadata, OG, next/image, focus, contrast, no overflow) → Tasks 7, 11 + Global Constraints. ✓
- Deferred to later phases (own plans): `/modeles/[slug]` detail, full model data, showrooms pages, `/hybride`, `/a-propos`, lead-gen pages + iframe slots, 360°/3D, structured data, sitemap.xml. Tracked in spec §8 phases P2–P5.

**Placeholder scan:** Showroom address/phone/hours use the literal `"À confirmer"` value (a real, intentional placeholder string surfaced in UI, tracked in spec §9), not an unfinished plan step. Remaining five models are explicit typed stubs filled in P2. No `TODO`/`TBD` plan steps.

**Type consistency:** `Model`/`Showroom` shapes in `types.ts` match usage in `models/*`, `showrooms.ts`, and all consuming components; `Button` prop names (`variant`,`href`), `getModel(slug)`, `allModels`, `modelSlugs` used consistently across Tasks 4–11.

**Known follow-ups for P2:** fill the five model stubs; this plan intentionally ships home with one fully-populated model (CS55 PHEV) plus card-level data for the rest.
