# Model Pages: Template + CS55 PHEV Flagship — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable model-detail page template and its components in the ATLAS language, wire the `/modeles` lineup index and the `/modeles/[slug]` dynamic route, and prove the whole thing end-to-end on the fully-populated CS55 PHEV — while gracefully degrading for models whose data is still stubbed.

**Architecture:** A data-driven model-detail page at `src/app/modeles/[slug]/page.tsx` composes section components from a `Model` object (already typed in `src/content/`). Every section renders only when its data is present, so a stub model yields a valid minimal page (hero + CTA) and a rich model (CS55 PHEV) yields the full experience. New section components live in `src/components/sections/model/`; shared primitives (`Container`, `Eyebrow`, `Button`, `Reveal`, `DiamondMark`) are reused. Interactive pieces (color switcher, 360° viewer) are client components; everything else is server-rendered and statically generated via `generateStaticParams`.

**Tech Stack:** Next.js 16 (App Router, static export of `/modeles/[slug]`), React 19, TypeScript strict, Tailwind v4, next/image, Vitest + RTL, Playwright.

## Global Constraints

- Framework: Next.js App Router + TypeScript strict + Tailwind CSS v4. No CMS/DB.
- Language: French only. `<html lang="fr">` already set. No i18n routing, no RTL.
- ATLAS tokens (verbatim): brand `#134A87`, azure `#1A5FD0`, azure-hi `#2D74E6`, ink `#0F2A4D`, muted `#54637C`, field `#ECF1F8`, panel `#F7FAFD`, sky `#DBE6F5`, line `#E0E8F3`. Deep-navy (`bg-ink`) sections for rhythm.
- Typography: display Bricolage Grotesque (`font-display`), body Inter Tight, data/mono IBM Plex Mono (`font-mono`), brand ChangAn unitype (`font-brand`) for model nameplates.
- Motion (Emil): easing `cubic-bezier(0.23,1,0.32,1)` (`ease-[var(--ease-out)]`), ≤300ms UI / longer hero reveals, transform/opacity only, `active:scale-[0.97]`, honor `prefers-reduced-motion` (global rule + `Reveal` already handle it).
- Accessibility: WCAG AA — 4.5:1 contrast, visible `:focus-visible` rings, labeled controls, 44px touch targets, alt text. No horizontal overflow at 375/768/1024/1440.
- All raster assets via `next/image` with correct dimensions (no aspect-ratio warnings).
- **Graceful degradation is mandatory:** every model section component must render `null` when its data array/field is empty/absent. Never fabricate feature titles or specs.
- Reuse existing primitives: `@/components/ui/{Container,Eyebrow,Button,Reveal,DiamondMark}`. Reuse content from `@/content/models` (`getModel`, `allModels`, `modelSlugs`).
- Frequent commits: one per task.

## Existing data shape (from `src/content/types.ts`, do not change)

```ts
type ColorVariant = { label: string; hex: string; image: string };
type Feature = { title: string; text?: string; image: string };
type Spec = { group: string; label: string; value: string };
type Model = {
  slug; name; nameplate; tagline; heroDesktop; heroMobile;
  colorVariants: ColorVariant[]; comfort: Feature[]; equipment: Feature[];
  gallery: string[]; specs: Spec[]; pdf?: string; price?: string;
  hasSpin: boolean; spinFrames?: string[];
};
```
CS55 PHEV (`getModel("cs55-phev")`) is fully populated (4 variants, 3 comfort, 2 equipment, 3 gallery, 3 specs, `hasSpin: true`, 5 spin frames). The other 5 are typed stubs (`tagline:""`, empty arrays, `hasSpin:false`) — they MUST still produce a valid page.

---

### Task 1: ModelHero section

**Files:**
- Create: `src/components/sections/model/ModelHero.tsx`
- Test: `src/components/sections/model/__tests__/ModelHero.test.tsx`

