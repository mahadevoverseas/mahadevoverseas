import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Loans from "@/components/sections/Loans";
import Stories from "@/components/sections/Stories";
import Universities from "@/components/sections/Universities";
import Testimonials from "@/components/sections/Testimonials";
import CtaBand from "@/components/ui/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Services />
      <Loans />
      <Stories />
      <Universities />
      <Testimonials />
      <CtaBand />
    </>
  );
}
