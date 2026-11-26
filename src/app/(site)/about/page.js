import PageHeader from "@/components/ui/PageHeader";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Universities from "@/components/sections/Universities";
import CtaBand from "@/components/ui/CtaBand";

export const metadata = { title: "About Us", description: "Mahadev Overseas — honest study abroad guidance from first counselling to boarding the flight." };

export default function AboutPage() {
  return (
    <>
      <PageHeader page="about" image="/frames/journey/frame_0400.webp" />
      <About />
      <Stats />
      <Universities />
      <CtaBand />
    </>
  );
}