**Interfaces:**
- Consumes: `Model`, `Container`, `Eyebrow`, `Button`, `Reveal`, `next/image`.
- Produces: `ModelHero({ model: Model })` — ATLAS light hero: eyebrow (model `name`), nameplate `model.nameplate` in `font-brand` + display headline using `model.tagline` (fallback to `name` when tagline is empty), `model.heroDesktop` image (`priority`, `alt={model.name}`, sized to its intrinsic ratio or `fill` in an aspect wrapper), CTAs `<Button href="/essai">Réserver un essai</Button>` + `<Button variant="outline" href="#specifications">Voir les spécifications</Button>`. If `model.price` present, show "À partir de {price}" in `font-mono`.

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from "@testing-library/react";
import { ModelHero } from "@/components/sections/model/ModelHero";
import { getModel } from "@/content/models";
test("renders nameplate and the essai CTA", () => {
  render(<ModelHero model={getModel("cs55-phev")!} />);
  expect(screen.getByText("CS55 PHEV")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Réserver un essai" })).toHaveAttribute("href", "/essai");
});
test("falls back to model name when tagline is empty", () => {
  render(<ModelHero model={getModel("alsvin")!} />);
  expect(screen.getAllByText(/ALSVIN/i).length).toBeGreaterThan(0);
});
```
- [ ] **Step 2: Run `npm run test -- ModelHero` → FAIL (module not found).**
- [ ] **Step 3: Implement `ModelHero`** in the ATLAS light style (mirror `HomeHero` conventions: radial glow background, `font-display` headline `text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.0] tracking-[-0.02em] text-ink`, nameplate in `font-brand text-brand`, `Reveal` stagger). Headline text = `model.tagline || model.name`. Image: if you pass explicit `width`/`height`, read the file's real pixel size; otherwise use `fill` inside `relative aspect-[16/10]`.
- [ ] **Step 4: Run `npm run test -- ModelHero` → PASS.**
- [ ] **Step 5: Commit** `feat: add ModelHero section`.

---

### Task 2: ColorVariantSwitcher (client)

**Files:**
- Create: `src/components/sections/model/ColorVariantSwitcher.tsx`
- Test: `src/components/sections/model/__tests__/ColorVariantSwitcher.test.tsx`

**Interfaces:**
- Consumes: `ColorVariant[]`, `Container`, `Eyebrow`, `next/image`, `cn`.
- Produces: `ColorVariantSwitcher({ variants: ColorVariant[]; name: string })` — a `"use client"` component. Renders `null` when `variants.length === 0`. Shows the selected variant image large, and a row of circular swatch buttons (`background: hex`); clicking/keyboard-activating a swatch swaps the displayed image. Selected swatch has a visible ring; each swatch is a real `<button>` with `aria-label={variant.label}` and `aria-pressed`, ≥44px hit area, `focus-visible` ring.

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColorVariantSwitcher } from "@/components/sections/model/ColorVariantSwitcher";
const variants = [
  { label: "Blanc", hex: "#EDEDED", image: "/a.png" },
  { label: "Noir", hex: "#16181B", image: "/b.png" },
];
test("renders nothing when no variants", () => {
  const { container } = render(<ColorVariantSwitcher variants={[]} name="X" />);
  expect(container).toBeEmptyDOMElement();
});
test("selecting a swatch updates the displayed image", async () => {
  render(<ColorVariantSwitcher variants={variants} name="CS55 PHEV" />);
  await userEvent.click(screen.getByRole("button", { name: "Noir" }));
  expect(screen.getByRole("button", { name: "Noir" })).toHaveAttribute("aria-pressed", "true");
});
```
- [ ] **Step 2: Run `npm run test -- ColorVariantSwitcher` → FAIL.**
- [ ] **Step 3: Implement** with `useState(0)` for the selected index, an `Image` (use `fill` in a fixed aspect wrapper, `alt={`${name} — ${selected.label}`}`), and the swatch button row. Section eyebrow "Couleurs". Swatch: `h-11 w-11 rounded-full` with an inner colored disc so the 44px target is met while the visible swatch can be smaller; ring on selected.
- [ ] **Step 4: Run `npm run test -- ColorVariantSwitcher` → PASS.**
- [ ] **Step 5: Commit** `feat: add ColorVariantSwitcher`.

---

### Task 3: FeatureSection (comfort / equipment)

