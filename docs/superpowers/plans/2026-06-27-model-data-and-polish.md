# Model Data Population + Polish — Implementation Plan (Phase 2b)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make the other 5 model pages (CS15, CS55, CS35 PLUS, UNI-K, ALSVIN) genuinely rich — real color variants, galleries, real French feature content sourced from the fiches techniques, and a downloadable fiche on every model — plus apply the deferred model-page polish. No fabricated specs or feature names.

**Architecture:** Pure content + small-component work on the existing `/modeles/[slug]` template. Add a `highlights` field to `Model` and a `FeatureList` text component (real feature names without forced image↔title pairing, since most comfort/equipment images are unlabeled). Author each model's `src/content/models/<slug>.ts` from verified sources. CS15's fiche has a clean text layer (full specs + features); CS55/UNI-K fiches were font-decoded for feature lists (numeric values unrecoverable); CS35/ALSVIN fiches are image-only. Per the user's decision, on-page numeric spec tables are **CS15 only**; all other models surface specs via the **downloadable fiche PDF**.

**Tech Stack:** Next.js 16 App Router, TS strict, Tailwind v4, next/image, Vitest + RTL, Playwright.

## Global Constraints

- Next.js App Router + TS strict + Tailwind v4. French only (`react/no-unescaped-entities` is on — escape apostrophes in JSX text as `&apos;` or use JS strings). ATLAS tokens only (brand #134A87, azure #1A5FD0, ink #0F2A4D, field #ECF1F8, panel #F7FAFD, sky #DBE6F5, line #E0E8F3, muted #54637C); no hardcoded hex except `variant.hex` data and existing rgba gradient precedent.
- Motion: ease-out, transform/opacity, prefers-reduced-motion (handled globally + Reveal).
- A11y AA: contrast, focus rings, 44px targets, alt text, no horizontal overflow at 375/768/1024/1440.
- All images via next/image with `sizes`, no aspect-ratio warnings. Every section component renders `null` on empty data (already true).
- **Never fabricate** specs or feature names. Use only the content embedded in this plan (sourced from the fiches/assets).
- Fiche PDFs live under `public/` and are served at: CS15 `/FT CS15.pdf`; CS55 `/images/model/gallery/cs55.pdf`; CS35 `/images/model/gallery/cs35.pdf`; UNI-K `/images/model/gallery/uni-k.pdf`; ALSVIN `/images/model/gallery/alsvin.pdf`.
- One commit per task. Run `npm run test`, `npm run lint` (0), `npm run build` before committing data tasks; e2e where noted.

---

### Task 1: `highlights` field + `FeatureList` component + wire into route

**Files:**
- Modify: `src/content/types.ts` (add `FeatureGroup` + `Model.highlights?`)
- Create: `src/components/sections/model/FeatureList.tsx`
- Test: `src/components/sections/model/__tests__/FeatureList.test.tsx`
- Modify: `src/app/modeles/[slug]/page.tsx` (render `<FeatureList groups={model.highlights ?? []} />` after the equipment `FeatureSection`)

**Interfaces:**
- Produces: `type FeatureGroup = { group: string; items: string[] }`; `Model.highlights?: FeatureGroup[]`; `FeatureList({ groups: FeatureGroup[]; eyebrow?: string; heading?: string })` — renders `null` when `groups.length === 0`; otherwise a `bg-panel` section with `Eyebrow` (default "Équipements") + heading (default "Équipements & technologies") and a responsive multi-column layout where each group is a block: group title (`font-mono uppercase text-xs tracking-[0.08em] text-muted`) + a `<ul>` of items (`text-ink`, each row with a small azure diamond/check marker via `DiamondMark` or an inline svg, no fabricated text).

- [ ] **Step 1: Add the type.** In `src/content/types.ts` add `export type FeatureGroup = { group: string; items: string[] };` and add `highlights?: FeatureGroup[];` to `Model`.
- [ ] **Step 2: Write the FeatureList test**
```tsx
import { render, screen } from "@testing-library/react";
import { FeatureList } from "@/components/sections/model/FeatureList";
test("renders nothing when no groups", () => {
  const { container } = render(<FeatureList groups={[]} />);
  expect(container).toBeEmptyDOMElement();
});
test("renders group titles and items", () => {
  render(<FeatureList groups={[{ group: "Sécurité", items: ["ESP", "ABS + EBD"] }]} />);
  expect(screen.getByText("Sécurité")).toBeInTheDocument();
  expect(screen.getByText("ESP")).toBeInTheDocument();
  expect(screen.getByText("ABS + EBD")).toBeInTheDocument();
});
```
- [ ] **Step 3: Run `npm run test -- FeatureList` → FAIL.**
- [ ] **Step 4: Implement `FeatureList`** per the interface (consume `Container`, `Eyebrow`, `Reveal`, `DiamondMark`; `bg-panel`; grid `md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8`; items in a `<ul>` with `flex items-start gap-2`, marker `text-azure`).
- [ ] **Step 5: Wire into the route.** In `src/app/modeles/[slug]/page.tsx`, import `FeatureList` and render `<FeatureList groups={model.highlights ?? []} />` immediately after the equipment `FeatureSection`. (It self-guards, so models without highlights are unaffected.)
- [ ] **Step 6: Run `npm run test` (full) + `npm run build` + `npm run lint` → all green.**
- [ ] **Step 7: Commit** `feat: add FeatureList component and highlights field`.

---

### Task 2: ModelHero polish — heroMobile, dead-anchor gating, French elision

**Files:**
- Modify: `src/components/sections/model/ModelHero.tsx`
- Create: `src/lib/elide.ts`
- Test: `src/lib/__tests__/elide.test.ts`, update `src/components/sections/model/__tests__/ModelHero.test.tsx`

**Interfaces:**
- Produces: `elide(article: "le"|"la", name: string): string` — returns `"l'" + name` when `name` starts with a vowel or a vowel-with-accent (AEIOUYÀÂÄÉÈÊËÎÏÔÖÛÜ, case-insensitive), else `article + " " + name`. Used for model CTA/headlines.
- `ModelHero` consumes `model.heroMobile` for small screens and only renders the "Voir les spécifications" button when `model.specs.length > 0 || model.pdf`.

- [ ] **Step 1: Write the elide test**
```ts
import { elide } from "@/lib/elide";
test("elides before a vowel", () => { expect(elide("le", "ALSVIN")).toBe("l'ALSVIN"); expect(elide("le", "UNI-K")).toBe("l'UNI-K"); });
test("keeps the article before a consonant", () => { expect(elide("le", "CS55 PHEV")).toBe("le CS55 PHEV"); });
```
- [ ] **Step 2: Run `npm run test -- elide` → FAIL; implement `src/lib/elide.ts`; run → PASS.** (Escape the apostrophe in source as a normal JS string `"l'"` — that's fine in TS, only JSX text triggers the lint rule.)
- [ ] **Step 3: heroMobile responsive swap.** In `ModelHero`, render two `Image`s (or one with a wrapper) — `model.heroDesktop` shown `hidden sm:block`, `model.heroMobile` shown `block sm:hidden` — each `fill` in the existing aspect wrapper with `sizes`. Keep `priority` on the visible one. (Both reference real files; the stub models set `heroMobile = heroDesktop`.)
- [ ] **Step 4: Gate the specs button.** Wrap the `<Button href="#specifications">Voir les spécifications</Button>` in `{(model.specs.length > 0 || model.pdf) && (...)}` so stub/spec-less models don't show a dead anchor.
- [ ] **Step 5: Add a ModelHero test** asserting the specs button is absent for a model with no specs and no pdf (use a crafted model or `getModel("alsvin")` after Task 6 sets alsvin's pdf — to avoid ordering coupling, test with an inline minimal model object that has `specs: [], pdf: undefined`). Run `npm run test -- ModelHero` → PASS.
- [ ] **Step 6: `npm run test` + `npm run build` + `npm run lint` → green. Commit** `feat: ModelHero mobile image, specs-anchor gating, French elision`.

---

### Task 3: Specifications PDF download UX + use elision in ModelCta

**Files:**
- Modify: `src/components/sections/model/Specifications.tsx`, `src/components/sections/model/ModelCta.tsx`
- Test: update `src/components/sections/model/__tests__/Specifications.test.tsx`, `ModelCta.test.tsx`

**Interfaces:**
- `Specifications` PDF link opens in a new tab as a download: render a real `<a href={pdf} target="_blank" rel="noopener" download>` styled like the primary button (reuse Button's class string or a local styled anchor) instead of the shared `Button` (which can't pass `target`/`download`).
- `ModelCta` heading uses `elide("le", name)` → "Envie d'essayer l'ALSVIN ?" etc.

- [ ] **Step 1: Update the Specifications PDF test** to assert the link has `target="_blank"` and `rel` containing `noopener` (plus the existing href assertion). Run → FAIL.
- [ ] **Step 2: Implement** the styled `<a>` for the PDF (keep it visually identical to the primary Button — you may import the Button class constants or inline an equivalent class). Run Specifications test → PASS.
- [ ] **Step 3: Update ModelCta** to use `elide("le", name)` in the heading; update its test to expect "l'ALSVIN" for name "ALSVIN" and "le CS55 PHEV" for "CS55 PHEV". Run → PASS. (Heading JSX: build the string in JS, e.g. `Envie d&apos;essayer {phrase}&nbsp;?` — keep the existing `&apos;`/`&nbsp;`.)
- [ ] **Step 4: `npm run test` + `npm run build` + `npm run lint` → green. Commit** `feat: PDF download UX + elided model CTA copy`.

---

### Task 4: CS15 data (full — clean fiche)

**Files:** Modify `src/content/models/cs15.ts` (create it; replace the stub in `index.ts`); Test: extend `src/content/__tests__/content.test.ts`.

**Content (verbatim — from `FT CS15.pdf`, clean text layer):**
- `name: "CS15"`, `nameplate: "CS15"`, `tagline: "L'audace au quotidien."`
- `heroDesktop: "/images/vehicles/cs15.webp"`, `heroMobile: "/images/vehicles/cs15-mobile.webp"`
- `colorVariants`: `{Blanc #EDEDED /images/model/variant/cs15-white.webp}`, `{Gris #B9BEC4 /images/model/variant/cs15-grey.webp}`, `{Noir #16181B /images/model/variant/cs15-black.webp}`
- `comfort` (titled FeatureSection — named image files, verify each exists):
  - "Écran tactile 10\"" → `/images/model/comfort/comfort-cs15-lcd.png` (or the named LCD file) — if unsure use `/images/model/comfort/CS15 Ordinateur de bord digital LCD 10.png`
  - "Smart Key" → `/images/model/comfort/CS15 Smart Key.jpg`
  - "Boîte automatique 5 DCT" → `/images/model/comfort/CS15  Boîte de vitesses automatique 5 DCT .jpg`
- `equipment` (titled — named files):
  - "Feux de jour à LED" → `/images/model/equipment/equipment-cs15-Feux-de-jour-à-LED.webp`
  - "Jantes en aluminium 17\"" → `/images/model/equipment/equipment-cs15-Jantes-en-aluminium-17'.webp`
  - "Toit ouvrant panoramique" → `/images/model/equipment/equipment-cs15-Toit-ouvrant-panoramique.webp`
  - "Apple CarPlay & Android Auto" → `/images/model/equipment/CS15 Apple CarPlay & Android Auto.jpg`
- `gallery`: `/images/model/gallery/gallery-cs15-1.webp` … `gallery-cs15-5.webp`
- `specs` (group, label, value):
  - Motorisation: Cylindrée "1480 cc"; Cylindres "4"; Puissance "100,6 ch"; Transmission "5 DCT"; Couple maxi "145 Nm"
  - Consommation: Mixte "7,1–7,8 L/100 km"
  - Suspension: Avant "McPherson indépendante"; Arrière "Barre de torsion"
  - Freinage: Avant/Arrière "Disques ventilés / Disques"
  - Dimensions: Longueur "4135 mm"; Largeur "1740 mm"; Hauteur "1630 mm"; Empattement "2520 mm"
  - Volumes: Réservoir "44 L"; Coffre "284 L"; Poids à vide "1210–1235 kg"
- `pdf: "/FT CS15.pdf"`, `hasSpin: false`
- `highlights`: omit (titled comfort/equipment already cover it) OR add a "Sécurité" group: ["ABS + EBD", "ESP", "HHC", "TPMS", "6 airbags (EXCLUSIVE)", "Fixations ISOFIX", "Régulateur de vitesse"]. Include this group.

- [ ] Steps: write a content test (`getModel("cs15")` has 3 variants, ≥3 specs groups, pdf, comfort length ≥2) → FAIL → create `cs15.ts` + register in `index.ts` (replace the `stub("cs15", …)`) → PASS → `npm run build` (verify all referenced files exist, no Image warnings) → `npm run lint` → commit `feat: populate CS15 model data`.
- [ ] **Asset check:** before finalizing, `ls` each referenced path; if a named file differs, correct to the real filename (exact spaces/accents).

---

### Task 5: CS55 data (highlights + variants + gallery + fiche)

**Files:** Create `src/content/models/cs55.ts`; register in `index.ts`; extend content test.

**Content (verbatim — feature names decoded from `cs55.pdf`):**
- `name: "CS55"`, `nameplate: "CS55"`, `tagline: "L'équilibre, sans compromis."`
- `heroDesktop: "/images/vehicles/cs55.webp"`, `heroMobile: "/images/vehicles/cs55-mobile.webp"`
- `colorVariants`: `{Blanc #EDEDED /…/variant/cs55-white.webp}`, `{Gris #9CA0A6 cs55-grey.webp}`, `{Argent #C9CDD2 cs55-silver.webp}`, `{Noir #16181B cs55-black.webp}`
- `comfort: []`, `equipment: []` (images unlabeled → use gallery instead)
- `gallery`: `/images/model/gallery/gallery-cs55-1.webp`, `-2`, `-3`; plus `/images/model/comfort/comfort-cs55-1.webp` … `comfort-cs55-6.webp`; plus `/images/model/equipment/equipment-cs55-1.webp` … `-3.webp` (verify each exists; include ~8–10 total)
- `specs: []` (fiche download only)
- `pdf: "/images/model/gallery/cs55.pdf"`, `hasSpin: false`
- `highlights` (FeatureGroup[]):
  - "Sécurité & aides à la conduite": ["Airbags frontaux et latéraux avant", "ABS + EBD", "ESP", "TCS — contrôle de traction", "HHC — aide au démarrage en côte", "HDC — assistance en descente", "Auto Hold", "EPB — frein de stationnement électrique", "TPMS", "Caméra de recul", "Caméra d'angle mort", "Régulateur de vitesse adaptatif (ACC)", "FCW — alerte de collision", "AEB — freinage d'urgence", "LDW / LKA — maintien de voie", "TJA — assistance embouteillages", "HBA — feux de route intelligents"]
  - "Confort & technologie": ["Smart Key", "Modes de conduite Normal / ECO / Sport", "Climatisation automatique", "Sellerie et volant en cuir", "Réglage électrique du siège conducteur", "Écran tactile", "Apple CarPlay (MirrorLink)", "Assistance vocale CHANGAN", "Boîte automatique E-shift", "Système audio Pioneer", "Chargeur sans fil", "Toit ouvrant panoramique"]
  - "Design extérieur": ["Jantes en aluminium", "Feux avant & arrière full LED", "Feux de jour à LED", "Vitres arrière surteintées", "Rétroviseurs rabattables électriquement", "Ouverture électrique du coffre"]

- [ ] Steps: content test (`getModel("cs55")` has 4 variants, highlights with ≥3 groups, gallery ≥6, pdf) → FAIL → create + register → PASS → asset-path `ls` verification → `npm run build`/`lint` → commit `feat: populate CS55 model data`.

---

### Task 6: UNI-K data (highlights + gallery + fiche; no variant renders)

**Files:** Create `src/content/models/uni-k.ts`; register; extend test.

**Content (verbatim — decoded from `uni-k.pdf`):**
- `name: "UNI-K"`, `nameplate: "UNI-K"`, `tagline: "Le SUV qui impose le respect."`
- `heroDesktop: "/images/vehicles/unik.webp"`, `heroMobile: "/images/vehicles/unik-mobile.webp"`
- `colorVariants: []` (only SVG swatch chips exist, no per-color car renders → switcher self-hides)
- `comfort: []`, `equipment: []`
- `gallery`: `/images/model/gallery/gallery-unik-1.webp` … `-3`; `/images/model/comfort/comfort-unik-1.webp` … `-6`; `/images/model/equipment/equipment-unik-1.webp` … `-5`; plus `/images/model/comfort/UNI-K Photo sellerie en cuir.jpg` (verify; include ~8–10)
- `specs: []`, `pdf: "/images/model/gallery/uni-k.pdf"`, `hasSpin: false`
- `highlights`:
  - "Sécurité": ["Airbags frontaux, latéraux et rideaux", "ESC + TCS", "ABS + EBD", "BA — assistance au freinage d'urgence", "TPMS", "HHC", "HDC", "ACC Stop & Go", "FCW avant et arrière", "AEB — freinage d'urgence", "LKA — maintien de voie", "LDW — alerte de sortie de voie", "LCS — assistance au changement de voie", "TJA — assistance embouteillages", "Auto Hold", "EPB"]
  - "Confort & fonctionnalité": ["Smart Key", "Boîte automatique E-shift", "Démarrage moteur à distance", "Modes Normal / ECO / Sport", "Transmission intégrale (4WD)", "Climatisation automatique bizone", "Volant et sellerie en cuir", "Réglage électrique des sièges avant (mémoire conducteur)", "Sièges avant chauffants et ventilés", "Sièges arrière chauffants", "Éclairage d'ambiance LED", "HBA — feux de route intelligents", "Radar avant et arrière", "Détecteur de pluie"]
  - "Multimédia": ["Ordinateur de bord TFT", "Apple CarPlay (MirrorLink)", "Écran tactile", "Caméra HD avec enregistrement vidéo", "Bluetooth", "Assistance vocale CHANGAN", "Système audio premium Sony", "Chargeur sans fil"]
  - "Design extérieur": ["Jantes en aluminium", "Rétroviseurs rabattables électriques avec mémoire", "Feux full LED avant et arrière", "Feux de jour à LED", "Vitres arrière surteintées", "Toit panoramique ouvrant", "Ouverture & fermeture électrique du coffre"]

- [ ] Steps: content test (`getModel("uni-k")` has highlights ≥4 groups, gallery ≥6, pdf, colorVariants length 0) → FAIL → create + register → PASS → asset `ls` verification → build/lint → commit `feat: populate UNI-K model data`.

---

### Task 7: CS35 PLUS + ALSVIN data (image-only fiches → variants/gallery + fiche; no fabricated features)

**Files:** Create `src/content/models/cs35-plus.ts` and `src/content/models/alsvin.ts`; register both; extend test.

**CS35 PLUS content (fiche is image-only — NO highlights, NO specs):**
- `name: "CS35 PLUS"`, `nameplate: "CS35 PLUS"`, `tagline: "Compact, complet, malin."`
- `heroDesktop: "/images/vehicles/cs35.webp"`, `heroMobile: "/images/vehicles/cs35-mobile.webp"`
- `colorVariants`: `{Blanc #EDEDED cs35-white.webp}`, `{Gris #9CA0A6 cs35-grey.webp}`, `{Noir #16181B cs35-black.webp}`
- `comfort: []`, `equipment: []`, `highlights: []`
- `gallery`: `gallery-cs35-1.webp` … `-3`; `comfort-cs35-0.webp` … `-6`; `equipment-cs35-1.webp` … `-4` (verify; ~8–10)
- `specs: []`, `pdf: "/images/model/gallery/cs35.pdf"`, `hasSpin: false`

**ALSVIN content (minimal — only render + fiche):**
- `name: "ALSVIN"`, `nameplate: "ALSVIN"`, `tagline: "La berline accessible."`
- `heroDesktop: "/images/vehicles/alsvin.webp"`, `heroMobile: "/images/vehicles/alsvin-mobile.webp"`
- `colorVariants: []`, `comfort: []`, `equipment: []`, `highlights: []`, `gallery: []`
- `specs: []`, `pdf: "/images/model/gallery/alsvin.pdf"`, `hasSpin: false`

- [ ] Steps: content test (`getModel("cs35-plus")` 3 variants + gallery ≥6 + pdf; `getModel("alsvin")` pdf set + empty arrays) → FAIL → create both + register (replace remaining stubs) → PASS. After this, `src/content/models/index.ts` has NO `stub()` calls left — all 6 are real modules. → asset `ls` verification → build/lint → commit `feat: populate CS35 PLUS and ALSVIN model data`.

---

### Task 8: Verification + visual pass

**Files:** update `e2e/model-screens.spec.ts` to also shoot cs55, cs35-plus, uni-k (1440 + 375).

- [ ] **Step 1:** extend the screenshot spec to cover all 6 slugs at 1440 + 375 (cs55-phev keeps 768 too), asserting no horizontal overflow each.
- [ ] **Step 2: Full verification:** `npm run build` (all 6 model pages static, no Image warnings), `npm run test` (unit pristine), `npm run lint` (0), `npm run test:e2e` (all pass).
- [ ] **Step 3: Inspect screenshots.** Confirm: CS15 shows titled comfort/equipment + full spec table + variants + gallery + fiche button; CS55 shows variants + gallery + grouped FeatureList + fiche button (no empty spec table); UNI-K shows FeatureList + gallery + fiche (no color switcher); CS35 PLUS shows variants + gallery + fiche; ALSVIN shows hero + fiche-less or fiche CTA minimal page. No empty section shells, no overflow, no broken images. Fix and re-run if needed.
- [ ] **Step 4: Commit** `test: model data visual checks for all six models`.

---

## Self-Review

**Spec coverage:** rich model pages for all 6 (CS55 PHEV already done; this plan does the other 5) — Tasks 4–7. Real feature content without fabrication via `highlights`/`FeatureList` (Task 1) and titled FeatureSection only where named images exist (CS15). Downloadable fiche on every model (Tasks 4–7). Deferred polish (heroMobile, dead-anchor gating, elision, PDF download UX) — Tasks 2–3. Verification — Task 8.

**Placeholder scan:** No TODO/TBD. All content is concrete and sourced; CS35/ALSVIN intentionally have empty feature/spec arrays (image-only/asset-poor sources) — honest, not gaps. Asset-path `ls` verification is built into each data task to catch filename drift (spaces/accents).

**Type consistency:** `FeatureGroup`/`highlights` defined in Task 1 and consumed by Tasks 5–6 and the route. `elide(article,name)` defined in Task 2, used in Tasks 2–3. All data conforms to the existing `Model` shape; `index.ts` ends with zero `stub()` calls after Task 7.

**Out of scope:** exact numeric specs for CS55/CS35/UNI-K/ALSVIN (user chose fiche-download-only); model-gallery lightbox; `Vehicle` structured data; removing the unused `hasSpin` field (left as-is to avoid churn — all data sets it explicitly).
