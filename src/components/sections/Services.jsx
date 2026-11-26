"use client";

import Link from "next/link";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import { SERVICE_ICONS as ICONS } from "@/lib/service-icons";
import { useSite } from "@/components/providers/ContentProvider";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import FlightPath from "@/components/ui/FlightPath";


export default function Services() {
  const { services } = useSite();
  return (
    <section id="services" className="relative overflow-hidden bg-mist text-navy">
      <div className="globe-grid-light pointer-events-none absolute inset-0" />
      <FlightPath variant="dip" tone="light" className="absolute inset-x-0 top-0 opacity-70" />
      <div className="relative mx-auto max-w-[1440px] px-5 pt-32 pb-28 md:px-10 md:pt-40 md:pb-36">
        <div className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5 text-red-strong">{services.eyebrow}</p>
            <SplitReveal className="font-display text-[clamp(2.8rem,7vw,6.5rem)]">{services.title}</SplitReveal>
          </div>
          <Link href="/contact" className="group inline-flex items-center gap-2 font-bold text-cyan-strong">
            Talk to a counsellor
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {services.items.map((s, i) => {
            const Icon = ICONS[s.icon] ?? CircleCheck;
            return (
              <article
                key={s.title}
                tabIndex={0}
                data-cursor="hover"
                className="group relative isolate flex min-h-[260px] flex-col overflow-hidden rounded-[10px] border border-navy/8 bg-paper p-7 shadow-[0_20px_40px_-30px_rgba(20,26,38,0.35)] outline-none md:min-h-[300px]"
              >
                {/* red sweep on hover */}
                <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-red-strong transition-transform duration-500 ease-out-expo group-hover:scale-y-100 group-focus-visible:scale-y-100" />
                <div className="flex items-start justify-between">
                  <span className="grid size-14 place-items-center rounded-[10px] bg-mist text-cyan-strong transition-colors duration-500 group-hover:bg-white/15 group-hover:text-white group-focus-visible:bg-white/15 group-focus-visible:text-white">
                    <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="font-display text-2xl text-navy/15 transition-colors duration-500 group-hover:text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display mt-auto pt-10 text-3xl transition-colors duration-500 group-hover:text-white group-focus-visible:text-white">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy/75 transition-all duration-500 ease-out-expo group-hover:text-white/90 group-focus-visible:text-white/90 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                  {s.text}
                </p>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
