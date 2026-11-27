import { test, expect } from "@playwright/test";
import { open } from "./helpers";

test("gallery filters and lightbox", async ({ page }) => {
  await open(page, "/gallery");
  const grid = page.locator('[aria-labelledby="gallery-title"] ul');
  const all = await grid.locator("li").count();
  expect(all).toBeGreaterThanOrEqual(12);

  await page.getByRole("tab", { name: "Visas" }).click();
  await expect(grid.locator("li")).not.toHaveCount(all);
  const n = await grid.locator("li").count();
  for (let i = 0; i < n; i++) await expect(grid.locator("li").nth(i)).toContainText("Visas");

  await page.getByRole("tab", { name: "All" }).click();
  await grid.locator("li button").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("video")).toHaveAttribute("controls", "");
  const first = await dialog.locator("p.font-display").textContent();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator("p.font-display")).not.toHaveText(first);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
