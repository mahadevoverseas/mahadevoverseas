import { getContent } from "@/lib/content";
import { publishedGuides } from "@/lib/structured-data";

export default async function sitemap() {
  const { site, countries, guides } = await getContent();
  const base = site.url.replace(/\/$/, "");
  const paths = ["", "/countries", "/services", "/journey", "/success-stories", "/gallery", "/guides", "/about", "/eligibility", "/contact"];
  return [
    ...paths.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly", priority: p ? 0.8 : 1 })),
    ...countries.map((c) => ({ url: `${base}/countries/${c.id}`, changeFrequency: "monthly", priority: 0.7 })),
    ...publishedGuides(guides).map((g) => ({ url: `${base}/guides/${g.slug}`, lastModified: g.updated || g.date, changeFrequency: "monthly", priority: 0.7 })),
  ];
}
