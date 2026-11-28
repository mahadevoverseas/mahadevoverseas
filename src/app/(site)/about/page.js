import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import PageHeader from "@/components/ui/PageHeader";
import About from "@/components/sections/About";
import Owner from "@/components/sections/Owner";
import Stats from "@/components/sections/Stats";
import Universities from "@/components/sections/Universities";
import CtaBand from "@/components/ui/CtaBand";


export async function generateMetadata() {
  return pageMetadata("about", "/about");
}

export default function AboutPage() {
  return (
    <>
      <PageSchema trail={[{ name: "About us", path: "/about" }]} />
      <PageHeader page="about" image="/frames/journey/frame_0400.webp" />
      <About />
      <Owner />
      <Stats />
      <Universities />
      <CtaBand />
    </>
  );
}
