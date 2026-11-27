import FilmScene from "@/components/ui/FilmScene";
import Services from "@/components/sections/Services";
import Loans from "@/components/sections/Loans";
import CtaBand from "@/components/ui/CtaBand";

export const metadata = { title: "Services", description: "Admissions, student visas, SOP & LOR, IELTS/PTE coaching, education loans, accommodation and pre-departure support." };

export default function ServicesPage() {
  return (
    <>
      <FilmScene name="visa" page="services" mode="header" posterAlt="A passport opening to a visa page as a red stamp is pressed" />
      <Services />
      <Loans />
      <CtaBand />
    </>
  );
}
