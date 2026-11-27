import { describe, expect, it } from "vitest";
import fs from "fs";
import { defaultContent, countries, nav } from "@/lib/site";

const allText = (o) => JSON.stringify(o).toLowerCase();
// Compliance: the brief says never promise visa approval.
const BANNED = [/100\s*%\s*visa/, /visa\s+guarantee/, /guaranteed\s+visa/, /guarantee(d)?\s+(your\s+)?(visa|approval|admission)/];

describe("content rules", () => {
  for (const [label, content] of [
    ["defaults (site.js)", defaultContent],
    ["saved content (content/site.json)", JSON.parse(fs.readFileSync("content/site.json", "utf8"))],
  ]) {
    it(`never promises visa approval — ${label}`, () => {
      const text = allText(content);
      for (const re of BANNED) expect(text).not.toMatch(re);
    });
  }

  it("every country has the fields the cards and pages need", () => {
    for (const c of countries) {
      for (const k of ["id", "name", "flag", "city", "lat", "lng", "intakes", "tuition", "work", "courses", "overview"]) expect(c[k], `${c.id}.${k}`).toBeTruthy();
      expect(c.id).toMatch(/^[a-z-]+$/);
      expect(c.flag).toMatch(/^[a-z]{2}$/);
    }
  });

  it("every menu link points at a page that exists", () => {
    for (const { href } of nav) {
      const dir = `src/app/(site)${href}`;
      expect(fs.existsSync(`${dir}/page.js`), href).toBe(true);
    }
  });

  it("every built-in gallery file exists", () => {
    for (const item of defaultContent.gallery.items) {
      for (const p of [item.image, item.video].filter(Boolean)) {
        if (p.startsWith("/gallery/")) expect(fs.existsSync(`public${p}`), p).toBe(true);
      }
    }
  });
});
