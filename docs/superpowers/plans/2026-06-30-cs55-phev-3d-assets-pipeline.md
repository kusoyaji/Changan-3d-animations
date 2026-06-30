# CS55 PHEV 3D — Asset Pipeline (Plan A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (inline, with review checkpoints — chosen over subagents because generation steps are paid, non-deterministic, and need human review of media). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Produce a committed, web-optimized frame sequence (≈120 desktop / ≈60 mobile AVIF+WebP frames + poster + manifest) of the CS55 PHEV cinematic camera move — aerial → full 360° orbit → window fly-through → interior — generated offline via fal.ai from the existing studio photography.

**Architecture:** A standalone, re-runnable Node (ESM `.mjs`) pipeline under `scripts/3d/`, never imported by the Next.js app. Real stills are normalized into keyframes; missing keyframes (left flank, aerial) are generated; fal.ai produces the move as short **start→end-frame** segments (accuracy-preserving); segments are stitched (ffmpeg), extracted to frames, and optimized (sharp) into `public/images/model/cs55-phev/3d/`. Deterministic helpers are unit-tested; paid generation steps are run-and-reviewed at explicit gates. A **proof segment** is generated and reviewed before any bulk spend.

**Tech Stack:** Node ESM scripts, `@fal-ai/client`, `sharp`, `ffmpeg-static`, Vitest (existing). Next.js app code is untouched in this plan (that's Plan B).

## Global Constraints

- **Pipeline is offline-only.** Nothing in `scripts/3d/` may be imported by `src/`. It is run manually from the terminal.
- **Secret handling:** `FAL_KEY` is read from `.env.local` (already present, gitignored). Never hardcode it, never log it, never commit it.
- **Git hygiene:** Raw video + intermediate segments + downloaded clips live under `scripts/3d/work/` which **must be gitignored**. Only final optimized frames + poster + `manifest.json` under `public/images/model/cs55-phev/3d/` are committed.
- **Budget posture:** Lean models first; **prove one segment and get user sign-off before bulk generation**; escalate a drifting segment to a premium model only when needed. Cache every fal result to avoid re-paying on re-run.
- **Accuracy bar:** the real vehicle must stay identity-accurate (paint, wheels, badges, `CS55 PHEV` plate, CHANGAN wordmark). Generated keyframes must not be mirror-flipped.
- **Frame budget:** desktop `FRAME_COUNT = 120`, mobile `MOBILE_FRAME_COUNT = 60` (tunable constants in `config.mjs`). AVIF primary + WebP fallback; desktop long edge ≈1600px, mobile ≈900px.
- **Source stills:** `public/images/CS55PHEV-ImagesFor3D/` (filenames contain spaces/accents/parentheses — always reference via the `KEYFRAMES` map, never inline).
- Node ≥ 18 (global `fetch` available). One commit per task. Run `npm run test` before commits that add/modify tested helpers.

---

## File structure (created by this plan)

```
scripts/3d/
  config.mjs            # constants, KEYFRAMES map, SEGMENTS definition, paths
  lib/
    env.mjs             # loadEnvLocal() — parse .env.local into process.env
    fal.mjs             # fal client init + falVideo() + downloadFile()
    images.mjs          # normalizeKeyframe(), optimizeFrame(), makePoster() (sharp)
    ffmpeg.mjs          # concatArgs(), extractArgs() pure builders + run wrappers
    paths.mjs           # buildFramePath(), padIndex(), buildManifest()
  01-prep-keyframes.mjs # normalize real stills -> work/keyframes
  02-gen-keyframes.mjs  # generate left-flank + aerial keyframes (fal i2i)
  03-gen-segments.mjs   # fal start->end segment generation (incl. --only <id> for proof)
  04-stitch.mjs         # concat segments -> work/master.mp4
  05-extract.mjs        # master.mp4 -> work/frames/desktop|mobile
  06-optimize.mjs       # frames -> public/.../3d (AVIF+WebP) + poster + manifest.json
  work/                 # GITIGNORED: keyframes, clips, master, raw frames
  __tests__/
    paths.test.mjs
    ffmpeg.test.mjs
    images.test.mjs
public/images/model/cs55-phev/3d/   # committed outputs (created in Task 8)
```

---

### Task 1: Pipeline scaffolding, deps, env wiring, fal connectivity

**Files:**
- Modify: `package.json` (devDeps + scripts), `.gitignore`, `.env.example` (create if absent)
- Create: `scripts/3d/lib/env.mjs`, `scripts/3d/lib/fal.mjs`, `scripts/3d/ping.mjs`

**Interfaces:**
- Produces: `loadEnvLocal(): void` (env.mjs) — reads `<repo>/.env.local`, sets `process.env[KEY]` for each `KEY=VALUE` line not already set; ignores blank/`#` lines; never throws if file missing.
- Produces: `getFal(): typeof fal` (fal.mjs) — calls `loadEnvLocal()`, asserts `process.env.FAL_KEY`, `fal.config({ credentials: process.env.FAL_KEY })`, returns `fal`.
- Produces: `downloadFile(url, destPath): Promise<string>` (fal.mjs) — fetch → write buffer → return destPath.

- [ ] **Step 1: Install dev dependencies**

Run:
```bash
npm install -D @fal-ai/client sharp ffmpeg-static
```
Expected: added to `devDependencies`, no errors.

- [ ] **Step 2: Gitignore the work dir**

Append to `.gitignore`:
```
# 3D pipeline intermediates (raw video/frames). Only optimized outputs in public/ are committed.
scripts/3d/work/
```

- [ ] **Step 3: Document the env var**

Create or append to `.env.example`:
```
# fal.ai API key for the offline 3D asset pipeline (scripts/3d/). Real value lives in .env.local.
FAL_KEY=your-fal-key-id:your-fal-key-secret
```

- [ ] **Step 4: Add npm scripts**

In `package.json` `"scripts"`, add:
```json
"3d:ping": "node scripts/3d/ping.mjs",
"3d:prep": "node scripts/3d/01-prep-keyframes.mjs",
"3d:gen-keyframes": "node scripts/3d/02-gen-keyframes.mjs",
"3d:gen": "node scripts/3d/03-gen-segments.mjs",
"3d:stitch": "node scripts/3d/04-stitch.mjs",
"3d:extract": "node scripts/3d/05-extract.mjs",
"3d:optimize": "node scripts/3d/06-optimize.mjs"
```

- [ ] **Step 5: Implement `scripts/3d/lib/env.mjs`**

```js
import fs from "node:fs";
import path from "node:path";

// Load .env.local (KEY=VALUE per line) into process.env without overwriting
// existing vars. Safe no-op if the file is missing. No external deps.
export function loadEnvLocal() {
  const file = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}
```

- [ ] **Step 6: Implement `scripts/3d/lib/fal.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { fal } from "@fal-ai/client";
import { loadEnvLocal } from "./env.mjs";

export function getFal() {
  loadEnvLocal();
  if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY missing. Put it in .env.local as FAL_KEY=id:secret");
  }
  fal.config({ credentials: process.env.FAL_KEY });
  return fal;
}

export async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status} for ${url}`);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return destPath;
}

