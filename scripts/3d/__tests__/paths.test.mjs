import { describe, it, expect } from "vitest";
import { padIndex, buildFramePath, buildManifest } from "../lib/paths.mjs";

describe("paths", () => {
  it("pads indices", () => {
    expect(padIndex(7)).toBe("0007");
    expect(padIndex(123)).toBe("0123");
  });
  it("builds frame paths", () => {
    expect(buildFramePath("/x/{i}.avif", 7)).toBe("/x/0007.avif");
  });
  it("builds a manifest", () => {
    const m = buildManifest({ frameCount: 120, mobileFrameCount: 60 });
    expect(m.frameCount).toBe(120);
    expect(m.framePath).toContain("{i}");
    expect(m.poster).toMatch(/poster/);
  });
});
