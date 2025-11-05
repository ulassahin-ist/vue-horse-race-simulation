import { test, expect } from "@playwright/test";

test("full race flow works", async ({ page }) => {
  await page.addInitScript(() => {
    window.__E2E__ = true;
  });

  await page.goto("/");

  const enter = page.locator("button:has-text('Enter')");
  if (await enter.isVisible()) await enter.click();

  await page.getByTitle("Generate Horses").click();
  await expect(page.locator(".horse-list table tbody tr")).toHaveCount(20);

  await page.getByTitle("Generate Program").click();
  await expect(page.locator(".race-programs table tbody tr")).toHaveCount(60);

  await page.getByTitle("Start / Pause / Resume").click();

  //  Now races will run fast because E2E flag shortened delays
  const results = page.locator(".race-results .result-block");
  await expect(results).toHaveCount(6, { timeout: 15000 });
});
