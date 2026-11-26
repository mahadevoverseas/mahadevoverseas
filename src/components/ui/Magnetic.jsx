"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Makes its single child gently follow the pointer (desktop only). */
export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);

  useGSAP(
    (ctx, contextSafe) => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
      const el = ref.current;
      const target = el.firstElementChild || el;
      const xTo = gsap.quickTo(target, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(target, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

      const move = contextSafe((e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      const leave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
