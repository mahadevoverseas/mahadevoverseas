import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import FilmScene from "@/components/ui/FilmScene";
import Countries from "@/components/sections/Countries";
import CtaBand from "@/components/ui/CtaBand";


export async function generateMetadata() {
  return pageMetadata("countries", "/countries");
}

export default function CountriesPage() {
  return (
    <>
      <PageSchema trail={[{ name: "Study destinations", path: "/countries" }]} />
      <FilmScene name="destinations" page="countries" mode="header" posterAlt="Glowing red arcs connecting India to destinations around a holographic globe" />
      <Countries />
      <CtaBand />
    </>
  );
}
