"use client";

import { Plus } from "lucide-react";
import { useSite } from "@/components/providers/ContentProvider";
import { faqPage, fillTemplate, jsonLdString } from "@/lib/structured-data";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";

/** Local FAQ (Admin → FAQ) with FAQPage structured data for search engines. */
export default function Faq() {
  const { faq, site } = useSite();
  if (!faq?.items?.length) return null;
  const vars = { city: site.city, name: site.name };
  const schema = faqPage(faq.items, vars);

  return (
    <section aria-labelledby="faq-title" className="relative overflow-hidden bg-paper py-24 text-navy md:py-32">
      <div className="globe-grid-light pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5 text-red-strong">{faq.eyebrow}</p>
          <SplitReveal id="faq-title" className="font-display text-[clamp(2.6rem,6vw,5rem)]">
            {fillTemplate(faq.title, vars)}
          </SplitReveal>
          {faq.intro && <p className="mt-6 max-w-md text-navy/75">{fillTemplate(faq.intro, vars)}</p>}
        </div>

        <Reveal className="divide-y divide-navy/10 border-y border-navy/10 lg:col-span-7" stagger={0.05} y={24}>
          {faq.items.map((f, i) => (
            <details key={i} className="group py-1" {...(i === 0 && { open: true })}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-base font-bold md:text-lg [&::-webkit-details-marker]:hidden">
                <h3 className="font-bold">{fillTemplate(f.q, vars)}</h3>
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-mist text-red-strong transition-transform duration-300 group-open:rotate-45">
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="max-w-2xl pr-12 pb-6 leading-relaxed text-navy/75">{fillTemplate(f.a, vars)}</p>
            </details>
          ))}
        </Reveal>
      </div>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }} />}
    </section>
  );
}
