import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import CountryDetail from "@/components/sections/CountryDetail";
import CtaBand from "@/components/ui/CtaBand";
import PageSchema from "@/components/PageSchema";
import { pageMetadata } from "@/lib/seo";

// Check the country before rendering the page body. In production the shared
// layout has already streamed (HTTP 200), so unknown ids show the branded
// not-found page with a noindex tag; in development they return 404.
export const instant = false;

export async function generateStaticParams() {
  const { countries } = await getContent();
  return countries.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { countries } = await getContent();
  const c = countries.find((x) => x.id === id);
  if (!c) return {};
  return pageMetadata("country", `/countries/${c.id}`, { country: c.name });
}

export default async function CountryPage({ params }) {
  const { id } = await params;
  const { countries } = await getContent();
  const c = countries.find((x) => x.id === id);
  if (!c) notFound();
  return (
    <>
      <PageSchema trail={[{ name: "Study destinations", path: "/countries" }, { name: `Study in ${c.name}`, path: `/countries/${c.id}` }]} />
      <CountryDetail id={id} />
      <CtaBand />
    </>
  );
}
