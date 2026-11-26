import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import CountryDetail from "@/components/sections/CountryDetail";
import CtaBand from "@/components/ui/CtaBand";

export async function generateStaticParams() {
  const { countries } = await getContent();
  return countries.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { countries } = await getContent();
  const c = countries.find((x) => x.id === id);
  if (!c) return {};
  return { title: `Study in ${c.name}`, description: `${c.overview ?? ""} Intakes: ${c.intakes.join(", ")}. Tuition: ${c.tuition}.`.trim() };
}

async function Country({ params }) {
  const { id } = await params;
  const { countries } = await getContent();
  if (!countries.some((c) => c.id === id)) notFound();
  return <CountryDetail id={id} />;
}

export default function CountryPage({ params }) {
  return (
    <>
      <Suspense fallback={<div className="min-h-svh bg-charcoal" />}>
        <Country params={params} />
      </Suspense>
      <CtaBand />
    </>
  );
}
