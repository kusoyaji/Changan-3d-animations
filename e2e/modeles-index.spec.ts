import { test, expect } from "@playwright/test";

test("modeles index lists models and links to a detail page", async ({ page }) => {
  await page.goto("/modeles");
  await expect(page.getByRole("link", { name: /CS55 PHEV/ }).first()).toBeVisible();
  await page.getByRole("link", { name: /CS55 PHEV/ }).first().click();
  await expect(page).toHaveURL(/\/modeles\/cs55-phev$/);
});
