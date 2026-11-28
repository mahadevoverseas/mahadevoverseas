import { pageMetadata } from "@/lib/seo";
import PageSchema from "@/components/PageSchema";
import PageHeader from "@/components/ui/PageHeader";
import GuidesList from "@/components/sections/GuidesList";
import CtaBand from "@/components/ui/CtaBand";

export async function generateMetadata() {
  return pageMetadata("guides", "/guides");
}

export default function GuidesPage() {
  return (
    <>
      <PageSchema trail={[{ name: "Guides", path: "/guides" }]} />
      <PageHeader eyebrow="Guides" title="Study abroad, explained" text="Practical answers for students and parents — from choosing a consultant to your loan and visa paperwork." image="/frames/journey/frame_0420.webp" />
      <GuidesList />
      <CtaBand />
    </>
  );
}
