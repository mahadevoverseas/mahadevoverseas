import { test, expect } from "@playwright/test";
import { open, trackErrors } from "./helpers";

test("desktop menu navigates between pages without errors", async ({ page }, info) => {
  test.skip(info.project.name === "mobile");
  const errors = trackErrors(page);
  await open(page, "/");
  for (const [label, path] of [["Services", "/services"], ["Journey", "/journey"], ["Countries", "/countries"], ["Gallery", "/gallery"], ["Contact", "/contact"]]) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("header nav").getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    // Next keeps the previous page hidden for instant "Back", so count visible headings only.
    await expect(page.locator("h1:visible")).toHaveCount(1);
    await expect(page.locator("header nav").getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
  }
  expect(errors).toEqual([]);
});

test("mobile menu opens, navigates and closes", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await open(page, "/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: /Services/ }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(menu).toBeHidden();
});

test("country card leads to its detail page", async ({ page }) => {
  await open(page, "/countries/germany");
  await expect(page.locator("h1")).toContainText("Germany");
  await page.getByRole("link", { name: /Canada/ }).first().click();
  await expect(page).toHaveURL(/\/countries\/canada$/);
});

test("about page introduces the founder", async ({ page }) => {
  await page.goto("/about");
  const founder = page.locator('section[aria-labelledby="owner-name"]');
  await expect(founder).toBeAttached();
  await expect(founder.getByText(/meet the founder/i)).toBeAttached();
  await expect(founder.locator("img")).toHaveAttribute("alt", /.+/);
  await expect(founder.getByRole("link", { name: /founder/i })).toHaveAttribute("href", "/contact");
});

test("education loan highlights show with the lender-approval footnote", async ({ page }) => {
  for (const path of ["/", "/services"]) {
    await page.goto(path);
    const loans = page.locator('section[aria-labelledby="loans-title"]');
    await expect(loans).toBeAttached();
    await expect(loans.locator("li")).toHaveCount(3);
    await expect(loans).toContainText("Collateral-free loan options available*");
    await expect(loans).toContainText(/\*Subject to lender approval/);
  }
});