// Generic fal video call. Returns the first video URL found in the result.
// modelId/input are supplied by config (verified against fal docs in Task 3).
export async function falVideo(modelId, input) {
  const f = getFal();
  const result = await f.subscribe(modelId, { input, logs: true });
  const data = result?.data ?? result;
  const url = data?.video?.url || data?.video_url || data?.videos?.[0]?.url;
  if (!url) throw new Error(`No video URL in result for ${modelId}: ${JSON.stringify(data).slice(0, 400)}`);
  return url;
}
```

- [ ] **Step 7: Implement `scripts/3d/ping.mjs` (connectivity check)**

```js
import { getFal } from "./lib/fal.mjs";

// Confirms FAL_KEY is loaded and the client is configured. Does NOT spend:
// it only initializes the client and prints a masked confirmation.
const fal = getFal();
const key = process.env.FAL_KEY || "";
const masked = key.length > 8 ? key.slice(0, 4) + "…" + key.slice(-2) : "(short)";
console.log("fal client configured. FAL_KEY loaded:", masked, "| length:", key.length);
console.log("client.subscribe is", typeof fal.subscribe === "function" ? "available" : "MISSING");
```

- [ ] **Step 8: Run the ping**

Run:
```bash
npm run 3d:ping
```
Expected: prints a masked key (length 69) and `client.subscribe is available`. If it says FAL_KEY missing, stop and fix `.env.local`.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json .gitignore .env.example scripts/3d/lib/env.mjs scripts/3d/lib/fal.mjs scripts/3d/ping.mjs
git commit -m "feat(3d): pipeline scaffolding, deps, env + fal connectivity"
```

---

### Task 2: Config + keyframe prep (normalize real stills)

**Files:**
- Create: `scripts/3d/config.mjs`, `scripts/3d/lib/images.mjs`, `scripts/3d/01-prep-keyframes.mjs`, `scripts/3d/__tests__/images.test.mjs`

**Interfaces:**
- Produces (config.mjs): `CANVAS = { w: 1920, h: 1080 }`; `FRAME_COUNT = 120`; `MOBILE_FRAME_COUNT = 60`; `WORK` (abs path to `scripts/3d/work`); `OUT` (abs path to `public/images/model/cs55-phev/3d`); `KEYFRAMES` (map id → source file path); `SEGMENTS` (array, defined in Task 3).
- Produces (images.mjs): `normalizeKeyframe(srcPath, destPath, canvas): Promise<{width,height}>` — resize-to-fit onto a black `canvas.w×canvas.h` background (letterbox, no crop), output PNG.

- [ ] **Step 1: Write `scripts/3d/config.mjs`**

