import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import PageHeader from "@/components/ui/PageHeader";
import Stories from "@/components/sections/Stories";
import Testimonials from "@/components/sections/Testimonials";
import CtaBand from "@/components/ui/CtaBand";


export async function generateMetadata() {
  return pageMetadata("stories", "/success-stories");
}

export default function StoriesPage() {
  return (
    <>
      <PageSchema trail={[{ name: "Success stories", path: "/success-stories" }]} />
      <PageHeader page="stories" image="/frames/burst/frame_0420.webp" />
      <Stories />
      <Testimonials />
      <CtaBand />
    </>
  );
}
