/**
 * Builders for schema.org JSON-LD. Pure functions (no I/O) so they can be
 * unit-tested. Anything still containing a [placeholder] is left out, so
 * Google never sees fake data.
 */
export const isPlaceholder = (v) => typeof v === "string" && /\[[^\]]+\]/.test(v);
const real = (v) => (v && !isPlaceholder(v) ? v : undefined);

/** Fills {city}, {name}, {country}… in SEO templates. */
export const fillTemplate = (s, vars) => String(s ?? "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const DAY_NAMES = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };

function to24(t) {
  const m = String(t).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = m[2] ?? "00";
  const ap = m[3]?.toLowerCase();
  if (ap === "pm" && h < 12) h += 12;
  if (ap === "am" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}

/** "Mon – Sat" + "10:00 AM – 6:00 PM" → OpeningHoursSpecification. Skips "By appointment". */
export function openingHours(hours = []) {
  const out = [];
  for (const { days, time } of hours) {
    const d = String(days).toLowerCase().match(/(mon|tue|wed|thu|fri|sat|sun)[a-z]*/g);
    const t = String(time).split(/[–-]/).map(to24);
    if (!d || t.length !== 2 || !t[0] || !t[1]) continue;
    const from = DAY_NAMES[d[0].slice(0, 3)];
    const to = DAY_NAMES[d[d.length - 1].slice(0, 3)];
    const span = /[–-]/.test(days) ? DAYS.slice(from, to + 1) : d.map((x) => DAYS[DAY_NAMES[x.slice(0, 3)]]);
    const names = { Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" };
    out.push({ "@type": "OpeningHoursSpecification", dayOfWeek: span.map((x) => names[x]), opens: t[0], closes: t[1] });
  }
  return out;
}

export function organizationGraph({ site, contact, countries = [], services, owner }) {
  const url = site.url.replace(/\/$/, "");
  const a = contact.address ?? {};
  const address = real(a.street) && real(a.locality)
    ? { "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.locality, addressRegion: real(a.region), postalCode: real(a.postalCode), addressCountry: a.country || "IN" }
    : undefined;
  const socials = (contact.socials ?? []).map((s) => s.href).filter((h) => h && !/^https?:\/\/(www\.)?[a-z]+\.com\/?$/i.test(h)); // drop bare placeholders like https://facebook.com/
  const hasOwner = real(owner?.name);
  const city = real(site.city);

  const org = {
    "@type": ["EducationalOrganization", "LocalBusiness", "ProfessionalService"],
    "@id": `${url}/#organization`,
    name: site.name,
    url,
    logo: `${url}/brand/logo-on-light.png`,
    image: `${url}/og-image.jpg`,
    description: site.description,
    slogan: site.tagline,
    telephone: real(contact.phone),
    email: real(contact.email),
    address,
    geo: contact.geo?.lat ? { "@type": "GeoCoordinates", latitude: contact.geo.lat, longitude: contact.geo.lng } : undefined,
    hasMap: real(contact.mapQuery) ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}` : undefined,
    openingHoursSpecification: openingHours(contact.hours),
    priceRange: "Free counselling",
    currenciesAccepted: "INR",
    areaServed: [city && { "@type": "City", name: city }, real(a.region) && { "@type": "State", name: a.region }, { "@type": "Country", name: "India" }].filter(Boolean),
    knowsAbout: ["Student visas", "Study abroad admissions", "IELTS", "PTE", "Education loans", ...countries.map((c) => `Study in ${c.name}`)],
    hasOfferCatalog: services?.items?.length
      ? {
          "@type": "OfferCatalog",
          name: "Study abroad services",
          itemListElement: services.items.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })),
        }
      : undefined,
    sameAs: socials.length ? socials : undefined,
    founder: hasOwner ? { "@type": "Person", name: owner.name, jobTitle: owner.role, ...(owner.photo?.startsWith("http") && { image: owner.photo }) } : undefined,
  };
  const website = { "@type": "WebSite", "@id": `${url}/#website`, url, name: site.name, inLanguage: "en-IN", publisher: { "@id": `${url}/#organization` } };
  return { "@context": "https://schema.org", "@graph": [website, JSON.parse(JSON.stringify(org))] };
}

export function breadcrumbs(siteUrl, items) {
  const url = siteUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${url}${it.path === "/" ? "" : it.path}` })),
  };
}

export function faqPage(items, vars) {
  const qa = items.filter((f) => real(f.q) && real(f.a));
  if (!qa.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((f) => ({ "@type": "Question", name: fillTemplate(f.q, vars), acceptedAnswer: { "@type": "Answer", text: fillTemplate(f.a, vars) } })),
  };
}

export const jsonLdString = (data) => JSON.stringify(data).replace(/</g, "\\u003c");
