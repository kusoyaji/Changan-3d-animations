import path from "node:path";
import { WORK, CANVAS } from "./config.mjs";
import { getFal, downloadFile } from "./lib/fal.mjs";
import { uploadImage } from "./lib/upload.mjs";
import { normalizeKeyframe } from "./lib/images.mjs";

// No real 6m aerial exists, so generate one from the real front-3/4 still.
const kfDir = path.join(WORK, "keyframes");
const fal = getFal();

const url = await uploadImage(path.join(kfDir, "front34.png"));
const prompt =
  "Same charcoal-grey Changan CS55 PHEV SUV, viewed from a high elevated aerial camera about 6 meters up looking down toward the roof, hood and front three-quarter of the car, on a solid pure-black studio background. Photorealistic, correct proportions, keep the CS55 PHEV identity, no distortion.";

const result = await fal.subscribe("fal-ai/nano-banana/edit", {
  input: { prompt, image_urls: [url], num_images: 1, output_format: "png", aspect_ratio: "auto" },
  logs: true,
});
const out = (result?.data ?? result)?.images?.[0]?.url;
if (!out) throw new Error("no aerial image: " + JSON.stringify(result?.data ?? result).slice(0, 300));
const raw = path.join(kfDir, "_raw_aerialTop.png");
await downloadFile(out, raw);
await normalizeKeyframe(raw, path.join(kfDir, "aerialTop.png"), CANVAS);
console.log("aerial keyframe generated -> aerialTop.png");
