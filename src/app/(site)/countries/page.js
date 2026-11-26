import FilmScene from "@/components/ui/FilmScene";
import Countries from "@/components/sections/Countries";
import CtaBand from "@/components/ui/CtaBand";

export const metadata = { title: "Study Destinations", description: "Study in Canada, UK, Australia, USA, Germany, Ireland or New Zealand — intakes, tuition, post-study work rights and popular courses." };

export default function CountriesPage() {
  return (
    <>
      <FilmScene name="destinations" page="countries" mode="header" posterAlt="Glowing red arcs connecting India to destinations around a holographic globe" />
      <Countries />
      <CtaBand />
    </>
  );
}