```js
import path from "node:path";
const ROOT = process.cwd();
export const CANVAS = { w: 1920, h: 1080 };
export const FRAME_COUNT = 120;
export const MOBILE_FRAME_COUNT = 60;
export const WORK = path.join(ROOT, "scripts/3d/work");
export const OUT = path.join(ROOT, "public/images/model/cs55-phev/3d");
const SRC = path.join(ROOT, "public/images/CS55PHEV-ImagesFor3D");

// Real studio stills (right side + front + rear) and interior. Generated
// keyframes (aerial, left flank) are produced into WORK/keyframes in Task 4.
export const KEYFRAMES = {
  front:      path.join(SRC, "CS55 PHEV FACE MOBILE.jpg"),
  front34:    path.join(SRC, "CS55 PHEV 2 face droite.png"),
  profile:    path.join(SRC, "CS55 PHEV Horizontal with bg copie.png"),
  rear34:     path.join(SRC, "CS55PHEV 1 arriere droite.png"),
  rear:       path.join(SRC, "CS55 PHEV arriere.png"),
  interior:   path.join(SRC, "CS55 PHEV Sellerie en cuir.jpg"),
};
```

- [ ] **Step 2: Write the failing test `scripts/3d/__tests__/images.test.mjs`**

```js
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { normalizeKeyframe } from "../lib/images.mjs";

describe("normalizeKeyframe", () => {
  it("fits a source image onto the exact black canvas size", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kf-"));
    const src = path.join(dir, "src.png");
    await sharp({ create: { width: 800, height: 200, channels: 3, background: "#888" } }).png().toFile(src);
    const dest = path.join(dir, "out.png");
    const meta = await normalizeKeyframe(src, dest, { w: 1920, h: 1080 });
    expect(meta.width).toBe(1920);
    expect(meta.height).toBe(1080);
    expect(fs.existsSync(dest)).toBe(true);
  });
});
```

- [ ] **Step 3: Run it — expect FAIL**

Run: `npm run test -- images`
Expected: FAIL (`normalizeKeyframe` not exported).

- [ ] **Step 4: Implement `scripts/3d/lib/images.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Resize to fit inside canvas (no crop), centered on a black background,
// producing an exact canvas-sized PNG. Keeps every keyframe identically framed.
export async function normalizeKeyframe(srcPath, destPath, canvas) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const resized = await sharp(srcPath)
    .resize(canvas.w, canvas.h, { fit: "contain", background: { r: 0, g: 0, b: 0 } })
    .png()
    .toBuffer();
  await sharp(resized).toFile(destPath);
  const meta = await sharp(destPath).metadata();
  return { width: meta.width, height: meta.height };
}

// AVIF + WebP encode of one frame at a target long-edge. Returns out paths.
export async function optimizeFrame(srcPath, destNoExt, longEdge, quality = 50) {
  fs.mkdirSync(path.dirname(destNoExt), { recursive: true });
  const base = sharp(srcPath).resize(longEdge, longEdge, { fit: "inside", withoutEnlargement: true });
  await base.clone().avif({ quality }).toFile(`${destNoExt}.avif`);
  await base.clone().webp({ quality: quality + 15 }).toFile(`${destNoExt}.webp`);
  return { avif: `${destNoExt}.avif`, webp: `${destNoExt}.webp` };
}
```

- [ ] **Step 5: Run it — expect PASS**

Run: `npm run test -- images`
Expected: PASS.

- [ ] **Step 6: Write `scripts/3d/01-prep-keyframes.mjs`**

```js
import path from "node:path";
import { KEYFRAMES, CANVAS, WORK } from "./config.mjs";
import { normalizeKeyframe } from "./lib/images.mjs";

const outDir = path.join(WORK, "keyframes");
for (const [id, src] of Object.entries(KEYFRAMES)) {
  const dest = path.join(outDir, `${id}.png`);
  const meta = await normalizeKeyframe(src, dest, CANVAS);
  console.log(`prepped ${id} -> ${dest} (${meta.width}x${meta.height})`);
}
console.log("Done. Inspect", outDir);
```

- [ ] **Step 7: Run prep + eyeball the output**

Run: `npm run 3d:prep`
Expected: 6 PNGs in `scripts/3d/work/keyframes/`, each 1920×1080, car centered on black. Open them to confirm framing/scale look consistent.

- [ ] **Step 8: Commit**

```bash
git add scripts/3d/config.mjs scripts/3d/lib/images.mjs scripts/3d/01-prep-keyframes.mjs scripts/3d/__tests__/images.test.mjs
git commit -m "feat(3d): config + keyframe normalization (sharp)"
```

---

### Task 3: Proof segment — verify a fal model + generate ONE orbit segment → USER REVIEW GATE

**Files:**
- Modify: `scripts/3d/config.mjs` (add `SEGMENTS` + `MODELS`)
- Create: `scripts/3d/lib/upload.mjs`, `scripts/3d/03-gen-segments.mjs`

