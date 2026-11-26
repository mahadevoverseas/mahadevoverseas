"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSite } from "@/components/providers/ContentProvider";
import SplitReveal from "./SplitReveal";
import Magnetic from "./Magnetic";
import FlightPath from "./FlightPath";

export default function CtaBand() {
  const { ctaBand } = useSite();
  if (!ctaBand) return null;
  return (
    <section className="relative overflow-hidden bg-red-strong py-24 text-white md:py-32">
      <FlightPath variant="rise" className="absolute inset-x-0 top-6 opacity-40 [&_path:nth-child(2)]:stroke-white" />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-10 px-5 md:px-10 lg:flex-row lg:items-end">
        <div className="max-w-4xl">
          <SplitReveal className="font-display text-[clamp(2.6rem,6.5vw,6rem)]">{ctaBand.title}</SplitReveal>
          <p className="mt-5 max-w-xl text-white/90 md:text-lg">{ctaBand.text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {ctaBand.primary?.label && (
            <Magnetic>
              <Link href={ctaBand.primary.href} className="btn bg-white text-red-strong hover:bg-ink">
                {ctaBand.primary.label} <ArrowRight className="size-4" />
              </Link>
            </Magnetic>
          )}
          {ctaBand.secondary?.label && (
            <Magnetic>
              <Link href={ctaBand.secondary.href} className="btn border border-white/50 text-white hover:bg-white/10">
                {ctaBand.secondary.label}
              </Link>
            </Magnetic>
          )}
        </div>
      </div>
    </section>
  );
}
