import { expect } from "@playwright/test";
import fs from "fs";

export const ADMIN_PASSWORD = "e2e-test-password";

export const PAGES = ["/", "/countries", "/countries/canada", "/services", "/journey", "/success-stories", "/gallery", "/about", "/eligibility", "/contact"];

/** Open a page and wait for the intro loader to leave. */
export async function open(page, path) {
  const res = await page.goto(path);
  await expect(page.locator("#mo-loader")).toBeHidden({ timeout: 25_000 });
  return res;
}

/** Collect real page errors (ignores third-party noise like the embedded map). */
export function trackErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/google|maps|flagcdn|favicon|Failed to load resource.*(net::ERR_ABORTED)/i.test(t)) return;
    errors.push(`console: ${t}`);
  });
  return errors;
}

export const readEnquiries = () => JSON.parse(fs.readFileSync(".test-content/enquiries.json", "utf8"));

// The brief: never promise visa approval.
export const BANNED = [/100\s*%\s*visa/i, /visa\s+guarantee/i, /guaranteed\s+visa/i, /guarantee(d)?\s+(your\s+)?(visa|approval|admission|loan)/i, /(100\s*%|guaranteed)\s+loan/i, /loan\s+(approval\s+)?guarantee/i];
