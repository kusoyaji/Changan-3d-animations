import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { WORK } from "./config.mjs";

// Ingest a USER-PROVIDED master video (any tool: CGI, real footage, a stronger
// generator) and take it all the way to optimized web frames. This bypasses the
// AI generation/stitch stages (03/04) entirely — the provided file IS the master.
//
//   npm run 3d:ingest -- "C:\\path\\to\\your-video.mp4"
//
// Then review WORK/master-contactsheet.png to re-time the beat captions in
// src/content/models/cs55-phev.ts to this video's actual phase timeline.

const here = path.dirname(fileURLToPath(import.meta.url));
const src = process.argv[2];
if (!src) {
  console.error('Usage: npm run 3d:ingest -- "<path-to-video>"');
  process.exit(1);
}
if (!fs.existsSync(src)) {
  console.error("File not found: " + src);
  process.exit(1);
}

fs.mkdirSync(WORK, { recursive: true });
const master = path.join(WORK, "master.mp4");
fs.copyFileSync(src, master);
console.log("copied -> " + master);

// Probe duration + resolution (ffmpeg prints to stderr and exits non-zero).
function probe(file) {
  try {
    execFileSync(ffmpegPath, ["-i", file], { stdio: ["ignore", "ignore", "pipe"] });
  } catch (e) {
    const s = (e.stderr || "").toString();
    const d = s.match(/Duration: (\d+):(\d+):([\d.]+)/);
    const r = s.match(/, (\d{3,5})x(\d{3,5})/);
    return {
      dur: d ? +d[1] * 3600 + +d[2] * 60 + parseFloat(d[3]) : null,
      w: r ? +r[1] : null,
      h: r ? +r[2] : null,
    };
  }
  return {};
}
const info = probe(master);
console.log(`master: ${info.dur ?? "?"}s, ${info.w ?? "?"}x${info.h ?? "?"}`);
if (info.h && info.h < 1080) {
  console.warn(`WARNING: ${info.h}px tall — 1080p+ recommended for a crisp hero.`);
}

// Contact sheet (5x3 across the whole clip) to locate phases for beat re-timing.
const sheet = path.join(WORK, "master-contactsheet.png");
const n = 15;
const fps = (n / (info.dur || 40)).toFixed(4);
execFileSync(
  ffmpegPath,
  ["-y", "-i", master, "-vf", `fps=${fps},scale=480:-1,tile=5x3`, "-frames:v", "1", sheet],
  { stdio: "ignore" },
);
console.log("contact sheet -> " + sheet);

// Reuse the tested extract + optimize stages verbatim.
execFileSync(process.execPath, [path.join(here, "05-extract.mjs")], { stdio: "inherit" });
execFileSync(process.execPath, [path.join(here, "06-optimize.mjs")], { stdio: "inherit" });

console.log("\nDONE. Optimized frames written to public/. Next:");
console.log(" - open " + sheet + " to map phases");
console.log(" - re-time `beats[].at` in src/content/models/cs55-phev.ts to this clip");
