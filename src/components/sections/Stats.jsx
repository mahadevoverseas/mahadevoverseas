"use client";

import { useRef } from "react";
import ScrollSequence from "@/components/ScrollSequence";
import { useSite } from "@/components/providers/ContentProvider";

export default function Stats() {
  const { stats } = useSite();
  const headRef = useRef(null);
  const itemsRef = useRef(null);
  const footRef = useRef(null);

  const onTimeline = (tl) => {
    const head = headRef.current;
    const items = itemsRef.current.querySelectorAll("[data-stat]");
    const nums = itemsRef.current.querySelectorAll("[data-num]");

    tl.from(head, { autoAlpha: 0, y: 60, duration: 0.12, ease: "power2.out" }, 0.08);
    tl.from(items, { autoAlpha: 0, y: 80, duration: 0.14, stagger: 0.04, ease: "power2.out" }, 0.2);
    nums.forEach((el, i) => {
      const target = Number(el.dataset.num);
      const counter = { v: 0 };
      el.textContent = "0";
      tl.to(
        counter,
        {
          v: target,
          duration: 0.35,
          ease: "power1.out",
          onUpdate: () => (el.textContent = Math.round(counter.v).toLocaleString("en-IN")),
        },
        0.22 + i * 0.04
      );
    });
    tl.from(footRef.current, { autoAlpha: 0, duration: 0.1 }, 0.6);
    tl.to([head, itemsRef.current, footRef.current], { autoAlpha: 0, y: -60, duration: 0.1, ease: "power2.in" }, 0.86);
  };

  return (
    <ScrollSequence
      id="stats"
      name="burst"
      frames={448}
      mobileFrames={224}
      length={260}
      mobileLength={180}
      posterAlt="Graduation caps tossed in the air"
      onTimeline={onTimeline}
    >
      <div className="relative flex h-full flex-col justify-center px-5 md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-charcoal/50" />
        <div className="relative mx-auto w-full max-w-[1440px]">
          <div ref={headRef} className="mb-10 max-w-3xl md:mb-16">
            <p className="eyebrow mb-5 text-brand-cyan">{stats.eyebrow}</p>
            <h2 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] text-ink">{stats.title}</h2>
          </div>
          <dl ref={itemsRef} className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-10">
            {stats.items.map((s) => (
              <div key={s.label} data-stat className="flex flex-col border-t border-white/15 pt-5">
                <dt className="order-2 mt-3 text-sm font-semibold tracking-wide text-muted md:text-base">{s.label}</dt>
                <dd className="font-display order-1 text-[clamp(3.2rem,8vw,7.5rem)] text-ink">
                  <span data-num={s.value}>{s.value.toLocaleString("en-IN")}</span>
                  <span className="text-brand-red">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p ref={footRef} className="mt-10 max-w-2xl text-xs leading-relaxed text-muted/90">
            {stats.footnote}
          </p>
        </div>
      </div>
    </ScrollSequence>
  );
}
