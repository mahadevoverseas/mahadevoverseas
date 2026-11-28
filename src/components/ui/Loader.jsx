"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { loaderStore, INTRO_EVENT } from "@/lib/loader-store";
import { getLenis } from "@/components/providers/SmoothScroll";

/** Intro loader: MO monogram, a filling red line and a % counter. */
export default function Loader() {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const shown = { v: 0 };
    const startedAt = performance.now();
    document.documentElement.classList.add("is-loading");
    getLenis()?.stop();
    let leaving = false;
    let tween;

    const render = () => {
      if (countRef.current) countRef.current.textContent = String(Math.round(shown.v * 100)).padStart(2, "0");
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${shown.v})`;
    };

    const leave = () => {
      if (leaving) return;
      leaving = true;
      const wait = Math.max(0, 700 - (performance.now() - startedAt)) / 1000;
      const reduce = prefersReducedMotion();
      gsap
        .timeline({ delay: wait, onComplete: done })
        .to(shown, { v: 1, duration: reduce ? 0 : 0.4, ease: "power2.out", onUpdate: render })
        .to(root.querySelector("[data-loader-inner]"), { autoAlpha: 0, y: -20, duration: reduce ? 0 : 0.4, ease: "power2.in" }, "+=0.15")
        .add(announce, "-=0.1") // page content starts its entrance while the loader slides away
        .to(root, { yPercent: -100, duration: reduce ? 0 : 0.9, ease: "expo.inOut" }, "<");
    };

    const announce = () => {
      if (window.__moIntroDone) return;
      document.documentElement.classList.remove("is-loading");
      getLenis()?.start();
      window.__moIntroDone = true;
      window.dispatchEvent(new Event(INTRO_EVENT));
    };
    const done = () => {
      announce();
      root.style.display = "none";
      ScrollTrigger.refresh();
    };

    const unsub = loaderStore.subscribe((s) => {
      tween?.kill();
      tween = gsap.to(shown, { v: s.progress, duration: 0.5, ease: "power2.out", onUpdate: render });
      if (s.done) leave();
    });
    // Pages without a hero sequence just show a short brand intro.
    if (loaderStore.get().done || !loaderStore.get().expected) {
      loaderStore.finish();
      leave();
    }

    // Never keep a visitor waiting: on a slow connection the page shows the
    // still poster after ~2 s while the video frames keep loading.
    const safety = setTimeout(() => loaderStore.finish(), 2000);

    return () => {
      unsub();
      clearTimeout(safety);
      tween?.kill();
    };
  }, []);

  return (
    <div
      id="mo-loader"
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal"
      role="status"
      aria-live="polite"
      aria-label="Loading Mahadev Overseas"
    >
      <div data-loader-inner className="flex w-56 flex-col items-center gap-6">
        <Image src="/brand/mo-monogram.png" alt="Mahadev Overseas" width={1261} height={597} priority sizes="160px" className="h-auto w-40" />
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div ref={lineRef} className="h-full w-full origin-left scale-x-0 bg-brand-red" />
        </div>
        <div className="font-display text-sm tracking-[0.3em] text-muted">
          <span ref={countRef}>00</span>%
        </div>
      </div>
    </div>
  );
}
