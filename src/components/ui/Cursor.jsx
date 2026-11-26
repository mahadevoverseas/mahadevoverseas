"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Small red dot with a trailing cyan ring — fine pointers only. */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    document.documentElement.classList.add("has-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    let visible = false;
    const move = (e) => {
      if (!visible) {
        visible = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e) => {
      const hot = e.target.closest?.("a, button, [data-cursor='hover'], label, select");
      gsap.to(ring, { scale: hot ? 1.8 : 1, borderColor: hot ? "rgba(243,40,50,0.8)" : "rgba(53,192,235,0.8)", duration: 0.35 });
      gsap.to(dot, { scale: hot ? 0.5 : 1, duration: 0.3 });
    };
    const leave = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
    };
    const down = () => gsap.to(ring, { scale: 0.75, duration: 0.2 });
    const up = () => gsap.to(ring, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[95] hidden size-9 rounded-full border border-brand-cyan/80 opacity-0 md:block"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[96] hidden size-2 rounded-full bg-brand-red opacity-0 md:block"
      />
    </>
  );
}
