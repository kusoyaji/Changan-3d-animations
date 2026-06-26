import { test, expect } from "@playwright/test";

test("CS55 PHEV detail page renders rich sections, no overflow", async ({ page }) => {
  await page.goto("/modeles/cs55-phev");
  await expect(page.getByRole("heading", { name: /CS55 PHEV|silence/i }).first()).toBeVisible();
  await expect(page.getByText("Couleurs")).toBeVisible();
  await expect(page.getByText(/Vue 360/i)).toBeVisible();
  await expect(page.getByText("Motorisation")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test("a stub model (alsvin) still renders a valid minimal page", async ({ page }) => {
  await page.goto("/modeles/alsvin");
  await expect(page.getByRole("link", { name: "Réserver un essai" }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test("unknown slug 404s", async ({ page }) => {
  const res = await page.goto("/modeles/nope");
  expect(res?.status()).toBe(404);
});
