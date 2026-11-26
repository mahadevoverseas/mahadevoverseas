"use client";

import { useRef } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { gsap, Draggable, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import { PlaneGlyph } from "@/components/ui/icons";
import SplitReveal from "@/components/ui/SplitReveal";

function BoardingPass({ s, i }) {
  return (
    <article
      data-pass
      className="relative flex w-[86vw] max-w-[640px] shrink-0 overflow-hidden rounded-[10px] bg-paper text-navy shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] select-none sm:w-[600px]"
    >
      {/* Main ticket */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between bg-red-strong px-4 py-2.5 text-white sm:px-5">
          <span className="text-[0.62rem] font-bold tracking-[0.25em] uppercase">Boarding pass</span>
          <span className="hidden text-[0.62rem] font-bold tracking-[0.25em] uppercase sm:inline">Mahadev Overseas</span>
        </div>
        <div className="flex items-center gap-3 px-4 pt-4 sm:gap-4 sm:px-5 sm:pt-5">
          <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-[8px] bg-mist sm:h-20 sm:w-16">
            <Image src={s.photo} alt={`Photo of ${s.name}`} fill sizes="64px" className="object-cover" draggable={false} />
          </div>
          <div className="min-w-0 flex-1 sm:pr-36">
            <p className="text-[0.6rem] font-bold tracking-[0.2em] text-navy/55 uppercase">Passenger</p>
            <p className="font-display truncate text-2xl sm:text-3xl">{s.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
          <div>
            <p className="text-[0.6rem] font-bold tracking-[0.2em] text-navy/55 uppercase">From</p>
            <p className="font-display text-4xl leading-none sm:text-5xl">{s.fromCode}</p>
            <p className="text-xs font-semibold text-navy/70">{s.from}</p>
          </div>
          <div className="flex flex-1 items-center gap-1 text-red-strong">
            <span className="h-px flex-1 border-t border-dashed border-navy/30" />
            <PlaneGlyph className="size-5" />
            <span className="h-px flex-1 border-t border-dashed border-navy/30" />
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] font-bold tracking-[0.2em] text-navy/55 uppercase">To</p>
            <p className="font-display text-4xl leading-none sm:text-5xl">{s.toCode}</p>
            <p className="text-xs font-semibold text-navy/70">{s.to}</p>
          </div>
        </div>
        <dl className="mt-auto grid grid-cols-1 gap-3 border-t border-dashed border-navy/15 py-4 pr-28 pl-4 text-xs sm:grid-cols-[1.3fr_1.3fr_0.8fr] sm:px-5">
          <div>
            <dt className="text-[0.6rem] font-bold tracking-[0.2em] text-navy/55 uppercase">University</dt>
            <dd className="mt-1 font-semibold">{s.university}</dd>
          </div>
          <div>
            <dt className="text-[0.6rem] font-bold tracking-[0.2em] text-navy/55 uppercase">Course</dt>
            <dd className="mt-1 font-semibold">{s.course}</dd>
          </div>
          <div>
            <dt className="text-[0.6rem] font-bold tracking-[0.2em] text-navy/55 uppercase">Intake</dt>
            <dd className="mt-1 font-semibold">{s.intake}</dd>
          </div>
        </dl>
        {/* Stamp */}
        <div
          aria-label="Visa approved"
          className="pointer-events-none absolute right-3 bottom-6 rotate-[-12deg] sm:bottom-auto rounded-[8px] border-[3px] border-red-strong px-2.5 py-1 text-center text-red-strong opacity-85 mix-blend-multiply sm:top-13 sm:right-5 sm:px-3 sm:py-1.5"
        >
          <span className="font-display block text-lg leading-none tracking-wide sm:text-2xl">Visa approved</span>
          <span className="block text-[0.5rem] font-bold tracking-[0.25em] sm:text-[0.55rem]">{s.intake.toUpperCase()}</span>
        </div>
      </div>

      {/* Perforation */}
      <div className="perforation relative w-4 shrink-0 border-l border-dashed border-navy/20" aria-hidden="true">
        <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-charcoal" />
        <span className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-charcoal" />
      </div>

      {/* Stub */}
      <div className="flex w-18 shrink-0 flex-col items-center justify-between bg-mist py-4 sm:w-28" aria-hidden="true">
        <span className="text-[0.5rem] font-bold tracking-[0.15em] text-navy/55 uppercase sm:text-[0.55rem]">Seat {String(i + 12)}A</span>
        <div className="text-center">
          <p className="font-display text-xl leading-none sm:text-2xl">{s.fromCode}</p>
          <PlaneGlyph className="mx-auto my-1 size-4 rotate-90 text-red-strong" />
          <p className="font-display text-xl leading-none sm:text-2xl">{s.toCode}</p>
        </div>
        <div className="barcode h-14 w-11 sm:w-18" />
      </div>
    </article>
  );
}

export default function Stories() {
  const { stories } = useSite();
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const [drag] = Draggable.create(track, {
        type: "x",
        bounds: viewportRef.current,
        inertia: true,
        edgeResistance: 0.85,
        dragClickables: true,
        zIndexBoost: false,
        onPress() {
          track.style.cursor = "grabbing";
        },
        onRelease() {
          track.style.cursor = "grab";
        },
      });
      const onResize = () => drag.applyBounds(viewportRef.current);
      window.addEventListener("resize", onResize);

      if (!prefersReducedMotion()) {
        gsap.from(track.querySelectorAll("[data-pass]"), {
          x: 160,
          rotate: 3,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: viewportRef.current, start: "top 80%", once: true },
        });
      }
      return () => {
        window.removeEventListener("resize", onResize);
        drag.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section id="stories" ref={sectionRef} className="relative overflow-hidden bg-charcoal py-28 md:py-40">
      <div className="globe-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto mb-14 flex max-w-[1440px] flex-col justify-between gap-6 px-5 md:mb-20 md:flex-row md:items-end md:px-10">
        <div className="max-w-3xl">
          <p className="eyebrow mb-5 text-brand-cyan">{stories.eyebrow}</p>
          <SplitReveal className="font-display text-[clamp(2.8rem,7vw,6.5rem)] text-ink">{stories.title}</SplitReveal>
        </div>
        <p className="flex items-center gap-2 text-sm font-semibold text-muted">
          <MoveHorizontal className="size-4" aria-hidden="true" /> Drag to explore
        </p>
      </div>
      <div ref={viewportRef} className="relative overflow-hidden" data-cursor="hover">
        <div
          ref={trackRef}
          className="flex w-max cursor-grab gap-6 px-5 py-6 md:gap-8 md:px-10 xl:pl-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))]"
        >
          {stories.items.map((s, i) => (
            <BoardingPass key={s.name + i} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