**Interfaces:**
- Produces (config.mjs): `MODELS = { lean, premium }` (verified fal model ids); `SEGMENTS` — array of `{ id, from, to, model, prompt, durationSec }` where `from`/`to` are keyframe ids.
- Produces (upload.mjs): `uploadImage(absPath): Promise<string>` — uploads a local image to fal storage, returns a public URL (fal models need URLs, not local paths).
- Produces (03-gen-segments.mjs): CLI `node scripts/3d/03-gen-segments.mjs --only <segmentId>` generates a single segment; no flag = all. Caches to `work/clips/<id>.mp4`; skips if present unless `--force`.

- [ ] **Step 1: VERIFY the fal model + input schema (no guessing)**

Run (confirm the exact model id + start/end-frame input field names that are live today):
```bash
node -e "import('@fal-ai/client').then(m=>console.log(Object.keys(m)))"
```
Then check current model docs for a **first+last frame (keyframe) image-to-video** model. Candidates to verify on fal.ai: `fal-ai/luma-dream-machine` (keyframes `frame0`/`frame1`), `fal-ai/kling-video/v1.6/pro/image-to-video` (`image_url` + `tail_image_url`), `fal-ai/wan-flf2v`. Record the chosen lean model id and its **exact** start/end field names; premium fallback id (e.g. `fal-ai/kling-video/v2.1/master/image-to-video` or `fal-ai/veo3/image-to-video`). Write findings as a comment in `config.mjs`.

- [ ] **Step 2: Add `MODELS` + `SEGMENTS` to `config.mjs`**

```js
// Verified <DATE>: lean keyframe model = <id>, start field = <field>, end field = <field>.
export const MODELS = {
  lean: "fal-ai/luma-dream-machine",      // replace with the id verified in Step 1
  premium: "fal-ai/kling-video/v2.1/master/image-to-video",
};

// Single-direction orbit + entry. from/to are KEYFRAMES ids (or generated ids
// added in Task 4: aerialTop, front34L, profileL, rear34L). proof uses real frames only.
export const SEGMENTS = [
  { id: "proof_front_to_front34", from: "front", to: "front34", model: MODELS.lean,
    prompt: "Slow cinematic orbit around a parked SUV, smooth camera, fixed subject, studio black background, photorealistic, no warping.", durationSec: 3 },
  // full set added in Task 5
];
```

- [ ] **Step 3: Implement `scripts/3d/lib/upload.mjs`**

```js
import fs from "node:fs";
import { getFal } from "./fal.mjs";

// fal video models accept image URLs. Upload a local file to fal storage.
export async function uploadImage(absPath) {
  const fal = getFal();
  const buf = fs.readFileSync(absPath);
  const blob = new Blob([buf], { type: absPath.endsWith(".png") ? "image/png" : "image/jpeg" });
  const url = await fal.storage.upload(blob);
  return url;
}
```

- [ ] **Step 4: Implement `scripts/3d/03-gen-segments.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { SEGMENTS, WORK } from "./config.mjs";
import { falVideo, downloadFile } from "./lib/fal.mjs";
import { uploadImage } from "./lib/upload.mjs";

const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const force = args.includes("--force");
const kfDir = path.join(WORK, "keyframes");
const clipsDir = path.join(WORK, "clips");

const todo = only ? SEGMENTS.filter((s) => s.id === only) : SEGMENTS;
if (only && todo.length === 0) throw new Error(`No segment with id ${only}`);

for (const seg of todo) {
  const out = path.join(clipsDir, `${seg.id}.mp4`);
  if (fs.existsSync(out) && !force) { console.log(`cached ${seg.id}`); continue; }
  console.log(`generating ${seg.id} (${seg.from} -> ${seg.to}) on ${seg.model}`);
  const startUrl = await uploadImage(path.join(kfDir, `${seg.from}.png`));
  const endUrl = await uploadImage(path.join(kfDir, `${seg.to}.png`));
  // NOTE: field names per the model verified in Step 1. Example for Luma keyframes:
  const input = {
    prompt: seg.prompt,
    keyframes: { frame0: { type: "image", url: startUrl }, frame1: { type: "image", url: endUrl } },
  };
  const videoUrl = await falVideo(seg.model, input);
  await downloadFile(videoUrl, out);
  console.log(`saved ${out}`);
}
```

- [ ] **Step 5: Generate the proof segment**

Run:
```bash
npm run 3d:prep    # ensure keyframes exist
npm run 3d:gen -- --only proof_front_to_front34
```
Expected: `scripts/3d/work/clips/proof_front_to_front34.mp4` exists.

- [ ] **Step 6: USER REVIEW GATE — review the proof clip**

Open the MP4. Judge: is the car identity-accurate (no warping/melting of wheels, badges, body), is the motion smooth, is the black background stable? 
- If good → proceed to Task 4.
- If drift → set this segment's `model` to `MODELS.premium`, rerun with `--force`, re-review. 
- If still poor → adjust prompt/duration, or flag to revisit choreography. **Do not proceed to bulk generation until this is approved.**

- [ ] **Step 7: Commit (config + scripts only; clips are gitignored)**