**Files:**
- Create: `src/components/sections/model/FeatureSection.tsx`
- Test: `src/components/sections/model/__tests__/FeatureSection.test.tsx`

**Interfaces:**
- Consumes: `Feature[]`, `Container`, `Eyebrow`, `Reveal`, `next/image`.
- Produces: `FeatureSection({ eyebrow: string; heading: string; features: Feature[]; alt?: boolean })` — renders `null` when `features.length === 0`. Alternating image/text rows (`Feature.title` in `font-display`, optional `Feature.text` in body). When a feature has no `text`, render just the titled image (no fabricated copy). `alt` flips the starting side / background (`bg-field` vs `bg-panel`) for rhythm.

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from "@testing-library/react";
import { FeatureSection } from "@/components/sections/model/FeatureSection";
test("renders nothing when empty", () => {
  const { container } = render(<FeatureSection eyebrow="Confort" heading="H" features={[]} />);
  expect(container).toBeEmptyDOMElement();
});
test("renders each feature title", () => {
  render(<FeatureSection eyebrow="Confort" heading="Confort à bord" features={[{ title: "Toit panoramique", image: "/t.jpg" }]} />);
  expect(screen.getByText("Toit panoramique")).toBeInTheDocument();
});
```
- [ ] **Step 2: Run `npm run test -- FeatureSection` → FAIL.**
- [ ] **Step 3: Implement** alternating rows (`grid lg:grid-cols-2 items-center gap-10`, flip order on odd rows), images via `Image` with `fill` in `aspect-[4/3]` wrappers, `Reveal` per row. Heading block uses `Eyebrow`.
- [ ] **Step 4: Run `npm run test -- FeatureSection` → PASS.**
- [ ] **Step 5: Commit** `feat: add FeatureSection`.

---

### Task 4: ModelGallery

**Files:**
- Create: `src/components/sections/model/ModelGallery.tsx`
- Test: `src/components/sections/model/__tests__/ModelGallery.test.tsx`

**Interfaces:**
- Consumes: `string[]` (image paths), `Container`, `Eyebrow`, `Reveal`, `next/image`.
- Produces: `ModelGallery({ images: string[]; name: string })` — renders `null` when empty. Responsive masonry-ish grid (`grid sm:grid-cols-2 lg:grid-cols-3 gap-4`) of `Image`s (each `fill` in `aspect-[4/3]`, `object-cover`, `alt={`${name} — vue ${i+1}`}`), rounded corners, subtle hover scale on the image only (`group-hover:scale-[1.03] transition-transform`). Section eyebrow "Galerie".

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from "@testing-library/react";
import { ModelGallery } from "@/components/sections/model/ModelGallery";
test("renders nothing when empty", () => {
  const { container } = render(<ModelGallery images={[]} name="X" />);
  expect(container).toBeEmptyDOMElement();
});
test("renders one image per path with alt text", () => {
  render(<ModelGallery images={["/g1.webp", "/g2.webp"]} name="CS55 PHEV" />);
  expect(screen.getByAltText("CS55 PHEV — vue 1")).toBeInTheDocument();
  expect(screen.getByAltText("CS55 PHEV — vue 2")).toBeInTheDocument();
});
```
- [ ] **Step 2: Run `npm run test -- ModelGallery` → FAIL.**
- [ ] **Step 3: Implement** the grid. Keep it a non-interactive grid (no lightbox in this milestone — YAGNI; add later if needed).
- [ ] **Step 4: Run `npm run test -- ModelGallery` → PASS.**
- [ ] **Step 5: Commit** `feat: add ModelGallery`.

---

### Task 5: SpecLedger + spec table + PDF

**Files:**
- Create: `src/components/sections/model/Specifications.tsx`
- Test: `src/components/sections/model/__tests__/Specifications.test.tsx`

