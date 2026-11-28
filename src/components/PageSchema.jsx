import { getContent } from "@/lib/content";
import { breadcrumbs } from "@/lib/structured-data";
import JsonLd from "./JsonLd";

/** Breadcrumb structured data for an inner page: Home › … › this page. */
export default async function PageSchema({ trail }) {
  const { site } = await getContent();
  return <JsonLd data={breadcrumbs(site.url, [{ name: "Home", path: "/" }, ...trail])} />;
}
