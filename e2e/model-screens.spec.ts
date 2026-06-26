import { test, expect } from "@playwright/test";

const targets: Array<[slug: string, width: number]> = [
  ["cs55-phev", 1440],
  ["cs55-phev", 768],
  ["cs55-phev", 375],
  ["alsvin", 1440],
  ["alsvin", 375],
];

for (const [slug, width] of targets) {
  test(`model page ${slug} renders at ${width}px with no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/modeles/${slug}`);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    ).toBe(true);
    // Walk the page top to bottom before capturing. fullPage screenshots
    // scroll through the page internally, but Next/Image's
    // IntersectionObserver-driven lazy load can still be mid-flight for
    // off-screen images when that scroll is fast and programmatic, leaving
    // them as empty placeholders in the capture. Scrolling in discrete
    // steps with a settle pause gives every observer time to fire and the
    // image to finish decoding before we move on.
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < pageHeight; y += 600) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `e2e/__screens__/model-${slug}-${width}.png`, fullPage: true });
  });
}
