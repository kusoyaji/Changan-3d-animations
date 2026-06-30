import { describe, it, expect } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { normalizeKeyframe } from "../lib/images.mjs";

describe("normalizeKeyframe", () => {
  it("fits a source image onto the exact black canvas size", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kf-"));
    const src = path.join(dir, "src.png");
    await sharp({ create: { width: 800, height: 200, channels: 3, background: "#888" } }).png().toFile(src);
    const dest = path.join(dir, "out.png");
    const meta = await normalizeKeyframe(src, dest, { w: 1920, h: 1080 });
    expect(meta.width).toBe(1920);
    expect(meta.height).toBe(1080);
    expect(fs.existsSync(dest)).toBe(true);
  });
});