```bash
git add scripts/3d/config.mjs scripts/3d/lib/upload.mjs scripts/3d/03-gen-segments.mjs
git commit -m "feat(3d): segment generator + proof segment (review gate)"
```

---

### Task 4: Generate missing keyframes (left flank + aerial)

**Files:**
- Create: `scripts/3d/02-gen-keyframes.mjs`
- Modify: `scripts/3d/config.mjs` (add generated keyframe ids + their generation specs)

**Interfaces:**
- Produces: generated keyframes written to `work/keyframes/{front34L,profileL,rear34L,aerialTop}.png`, normalized to `CANVAS`.
- Consumes: real keyframes from Task 2; `optimizeFrame`/`normalizeKeyframe` from images.mjs; fal image model (verified id).

- [ ] **Step 1: VERIFY a fal image-to-image / edit model**

Confirm a current fal image model that takes a reference image + prompt (e.g. `fal-ai/flux-pro/kontext`, `fal-ai/nano-banana/edit`, or `fal-ai/gemini-*-image`). Record the id + input field names (image url(s) + prompt) in a `config.mjs` comment. (Alternatively the nano-banana-pro Claude skill may be used for these stills; if so, save its outputs into `work/keyframes/` with the ids below and skip the script for that frame.)

- [ ] **Step 2: Add generation specs to `config.mjs`**

```js
// Generated keyframes. Prompts must preserve the exact CS55 PHEV identity and
// produce the OPPOSITE (left) flank with correct (non-mirrored) badges/plate,
// and a top-down ~6m aerial. Conditioned on the named real reference.
export const GEN_KEYFRAMES = [
  { id: "front34L", ref: "front34", model: "<image-model-id>",
    prompt: "Same charcoal-grey CS55 PHEV SUV, front three-quarter view of the LEFT side, identical studio black background and lighting, correct upright badges and plate, photorealistic." },
  { id: "profileL",  ref: "profile", model: "<image-model-id>",
    prompt: "Same CS55 PHEV, full LEFT-side profile, mirrored pose but with correct (not reversed) badges and CHANGAN wordmark, identical studio black background." },
  { id: "rear34L",   ref: "rear34", model: "<image-model-id>",
    prompt: "Same CS55 PHEV, rear three-quarter view of the LEFT side, identical studio black background, correct rear badges/plate." },
  { id: "aerialTop", ref: "front34", model: "<image-model-id>",
    prompt: "Same CS55 PHEV seen from a high ~6m elevated front-quarter aerial angle looking down at the roof and hood, identical studio black background, photorealistic, no distortion." },
];
```

- [ ] **Step 3: Implement `scripts/3d/02-gen-keyframes.mjs`**

```js
import path from "node:path";
import { GEN_KEYFRAMES, KEYFRAMES, CANVAS, WORK } from "./config.mjs";
import { uploadImage } from "./lib/upload.mjs";
import { getFal, downloadFile } from "./lib/fal.mjs";
import { normalizeKeyframe } from "./lib/images.mjs";

const kfDir = path.join(WORK, "keyframes");
const fal = getFal();

for (const spec of GEN_KEYFRAMES) {
  const refUrl = await uploadImage(KEYFRAMES[spec.ref] ? path.join(kfDir, `${spec.ref}.png`) : spec.ref);
  // field names per the image model verified in Step 1:
  const result = await fal.subscribe(spec.model, { input: { prompt: spec.prompt, image_url: refUrl }, logs: true });
  const data = result?.data ?? result;
  const url = data?.images?.[0]?.url || data?.image?.url;
  if (!url) throw new Error(`no image for ${spec.id}: ${JSON.stringify(data).slice(0,300)}`);
  const raw = path.join(kfDir, `_raw_${spec.id}.png`);
  await downloadFile(url, raw);
  await normalizeKeyframe(raw, path.join(kfDir, `${spec.id}.png`), CANVAS);
  console.log(`generated keyframe ${spec.id}`);
}
```

- [ ] **Step 4: Run + USER REVIEW GATE**

Run: `npm run 3d:gen-keyframes`
Expected: 4 generated keyframes in `work/keyframes/`. **Review for accuracy** (left-side badges/plate correct, paint/proportions match, aerial undistorted). Regenerate (premium model / tweaked prompt) until accurate. Mirror-flipping is not acceptable.

- [ ] **Step 5: Commit (script + config only)**

```bash
git add scripts/3d/02-gen-keyframes.mjs scripts/3d/config.mjs
git commit -m "feat(3d): generate left-flank + aerial keyframes"
```

---

### Task 5: Full segment set (orbit ring + fly-through + interior push)

**Files:**
- Modify: `scripts/3d/config.mjs` (complete `SEGMENTS`)

**Interfaces:**
- Consumes: all keyframes (real + generated) in `work/keyframes/`; the generator from Task 3.

- [ ] **Step 1: Complete `SEGMENTS` in `config.mjs`**

