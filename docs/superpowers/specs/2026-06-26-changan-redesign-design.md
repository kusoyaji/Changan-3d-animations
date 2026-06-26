# Changan Morocco — Full Site Reinvention · Design Spec

**Date:** 2026-06-26
**Status:** Approved (visual direction + architecture)
**Owner:** Mehdi

---

## 1. Overview

A complete, from-scratch reinvention of **changan.ma**, the Changan Morocco brand
marketing site. The current site is treated as irrelevant; this is a greenfield
build. The repository currently contains only brand assets under `public/`.

**Goal:** Full reinvention — rethink structure, identity, and experience to produce
the ideal Changan Morocco brand experience, premium yet accessible.

**Scope:** The entire site — homepage, all 6 model pages, showrooms, brand story,
and all lead-generation pages — delivered as one cohesive design system built in
sequenced phases.

### Key decisions (locked)

| Decision | Choice |
|---|---|
| Ambition | Full reinvention |
| Scope | Full site, all pages |
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Language | French only (no i18n routing, no RTL) |
| Content | Static, typed data files in-repo (no CMS, no DB) |
| Lead-gen forms | Existing third-party **iframe embeds** in styled slots (URLs supplied later) |
| Visual direction | **ATLAS** — Moroccan-modern, light, Changan-blue system |
| Hosting | Vercel (default; easily changed) |

---

## 2. Visual direction — "ATLAS"

Light and airy, with a Changan-blue system pulled directly from the emblem.
Confident display typography, generous space, the car treated as the hero. A quiet
diamond/zellige mark nods to both the CS-series grille mesh and Moroccan geometry —
used sparingly as an accent, never as a busy background grid.

Approved hero reference: `.superpowers/brainstorm/.../content/atlas-v3.html`
(light field, blue logo, deep-cobalt brand + vivid-azure buttons, frosted spec strip).

### Design tokens

**Color**
- `--brand` `#134A87` — Changan emblem blue (brand, logo, headings, nav)
- `--azure` `#1A5FD0` / `--azure-hi` `#2D74E6` — primary action (buttons, links)
- `--ink` `#0F2A4D` — primary text / deep-navy sections
- `--muted` `#54637C` — secondary text
- `--field` `#ECF1F8` — light page background
- `--panel` `#F7FAFD` — raised surfaces
- `--sky` `#DBE6F5` — subtle fills / borders
- White `#FFFFFF`
- Light-first; **deep-navy (`--ink`) sections** used for rhythm (footer, hybrid story, CTAs).

**Typography**
- Display: **Bricolage Grotesque** (headings, hero)
- Body: **Inter Tight**
- Data / specs / eyebrows: **IBM Plex Mono**
- Brand: **ChangAn unitype** (local font, `public/changan-font/`) reserved for model
  nameplates and brand moments only.
- One modular type scale; defined weights per role.

**Shape & space**
- Radius 10–20px; soft blue-tinted shadows; container max-width ~1280px, 12-col grid.
- Diamond motif (rotated square) as the reusable accent glyph.

**Motion** (Emil Kowalski system)
- Default easing `cubic-bezier(.23,1,.32,1)` (ease-out).
- Durations: 160ms (press), 200ms (standard), ≤300ms (UI); hero reveals may run longer.
- Entrance: fade-up with staggered children; press: `active:scale-[0.97]`.
- Animate `transform`/`opacity` only; respect `prefers-reduced-motion`.

---

## 3. Information architecture

| Route | Page |
|---|---|
| `/` | Home |
| `/modeles` | Lineup (all 6) |
| `/modeles/[slug]` | Model detail — `cs55-phev`, `cs55`, `cs35-plus`, `cs15`, `uni-k`, `alsvin` |
| `/hybride` | PHEV / hybrid technology story |
| `/showrooms` | Showroom finder (8 cities) |
| `/showrooms/[ville]` | Showroom detail (optional) |
| `/a-propos` | Brand story |
| `/essai` | Test-drive (iframe embed) |
| `/reprise` | Trade-in / reprise (iframe embed) |
| `/contact` | Contact (iframe embed + showroom info) |
| `/recrutement` | Careers / join us |
| `/mentions-legales`, `/confidentialite` | Legal |

**Global chrome:** sticky Header (blue logo, primary nav, phone, "Réserver un essai"
CTA, Modèles mega-menu, condenses on scroll) and Footer (showrooms, social icons,
legal, brand).

---

## 4. Component library

Reusable, independently testable units:

