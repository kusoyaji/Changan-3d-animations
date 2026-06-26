import { test, expect } from "@playwright/test";

for (const [w, h] of [[1440, 900], [768, 1024], [375, 812]] as const) {
  test(`home renders at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    await expect(page.getByText(/Le voyage/)).toBeVisible();
    await expect(page.getByRole("link", { name: /CS55 PHEV/ }).first()).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    ).toBe(true);
    await page.screenshot({ path: `e2e/__screens__/home-${w}.png`, fullPage: true });
  });
}
