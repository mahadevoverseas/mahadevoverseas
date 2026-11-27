import { describe, expect, it } from "vitest";
import { suggestCountries } from "@/lib/eligibility";
import { countries, eligibility } from "@/lib/site";

const run = (answers) => suggestCountries(answers, countries, eligibility);

describe("eligibility checker scoring", () => {
  it("always suggests 2 or 3 countries", () => {
    for (const q of eligibility.steps[0].options)
      for (const m of eligibility.steps[1].options)
        for (const e of eligibility.steps[2].options)
          for (const b of eligibility.steps[3].options) {
            const r = run({ qualification: q.value, marks: m.value, english: e.value, budget: b.value });
            expect(r.length).toBeGreaterThanOrEqual(2);
            expect(r.length).toBeLessThanOrEqual(3);
            expect(new Set(r.map((c) => c.id)).size).toBe(r.length);
          }
  });

  it("puts Germany first for a low budget, strong academics profile", () => {
    const r = run({ qualification: "bachelors", marks: "high", english: "none", budget: "low" });
    expect(r[0].id).toBe("germany");
  });

  it("favours USA/Australia for a high budget with a strong English score", () => {
    const r = run({ qualification: "bachelors", marks: "high", english: "high", budget: "high" });
    expect(["usa", "australia"]).toContain(r[0].id);
  });

  it("ignores unknown answers and weights for countries that do not exist", () => {
    const r = suggestCountries({ budget: "nope" }, countries, { weights: { budget: { nope: { atlantis: 5 } } } });
    expect(r).toHaveLength(2);
    expect(r.every((c) => c.score === 0)).toBe(true);
  });
});
