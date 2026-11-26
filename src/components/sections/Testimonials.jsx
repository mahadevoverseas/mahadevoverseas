"use client";

import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import SplitReveal from "@/components/ui/SplitReveal";

const INTERVAL = 6500;

export default function Testimonials() {
  const { testimonials } = useSite();
  const quoteRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.items.length;

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % n), INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, n]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        quoteRef.current.querySelectorAll("[data-q]"),
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }
      );
    },
    { dependencies: [index], scope: quoteRef }
  );

  const t = testimonials.items[index];

  return (
    <section
      aria-labelledby="testi-title"
      className="relative overflow-hidden bg-card py-28 md:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-[1100px] px-5 text-center md:px-10">
        <p className="eyebrow mb-5 text-brand-cyan">{testimonials.eyebrow}</p>
        <SplitReveal className="font-display text-[clamp(2.2rem,5vw,4rem)] text-ink">
          <span id="testi-title">{testimonials.title}</span>
        </SplitReveal>

        <figure ref={quoteRef} className="mt-14 min-h-[16rem] md:min-h-[14rem]" aria-live="polite">
          <Quote data-q className="mx-auto size-10 text-brand-red" aria-hidden="true" />
          <blockquote data-q className="mx-auto mt-6 max-w-4xl text-[clamp(1.25rem,2.6vw,2.1rem)] leading-snug font-semibold text-ink">
            “{t.quote}”
          </blockquote>
          <figcaption data-q className="mt-8 text-sm">
            <span className="font-bold text-ink">{t.name}</span>
            <span className="text-muted"> · {t.role}</span>
          </figcaption>
        </figure>

        <div className="mt-10 flex justify-center gap-2" role="tablist" aria-label="Choose testimonial">
          {testimonials.items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className="group grid h-8 w-10 place-items-center"
            >
              <span className={`block h-[3px] w-full overflow-hidden rounded-full ${i === index ? "bg-white/15" : "bg-white/15 group-hover:bg-white/35"}`}>
                {i === index && (
                  <span
                    key={`${index}-${paused}`}
                    className="block h-full origin-left bg-brand-red"
                    style={{ animation: paused ? "none" : `mo-progress ${INTERVAL}ms linear forwards`, transform: paused ? "scaleX(1)" : undefined }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes mo-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
    </section>
  );
}
