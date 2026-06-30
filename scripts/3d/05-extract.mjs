import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { WORK, FRAME_COUNT, MOBILE_FRAME_COUNT } from "./config.mjs";

// Probe duration via `ffmpeg -i` (prints to stderr, exits non-zero with no output).
function duration(file) {
  try {
    execFileSync(ffmpegPath, ["-i", file], { stdio: ["ignore", "ignore", "pipe"] });
  } catch (e) {
    const s = (e.stderr || "").toString();
    const m = s.match(/Duration: (\d+):(\d+):([\d.]+)/);
    if (m) return +m[1] * 3600 + +m[2] * 60 + parseFloat(m[3]);
  }
  return null;
}

const master = path.join(WORK, "master.mp4");
if (!fs.existsSync(master)) throw new Error("master.mp4 missing. Run 3d:stitch first.");
const dur = duration(master);
if (!dur) console.warn("Could not probe duration; falling back to 35s estimate.");

for (const [set, count] of [["desktop", FRAME_COUNT], ["mobile", MOBILE_FRAME_COUNT]]) {
  const outDir = path.join(WORK, "frames", set);
  fs.mkdirSync(outDir, { recursive: true });
  const fps = (count / (dur || 35)).toFixed(4);
  execFileSync(ffmpegPath, ["-y", "-i", master, "-vf", `fps=${fps}`, path.join(outDir, "%04d.png")], { stdio: "inherit" });
  const got = fs.readdirSync(outDir).filter((f) => f.endsWith(".png")).length;
  console.log(`extracted ${got} ${set} frames (target ${count}, fps ${fps})`);
}
