import { getContent } from "@/lib/content";

export default async function robots() {
  const { site } = await getContent();
  const url = site.url.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
