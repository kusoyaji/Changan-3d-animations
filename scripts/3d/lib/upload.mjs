import fs from "node:fs";
import { getFal } from "./fal.mjs";

// fal video models accept image URLs. Upload a local file to fal storage.
export async function uploadImage(absPath) {
  const fal = getFal();
  const buf = fs.readFileSync(absPath);
  const blob = new Blob([buf], { type: absPath.endsWith(".png") ? "image/png" : "image/jpeg" });
  const url = await fal.storage.upload(blob);
  return url;
}
