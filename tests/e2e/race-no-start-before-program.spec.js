import { test, expect } from "@playwright/test";

test("race cannot start before program is generated", async ({ page }) => {
  await page.goto("/");

  const enter = page.locator("button:has-text('Enter')");
  if (await enter.isVisible()) await enter.click();

  const startBtn = page.getByTitle("Start / Pause / Resume");

  //  Assert cannot click instead of clicking
  await expect(startBtn).toBeDisabled();

  const results = page.locator(".race-results .result-block");
  await expect(results).toHaveCount(0);
});
