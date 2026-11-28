import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import PageHeader from "@/components/ui/PageHeader";
import Eligibility from "@/components/sections/Eligibility";


export async function generateMetadata() {
  return pageMetadata("eligibility", "/eligibility");
}

export default function EligibilityPage() {
  return (
    <>
      <PageSchema trail={[{ name: "Eligibility checker", path: "/eligibility" }]} />
      <PageHeader page="eligibility" image="/frames/hero/frame_0200.webp" />
      <Eligibility />
    </>
  );
}
