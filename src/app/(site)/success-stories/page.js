import PageHeader from "@/components/ui/PageHeader";
import Stories from "@/components/sections/Stories";
import Testimonials from "@/components/sections/Testimonials";
import CtaBand from "@/components/ui/CtaBand";

export const metadata = { title: "Success Stories", description: "Students who flew abroad for their studies with guidance from Mahadev Overseas." };

export default function StoriesPage() {
  return (
    <>
      <PageHeader page="stories" image="/frames/burst/frame_0420.webp" />
      <Stories />
      <Testimonials />
      <CtaBand />
    </>
  );
}