```js
export const SEGMENTS = [
  { id: "s1_aerial_to_front",   from: "aerialTop", to: "front",    model: MODELS.lean, durationSec: 3,
    prompt: "Cinematic descent from a high aerial down to the front of a parked CS55 PHEV SUV, smooth, fixed subject, studio black background, photorealistic." },
  { id: "s2_front_to_front34",  from: "front",     to: "front34",  model: MODELS.lean, durationSec: 2, prompt: "Smooth orbit, fixed subject, studio black background." },
  { id: "s3_front34_to_profile",from: "front34",   to: "profile",  model: MODELS.lean, durationSec: 2, prompt: "Smooth orbit continuing around the side, studio black background." },
  { id: "s4_profile_to_rear34", from: "profile",   to: "rear34",   model: MODELS.lean, durationSec: 2, prompt: "Smooth orbit toward the rear, studio black background." },
  { id: "s5_rear34_to_rear",    from: "rear34",    to: "rear",     model: MODELS.lean, durationSec: 2, prompt: "Smooth orbit to the rear, studio black background." },
  { id: "s6_rear_to_rear34L",   from: "rear",      to: "rear34L",  model: MODELS.lean, durationSec: 2, prompt: "Smooth orbit continuing past the rear to the far side, studio black background." },
  { id: "s7_rear34L_to_profileL",from: "rear34L",  to: "profileL", model: MODELS.lean, durationSec: 2, prompt: "Smooth orbit along the far side, studio black background." },
  { id: "s8_profileL_to_front34L",from: "profileL",to: "front34L", model: MODELS.lean, durationSec: 2, prompt: "Smooth orbit closing the 360 toward the front, studio black background." },
  { id: "s9_flythrough",        from: "profileL",  to: "interior", model: MODELS.premium, durationSec: 3,
    prompt: "Camera pushes toward the driver side window of the CS55 PHEV and passes through the glass into the cabin, ending on the tan leather interior and dashboard, cinematic, photorealistic." },
  { id: "s10_interior_push",    from: "interior",  to: "interior", model: MODELS.lean, durationSec: 3,
    prompt: "Slow gentle dolly forward inside the CS55 PHEV cabin over the leather seats and dual screens, subtle motion, photorealistic." },
];
```

- [ ] **Step 2: Generate all segments**

Run: `npm run 3d:gen`
Expected: ten `.mp4` files in `work/clips/`. Cached segments skip. Review each; rerun any drifter with its `model` flipped to premium + `--force`.

- [ ] **Step 3: USER REVIEW GATE** — review all clips together for continuity (orientation flows one direction, fly-through reads, interior settles). Fix outliers before stitching. The fly-through (`s9`) is the riskiest — if no attempt is clean, replace it with a cross-dissolve fallback (handled in stitch Task 6, Step 4).

- [ ] **Step 4: Commit (config only)**

```bash
git add scripts/3d/config.mjs
git commit -m "feat(3d): full segment set (360 orbit + fly-through + interior)"
```

---

### Task 6: Stitch segments → master clip

**Files:**
- Create: `scripts/3d/lib/ffmpeg.mjs`, `scripts/3d/04-stitch.mjs`, `scripts/3d/__tests__/ffmpeg.test.mjs`

**Interfaces:**
- Produces (ffmpeg.mjs): `concatArgs(listFile, outPath): string[]`; `extractArgs(inPath, outPattern, fps): string[]`; `run(args): void` (execFileSync on ffmpeg-static).
- Produces: `work/master.mp4`.

- [ ] **Step 1: Write failing test `scripts/3d/__tests__/ffmpeg.test.mjs`**

```js
import { describe, it, expect } from "vitest";
import { concatArgs, extractArgs } from "../lib/ffmpeg.mjs";

describe("ffmpeg arg builders", () => {
  it("concat uses the concat demuxer and copies", () => {
    expect(concatArgs("/w/list.txt", "/w/master.mp4")).toEqual(
      ["-y", "-f", "concat", "-safe", "0", "-i", "/w/list.txt", "-c", "copy", "/w/master.mp4"]
    );
  });
  it("extract sets fps and output pattern", () => {
    expect(extractArgs("/w/master.mp4", "/w/frames/%04d.png", 30)).toEqual(
      ["-y", "-i", "/w/master.mp4", "-vf", "fps=30", "/w/frames/%04d.png"]
    );
  });
});
```

- [ ] **Step 2: Run — expect FAIL.** Run: `npm run test -- ffmpeg`. Expected: FAIL (module missing).

- [ ] **Step 3: Implement `scripts/3d/lib/ffmpeg.mjs`**

```js
import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

export function concatArgs(listFile, outPath) {
  return ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outPath];
}
export function extractArgs(inPath, outPattern, fps) {
  return ["-y", "-i", inPath, "-vf", `fps=${fps}`, outPattern];
}
export function run(args) {
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
}
```

