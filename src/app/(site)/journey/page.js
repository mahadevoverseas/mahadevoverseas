import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import Journey from "@/components/sections/Journey";
import CtaBand from "@/components/ui/CtaBand";


export async function generateMetadata() {
  return pageMetadata("journey", "/journey");
}

export default function JourneyPage() {
  return (
    <>
      <PageSchema trail={[{ name: "Your journey", path: "/journey" }]} />
      <Journey />
      <CtaBand />
    </>
  );
}
