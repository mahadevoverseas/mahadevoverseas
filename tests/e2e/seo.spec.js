import { test, expect } from "@playwright/test";

test("home has Open Graph tags and organisation JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Mahadev Overseas/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-image\.jpg/);
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
  expect(ld["@type"]).toEqual(expect.arrayContaining(["EducationalOrganization", "LocalBusiness"]));
  expect(ld.name).toBe("Mahadev Overseas");
});

test("robots.txt hides admin and sitemap lists all pages", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \/admin/);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/countries", "/services", "/journey", "/gallery", "/contact", "/countries/canada"]) expect(sitemap).toContain(p);
});
