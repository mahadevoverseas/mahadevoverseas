import { getContent } from "@/lib/content";

export default async function sitemap() {
  const { site, countries } = await getContent();
  const paths = ["", "/countries", "/services", "/journey", "/success-stories", "/gallery", "/about", "/eligibility", "/contact"];
  return [
    ...paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly", priority: p ? 0.8 : 1 })),
    ...countries.map((c) => ({ url: `${site.url}/countries/${c.id}`, changeFrequency: "monthly", priority: 0.7 })),
  ];
}
