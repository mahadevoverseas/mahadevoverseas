import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import FilmScene from "@/components/ui/FilmScene";
import Services from "@/components/sections/Services";
import Loans from "@/components/sections/Loans";
import CtaBand from "@/components/ui/CtaBand";


export async function generateMetadata() {
  return pageMetadata("services", "/services");
}

export default function ServicesPage() {
  return (
    <>
      <PageSchema trail={[{ name: "Services", path: "/services" }]} />
      <FilmScene name="visa" page="services" mode="header" posterAlt="A passport opening to a visa page as a red stamp is pressed" />
      <Services />
      <Loans />
      <CtaBand />
    </>
  );
}
