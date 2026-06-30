# CS55 PHEV — 3D Scroll Experience · Design Spec

**Date:** 2026-06-30
**Status:** Approved (design + decisions)
**Owner:** Mehdi
**Parent spec:** [`2026-06-26-changan-redesign-design.md`](./2026-06-26-changan-redesign-design.md) — this delivers the **P5 "360° / 3D viewer"** item for the **CS55 PHEV** flagship.

---

## 1. Overview

A scroll-driven cinematic "3D" experience for the **CS55 PHEV** model page. As the user
scrolls, a pinned stage plays a continuous camera move generated from the existing
product photography: the camera descends from a high (≈6 m) aerial, **orbits the full
360°** of the vehicle (front, both flanks, rear), then **flies through the side glass
into the cabin** and settles on the interior.

The motion is produced **offline** as a frame sequence (via **fal.ai**, image-guided),
then played back in the browser by a **canvas frame-sequence scrubber** driven by scroll
position — the Apple / Dacia-Bigster technique. The feature lives in the existing ATLAS
design system and **replaces** the current drag-based `SpinViewer` ("Vue 360°") section
on `/modeles/cs55-phev`.

**Quality bar (user):** "perfected, quality and accuracy wise." Accuracy of the real
vehicle is paramount; cinematic ambition is achieved without letting the AI distort the
car's identity.

### Source material (in `public/images/CS55PHEV-ImagesFor3D/`)

- **Exterior, black studio bg, matched grey paint (2560×1440):** front, front ¾ (right),
  side profile, rear ¾ (right), rear. → 5 real angles, **right side + front/rear only**.
- **Interior (2560×1440):** leather cabin (rear-seat POV toward dash, sunset outside),
  panoramic roof, steering wheel (ADAS).
- **Gaps:** no left-flank angles; no true aerial; exterior (studio) and interior (warm
  sunset) are different lighting worlds.

---

## 2. Locked decisions

| Decision | Choice |
|---|---|
| Placement | Replace the `SpinViewer` "Vue 360°" section on `/modeles/cs55-phev` |
| Generation strategy | **Hybrid** — real stills anchor the orbit; AI only fills gaps (aerial, left flank, fly-through, interior motion) |
| Orbit coverage | **Full 360°** (AI-generate the missing left flank) |
| Interior entry | **Literal window fly-through** (start→end-frame interpolation); dissolve is the fallback |
| Budget posture | **Lean-first, escalate to premium** (Veo 3 / Kling Pro / Runway Gen-4) per segment when quality requires |
| Playback engine | **Canvas frame-sequence** scrubber, lerp-smoothed |
| Frame budget | ~**120** desktop / ~**60** mobile frames |
| Frame format | **AVIF** with **WebP** fallback; ~1600px (desktop) / ~900px (mobile); + poster still |
| Asset delivery | Optimized frames committed under `public/`; raw video/intermediates stay out of git |
| Generation runtime | Standalone Node script (`scripts/`), reads `FAL_KEY` from `.env.local`; **never** in the app runtime |

---

## 3. Camera choreography (8 beats — approved, adjustable)

The underlying frame sequence is **continuous** (0→1). Beats are narrative caption
anchors layered over it; their `at` is the scroll fraction where each caption peaks.

| # | `at` | Eyebrow | Title | Source of frames |
|---|------|---------|-------|------------------|
| 1 | 0.00 | Plan 01 · Vue aérienne | Six mètres au-dessus | AI (generated aerial descent) |
| 2 | 0.13 | Plan 02 · Face avant | Calandre diamant | real |
| 3 | 0.27 | Plan 03 · Trois-quarts avant | Le regard LED | real |
| 4 | 0.41 | Plan 04 · Profil | Des lignes qui filent | real |
| 5 | 0.55 | Plan 05 · Trois-quarts arrière | Épaules musclées | real |
| 6 | 0.68 | Plan 06 · Face arrière | Signature lumineuse | real |
| 7 | 0.81 | Plan 07 · Tour complet | Le flanc opposé | AI (generated left flank closes the 360°) |
| 8 | 0.92 | Plan 08 · À bord | Cuir. Écrans. Silence. | AI fly-through → real interior |

The orbit is a single continuous direction: aerial → front → front ¾ → profile → rear ¾
→ rear → around the far (left) flank → fly-through into the cabin.

> The **real/AI distinction is a production concern, not UI** — the shipped component
> shows only the narrative eyebrow/title; we do not label synthetic frames to visitors.
> Beat copy is final-draft and may be tuned during implementation.

---

## 4. Asset-generation pipeline (offline, `scripts/`)

