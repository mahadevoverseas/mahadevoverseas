"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import FlightPath from "@/components/ui/FlightPath";
import { frameUrl } from "@/lib/frames";

export default function About() {
  const { about } = useSite();
  const ref = useRef(null);
  const words = about.paragraph.split(" ");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current;
      // Section "arrives" out of the dark pinned scene above.
      gsap.from(el.querySelector("[data-about-panel]"), {
        scale: 0.94,
        borderRadius: 40,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: true },
      });
      // Word-by-word fade.
      gsap.fromTo(
        el.querySelectorAll("[data-word]"),
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: el.querySelector("[data-para]"), start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      // Image parallax.
      el.querySelectorAll("[data-parallax]").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -12 },
          { yPercent: 12, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
    },
    { scope: ref }
  );

  return (
    <section id="about" ref={ref} className="relative bg-charcoal">
      <div data-about-panel className="relative overflow-hidden bg-paper text-navy will-change-transform">
        <div className="globe-grid-light pointer-events-none absolute inset-0" />
        <FlightPath variant="swoop" tone="light" className="absolute inset-x-0 top-6 opacity-80" />
        <div className="relative mx-auto max-w-[1200px] px-5 pt-36 pb-28 text-center md:px-10 md:pt-48 md:pb-40">
          <p className="eyebrow mb-10 text-red-strong">{about.eyebrow}</p>
          <p data-para className="mx-auto max-w-5xl text-[clamp(1.45rem,3.1vw,2.75rem)] leading-[1.3] font-semibold tracking-tight">
            {words.map((w, i) => (
              <span key={i} data-word className="inline-block will-change-[opacity]">
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
          <p className="mt-10 text-sm font-bold tracking-widest text-red-strong uppercase">{about.signature}</p>

          <div className="mt-20 grid grid-cols-2 gap-4 md:mt-28 md:grid-cols-3 md:gap-6">
            {[
              { src: "/frames/journey/frame_0300.webp", alt: "Autumn university campus at golden hour" },
              { src: "/frames/burst/frame_0250.webp", alt: "Graduation caps and confetti in the air", hide: true },
              { src: "/frames/hero/frame_0380.webp", alt: "Flight paths circling the globe" },
            ].map((img) => (
              <div key={img.src} className={`relative aspect-[4/5] overflow-hidden rounded-[10px] ${img.hide ? "hidden md:block md:translate-y-16" : ""}`}>
                <div data-parallax className="absolute -inset-y-[15%] inset-x-0">
                  <Image src={frameUrl(img.src)} alt={img.alt} fill sizes="(max-width: 768px) 50vw, 33vw" quality={70} className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
