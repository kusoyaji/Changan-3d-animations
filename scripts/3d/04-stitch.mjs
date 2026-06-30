import fs from "node:fs";
import path from "node:path";
import { SEGMENTS, WORK } from "./config.mjs";
import { concatArgs, run } from "./lib/ffmpeg.mjs";

// Concatenate the segment clips (in SEGMENTS order) into one master clip.
// If s9_flythrough was rejected, remove it from SEGMENTS and the cut becomes the
// natural exterior->interior dissolve handled at playback.
const clipsDir = path.join(WORK, "clips");
const listFile = path.join(WORK, "concat.txt");
const lines = SEGMENTS.map((s) => path.join(clipsDir, `${s.id}.mp4`))
  .filter((p) => fs.existsSync(p))
  .map((p) => `file '${p.replace(/'/g, "'\\''")}'`);

if (lines.length === 0) throw new Error("No clips found to stitch. Run 3d:gen first.");
fs.writeFileSync(listFile, lines.join("\n") + "\n");
run(concatArgs(listFile, path.join(WORK, "master.mp4")));
console.log(`stitched ${lines.length} clips -> ${path.join(WORK, "master.mp4")}`);