A standalone, re-runnable Node script (not bundled, not imported by the app). Reads
`FAL_KEY` from `.env.local`. Each stage caches its output so re-runs don't re-pay fal.ai.

**Stage 0 — Keyframe prep.** Normalize the real stills to a common frame, scale, and
matched black-studio background. Produce the canonical exterior keyframe set.

**Stage 1 — Fill the gaps (image generation).** Generate the **missing left-flank**
keyframes (left ¾-front, left profile, left ¾-rear) and an **aerial** establishing
keyframe, conditioned on the real shots so paint, wheels, and proportions match.
Asymmetric details (CHANGAN wordmark, `CS55 PHEV` plate, fuel door, badges) must read
correctly — **not** mirror-flipped. Candidate tools: **nano-banana-pro** (Gemini 3 Pro
Image) and/or fal.ai image-to-image; final pick by fidelity.

**Stage 2 — Segment generation (fal.ai, image-guided).** Generate the move in short
segments using **start→end-frame interpolation** for maximum accuracy:
1. `aerial-descent` — aerial keyframe → front ¾.
2. `orbit` — chained keyframe pairs around the full ring (right ¾ → profile → front →
   left flank → rear ¾ → rear), each segment anchored by two keyframes.
3. `window-flythrough` — exterior push toward side glass/windshield → interior still.
4. `interior-push-in` — slow dolly within the cabin.

Lean models first (e.g. Kling std / WAN-FLF / Luma / MiniMax — first/last-frame capable);
a segment that drifts is re-run on a **premium** model (Veo 3 / Kling 2.x Pro / Runway
Gen-4). **Review gate:** candidate segments are reviewed together before frame extraction.

**Stage 3 — Stitch + extract.** Concatenate approved segments into one master clip;
`ffmpeg` extracts the target frame counts. Frames are tone/aspect-normalized so the
black-studio exterior and warm interior read as one continuous piece.

**Stage 4 — Optimize + emit.** Encode **AVIF** (+ **WebP** fallback) at desktop/mobile
sizes via `sharp`; emit a `poster`. Write a small `manifest.json` (counts, dims, paths)
for the record.

**Output layout (committed):**
```
public/images/model/cs55-phev/3d/
  desktop/0000.avif … 0119.avif      (+ .webp fallbacks)
  mobile/0000.avif  … 0059.avif      (+ .webp fallbacks)
  poster.avif (+ .webp)
  manifest.json
```
Raw video + intermediate segments live in scratch / a gitignored work dir, never committed.

---

## 5. Playback component — `CinematicSequence`

New client component at `src/components/sections/model/CinematicSequence.tsx`,
**replacing** `SpinViewer` in the model route. One clear job: scrub a frame sequence to
scroll within a pinned stage, with ATLAS-styled beat captions.

**Behavior**
- **Pinned stage:** a tall track (≈600vh, configurable) with a `sticky`, `100vh` stage;
  a `<canvas>` fills the stage and draws the scroll-mapped frame (`object-fit: cover`
  equivalent, computed in canvas).
- **Scroll → frame:** progress = clamped position within the track; `frame =
  round(progress × (frameCount−1))`. The displayed progress is **lerp-smoothed** in a
  `requestAnimationFrame` loop for buttery motion (matches the approved demo).
- **Preload + arm:** all frames for the active set preload with a progress indicator;
  the scrubber arms only once decoded, so it never shows a blank/stale frame.
- **Responsive set:** desktop vs mobile frame set chosen by viewport (and a coarse
  device/`matchMedia` check); only one set is fetched.
- **Beat captions:** absolutely-positioned ATLAS captions (IBM Plex Mono eyebrow +
  Bricolage display title) fade/slide in around each beat's `at`.
- **Lazy-mount:** `IntersectionObserver` defers decoding the sequence until the section
  is near the viewport; height is reserved to avoid layout shift.

**Fallbacks**
- `prefers-reduced-motion: reduce` → render the **poster** (no scrub), optionally a small
  static gallery of key angles; no pinning.
- No-JS / decode failure → poster.
- Mobile → lighter frame set; if data-saver (`prefers-reduced-data`) → poster.

**Props (shape):** `{ data: Cinematic3D; name: string }` — pure presentational; all asset
paths/counts/beats come from content.

---

## 6. Data model & integration

