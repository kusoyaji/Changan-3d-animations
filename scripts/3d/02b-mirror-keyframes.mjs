import path from "node:path";
import sharp from "sharp";
import { WORK } from "./config.mjs";

// The car is externally symmetric (user-confirmed L=R), so we synthesize the
// left-flank keyframes by horizontally mirroring the real right-flank frames.
// Real (right): front34, profile, rear34  ->  mirrored (left): front34L, profileL, rear34L.
const kfDir = path.join(WORK, "keyframes");
const PAIRS = [
  ["front34", "front34L"],
  ["profile", "profileL"],
  ["rear34", "rear34L"],
];

for (const [src, dst] of PAIRS) {
  await sharp(path.join(kfDir, `${src}.png`)).flop().toFile(path.join(kfDir, `${dst}.png`));
  console.log(`mirrored ${src} -> ${dst}`);
}
console.log("Done. Mirrored keyframes in", kfDir);
