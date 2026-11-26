import PageHeader from "@/components/ui/PageHeader";
import Eligibility from "@/components/sections/Eligibility";

export const metadata = { title: "Eligibility Checker", description: "Answer four quick questions to see which study-abroad countries may suit your profile. Guidance only, not a guarantee." };

export default function EligibilityPage() {
  return (
    <>
      <PageHeader page="eligibility" image="/frames/hero/frame_0200.webp" />
      <Eligibility />
    </>
  );
}
