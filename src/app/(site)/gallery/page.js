import PageHeader from "@/components/ui/PageHeader";
import Gallery from "@/components/sections/Gallery";
import CtaBand from "@/components/ui/CtaBand";

export const metadata = { title: "Gallery", description: "Videos and photos from campuses, graduations and study-abroad journeys with Mahadev Overseas." };

export default function GalleryPage() {
  return (
    <>
      <PageHeader page="gallery" image="/frames/burst/frame_0350.webp" />
      <Gallery />
      <CtaBand />
    </>
  );
}
