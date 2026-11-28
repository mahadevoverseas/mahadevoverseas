"use client";

import { useRef } from "react";
import ScrollSequence from "@/components/ScrollSequence";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntro } from "@/lib/loader-store";
import { fillTemplate } from "@/lib/structured-data";
import { useSite } from "@/components/providers/ContentProvider";

export default function Hero() {
  const { hero, site } = useSite();
  const overlayRef = useRef(null);
  const lineOneRef = useRef(null);
  const lineTwoRef = useRef(null);
  const eyebrowRef = useRef(null);
  const metaRef = useRef(null);

  // Intro entrance after the loader leaves.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Text is visible from the very first paint (good for Google's LCP);
      // the entrance animation plays *from* hidden as the loader slides away.
      const words = overlayRef.current.querySelectorAll("[data-hero-in]");
      return onIntro(() => {
        gsap
          .timeline()
          .from(words, { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.12 })
          .from([eyebrowRef.current, metaRef.current], { autoAlpha: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.35);
      });
    },
    { scope: overlayRef }
  );

  // Scroll: the headline splits apart as the camera pushes into the globe.
  const onTimeline = (tl, { mobile }) => {
    const dist = mobile ? 70 : 60;
    tl.to(lineOneRef.current, { xPercent: -dist, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0.08)
      .to(lineTwoRef.current, { xPercent: dist, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0.08)
      .to(eyebrowRef.current, { autoAlpha: 0, y: -30, duration: 0.2 }, 0.05)
      .to(metaRef.current, { autoAlpha: 0, y: 30, duration: 0.2 }, 0.05);
  };

  return (
    <ScrollSequence
      id="top"
      name="hero"
      frames={448}
      mobileFrames={224}
      length={300}
      mobileLength={200}
      reportProgress
      priorityPoster
      posterAlt="A plane orbiting a glowing holographic Earth"
      onTimeline={onTimeline}
    >
      <div ref={overlayRef} className="relative flex h-full flex-col items-center justify-center px-5 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/80" />

        {/* The <h1> is what Google reads first: "Study visa consultants in Guntur". */}
        <h1 ref={eyebrowRef} className="eyebrow relative mb-6 text-brand-cyan md:mb-8">
          {fillTemplate(hero.seoHeading || "Study visa consultants in {city}", { city: site.city })}
        </h1>

        <p className="font-display relative text-ink">
          <span className="sr-only">
            {hero.lineOne} {hero.lineTwo}
          </span>
          <span aria-hidden="true" ref={lineOneRef} className="block overflow-hidden will-change-transform">
            <span data-hero-in className="block text-[clamp(3.6rem,13.5vw,13rem)]">
              {hero.lineOne}
            </span>
          </span>
          <span aria-hidden="true" ref={lineTwoRef} className="block overflow-hidden will-change-transform">
            <span data-hero-in className="block text-[clamp(2.2rem,8.4vw,8.2rem)]">
              {hero.lineTwo.split(" ").map((w, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={w} className="text-brand-red">
                    {w}
                  </span>
                ) : (
                  <span key={w}>{w} </span>
                )
              )}
            </span>
          </span>
        </p>

        <div ref={metaRef} className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-8 md:px-10 md:pb-10">
          <p className="max-w-[14rem] text-left text-xs font-semibold tracking-[0.18em] text-ink/80 uppercase md:max-w-none md:text-[0.8rem]">
            {hero.countries.join(" · ")}
          </p>
          <a
            href="#stats"
            className="absolute left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] text-ink/70 uppercase md:flex"
          >
            {hero.scrollLabel}
            <span className="relative block h-12 w-[2px] overflow-hidden rounded-full bg-white/15">
              <span className="absolute inset-x-0 top-0 block h-1/3 animate-scroll-dot bg-brand-red" />
            </span>
          </a>
          <span className="hidden text-right text-xs font-semibold tracking-[0.18em] text-ink/60 uppercase md:block">
            {hero.eyebrow} · Est. {site.foundedYear}
          </span>
        </div>
      </div>
    </ScrollSequence>
  );
}
