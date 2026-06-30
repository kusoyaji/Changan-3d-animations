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
