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
  if (fs.existsSync(out) && !force) {
    console.log(`cached ${seg.id}`);
    continue;
  }
  console.log(`generating ${seg.id} (${seg.from} -> ${seg.to}) on ${seg.model}`);
  const startUrl = await uploadImage(path.join(kfDir, `${seg.from}.png`));
  const endUrl = await uploadImage(path.join(kfDir, `${seg.to}.png`));
  // Kling 1.6/2.x i2v schema (verified): image_url start + tail_image_url end.
  const input = {
    prompt: seg.prompt,
    image_url: startUrl,
    tail_image_url: endUrl,
    duration: seg.durationSec >= 8 ? "10" : "5",
    cfg_scale: 0.5,
    negative_prompt:
      "different vehicle, changing background, background color shift, warping, distortion, melting, extra wheels, deformed body, text changes, license plate changes, watermark",
  };
  // v1.6 accepts aspect_ratio; v2.1 does not (it follows the input image's ratio).
  if (seg.model.includes("v1.6")) input.aspect_ratio = "16:9";
  const videoUrl = await falVideo(seg.model, input);
  await downloadFile(videoUrl, out);
  console.log(`saved ${out}`);
}
console.log("segment generation done");
