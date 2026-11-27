import { test, expect } from "@playwright/test";
import { ADMIN_PASSWORD } from "./helpers";

test.describe.configure({ mode: "serial" });

test("admin is protected", async ({ page, request }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  const res = await request.post("/api/admin/upload", { multipart: { file: { name: "x.png", mimeType: "image/png", buffer: Buffer.from("x") } } });
  expect(res.status()).toBe(401);
});

test("wrong password is rejected", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.locator("form").getByRole("alert")).toHaveText("Incorrect password.");
});

test("admin can edit content, see enquiries, upload and log out", async ({ page }) => {
  // An enquiry to look for in the inbox.
  const lead = `Admin Inbox ${Date.now()}`;
  await page.request.post("/api/enquiry", { data: { name: lead, phone: "+91 90000 11111", email: "inbox@example.com", source: "contact-form" } });

  await page.goto("/admin/login");
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  // Edit the About signature and save.
  await page.locator("aside").getByRole("button", { name: "About" }).click();
  const field = page.locator("main input").last();
  const original = await field.inputValue();
  const edited = `— E2E signature ${Date.now()}`;
  await field.fill(edited);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");

  // The live page shows it.
  const about = await page.request.get("/about");
  expect(await about.text()).toContain(edited);

  // Restore it.
  await field.fill(original);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");

  // Enquiries inbox.
  await page.locator("aside").getByRole("button", { name: /Enquiries/ }).click();
  await expect(page.getByText(lead)).toBeVisible();

  // Upload goes to local storage in test mode and is served back.
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
  const up = await page.request.post("/api/admin/upload", { multipart: { file: { name: "e2e.png", mimeType: "image/png", buffer: png } } });
  expect(up.status()).toBe(200);
  const { url } = await up.json();
  expect(url).toMatch(/^\/media\/.+\.png$/);
  expect((await page.request.get(url)).status()).toBe(200);
  const svg = await page.request.post("/api/admin/upload", { multipart: { file: { name: "x.svg", mimeType: "image/svg+xml", buffer: Buffer.from("<svg/>") } } });
  expect(svg.status()).toBe(415);

  // Log out.
  await page.locator("aside").getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});
