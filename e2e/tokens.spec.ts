import { test, expect } from "@playwright/test";

test("brand token resolves", async ({ page }) => {
  await page.goto("/");
  const brand = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim()
  );
  expect(brand.toLowerCase()).toBe("#134a87");
});
