"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Wallet, Briefcase, BookOpen } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import SplitReveal from "@/components/ui/SplitReveal";
import { getLenis } from "@/components/providers/SmoothScroll";
import DecoNum from "@/components/ui/DecoNum";

const GlobeView = dynamic(() => import("./GlobeView"), {
  ssr: false,
  loading: () => <GlobeFallback />,
});

function GlobeFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="aspect-square w-[70%] rounded-full border border-brand-cyan/20 bg-[radial-gradient(circle_at_35%_35%,rgba(53,192,235,0.18),transparent_60%)]" />
    </div>
  );
}

const flagSrc = (code) => `https://flagcdn.com/w160/${code}.png`;

function CountryCard({ c, index, compact = false }) {
  return (
    <article className={`card relative flex h-full flex-col overflow-hidden ${compact ? "p-6" : "p-8 lg:p-10"}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image src={flagSrc(c.flag)} alt={`Flag of ${c.name}`} width={56} height={38} className="h-[38px] w-14 rounded-[4px] object-cover ring-1 ring-white/10" />
          <h3 className={`font-display text-ink ${compact ? "text-4xl" : "text-5xl lg:text-6xl"}`}>{c.name}</h3>
        </div>
        <DecoNum n={index + 1} className="font-display text-2xl text-white/15" />
      </div>

      <dl className="mt-8 grid gap-5 text-sm">
        <div>
          <dt className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
            <CalendarDays className="size-4 shrink-0 text-brand-cyan" aria-hidden="true" />
            Intakes
          </dt>
          <dd className="mt-1 font-semibold text-ink pl-7">{c.intakes.join(" · ")}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
            <Wallet className="size-4 shrink-0 text-brand-cyan" aria-hidden="true" />
            Tuition (approx.)
          </dt>
          <dd className="mt-1 font-semibold text-ink pl-7">{c.tuition}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
            <Briefcase className="size-4 shrink-0 text-brand-cyan" aria-hidden="true" />
            Post-study work
          </dt>
          <dd className="mt-1 font-semibold text-ink pl-7">{c.work}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
            <BookOpen className="size-4 shrink-0 text-brand-cyan" aria-hidden="true" />
            Popular courses
          </dt>
          <dd className="mt-2 flex flex-wrap gap-2 pl-7">
              {c.courses.map((course) => (
                <span key={course} className="rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-ink/90">
                  {course}
                </span>
              ))}
          </dd>
        </div>
      </dl>

      <Link
        href={`/countries/${c.id}`}
        className="group mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-ink underline decoration-brand-red decoration-2 underline-offset-4 hover:text-white"
      >
        Explore {c.name}
        <ArrowUpRight className="size-4 text-brand-red transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function Countries() {
  const { countries, countriesSection, origin } = useSite();
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const stRef = useRef(null);
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [nearby, setNearby] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNearby(true), { rootMargin: "150% 0px" });
    io.observe(sectionRef.current);
    return () => {
      mq.removeEventListener("change", update);
      io.disconnect();
    };
  }, []);

  // Desktop: pin and step through countries as you scroll.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const n = countries.length;
        const reduce = prefersReducedMotion();
        stRef.current = ScrollTrigger.create({
          trigger: sectionRef.current.querySelector("[data-pin]"),
          start: "top top",
          end: `+=${n * (reduce ? 50 : 85)}%`,
          pin: true,
          anticipatePin: 1,
          onUpdate(self) {
            const i = Math.min(n - 1, Math.floor(self.progress * n));
            setActive((prev) => (prev === i ? prev : i));
          },
        });
        return () => {
          stRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // Animate the card swap.
  useGSAP(
    () => {
      if (!cardRef.current || prefersReducedMotion()) return;
      gsap.fromTo(
        cardRef.current.querySelectorAll("h3, dl > div, a"),
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }
      );
    },
    { dependencies: [active], scope: cardRef }
  );

  const jumpTo = (i) => {
    const st = stRef.current;
    if (!st) return;
    const n = countries.length;
    const y = st.start + ((i + 0.5) / n) * (st.end - st.start);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y });
  };

  const c = countries[active];

  return (
    <section id="countries" ref={sectionRef} className="relative bg-charcoal">
      {/* Desktop: pinned globe + country card (outer div isolates the pin-spacer from React) */}
      <div>
      <div data-pin className="relative hidden h-svh overflow-hidden lg:block">
        <div className="globe-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid h-full max-w-[1440px] grid-cols-12 items-center gap-8 px-10">
          <div className="relative col-span-7 h-full">
            <div className="absolute top-28 left-0 z-10 max-w-md">
              <p className="eyebrow mb-4 text-brand-cyan">{countriesSection.eyebrow}</p>
              <SplitReveal className="font-display text-[clamp(3rem,5vw,5.25rem)] text-ink">{countriesSection.title}</SplitReveal>
            </div>
            <div className="absolute inset-0 top-16">{isDesktop && nearby ? <GlobeView country={c} origin={origin} /> : <GlobeFallback />}</div>
            <ol className="absolute bottom-10 left-0 z-10 flex flex-wrap gap-x-5 gap-y-2" aria-label="Countries">
              {countries.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={i === active ? "true" : undefined}
                    className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors ${i === active ? "text-brand-red" : "text-muted hover:text-ink"}`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="col-span-5" aria-live="polite">
            <div ref={cardRef}>
              <CountryCard key={c.id} c={c} index={active} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">{countriesSection.note}</p>
          </div>
        </div>
      </div>

      </div>

      {/* Mobile / tablet: swipeable cards */}
      <div className="relative py-24 lg:hidden">
        <div className="px-5 md:px-10">
          <p className="eyebrow mb-4 text-brand-cyan">{countriesSection.eyebrow}</p>
          <SplitReveal className="font-display text-[clamp(2.8rem,11vw,4.5rem)] text-ink">{countriesSection.title}</SplitReveal>
          <p className="mt-4 text-sm text-muted">Swipe to explore →</p>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 md:scroll-px-10 md:px-10">
          {countries.map((item, i) => (
            <div key={item.id} className="w-[85%] max-w-[420px] shrink-0 snap-start">
              <CountryCard c={item} index={i} compact />
            </div>
          ))}
        </div>
        <p className="mt-4 px-5 text-xs leading-relaxed text-muted md:px-10">{countriesSection.note}</p>
      </div>
    </section>
  );
}
