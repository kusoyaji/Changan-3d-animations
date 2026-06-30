import fs from "node:fs";
import path from "node:path";
import { WORK, OUT } from "./config.mjs";
import { optimizeFrame } from "./lib/images.mjs";
import { buildManifest, padIndex } from "./lib/paths.mjs";

async function optimizeSet(set, longEdge) {
  const inDir = path.join(WORK, "frames", set);
  if (!fs.existsSync(inDir)) throw new Error(`${inDir} missing. Run 3d:extract first.`);
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
// Poster = first desktop frame.
const firstDesktop = fs.readdirSync(path.join(WORK, "frames/desktop")).filter((f) => f.endsWith(".png")).sort()[0];
await optimizeFrame(path.join(WORK, "frames/desktop", firstDesktop), path.join(OUT, "poster"), 1600);

const manifest = buildManifest({ frameCount: d, mobileFrameCount: m });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`optimized ${d} desktop + ${m} mobile frames -> ${OUT}`);
