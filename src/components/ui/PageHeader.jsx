"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntro } from "@/lib/loader-store";
import { useSite } from "@/components/providers/ContentProvider";
import FlightPath from "./FlightPath";
import { frameUrl } from "@/lib/frames";

/**
 * Cinematic banner for inner pages. `page` is a key of content.pages, or pass
 * eyebrow/title/text directly.
 */
export default function PageHeader({ page, eyebrow, title, text, image = "/frames/hero/frame_0300.webp", children }) {
  const { pages } = useSite();
  const data = { ...(page ? pages?.[page] : {}), ...(eyebrow && { eyebrow }), ...(title && { title }), ...(text && { text }) };
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current;
      const words = el.querySelectorAll("[data-ph-word]");
      gsap.set(words, { yPercent: 110 });
      gsap.set(el.querySelectorAll("[data-ph-fade]"), { autoAlpha: 0, y: 20 });
      const off = onIntro(() => {
        gsap.to(words, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.06 });
        gsap.to(el.querySelectorAll("[data-ph-fade]"), { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.25 });
      });
      gsap.to(el.querySelector("[data-ph-bg]"), {
        yPercent: 18,
        scale: 1.1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: ref }
  );

  const words = String(data.title ?? "").split(" ");

  return (
    <header ref={ref} className="relative flex min-h-[78svh] items-end overflow-hidden bg-charcoal pt-32 pb-16 md:min-h-[86svh] md:pb-24">
      <div data-ph-bg className="absolute inset-0 will-change-transform">
        <Image src={frameUrl(image)} alt="" fill priority sizes="100vw" quality={70} className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/40 to-charcoal" />
      </div>
      <div className="globe-grid pointer-events-none absolute inset-0" />
      <FlightPath variant="swoop" className="absolute inset-x-0 bottom-28 opacity-80" start="top bottom" end="bottom top" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-10">
        {data.eyebrow && (
          <p data-ph-fade className="eyebrow mb-6 text-brand-cyan">
            {data.eyebrow}
          </p>
        )}
        <h1 className="font-display max-w-6xl text-[clamp(3.2rem,10vw,9.5rem)] text-ink">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.04em] align-bottom">
              <span data-ph-word className={`inline-block ${i === words.length - 1 ? "text-brand-red" : ""}`}>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>
        {data.text && (
          <p data-ph-fade className="mt-6 max-w-xl text-base text-muted md:text-lg">
            {data.text}
          </p>
        )}
        {children && <div data-ph-fade className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
