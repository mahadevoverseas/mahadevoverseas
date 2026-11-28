import { test, expect } from "@playwright/test";
import { open, trackErrors } from "./helpers";

test("home: hero, scroll scenes and sections work end to end", async ({ page }) => {
  const errors = trackErrors(page);
  await open(page, "/");
  await expect(page.locator("h1")).toContainText(/study visa consultants in/i);
  await expect(page.getByText(/your future/i).first()).toBeVisible();
  await expect(page.locator("#stats")).toBeAttached();

  // Scroll through the whole page in steps — nothing should throw.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 900) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator("footer")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("home: hero canvas draws video frames (motion allowed)", async ({ page }, info) => {
  test.skip(info.project.name === "reduced-motion", "frames are not used with reduced motion");
  await open(page, "/");
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect.poll(() => page.locator("canvas").first().evaluate((c) => c.style.opacity)).toBe("1");
});

test("reduced motion shows the still poster and skips the canvas", async ({ page }, info) => {
  test.skip(info.project.name !== "reduced-motion");
  await open(page, "/");
  await expect(page.locator("canvas").first()).toHaveCSS("opacity", "0");
  await expect(page.locator('img[alt*="holographic"]')).toBeVisible();
});
