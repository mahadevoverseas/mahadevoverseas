import PageHeader from "@/components/ui/PageHeader";
import Contact from "@/components/sections/Contact";

export const metadata = { title: "Contact", description: "Book free study abroad counselling — call, WhatsApp, visit our office or send an enquiry." };

export default function ContactPage() {
  return (
    <>
      <PageHeader page="contact" image="/frames/journey/frame_0250.webp" />
      <Contact />
    </>
  );
}
