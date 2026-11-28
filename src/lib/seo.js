import { getContent } from "./content";
import { fillTemplate } from "./structured-data";

/**
 * Per-page <title>, description, canonical URL and social preview, from the
 * admin-editable `seo` content (Admin → SEO). Templates may use {city},
 * {name} and, on country pages, {country}.
 */
export async function pageMetadata(key, path, extra = {}) {
  const { site, seo } = await getContent();
  const page = seo?.pages?.[key] ?? {};
  const vars = { city: site.city, name: site.name, ...extra };
  const title = fillTemplate(page.title || site.name, vars).trim();
  const description = fillTemplate(page.description || site.description, vars).trim();
  const image = { url: "/og-image.jpg", width: 1200, height: 630, alt: title };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "en_IN", siteName: site.name, url: path, title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
