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