**Interfaces:**
- Consumes: `Spec[]`, optional `pdf?: string`, `Container`, `Eyebrow`, `Button`, `next/link`.
- Produces: `Specifications({ specs: Spec[]; pdf?: string; id?: string })` — renders `null` when `specs.length === 0` AND no `pdf`. Wraps in a `<section id={id ?? "specifications"}>` (anchor target for the hero CTA). Groups `specs` by `spec.group` (preserve first-seen order) and renders each group as a labeled block with `label … value` rows on hairline (`border-line`) baselines, mono values. If `pdf` present, a `<Button href={pdf}>Télécharger la fiche technique</Button>` (renders an `<a download>` — pass through to Button's link; open in new tab via the href).

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from "@testing-library/react";
import { Specifications } from "@/components/sections/model/Specifications";
const specs = [
  { group: "Motorisation", label: "Type", value: "Hybride rechargeable" },
  { group: "Autonomie", label: "Combinée", value: "1 100 km" },
];
test("renders nothing when no specs and no pdf", () => {
  const { container } = render(<Specifications specs={[]} />);
  expect(container).toBeEmptyDOMElement();
});
test("renders grouped specs and the section anchor", () => {
  const { container } = render(<Specifications specs={specs} id="specifications" />);
  expect(screen.getByText("Motorisation")).toBeInTheDocument();
  expect(screen.getByText("1 100 km")).toBeInTheDocument();
  expect(container.querySelector("#specifications")).not.toBeNull();
});
test("shows the PDF download when pdf is provided", () => {
  render(<Specifications specs={specs} pdf="/FT CS15.pdf" />);
  expect(screen.getByRole("link", { name: /fiche technique/i })).toHaveAttribute("href", "/FT CS15.pdf");
});
```
- [ ] **Step 2: Run `npm run test -- Specifications` → FAIL.**
- [ ] **Step 3: Implement.** Group with a `Map<string, Spec[]>` preserving insertion order. Datasheet styling: group title `font-mono uppercase text-xs tracking-[0.08em] text-muted`, rows with `border-t border-line`, label `text-muted`, value `font-display text-ink`.
- [ ] **Step 4: Run `npm run test -- Specifications` → PASS.**
- [ ] **Step 5: Commit** `feat: add Specifications section with grouped specs and PDF`.

---

### Task 6: SpinViewer (client, 360°)

**Files:**
- Create: `src/components/sections/model/SpinViewer.tsx`
- Test: `src/components/sections/model/__tests__/SpinViewer.test.tsx`

**Interfaces:**
- Consumes: `string[]` (`spinFrames`), `Container`, `Eyebrow`, `next/image`, `cn`.
- Produces: `SpinViewer({ frames: string[]; name: string })` — `"use client"`. Renders `null` when `frames.length < 2`. Shows the current frame as an `Image`; dragging horizontally (pointer events) cycles frames; provides a visible hint ("Glissez pour faire pivoter") and a range `<input type="range">` fallback (keyboard-accessible, `aria-label="Faire pivoter le véhicule"`) bound to the frame index. Preloads all frames. Respects `prefers-reduced-motion` by not auto-rotating.

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { SpinViewer } from "@/components/sections/model/SpinViewer";
const frames = ["/f0.webp","/f1.webp","/f2.webp","/f3.webp","/f4.webp"];
test("renders nothing with fewer than 2 frames", () => {
  const { container } = render(<SpinViewer frames={["/only.webp"]} name="X" />);
  expect(container).toBeEmptyDOMElement();
});
test("range slider changes the visible frame", () => {
  render(<SpinViewer frames={frames} name="CS55 PHEV" />);
  const slider = screen.getByRole("slider", { name: /pivoter/i });
  fireEvent.change(slider, { target: { value: "2" } });
  expect(screen.getByRole("img")).toHaveAttribute("src", expect.stringContaining("f2"));
});
```
(Note: `next/image` rewrites `src`; if `toHaveAttribute("src", containing "f2")` is brittle under the Image loader, assert via the `alt`/`data-frame` attribute instead — set `data-frame={index}` on the wrapper and assert that. Adjust the test to a stable signal while keeping it a real behavior assertion.)
- [ ] **Step 2: Run `npm run test -- SpinViewer` → FAIL.**
- [ ] **Step 3: Implement** pointer-drag frame cycling (track `startX`, map delta→frame step), the range fallback, frame preloading, and a `data-frame` attribute for testability. Section eyebrow "Vue 360°".
- [ ] **Step 4: Run `npm run test -- SpinViewer` → PASS.**
- [ ] **Step 5: Commit** `feat: add 360° SpinViewer`.

---

### Task 7: ModelCta closing band

**Files:**
- Create: `src/components/sections/model/ModelCta.tsx`
- Test: `src/components/sections/model/__tests__/ModelCta.test.tsx`

**Interfaces:**
- Consumes: `Container`, `Button`, `Reveal`.
- Produces: `ModelCta({ name: string })` — deep-navy band (layered radial, not flat 2-stop) echoing the home `LeadCta`: heading "Envie d'essayer le {name} ?", buttons `<Button href="/essai">Réserver un essai</Button>` + `<Button variant="outline" href="/showrooms">Trouver un showroom</Button>` (outline = opaque white, visible on navy).

- [ ] **Step 1: Write the failing test**
```tsx
import { render, screen } from "@testing-library/react";
import { ModelCta } from "@/components/sections/model/ModelCta";
test("includes the model name and an essai link", () => {
  render(<ModelCta name="CS55 PHEV" />);
  expect(screen.getByText(/CS55 PHEV/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Réserver un essai" })).toHaveAttribute("href", "/essai");
});
```
- [ ] **Step 2: Run `npm run test -- ModelCta` → FAIL.**
- [ ] **Step 3: Implement** (reuse the `LeadCta` navy/radial styling for cohesion).
- [ ] **Step 4: Run `npm run test -- ModelCta` → PASS.**
- [ ] **Step 5: Commit** `feat: add ModelCta`.

---

### Task 8: `/modeles/[slug]` dynamic route

**Files:**
- Create: `src/app/modeles/[slug]/page.tsx`
- Create: `e2e/model-detail.spec.ts`

**Interfaces:**
- Consumes: `getModel`, `modelSlugs` from `@/content/models`; all `model/*` sections; `next/navigation` `notFound`.
- Produces: a statically-generated page per slug. `generateStaticParams()` returns `modelSlugs.map(slug => ({ slug }))`. `generateMetadata({ params })` returns `{ title: model.name, description: model.tagline || `Découvrez le ${model.name}.` }` (or `notFound()`-safe). The page composes, in order, rendering each only when present:
  `ModelHero` → `ColorVariantSwitcher` → `FeatureSection (comfort)` → `FeatureSection (equipment, alt)` → `SpinViewer` → `ModelGallery` → `Specifications` → `ModelCta`.

- [ ] **Step 1: Implement the route.** `const model = getModel(params.slug); if (!model) notFound();` then compose the sections. Pass `comfort`→FeatureSection eyebrow "Confort", heading "Le confort à bord"; `equipment`→eyebrow "Équipement", heading "Équipements & technologies", `alt`. `Specifications` gets `id="specifications"`. (In Next 16, `params` is async — `const { slug } = await params;`.)
- [ ] **Step 2: Write the e2e**
`e2e/model-detail.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
test("CS55 PHEV detail page renders rich sections, no overflow", async ({ page }) => {
  await page.goto("/modeles/cs55-phev");
  await expect(page.getByRole("heading", { name: /CS55 PHEV|silence/i }).first()).toBeVisible();
  await expect(page.getByText("Couleurs")).toBeVisible();
  await expect(page.getByText(/Vue 360/i)).toBeVisible();
  await expect(page.getByText("Motorisation")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
test("a stub model (alsvin) still renders a valid minimal page", async ({ page }) => {
  await page.goto("/modeles/alsvin");
  await expect(page.getByRole("link", { name: "Réserver un essai" }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
test("unknown slug 404s", async ({ page }) => {
  const res = await page.goto("/modeles/nope");
  expect(res?.status()).toBe(404);
});
```
- [ ] **Step 3: Verify.** `npm run build` (all 6 slugs prerender; no aspect-ratio warnings) and `npm run test:e2e -- model-detail` → pass.
- [ ] **Step 4: Commit** `feat: add /modeles/[slug] model-detail route`.

---

### Task 9: `/modeles` lineup index

**Files:**
- Create: `src/app/modeles/page.tsx`
- Create: `e2e/modeles-index.spec.ts`

**Interfaces:**
- Consumes: `Lineup` (`@/components/sections/Lineup`) or `allModels` + `ModelCard`, `Container`, `Eyebrow`.
- Produces: `/modeles` page with `metadata` (`title: "Modèles", description` FR) and a header ("La gamme Changan") above the existing `Lineup` grid (reuse `<Lineup />` — it already renders all 6 cards linking to `/modeles/<slug>`). Wrap with `Container` + an `Eyebrow`/heading band so it reads as a page, not a homepage clone.

- [ ] **Step 1: Implement** the page composing the heading band + `<Lineup />`.
- [ ] **Step 2: Write the e2e**
```ts
import { test, expect } from "@playwright/test";
test("modeles index lists models and links to a detail page", async ({ page }) => {
  await page.goto("/modeles");
  await expect(page.getByRole("link", { name: /CS55 PHEV/ }).first()).toBeVisible();
  await page.getByRole("link", { name: /CS55 PHEV/ }).first().click();
  await expect(page).toHaveURL(/\/modeles\/cs55-phev$/);
});
```
- [ ] **Step 3: Verify** `npm run build` + `npm run test:e2e -- modeles-index` → pass.
- [ ] **Step 4: Commit** `feat: add /modeles lineup index page`.

---

### Task 10: Full verification + visual pass

**Files:**
- Create: `e2e/model-screens.spec.ts` (screenshots; `e2e/__screens__/` already gitignored)

**Interfaces:** consumes the live routes.

- [ ] **Step 1: Write a screenshot spec** that, with the default `reducedMotion: "reduce"` config, loads `/modeles/cs55-phev` and `/modeles/alsvin` at 1440/768/375 and full-page-screenshots each to `e2e/__screens__/model-<slug>-<w>.png`, asserting no horizontal overflow at each.
- [ ] **Step 2: Run full verification.** `npm run build` (success, all 6 model slugs static, no Image warnings), `npm run test` (all unit pass, pristine), `npm run test:e2e` (all specs pass).
- [ ] **Step 3: Review screenshots.** Confirm CS55 PHEV shows: ATLAS hero, color switcher, comfort/equipment feature rows, 360° viewer, gallery grid, grouped specs, navy CTA — cohesive and on-brand. Confirm ALSVIN renders a clean minimal page (hero + CTA) with no empty/broken section shells. Fix any layout bug and re-run.
- [ ] **Step 4: Commit** `test: add model-page visual checks`.

---

## Self-Review

**Spec coverage (design spec §4–§5 model-detail template + components):**
- Model-detail template / composition → Task 8. ✓
- Hero/banner → Task 1. ✓ · ColorVariantSwitcher → Task 2. ✓ · FeatureSplit (comfort/equipment) → Task 3. ✓ · Gallery → Task 4. ✓ · SpecLedger + full specs + PDF → Task 5. ✓ · SpinViewer (360°) → Task 6. ✓ · model CTA → Task 7. ✓ · `/modeles` index → Task 9. ✓ · SEO per-page metadata → Task 8 (`generateMetadata`). ✓
- Graceful degradation for stub models → enforced in every component (renders `null` when empty) + Task 8 composition + verified on ALSVIN in Tasks 8/10. ✓

**Placeholder scan:** No `TBD`/`TODO` steps; the SpinViewer test note gives a concrete, stable alternative assertion (`data-frame`) rather than a vague "fix later." Stub models rendering minimal pages is intentional and tested, not a gap.

**Type consistency:** All components consume the existing `Model`/`Feature`/`Spec`/`ColorVariant` shapes from `src/content/types.ts` unchanged. Section prop names (`features`, `variants`, `images`, `specs`, `frames`, `name`, `model`) are used consistently across Tasks 1–8. The hero CTA targets `#specifications`, which Task 5/Task 8 set as the section `id`.

**Out of scope (explicit — follow-up plan):** populating real data for CS55, CS35 PLUS, CS15, UNI-K, ALSVIN (variants/gallery/specs from assets, and sourcing French feature copy for the numbered images); model gallery lightbox; `Vehicle` structured data. These pages render gracefully minimal until that data lands.