- [ ] **Step 4: Implement `scripts/3d/04-stitch.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { SEGMENTS, WORK } from "./config.mjs";
import { concatArgs, run } from "./lib/ffmpeg.mjs";

const clipsDir = path.join(WORK, "clips");
const listFile = path.join(WORK, "concat.txt");
// Order = SEGMENTS order. If s9_flythrough was rejected, remove it here and the
// dissolve fallback is the natural cut between exterior and interior clips.
const lines = SEGMENTS
  .map((s) => path.join(clipsDir, `${s.id}.mp4`))
  .filter((p) => fs.existsSync(p))
  .map((p) => `file '${p.replace(/'/g, "'\\''")}'`);
fs.writeFileSync(listFile, lines.join("\n") + "\n");
run(concatArgs(listFile, path.join(WORK, "master.mp4")));
console.log("wrote", path.join(WORK, "master.mp4"));
```

- [ ] **Step 5: Run tests + stitch**

Run: `npm run test -- ffmpeg` (PASS), then `npm run 3d:stitch`.
Expected: `work/master.mp4` plays the full move start to finish. (If concat fails due to differing codecs between models, re-encode step: add `-c:v libx264 -r 30` variant — note for executor.)

- [ ] **Step 6: Commit**

```bash
git add scripts/3d/lib/ffmpeg.mjs scripts/3d/04-stitch.mjs scripts/3d/__tests__/ffmpeg.test.mjs
git commit -m "feat(3d): ffmpeg stitch to master clip"
```

---

### Task 7: Extract frames

**Files:**
- Create: `scripts/3d/lib/paths.mjs`, `scripts/3d/05-extract.mjs`, `scripts/3d/__tests__/paths.test.mjs`

**Interfaces:**
- Produces (paths.mjs): `padIndex(i, width=4): string`; `buildFramePath(template, i): string` (replaces `{i}`); `buildManifest({frameCount,mobileFrameCount,...}): object`.
- Produces: raw frames in `work/frames/desktop/%04d.png` and `work/frames/mobile/%04d.png`.

- [ ] **Step 1: Write failing test `scripts/3d/__tests__/paths.test.mjs`**

```js
import { describe, it, expect } from "vitest";
import { padIndex, buildFramePath, buildManifest } from "../lib/paths.mjs";

describe("paths", () => {
  it("pads indices", () => { expect(padIndex(7)).toBe("0007"); expect(padIndex(123)).toBe("0123"); });
  it("builds frame paths", () => {
    expect(buildFramePath("/x/{i}.avif", 7)).toBe("/x/0007.avif");
  });
  it("builds a manifest", () => {
    const m = buildManifest({ frameCount: 120, mobileFrameCount: 60 });
    expect(m.frameCount).toBe(120);
    expect(m.framePath).toContain("{i}");
    expect(m.poster).toMatch(/poster/);
  });
});
```

- [ ] **Step 2: Run — expect FAIL.** Run: `npm run test -- paths`.

- [ ] **Step 3: Implement `scripts/3d/lib/paths.mjs`**

```js
export function padIndex(i, width = 4) { return String(i).padStart(width, "0"); }
export function buildFramePath(template, i) { return template.replace("{i}", padIndex(i)); }
export function buildManifest({ frameCount, mobileFrameCount }) {
  const dir = "/images/model/cs55-phev/3d";
  return {
    frameCount, mobileFrameCount,
    framePath: `${dir}/desktop/{i}.avif`,
    mobileFramePath: `${dir}/mobile/{i}.avif`,
    poster: `${dir}/poster.avif`,
    webpFallback: true,
  };
}
```

- [ ] **Step 4: Implement `scripts/3d/05-extract.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { WORK, FRAME_COUNT, MOBILE_FRAME_COUNT } from "./config.mjs";

