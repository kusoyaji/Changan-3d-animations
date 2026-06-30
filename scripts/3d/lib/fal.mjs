import fs from "node:fs";
import path from "node:path";
import { fal } from "@fal-ai/client";
import { loadEnvLocal } from "./env.mjs";

export function getFal() {
  loadEnvLocal();
  if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY missing. Put it in .env.local as FAL_KEY=id:secret");
  }
  fal.config({ credentials: process.env.FAL_KEY });
  return fal;
}

export async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status} for ${url}`);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return destPath;
}

// Generic fal video call. Returns the first video URL found in the result.
// modelId/input are supplied by config (verified against fal docs in Task 3).
export async function falVideo(modelId, input) {
  const f = getFal();
  const result = await f.subscribe(modelId, { input, logs: true });
  const data = result?.data ?? result;
  const url = data?.video?.url || data?.video_url || data?.videos?.[0]?.url;
  if (!url) throw new Error(`No video URL in result for ${modelId}: ${JSON.stringify(data).slice(0, 400)}`);
  return url;
}
