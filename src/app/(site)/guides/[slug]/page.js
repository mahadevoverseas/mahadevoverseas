import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getContent } from "@/lib/content";
import { articleSchema, breadcrumbs, fillTemplate, publishedGuides } from "@/lib/structured-data";
import { frameUrl } from "@/lib/frames";
import JsonLd from "@/components/JsonLd";
import GuideBody from "@/components/sections/GuideBody";
import CtaBand from "@/components/ui/CtaBand";

// Unknown or unpublished guides → not-found page (see countries/[id] for why).
export const instant = false;

export async function generateStaticParams() {
  const { guides } = await getContent();
  return publishedGuides(guides).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { guides, site } = await getContent();
  const g = publishedGuides(guides).find((x) => x.slug === slug);
  if (!g) return {};
  // "Guide title | Mahadev Overseas" when it fits Google's ~60–65 characters.
  const base = g.seoTitle || g.title;
  const branded = `${base} | ${site.name}`;
  const title = branded.length <= 65 ? branded : base;
  const description = fillTemplate(g.metaDescription || g.excerpt, { city: site.city });
  const path = `/guides/${g.slug}`;
  const image = frameUrl(g.cover) || "/og-image.jpg";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, title, description, publishedTime: g.date, images: [{ url: image }], siteName: site.name, locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

const fmt = (d) => new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const { guides, site } = await getContent();
  const all = publishedGuides(guides);
  const g = all.find((x) => x.slug === slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}`;
  const more = all.filter((x) => x.slug !== g.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          articleSchema({ site, guide: g, path }),
          breadcrumbs(site.url, [{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path }]),
        ]}
      />
      <article className="bg-paper text-navy">
        <header className="relative overflow-hidden bg-charcoal pt-32 pb-14 text-ink md:pt-40 md:pb-20">
          <div className="absolute inset-0 opacity-35">
            <Image src={frameUrl(g.cover) || "/og-image.jpg"} alt="" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-charcoal" />
          </div>
          <div className="relative mx-auto max-w-3xl px-5">
            <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
              <ArrowLeft className="size-4" aria-hidden="true" /> All guides
            </Link>
            <h1 className="font-display mt-6 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">{g.title}</h1>
            <p className="mt-5 text-sm text-muted">
              <time dateTime={g.date}>{fmt(g.date)}</time> · {g.author}
            </p>
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
          {g.excerpt && <p className="text-xl leading-relaxed font-semibold text-navy">{fillTemplate(g.excerpt, { city: site.city })}</p>}
          <GuideBody blocks={g.body ?? []} vars={{ city: site.city }} />
          <div className="mt-12 rounded-[10px] border-l-4 border-red-strong bg-mist p-6">
            <p className="font-bold">Questions about your own plans?</p>
            <p className="mt-1 text-navy/75">Book a free counselling session at our {site.city} office, by phone or on WhatsApp.</p>
            <Link href="/contact" className="btn btn-red mt-4">
              Book free counselling
            </Link>
          </div>
          {more.length > 0 && (
            <nav aria-label="More guides" className="mt-14 border-t border-navy/10 pt-8">
              <p className="text-xs font-bold tracking-[0.2em] text-navy/65 uppercase">More guides</p>
              <ul className="mt-4 grid gap-3">
                {more.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/guides/${m.slug}`} className="font-bold text-cyan-strong underline-offset-4 hover:underline">
                      {m.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </article>
      <CtaBand />
    </>
  );
}