**`src/content/types.ts`** — add:
```ts
export type CinematicBeat = { at: number; eyebrow: string; title: string; text?: string };
export type Cinematic3D = {
  frameCount: number;        // desktop
  mobileFrameCount: number;
  framePath: string;         // template with {i}, e.g. "/images/model/cs55-phev/3d/desktop/{i}.avif"
  mobileFramePath: string;
  poster: string;
  webpFallback?: boolean;
  beats: CinematicBeat[];
};
// Model: add `cinematic3d?: Cinematic3D;`
```
`{i}` is zero-padded to 4 digits. The component builds each URL by substituting `{i}`.

**`src/content/models/cs55-phev.ts`** — add `cinematic3d` (paths, counts, 8 beats); remove
the now-dead `hasSpin: true` / `spinFrames` placeholders for this model.

**`src/app/modeles/[slug]/page.tsx`** — render `<CinematicSequence data={model.cinematic3d} name={model.name} />`
(guarded by `model.cinematic3d`) where `<SpinViewer>` currently renders.

**Cleanup (related):** delete `SpinViewer.tsx` and its test (no other model uses it). The
`hasSpin`/`spinFrames` fields are removed from `types.ts` only if no other model relies on
them; otherwise left untouched to avoid churn. (At spec time, only CS55 PHEV used spin.)

---

## 7. Quality bars

- **Design:** ATLAS tokens/motion only (brand `#134A87`, azure `#1A5FD0`, ink `#0F2A4D`,
  field `#ECF1F8`, panel `#F7FAFD`, sky `#DBE6F5`, line `#E0E8F3`, muted `#54637C`);
  ease-out `cubic-bezier(.23,1,.32,1)`; the deep-ink immersive stage is consistent with
  the parent spec's "deep-navy sections for rhythm."
- **Performance:** AVIF + responsive sets; lazy decode; explicit mobile frame budget;
  **zero CLS** (reserved height); only the active set fetched. Target: mobile sequence
  payload kept modest via frame count + AVIF.
- **Accessibility (WCAG AA):** full `prefers-reduced-motion` path; the section is
  scroll-skippable and never traps; captions are real text; controls (if any) labeled;
  respects `prefers-reduced-data`.
- **Testing:** Vitest/RTL — poster renders, reduced-motion path renders without canvas
  scrub, beats present, lazy-mount guard, renders `null`/poster on absent data. Playwright
  — visual at 375 / 768 / 1440, no horizontal overflow.
- **Lint/build:** `npm run lint` (0), `npm run test`, `npm run build` green;
  `react/no-unescaped-entities` respected in French copy.

---

## 8. Build sequence (three implementation plans)

Each becomes its own plan via the writing-plans skill; all share this spec.

- **Plan A — Asset pipeline & generation.** `scripts/` pipeline; `.env.example` documents
  `FAL_KEY`; generate left flank + aerial; fal.ai segments (start→end-frame); review;
  stitch; extract; optimize; emit committed frames + `manifest.json`.
- **Plan B — Component & integration.** `CinematicSequence` (canvas scrub, preload, lerp,
  captions, lazy-mount, fallbacks); `types.ts` + `cs55-phev.ts` data; route wiring;
  retire `SpinViewer`; unit tests.
- **Plan C — Polish & verification.** Perf budget, a11y/reduced-motion/reduced-data,
  mobile set tuning, Playwright visual pass, final review.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Left flank inaccurate** (mirrored badges/plate, wrong asymmetric details) | Generate (not mirror); condition on real shots; manual fidelity review; premium model + regen; worst case, tighten orbit so the unseen flank is briefly framed. |
| **Window fly-through looks fake / warps** | Start→end-frame interpolation anchored by real interior; premium models; multiple attempts; **fallback = the approved dissolve**. |
| **Identity drift over the orbit** | Keep AI segments short and keyframe-anchored at both ends; never free-roam a full turn in one shot. |
| **Payload / decode cost** (120 AVIF frames) | Responsive sets, lazy-mount, AVIF, mobile-only lighter set, poster for reduced-data. |
| **fal.ai cost overrun** | Lean models first; per-segment caching; review gate before extraction; escalate to premium only where needed. |
| **Scroll jank on low-end mobile** | Lerp + rAF; fewer mobile frames; poster fallback paths. |

---

## 10. Open items (resolved + remaining)

- ✅ **`FAL_KEY`** — secured in `.env.local` (moved out of `public/`). *Recommend rotating
  the key as hygiene.*
- **Final model selection** per segment — decided during Plan A against cost/quality
  (lean vs premium), not pre-committed here.
- **Exact frame counts (120/60)** and **pin height (~600vh)** — tunable in Plan C.
- **Left-flank & fly-through fidelity** — validated at the Plan A review gate; dissolve is
  the standing fallback for the interior entry.
- **`.env.example`** with a `FAL_KEY=` placeholder — added in Plan A.
