import { test, expect } from "@playwright/test";

test("pause and resume works", async ({ page }) => {
  await page.goto("/");

  const enter = page.locator("button:has-text('Enter')");
  if (await enter.isVisible()) await enter.click();

  await page.getByTitle("Generate Horses").click();
  await page.getByTitle("Generate Program").click();
  await page.getByTitle("Start / Pause / Resume").click();

  await page.waitForTimeout(400);

  const horse = page.locator(".track .horse").first();
  const beforePause = await horse.evaluate(
    (el) => parseFloat(el.style.left) || 0
  );

  await page.getByTitle("Start / Pause / Resume").click();
  await page.waitForTimeout(500);

  const afterPause = await horse.evaluate(
    (el) => parseFloat(el.style.left) || 0
  );

  //  Allow tiny drift tolerance from animations
  expect(Math.abs(afterPause - beforePause)).toBeLessThan(0.5);

  await page.getByTitle("Start / Pause / Resume").click();
  await page.waitForTimeout(500);

  const afterResume = await horse.evaluate(
    (el) => parseFloat(el.style.left) || 0
  );
  expect(afterResume).toBeGreaterThan(beforePause);
});