- **Header / MegaNav** — model thumbnails in the Modèles menu; scroll-condense.
- **Footer**
- **Hero** — brand variant (home) and model variant (banner + headline + CTAs + spec strip).
- **LineupGrid / ModelCard** — the 6 models as cards with logo + render.
- **ColorVariantSwitcher** — color swatches drive the displayed variant image.
- **FeatureSplit** — alternating image/text for comfort & equipment sections.
- **Gallery + Lightbox**
- **SpecLedger** — datasheet-style key specs; links to full spec table + fiche-technique PDF.
- **SpinViewer** — 360° frame sequence (CS55 PHEV).
- **ShowroomFinder** — map + city list + showroom cards.
- **LeadFormEmbed** — styled wrapper around a third-party iframe with a loading state
  and consistent framing; iframe `src` supplied via config later.
- **StatStrip** — the frosted spec strip.
- **Buttons** (primary azure, secondary outline), **Breadcrumbs**, section primitives.

---

## 5. Page templates

- **Home** — brand hero → lineup → hybrid/tech highlight → showroom teaser → lead CTAs.
- **Model detail** (data-driven): hero/banner → color variants → comfort → equipment →
  gallery → spec ledger + full specs + PDF → 360° (if `hasSpin`) → CTA.
- **Showrooms** — finder + 8 city cards/details.
- **About** — brand story sections.
- **Lead-gen** (`/essai`, `/reprise`, `/contact`, `/recrutement`) — hero + `LeadFormEmbed`.

---

## 6. Data model & content

Typed content in-repo, consumed by templates.

**`/content/models/<slug>.ts`** — per model:
`name`, `slug`, `nameplate`, `tagline`, `heroDesktop`, `heroMobile`,
`colorVariants[] { label, hex, image }`, `comfort[] { title, text, image }`,
`equipment[] { title, image }`, `gallery[]`, `specs[] { group, label, value }`,
`pdf`, `price?`, `hasSpin`, `spinFrames?`.

**`/content/showrooms.ts`** — 8 cities (Casablanca, Rabat, Tanger, Marrakech, Kenitra,
Mohammedia, El Jadida, Tetouan): `name`, `address`, `phone`, `hours`, `image`,
`mapEmbed`/`geo`.

**`/content/site.ts`** — nav, footer, social links, phone, lead-form iframe URLs (placeholders).

### Asset inventory (already in `public/`)

- Models: CS55 PHEV, CS55, CS35+, CS15, UNI-K, Alsvin — banners, color variants,
  comfort/equipment shots, galleries, logos.
- Fiches techniques (PDF), brand font, logo SVG, social icons, OG image.
- 360° spin: CS55 PHEV (currently 5 frames — **needs a fuller sequence** for a smooth spin).
- 3D: `cs55-plus.glb` / `changan_cs55_plus_2025.glb`, hero `video.mp4`.

---

## 7. Cross-cutting concerns

- **SEO** — per-page metadata, OG (`public/images/og.png`), `sitemap.xml`, `robots.txt`,
  structured data: `AutoDealer`/`LocalBusiness` (showrooms), `Vehicle` (models).
- **Performance** — `next/image` for all assets, lazy media, route-level code splitting;
  reserve space to avoid layout shift.
- **Accessibility** — WCAG AA: 4.5:1 contrast, visible focus, labeled controls,
  44px touch targets, reduced-motion. (ui-ux-pro-max pre-delivery checklist.)
- **Responsive** — verified at 375 / 768 / 1024 / 1440px.

---

## 8. Build sequence (one spec → phased plans)

- **P0 — Scaffold:** Next.js + TS + Tailwind v4, fonts (`next/font` + local), token layer,
  layout shell, Header + Footer.
- **P1 — System + Home:** component primitives, motion system, full homepage.
- **P2 — Models:** model-detail template + all 6 models from data.
- **P3 — Showrooms + About.**
- **P4 — Lead-gen:** `/essai`, `/reprise`, `/contact`, `/recrutement` + iframe slots.
- **P5 — Polish:** 360° spin, optional 3D viewer, SEO, a11y/perf pass.

Each phase becomes its own implementation plan; all share this spec.

---

## 9. Open items (non-blocking)

- Lead-gen iframe embed URLs (supplied later).
- Showroom details (addresses, phones, hours) — confirm/source.
- Model prices — confirm or omit.
- Fuller 360° frame set for CS55 PHEV.
- Final hero/marketing copy (placeholders in use).
- Phone number / contact details in header & footer.
