import { test, expect } from "@playwright/test";

test("final summary modal shows 6 winners", async ({ page }) => {
  await page.addInitScript(() => {
    window.__E2E__ = true;
  });
  await page.goto("/");

  const enter = page.locator("button:has-text('Enter')");
  if (await enter.isVisible()) await enter.click();

  await page.getByTitle("Generate Horses").click();
  await page.getByTitle("Generate Program").click();
  await page.getByTitle("Start / Pause / Resume").click();

  //  Wait for the modal itself to appear
  const modal = page.locator(".summary-modal");
  await expect(modal).toBeVisible({ timeout: 50000 });

  //  Wait until 6 rows appear inside modal
  const rows = modal.locator(".summary-row");
  await expect(rows).toHaveCount(6, { timeout: 50000 });
});
