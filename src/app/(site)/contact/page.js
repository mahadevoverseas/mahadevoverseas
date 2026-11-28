import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import PageHeader from "@/components/ui/PageHeader";
import Contact from "@/components/sections/Contact";
import Faq from "@/components/sections/Faq";


export async function generateMetadata() {
  return pageMetadata("contact", "/contact");
}

export default function ContactPage() {
  return (
    <>
      <PageSchema trail={[{ name: "Contact", path: "/contact" }]} />
      <PageHeader page="contact" image="/frames/journey/frame_0250.webp" />
      <Contact />
      <Faq />
    </>
  );
}
