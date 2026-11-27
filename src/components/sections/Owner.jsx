"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Quote } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import { PlaneGlyph } from "@/components/ui/icons";

/** "Meet the founder" — owner profile, edited in Admin → Founder. */
export default function Owner() {
  const { owner } = useSite();
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current;
      gsap.fromTo(
        el.querySelector("[data-owner-photo]"),
        { yPercent: -8 },
        { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
      );
      gsap.from(el.querySelector("[data-owner-frame]"), {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
      });
      const arc = el.querySelector("[data-owner-arc]");
      const len = arc.getTotalLength();
      gsap.fromTo(arc, { strokeDasharray: len, strokeDashoffset: len }, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "center 40%", scrub: 0.6 },
      });
    },
    { scope: ref }
  );

  if (!owner?.name) return null;
  const paragraphs = (Array.isArray(owner.bio) ? owner.bio : [owner.bio]).filter(Boolean);

  return (
    <section ref={ref} aria-labelledby="owner-name" className="relative overflow-hidden bg-mist py-24 text-navy md:py-36">
      <div className="globe-grid-light pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-20">
        {/* Photo */}
        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <svg aria-hidden="true" viewBox="0 0 400 500" className="pointer-events-none absolute -inset-6 z-10 h-[calc(100%+3rem)] w-[calc(100%+3rem)] overflow-visible" fill="none">
            <path data-owner-arc d="M-10 470 C 60 520 180 520 260 440 S 420 230 395 40" stroke="#F32832" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <PlaneGlyph aria-hidden="true" className="absolute -top-4 -right-3 z-10 size-9 -rotate-[70deg] text-red-strong" />
          <div data-owner-frame className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-card shadow-[0_40px_80px_-40px_rgba(20,26,38,0.6)]">
            <div data-owner-photo className="absolute -inset-y-[8%] inset-x-0">
              <Image src={owner.photo || "/images/owner.svg"} alt={`${owner.name}, ${owner.role}`} fill sizes="(max-width: 1024px) 90vw, 40vw" className="object-cover" />
            </div>
          </div>
          <div className="absolute -bottom-6 left-6 z-10 rounded-[10px] bg-red-strong px-5 py-3 text-white shadow-lg">
            <p className="font-display text-xl leading-none">{owner.name}</p>
            <p className="mt-1 text-[0.65rem] font-bold tracking-[0.2em] uppercase opacity-90">{owner.role}</p>
          </div>
        </div>

        {/* Story */}
        <div className="lg:col-span-7">
          <p className="eyebrow mb-5 text-red-strong">{owner.eyebrow}</p>
          <SplitReveal id="owner-name" className="font-display text-[clamp(2.8rem,7vw,6rem)]">
            {owner.name}
          </SplitReveal>
          <p className="mt-3 text-sm font-bold tracking-[0.2em] text-cyan-strong uppercase">{owner.role}</p>

          <Reveal className="mt-8 space-y-4 text-base leading-relaxed text-navy/80 md:text-lg">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>

          {owner.quote && (
            <figure className="relative mt-10 rounded-[10px] border-l-4 border-red-strong bg-paper p-6 shadow-[0_20px_40px_-30px_rgba(20,26,38,0.4)] md:p-8">
              <Quote className="absolute top-5 right-5 size-8 text-red-strong/15" aria-hidden="true" />
              <blockquote className="text-lg font-semibold leading-snug md:text-xl">“{owner.quote}”</blockquote>
              <figcaption className="mt-3 text-sm font-bold text-navy/60">— {owner.name}</figcaption>
            </figure>
          )}

          {owner.highlights?.length > 0 && (
            <Reveal as="dl" className="mt-10 grid grid-cols-3 gap-4 border-y border-navy/10 py-6">
              {owner.highlights.map((h) => (
                <div key={h.label}>
                  <dt className="sr-only">{h.label}</dt>
                  <dd className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-none text-red-strong">{h.value}</dd>
                  <dd className="mt-2 text-xs font-semibold text-navy/70 md:text-sm">{h.label}</dd>
                </div>
              ))}
            </Reveal>
          )}

          {owner.credentials?.filter(Boolean).length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {owner.credentials.filter(Boolean).map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm font-semibold text-navy/80">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-cyan-strong" aria-hidden="true" /> {c}
                </li>
              ))}
            </ul>
          )}

          {owner.ctaLabel && (
            <div className="mt-10">
              <Magnetic>
                <Link href={owner.ctaHref || "/contact"} className="btn btn-red">
                  {owner.ctaLabel} <ArrowRight className="size-4" />
                </Link>
              </Magnetic>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
