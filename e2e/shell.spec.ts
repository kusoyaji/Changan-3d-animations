import { test, expect } from "@playwright/test";

test("header and footer render on home", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Réserver un essai" }).first()).toBeVisible();
  await expect(page.getByText(/Mentions légales/i).first()).toBeVisible();
});
