import { test, expect } from "@playwright/test";
import { open, readEnquiries } from "./helpers";

test("contact form validates and saves an enquiry", async ({ page }, info) => {
  await open(page, "/contact");
  const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Send enquiry" }) });
  await form.getByRole("button", { name: "Send enquiry" }).click();
  await expect(form.getByText("Please enter your name.")).toBeVisible();
  await expect(form.getByText("Please enter a valid phone number.")).toBeVisible();

  const name = `E2E Contact ${info.project.name} ${Date.now()}`;
  await form.getByLabel("Full name").fill(name);
  await form.getByLabel("Phone").fill("+91 98765 43210");
  await form.getByLabel("Email").fill("e2e@example.com");
  await form.getByLabel("Country of interest").selectOption({ label: "Canada" });
  await form.getByLabel("Preferred intake").selectOption({ index: 1 });
  await form.getByLabel(/Message/).fill("Automated test enquiry");
  await form.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText(/Thank you! Your enquiry has reached us/)).toBeVisible();

  await expect.poll(() => readEnquiries().find((e) => e.name === name)?.country).toBe("Canada");

  // Analytics lead event: useful details, but never personal data.
  const events = await page.evaluate(() => (window.dataLayer || []).filter((e) => e.event === "generate_lead"));
  expect(events).toEqual([expect.objectContaining({ form_name: "contact", country_interest: "Canada" })]);
  const raw = JSON.stringify(events);
  for (const pii of [name, "98765", "e2e@example.com"]) expect(raw).not.toContain(pii);
});

test("eligibility checker suggests countries with a disclaimer and captures the lead", async ({ page }, info) => {
  await open(page, "/eligibility");
  const section = page.locator("#eligibility");
  await expect(section).toContainText(/not a guarantee/i);
  for (const answer of ["Bachelor's degree", "Above 75%", "Not taken yet", "Under ₹12 lakh"]) {
    await section.getByRole("button", { name: answer }).click();
  }
  const suggestions = section.locator("li p.font-display");
  await expect(suggestions.first()).toHaveText("Germany");
  expect(await suggestions.count()).toBeGreaterThanOrEqual(2);
  await expect(section).toContainText(/not a guarantee of admission or visa approval/i);

  const name = `E2E Quiz ${info.project.name} ${Date.now()}`;
  await section.getByLabel("Name").fill(name);
  await section.getByLabel("Phone").fill("+91 91234 56789");
  await section.getByLabel("Email").fill("quiz@example.com");
  await section.getByRole("button", { name: /free counselling call/ }).click();
  await expect(section.getByText(/Thank you/)).toBeVisible();

  await expect.poll(() => readEnquiries().find((e) => e.name === name)?.source).toBe("eligibility-checker");
  expect(readEnquiries().find((e) => e.name === name).suggestions[0]).toBe("Germany");

  const events = await page.evaluate(() => (window.dataLayer || []).filter((e) => e.event === "generate_lead"));
  expect(events).toEqual([expect.objectContaining({ form_name: "eligibility" })]);
  expect(JSON.stringify(events)).not.toContain("quiz@example.com");
});
