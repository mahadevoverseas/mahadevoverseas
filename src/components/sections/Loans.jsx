"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import { SERVICE_ICONS } from "@/lib/service-icons";
import SplitReveal from "@/components/ui/SplitReveal";
import Magnetic from "@/components/ui/Magnetic";
import DecoNum from "@/components/ui/DecoNum";

/** Highlighted education-loan promises (Admin → Education loans). */
export default function Loans() {
  const { loans } = useSite();
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current;
      const cards = el.querySelectorAll("[data-loan-card]");
      gsap.from(cards, {
        y: 60,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: el.querySelector("[data-loan-grid]"), start: "top 85%", once: true },
      });
      gsap.from(el.querySelectorAll("[data-loan-line]"), {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        stagger: 0.12,
        delay: 0.3,
        ease: "expo.out",
        scrollTrigger: { trigger: el.querySelector("[data-loan-grid]"), start: "top 85%", once: true },
      });
    },
    { scope: ref }
  );

  if (!loans?.points?.length) return null;

  return (
    <section ref={ref} aria-labelledby="loans-title" className="relative overflow-hidden bg-charcoal py-24 md:py-32">
      <div className="globe-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand-red/15 blur-[120px]" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5 text-brand-cyan">{loans.eyebrow}</p>
            <SplitReveal id="loans-title" className="font-display text-[clamp(2.6rem,6.5vw,5.5rem)] text-ink">
              {loans.title}
            </SplitReveal>
          </div>
          {loans.ctaLabel && (
            <Magnetic>
              <Link href={loans.ctaHref || "/contact"} className="btn btn-red">
                {loans.ctaLabel} <ArrowRight className="size-4" />
              </Link>
            </Magnetic>
          )}
        </div>

        <ul data-loan-grid className="grid gap-4 md:grid-cols-3 md:gap-6">
          {loans.points.map((p, i) => {
            const Icon = SERVICE_ICONS[p.icon] ?? CircleCheck;
            return (
              <li
                key={p.title}
                data-loan-card
                className="group relative overflow-hidden rounded-[10px] border border-brand-red/25 bg-gradient-to-br from-card to-[#241a20] p-7 transition-colors duration-500 hover:border-brand-red/70 md:p-9"
              >
                <span data-loan-line className="absolute inset-x-0 top-0 h-[3px] bg-brand-red" />
                <div className="flex items-start justify-between">
                  <span className="grid size-14 place-items-center rounded-[10px] bg-brand-red/15 text-brand-red ring-1 ring-brand-red/30 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="size-7" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <DecoNum n={i + 1} className="font-display text-3xl text-white/10" />
                </div>
                <h3 className="font-display mt-8 text-[clamp(1.75rem,2.6vw,2.4rem)] text-ink">{p.title}</h3>
                {p.text && <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{p.text}</p>}
              </li>
            );
          })}
        </ul>

        {loans.footnote && <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">{loans.footnote}</p>}
      </div>
    </section>
  );
}
