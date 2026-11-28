"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSite } from "@/components/providers/ContentProvider";
import { fillTemplate, publishedGuides } from "@/lib/structured-data";
import { frameUrl } from "@/lib/frames";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";

const fmt = (d) => new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

/** Grid of published guides. `limit` + `teaser` for the home-page strip. */
export default function GuidesList({ limit, teaser = false }) {
  const { guides, site } = useSite();
  const items = publishedGuides(guides).slice(0, limit ?? undefined);
  if (!items.length) return null;
  const vars = { city: site.city };

  return (
    <section aria-labelledby="guides-title" className={`relative overflow-hidden bg-mist text-navy ${teaser ? "py-24 md:py-28" : "py-20 md:py-28"}`}>
      <div className="globe-grid-light pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5 text-red-strong">{guides.eyebrow}</p>
            <SplitReveal id="guides-title" className="font-display text-[clamp(2.4rem,6vw,5rem)]">
              {guides.title}
            </SplitReveal>
            {guides.intro && <p className="mt-5 max-w-xl text-navy/75">{fillTemplate(guides.intro, vars)}</p>}
          </div>
          {teaser && (
            <Link href="/guides" className="group inline-flex items-center gap-2 font-bold text-cyan-strong">
              All guides <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          )}
        </div>
        <Reveal as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-navy/8 bg-paper shadow-[0_20px_40px_-30px_rgba(20,26,38,0.35)]">
                <div className="relative aspect-[16/9] overflow-hidden bg-card">
                  <Image src={frameUrl(g.cover) || "/og-image.jpg"} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <time dateTime={g.date} className="text-xs font-bold tracking-[0.15em] text-navy/65 uppercase">
                    {fmt(g.date)}
                  </time>
                  <h3 className="font-display mt-3 text-2xl leading-tight group-hover:text-red-strong md:text-3xl">{g.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy/70">{fillTemplate(g.excerpt, vars)}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-navy">
                    Read guide <ArrowUpRight className="size-4 text-red-strong transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
