import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Scroll-triggered Reveal animations start at opacity:0 until their
    // IntersectionObserver fires; full-page screenshots are taken without
    // scrolling through the page first, so without this, below-the-fold
    // (and sometimes above-the-fold, due to a render-timing race) content
    // would be captured invisible. Reveal honors this media query and
    // shows content immediately when set.
    contextOptions: {
      reducedMotion: "reduce",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
