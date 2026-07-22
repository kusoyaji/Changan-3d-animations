import path from "node:path";
import { WORK, CANVAS } from "./config.mjs";
import { getFal, downloadFile } from "./lib/fal.mjs";
import { uploadImage } from "./lib/upload.mjs";
import { normalizeKeyframe } from "./lib/images.mjs";

// Mirroring the right-flank stills reverses the plate + tailgate wordmark on the
// left-flank keyframes. Use an image editor (Gemini/nano-banana) to fix ONLY the
// text so it reads correctly, keeping the car/background identical.
const kfDir = path.join(WORK, "keyframes");
const fal = getFal();

const EDITS = [
  {
    id: "front34L",
    prompt:
      "Edit ONLY the small rectangular front license plate on this Changan CS55 PHEV SUV (the white plate low on the front bumper). It currently shows backwards, mirrored, unreadable characters. Completely repaint that plate as a clean white rectangular license plate that clearly reads, correctly left-to-right and NOT mirrored: bold red 'CS55' followed by a small red 'PHEV' tag. Make it sharp and legible. Do not change the car body, grille, Changan V logo, headlights, wheels, paint colour, or the pure black background.",
  },
  {
    id: "rear34L",
    prompt:
      "Edit ONLY the small rectangular rear license plate on this Changan CS55 PHEV SUV (the white plate low-centre on the tailgate/bumper). It currently shows backwards, mirrored, unreadable characters. Completely repaint that plate as a clean white rectangular license plate that clearly reads, correctly left-to-right and NOT mirrored: bold red 'CS55' followed by a small red 'PHEV' tag. Keep the CHANGAN tailgate wordmark exactly as it is. Do not change the car body, tail lights, wheels, paint colour, or the pure black background.",
  },
];

for (const e of EDITS) {
  const url = await uploadImage(path.join(kfDir, `${e.id}.png`));
  const result = await fal.subscribe("fal-ai/nano-banana/edit", {
    input: { prompt: e.prompt, image_urls: [url], num_images: 1, output_format: "png", aspect_ratio: "auto" },
    logs: true,
  });
  const out = (result?.data ?? result)?.images?.[0]?.url;
  if (!out) throw new Error(`no edited image for ${e.id}: ${JSON.stringify(result?.data ?? result).slice(0, 300)}`);
  const raw = path.join(kfDir, `_fixed_${e.id}.png`);
  await downloadFile(out, raw);
  await normalizeKeyframe(raw, path.join(kfDir, `${e.id}.png`), CANVAS);
  console.log(`fixed badge on ${e.id}`);
}
console.log("badge fix done");
