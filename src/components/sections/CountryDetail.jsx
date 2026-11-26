"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Wallet, Briefcase, BookOpen, MapPin } from "lucide-react";
import { useSite } from "@/components/providers/ContentProvider";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";

const flagSrc = (code, w = 160) => `https://flagcdn.com/w${w}/${code}.png`;

export default function CountryDetail({ id }) {
  const { countries, countriesSection } = useSite();
  const c = countries.find((x) => x.id === id);
  if (!c) return null;
  const others = countries.filter((x) => x.id !== id);

  const facts = [
    { icon: CalendarDays, label: "Intakes", value: c.intakes.join(" · ") },
    { icon: Wallet, label: "Tuition (approx.)", value: c.tuition },
    { icon: Briefcase, label: "Post-study work", value: c.work },
    { icon: MapPin, label: "Popular city", value: c.city },
  ];

  return (
    <>
      <PageHeader eyebrow="Study destination" title={`Study in ${c.name}`} text={c.overview} image="/frames/hero/frame_0350.webp">
        <div className="flex items-center gap-4">
          <Image src={flagSrc(c.flag)} alt={`Flag of ${c.name}`} width={72} height={48} className="h-12 w-[72px] rounded-[6px] object-cover ring-1 ring-white/15" />
          <Link href="/contact" className="btn btn-red">
            Free counselling for {c.name}
          </Link>
        </div>
      </PageHeader>

      <section className="relative bg-charcoal py-20 md:py-28">
        <div className="globe-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="card p-7">
                <Icon className="size-6 text-brand-cyan" aria-hidden="true" />
                <p className="mt-6 text-xs font-bold tracking-[0.2em] text-muted uppercase">{label}</p>
                <p className="mt-2 font-semibold text-ink">{value}</p>
              </div>
            ))}
          </Reveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-5 text-brand-cyan">Popular courses</p>
              <SplitReveal className="font-display text-[clamp(2.4rem,5vw,4.5rem)] text-ink">What students pick in {c.name}</SplitReveal>
            </div>
            <Reveal className="flex flex-wrap content-start gap-3 lg:col-span-7">
              {c.courses.map((course) => (
                <span key={course} className="flex items-center gap-2 rounded-[10px] border border-white/12 bg-card px-5 py-4 font-semibold text-ink">
                  <BookOpen className="size-4 text-brand-red" aria-hidden="true" /> {course}
                </span>
              ))}
            </Reveal>
          </div>
          <p className="mt-12 max-w-2xl text-xs leading-relaxed text-muted">{countriesSection.note}</p>
        </div>
      </section>

      <section className="bg-card py-20 md:py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow mb-8 text-brand-cyan">Other destinations</p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {others.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/countries/${o.id}`}
                  className="group flex items-center justify-between gap-3 rounded-[10px] border border-white/10 bg-charcoal p-4 transition-colors hover:border-brand-red"
                >
                  <span className="flex items-center gap-3">
                    <Image src={flagSrc(o.flag, 80)} alt="" width={32} height={22} className="h-[22px] w-8 rounded-[3px] object-cover" />
                    <span className="text-sm font-bold text-ink">{o.name}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-red" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
