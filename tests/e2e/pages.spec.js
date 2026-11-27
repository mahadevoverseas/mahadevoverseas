import { test, expect } from "@playwright/test";
import { PAGES, BANNED, open, trackErrors } from "./helpers";

for (const path of PAGES) {
  test(`page ${path} loads cleanly`, async ({ page }) => {
    const errors = trackErrors(page);
    const res = await open(page, path);
    expect(res.status()).toBe(200);

    await expect(page).toHaveTitle(/Mahadev Overseas/);
    await expect(page.locator("h1")).toHaveCount(1);
    expect((await page.locator("h1").textContent()).trim().length).toBeGreaterThan(3);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{30,}/);

    // Header, footer and the floating WhatsApp button are on every page.
    await expect(page.locator("header nav")).toBeVisible();
    await expect(page.locator("footer")).toBeAttached();
    await expect(page.locator('a[href^="https://wa.me/"]').last()).toHaveAttribute("href", /wa\.me\/\d+\?text=/);

    // No sideways scrolling.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    // Every section labelled by a heading points at a heading that has text.
    const brokenLabels = await page.evaluate(() =>
      [...document.querySelectorAll("[aria-labelledby]")]
        .filter((el) => el.checkVisibility?.() !== false)
        .map((el) => el.getAttribute("aria-labelledby"))
        .filter((id) => !document.getElementById(id)?.textContent.trim())
    );
    expect(brokenLabels).toEqual([]);

    // Every image has alt text (empty alt is fine for decorative images).
    expect(await page.locator("img:not([alt])").count()).toBe(0);

    // Compliance: never promise a visa.
    const text = await page.locator("body").innerText();
    for (const re of BANNED) expect(text).not.toMatch(re);

    expect(errors).toEqual([]);
  });
}

test("unknown country shows the not-found page and is not indexed", async ({ page }) => {
  await page.goto("/countries/atlantis");
  await expect(page.getByRole("heading", { name: /off the flight path/i })).toBeVisible();
  const robots = await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((e) => e.content));
  expect(robots.length).toBeGreaterThan(0);
  for (const r of robots) expect(r).toMatch(/noindex/); // nothing tells search engines to index it
});

test("unknown URL returns a real 404", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /off the flight path/i })).toBeVisible();
});
