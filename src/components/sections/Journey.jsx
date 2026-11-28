"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import { PlaneGlyph } from "@/components/ui/icons";
import SplitReveal from "@/components/ui/SplitReveal";
import Reveal from "@/components/ui/Reveal";
import FilmScene from "@/components/ui/FilmScene";
import DecoNum from "@/components/ui/DecoNum";

function JourneyFilm() {
  const { journey } = useSite();
  return (
    <FilmScene
      id="journey"
      name="journey"
      mode="header"
      eyebrow={journey.eyebrow}
      title={journey.title}
      text={journey.intro}
      length={260}
      mobileLength={180}
      posterAlt="Flying above the clouds down to a university campus"
    />
  );
}

function StepCard({ step, i, horizontal }) {
  return (
    <article
      data-step
      data-active="false"
      className={`group card relative transition-[border-color,background-color] duration-500 data-[active=true]:border-brand-red/50 data-[active=true]:bg-[#222833] ${
        horizontal ? "w-[34vw] max-w-[520px] shrink-0 p-8 xl:p-10" : "p-6"
      }`}
    >
      <DecoNum n={i + 1} className="font-display block text-6xl text-white/10 transition-colors duration-500 group-data-[active=true]:text-brand-red md:text-7xl" />
      <h3 className="font-display mt-4 text-3xl text-ink md:text-4xl">{step.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{step.text}</p>
    </article>
  );
}

function Timeline() {
  const { journey } = useSite();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const ghostRef = useRef(null);
  const planeRef = useRef(null);
  const dotsRef = useRef(null);
  const vLineRef = useRef(null);
  const vPlaneRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pinned horizontal scroll with a plane riding a red path.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const svg = svgRef.current;
        const path = pathRef.current;
        const ghost = ghostRef.current;
        const plane = planeRef.current;
        const cards = [...track.querySelectorAll("[data-step]")];
        const dots = [...dotsRef.current.querySelectorAll("circle")];
        let lookup = [];
        let total = 0;
        let D = 0;
        let P = 0;
        let markerXs = [];

        const build = () => {
          const W = track.scrollWidth;
          const H = track.clientHeight;
          const base = H * 0.26;
          svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
          svg.style.width = `${W}px`;
          markerXs = cards.map((c) => c.parentElement.offsetLeft + 40);
          let prev = { x: 0, y: base + 70 };
          let d = `M ${prev.x} ${prev.y}`;
          const pts = markerXs.map((x, i) => ({ x, y: base + (i % 2 ? 34 : -34) }));
          [...pts, { x: W, y: base - 60 }].forEach((p) => {
            const cx = (prev.x + p.x) / 2;
            d += ` C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`;
            prev = p;
          });
          path.setAttribute("d", d);
          ghost.setAttribute("d", d);
          total = path.getTotalLength();
          path.style.strokeDasharray = `${total}`;
          lookup = [];
          const samples = 600;
          for (let s = 0; s <= samples; s++) {
            const len = (s / samples) * total;
            const pt = path.getPointAtLength(len);
            lookup.push({ x: pt.x, y: pt.y, len });
          }
          pts.forEach((p, i) => {
            dots[i]?.setAttribute("cx", p.x);
            dots[i]?.setAttribute("cy", p.y);
          });
          P = window.innerWidth * 0.34;
          D = Math.max(0, W - window.innerWidth);
        };

        const at = (x) => {
          let lo = 0;
          let hi = lookup.length - 1;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (lookup[mid].x < x) lo = mid + 1;
            else hi = mid;
          }
          const a = lookup[Math.max(0, lo - 1)];
          const b = lookup[Math.min(lookup.length - 1, lo + 1)];
          return { ...lookup[lo], angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
        };

        const update = (p) => {
          if (!lookup.length) return;
          const tx = P + D * p;
          const pt = at(tx);
          plane.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${pt.angle})`);
          path.style.strokeDashoffset = `${total - pt.len}`;
          markerXs.forEach((mx, i) => {
            const on = tx >= mx - 2;
            if (cards[i].dataset.active !== String(on)) cards[i].dataset.active = String(on);
            dots[i]?.setAttribute("fill", on ? "#F32832" : "#1C212B");
          });
        };

        build();
        ScrollTrigger.addEventListener("refreshInit", build);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current.querySelector("[data-h-pin]"),
            start: "top top",
            end: () => `+=${D}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => update(self.progress),
          },
        });
        tl.to(track, { x: () => -D, duration: 1 });
        update(0);

        return () => ScrollTrigger.removeEventListener("refreshInit", build);
      });

      // Mobile / tablet / reduced motion: vertical line + plane.
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        const list = sectionRef.current.querySelector("[data-v-list]");
        const line = vLineRef.current;
        const plane = vPlaneRef.current;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.set(line, { scaleY: 1 });
          list.querySelectorAll("[data-step]").forEach((c) => (c.dataset.active = "true"));
          return;
        }
        const st = { trigger: list, start: "top 60%", end: "bottom 60%", scrub: true };
        gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo(plane, { y: 0 }, { y: () => list.offsetHeight, ease: "none", scrollTrigger: { ...st, invalidateOnRefresh: true } });
        list.querySelectorAll("[data-step]").forEach((c) => {
          ScrollTrigger.create({
            trigger: c,
            start: "top 60%",
            onEnter: () => (c.dataset.active = "true"),
            onLeaveBack: () => (c.dataset.active = "false"),
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} aria-label="Your journey in six steps" className="relative bg-charcoal">
      {/* Desktop horizontal (outer div isolates the pin-spacer from React) */}
      <div>
      <div data-h-pin className="relative hidden h-svh overflow-hidden lg:motion-safe:block">
        <div className="globe-grid pointer-events-none absolute inset-0 opacity-70" />
        <div ref={trackRef} className="relative flex h-full items-center gap-10 pr-[34vw] will-change-transform">
          <svg ref={svgRef} className="pointer-events-none absolute top-0 left-0 h-full overflow-visible" fill="none" aria-hidden="true">
            <path ref={ghostRef} stroke="rgba(242,244,247,0.12)" strokeWidth="1.5" strokeDasharray="4 9" />
            <path ref={pathRef} stroke="#F32832" strokeWidth="2.5" strokeLinecap="round" />
            <g ref={dotsRef}>
              {journey.steps.map((s) => (
                <circle key={s.title} r="7" fill="#1C212B" stroke="#F32832" strokeWidth="2" />
              ))}
            </g>
            <g ref={planeRef} className="text-ink">
              <PlaneGlyph width="44" height="44" x="-22" y="-22" />
            </g>
          </svg>
          <div className="relative w-[34vw] shrink-0 pl-10 xl:pl-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))]">
            <p className="eyebrow mb-5 text-brand-cyan">Six steps</p>
            <h2 className="font-display text-[clamp(3rem,5.5vw,6rem)] text-ink">
              One road,
              <br />
              <span className="text-brand-red">one team</span>
            </h2>
            <p className="mt-6 max-w-sm text-muted">{journey.intro}</p>
          </div>
          {journey.steps.map((s, i) => (
            <div key={s.title} className="relative mt-[18vh] shrink-0">
              <StepCard step={s} i={i} horizontal />
            </div>
          ))}
        </div>
      </div>

      </div>

      {/* Vertical (mobile, tablet, reduced motion) */}
      <div className="relative px-5 py-24 md:px-10 lg:motion-safe:hidden">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-5 text-brand-cyan">Six steps</p>
          <SplitReveal className="font-display text-[clamp(2.8rem,11vw,5rem)] text-ink">
            One road, <span className="text-brand-red">one team</span>
          </SplitReveal>
          <div data-v-list className="relative mt-12 pl-12">
            <div className="absolute top-0 bottom-0 left-[15px] w-[2px] bg-white/10" />
            <div ref={vLineRef} className="absolute top-0 bottom-0 left-[15px] w-[2px] origin-top bg-brand-red" />
            <div ref={vPlaneRef} className="absolute top-0 left-0 z-10 -mt-4 text-ink" aria-hidden="true">
              <PlaneGlyph className="size-8 rotate-90" />
            </div>
            <Reveal className="flex flex-col gap-5">
              {journey.steps.map((s, i) => (
                <StepCard key={s.title} step={s} i={i} />
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Takeoff() {
  const { journey } = useSite();
  const f = journey.finale;
  if (!f) return null;
  return <FilmScene name="takeoff" eyebrow={f.eyebrow} title={f.title} text={f.text} align="center" posterAlt="A passenger jet taking off at dusk, leaving a red light trail" />;
}

export default function Journey() {
  return (
    <>
      <JourneyFilm />
      <Timeline />
      <Takeoff />
    </>
  );
}
