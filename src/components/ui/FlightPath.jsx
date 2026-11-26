"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { PlaneGlyph } from "./icons";

const PATHS = {
  // gentle swoop, left → right
  swoop: "M-20 150 C 260 150 380 30 720 60 S 1150 170 1400 50",
  // rising arc
  rise: "M-20 170 C 320 170 520 120 760 90 S 1180 30 1400 24",
  // dip
  dip: "M-20 30 C 300 30 480 170 760 150 S 1200 40 1400 90",
};

/**
 * The signature motif: a thin red curved flight path that draws itself as you
 * scroll, with a small plane riding the tip of the line.
 */
export default function FlightPath({ variant = "swoop", className = "", tone = "dark", start = "top 90%", end = "bottom 30%" }) {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const planeRef = useRef(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      const plane = planeRef.current;
      if (prefersReducedMotion()) {
        gsap.set(plane, { autoAlpha: 0 });
        return;
      }
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: wrapRef.current, start, end, scrub: 0.6 },
      });
      tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0).to(
        plane,
        {
          duration: 1,
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 1 },
        },
        0
      );
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} aria-hidden="true" className={`pointer-events-none relative w-full ${className}`}>
      <svg viewBox="0 0 1440 200" className="block h-auto w-full overflow-visible" fill="none">
        <path d={PATHS[variant]} stroke={tone === "dark" ? "rgba(242,244,247,0.07)" : "rgba(20,26,38,0.08)"} strokeWidth="1.5" strokeDasharray="4 8" />
        <path ref={pathRef} d={PATHS[variant]} stroke="#F32832" strokeWidth="2" strokeLinecap="round" />
        <g ref={planeRef} className={tone === "dark" ? "text-ink" : "text-navy"}>
          <PlaneGlyph width="34" height="34" x="-17" y="-17" />
        </g>
      </svg>
    </div>
  );
}
