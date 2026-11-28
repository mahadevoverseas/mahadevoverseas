import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import PageHeader from "@/components/ui/PageHeader";
import Gallery from "@/components/sections/Gallery";
import CtaBand from "@/components/ui/CtaBand";


export async function generateMetadata() {
  return pageMetadata("gallery", "/gallery");
}

export default function GalleryPage() {
  return (
    <>
      <PageSchema trail={[{ name: "Gallery", path: "/gallery" }]} />
      <PageHeader page="gallery" image="/frames/burst/frame_0350.webp" />
      <Gallery />
      <CtaBand />
    </>
  );
}