// Probe duration so we can choose fps = frames / duration for an exact count.
function duration(file) {
  const out = execFileSync(ffmpegPath, ["-i", file], { stdio: ["ignore", "ignore", "pipe"] , encoding: "utf8" }).toString?.() || "";
  // ffmpeg prints to stderr; if not captured, fall back to a fixed fps below.
  const m = out.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
  if (!m) return null;
  return (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]);
}
const master = path.join(WORK, "master.mp4");
const dur = duration(master);
for (const [set, count] of [["desktop", FRAME_COUNT], ["mobile", MOBILE_FRAME_COUNT]]) {
  const outDir = path.join(WORK, "frames", set);
  fs.mkdirSync(outDir, { recursive: true });
  const fps = dur ? (count / dur).toFixed(4) : (count / 22).toFixed(4); // 22s ≈ sum of durations fallback
  execFileSync(ffmpegPath, ["-y", "-i", master, "-vf", `fps=${fps}`, path.join(outDir, "%04d.png")], { stdio: "inherit" });
  console.log(`extracted ~${count} ${set} frames at fps ${fps}`);
}
```

- [ ] **Step 5: Run tests + extract**

Run: `npm run test -- paths` (PASS), then `npm run 3d:extract`.
Expected: ~120 PNGs in `work/frames/desktop/`, ~60 in `work/frames/mobile/`. Confirm counts (`ls | wc -l`); trim/pad the last frames if off-by-one.

- [ ] **Step 6: Commit**

```bash
git add scripts/3d/lib/paths.mjs scripts/3d/05-extract.mjs scripts/3d/__tests__/paths.test.mjs
git commit -m "feat(3d): frame extraction + path/manifest helpers"
```

---

### Task 8: Optimize → public/ + manifest, verify, commit assets

**Files:**
- Create: `scripts/3d/06-optimize.mjs`
- Create (output, committed): `public/images/model/cs55-phev/3d/**`

**Interfaces:**
- Consumes: `optimizeFrame` (images.mjs), `buildManifest` (paths.mjs), raw frames from Task 7.
- Produces: committed AVIF+WebP frame sets, `poster.avif/.webp`, `manifest.json`.

- [ ] **Step 1: Implement `scripts/3d/06-optimize.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { WORK, OUT, FRAME_COUNT, MOBILE_FRAME_COUNT } from "./config.mjs";
import { optimizeFrame } from "./lib/images.mjs";
import { buildManifest, padIndex } from "./lib/paths.mjs";

async function optimizeSet(set, longEdge) {
  const inDir = path.join(WORK, "frames", set);
  const outDir = path.join(OUT, set);
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(inDir).filter((f) => f.endsWith(".png")).sort();
  for (let i = 0; i < files.length; i++) {
    await optimizeFrame(path.join(inDir, files[i]), path.join(outDir, padIndex(i)), longEdge);
  }
  return files.length;
}
const d = await optimizeSet("desktop", 1600);
const m = await optimizeSet("mobile", 900);
// poster = first desktop frame
await optimizeFrame(path.join(WORK, "frames/desktop", fs.readdirSync(path.join(WORK,"frames/desktop")).filter(f=>f.endsWith(".png")).sort()[0]), path.join(OUT, "poster"), 1600);
const manifest = buildManifest({ frameCount: d, mobileFrameCount: m });
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`optimized ${d} desktop + ${m} mobile frames -> ${OUT}`);
```

- [ ] **Step 2: Run optimize**

Run: `npm run 3d:optimize`
Expected: `public/images/model/cs55-phev/3d/desktop/0000.avif…`, `mobile/…`, `poster.avif`, `manifest.json`. Spot-check a few AVIFs open and look correct; check total committed size is reasonable (target desktop set ≲ a few MB, mobile lighter).

- [ ] **Step 3: Final USER REVIEW GATE — scrub preview**

Quick check the sequence reads as continuous motion (open frames in order, or a quick `ffmpeg` playback of `master.mp4`). This is the "review the 3D animation and results" checkpoint before it goes into the app (Plan B).

- [ ] **Step 4: Commit the assets**

```bash
git add scripts/3d/06-optimize.mjs public/images/model/cs55-phev/3d
git commit -m "feat(3d): optimized CS55 PHEV 3D frame sequence + manifest"
```

---

## Self-Review

**Spec coverage (§4 of the spec):** Stage 0 prep → Task 2; Stage 1 gap-fill (left flank + aerial) → Task 4; Stage 2 segmented start→end generation (orbit + fly-through + interior) → Tasks 3 (proof) + 5 (full); Stage 3 stitch+extract → Tasks 6–7; Stage 4 optimize+emit (AVIF/WebP+poster+manifest, committed layout) → Task 8. Caching + review gates → Tasks 3/4/5/8. `FAL_KEY` from `.env.local`, offline-only, work dir gitignored → Tasks 1. Lean-first + premium escalation + proof-first → Tasks 3/5. **Covered.**

**Out of scope (correctly deferred to Plan B/C):** the `CinematicSequence` component, `types.ts`/`cs55-phev.ts` data, route wiring, `SpinViewer` retirement, in-app perf/a11y. This plan stops at committed assets + manifest.

**Placeholder scan:** Model ids in Tasks 3/4 are marked **verify-before-use** with concrete candidate ids and a verification command — deliberate (live schemas must be confirmed), not lazy TODOs. All deterministic helpers have complete code + tests. The fal `input` objects show the real shape with a note to confirm exact field names against the model verified in the same task.

**Type/name consistency:** `normalizeKeyframe`/`optimizeFrame` (images.mjs) used in Tasks 2/4/8; `falVideo`/`downloadFile` (fal.mjs) in Tasks 3/4; `uploadImage` (upload.mjs) in Tasks 3/4; `concatArgs`/`extractArgs`/`run` (ffmpeg.mjs) in Task 6; `padIndex`/`buildFramePath`/`buildManifest` (paths.mjs) in Tasks 7/8. `SEGMENTS`/`KEYFRAMES`/`MODELS`/`GEN_KEYFRAMES`/`CANVAS`/`WORK`/`OUT`/`FRAME_COUNT`/`MOBILE_FRAME_COUNT` all defined in config.mjs and consumed consistently. Manifest field names (`frameCount`, `framePath`, `mobileFramePath`, `poster`, `webpFallback`) match the spec's `Cinematic3D` type for Plan B.
