import { test, expect } from "@playwright/test";
import { PAGES } from "./helpers";

const ldOf = async (page) => (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t));
const types = (lds) => lds.flatMap((d) => (d["@graph"] ?? [d]).flatMap((n) => [].concat(n["@type"])));

test("every page has its own canonical URL, title and description", async ({ page }) => {
  const titles = new Set();
  const descriptions = new Set();
  for (const path of PAGES) {
    await page.goto(path);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical).pathname.replace(/\/$/, "") || "/", path).toBe(path);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    const title = await page.title();
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(title.length, `${path} title`).toBeLessThanOrEqual(65);
    expect(desc.length, `${path} description`).toBeLessThanOrEqual(165);
    expect(titles.has(title), `duplicate title on ${path}`).toBe(false);
    expect(descriptions.has(desc), `duplicate description on ${path}`).toBe(false);
    titles.add(title);
    descriptions.add(desc);

    const lds = await ldOf(page);
    expect(types(lds)).toEqual(expect.arrayContaining(["WebSite", "EducationalOrganization", "LocalBusiness"]));
    if (path !== "/") expect(types(lds)).toContain("BreadcrumbList");
    for (const d of lds) expect(JSON.stringify(d), `placeholder in JSON-LD on ${path}`).not.toMatch(/\[[A-Z][^\]]*\]/);
  }
});

test("home and contact carry FAQ structured data matching the visible FAQ", async ({ page }) => {
  for (const path of ["/", "/contact"]) {
    await page.goto(path);
    const faq = (await ldOf(page)).find((d) => d["@type"] === "FAQPage");
    expect(faq, path).toBeTruthy();
    const firstQ = faq.mainEntity[0].name;
    await expect(page.locator('section[aria-labelledby="faq-title"] summary').first()).toContainText(firstQ);
    expect(firstQ).not.toContain("{city}");
  }
});

test("home has Open Graph tags", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Mahadev Overseas/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-image\.jpg/);
  await expect(page.locator('meta[name="geo.region"]')).toHaveAttribute("content", "IN-AP");
});

test("robots.txt hides admin and sitemap lists all pages", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \/admin/);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/countries", "/services", "/journey", "/gallery", "/contact", "/countries/canada"]) expect(sitemap).toContain(p);
});

test("guides: article structured data, listed in sitemap, drafts hidden", async ({ page, request }) => {
  await page.goto("/guides/education-loan-documents-checklist");
  const lds = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t));
  const article = lds.find((d) => d["@type"] === "Article");
  expect(article.headline).toMatch(/education loan/i);
  expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await expect(page.locator("h1")).toContainText(/education loan/i);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/guides/how-to-choose-study-visa-consultant-guntur");
  expect(sitemap).not.toContain("cost-of-studying-in-canada"); // draft

  await page.goto("/guides/cost-of-studying-in-canada-from-india");
  await expect(page.getByRole("heading", { name: /off the flight path/i })).toBeVisible();
});
