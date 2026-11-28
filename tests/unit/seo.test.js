import { describe, expect, it } from "vitest";
import fs from "fs";
import { breadcrumbs, faqPage, fillTemplate, isPlaceholder, openingHours, organizationGraph } from "@/lib/structured-data";
import { defaultContent } from "@/lib/site";

const sample = (over = {}) => ({ ...defaultContent, ...over });

describe("SEO templates", () => {
  for (const [label, content] of [
    ["defaults", defaultContent],
    ["saved content", JSON.parse(fs.readFileSync("content/site.json", "utf8"))],
  ]) {
    it(`every page has a title ≤ 60 and description ≤ 160 characters — ${label}`, () => {
      const fill = (s) => fillTemplate(s, { city: "Guntur", name: "Mahadev Overseas", country: "New Zealand" });
      for (const [key, p] of Object.entries(content.seo.pages)) {
        expect(fill(p.title).length, `${key} title`).toBeLessThanOrEqual(60);
        expect(fill(p.description).length, `${key} description`).toBeLessThanOrEqual(160);
        expect(fill(p.description).length, `${key} description`).toBeGreaterThanOrEqual(70);
      }
    });
  }

  it("fills {city}, {name} and {country}", () => {
    expect(fillTemplate("Study in {country} from {city} with {name}", { city: "Guntur", country: "Canada", name: "MO" })).toBe("Study in Canada from Guntur with MO");
  });
});

describe("structured data", () => {
  it("parses opening hours and skips 'By appointment'", () => {
    expect(openingHours([{ days: "Mon – Sat", time: "10:00 AM – 6:00 PM" }, { days: "Sunday", time: "By appointment" }])).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "18:00" },
    ]);
  });

  it("describes the business with real details and never leaks [placeholders]", () => {
    const g = organizationGraph(
      sample({
        site: { ...defaultContent.site, city: "Guntur" },
        contact: {
          ...defaultContent.contact,
          phone: "+91 91217 74843",
          address: { street: "Door no 21-6-139, Sakethapuram", locality: "Guntur", region: "Andhra Pradesh", postalCode: "522007", country: "IN" },
        },
      })
    );
    const org = g["@graph"].find((n) => n["@id"].endsWith("#organization"));
    expect(org["@type"]).toEqual(expect.arrayContaining(["EducationalOrganization", "LocalBusiness"]));
    expect(org.address.addressLocality).toBe("Guntur");
    expect(org.areaServed[0]).toEqual({ "@type": "City", name: "Guntur" });
    expect(org.hasOfferCatalog.itemListElement.length).toBe(defaultContent.services.items.length);
    expect(org.founder).toBeUndefined(); // founder name is still a placeholder
    expect(JSON.stringify(g)).not.toMatch(/\[[A-Za-z][^\]"]*\]/);
  });

  it("omits the address entirely while it is still a placeholder", () => {
    const org = organizationGraph(defaultContent)["@graph"][1];
    expect(org.address).toBeUndefined();
    expect(JSON.stringify(org)).not.toMatch(/\[(Office|CITY|State|PIN)/);
  });

  it("builds breadcrumbs with absolute URLs", () => {
    const b = breadcrumbs("https://x.com/", [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]);
    expect(b.itemListElement.map((i) => i.item)).toEqual(["https://x.com", "https://x.com/services"]);
  });

  it("builds FAQ data, filling {city} and skipping placeholder entries", () => {
    const f = faqPage([{ q: "Best consultant in {city}?", a: "Us." }, { q: "[todo]", a: "[todo]" }], { city: "Guntur" });
    expect(f.mainEntity).toHaveLength(1);
    expect(f.mainEntity[0].name).toBe("Best consultant in Guntur?");
    expect(faqPage([{ q: "[x]", a: "[y]" }], {})).toBeNull();
    expect(isPlaceholder("[Founder name]")).toBe(true);
  });
});
