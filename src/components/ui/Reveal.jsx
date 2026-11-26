"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Fades + lifts its direct children (or elements marked [data-reveal]) into
 * view as they scroll in. Uses transform/opacity only.
 */
export default function Reveal({ as: Tag = "div", children, className = "", stagger = 0.08, y = 40, start = "top 85%", ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current;
      const marked = el.querySelectorAll("[data-reveal]");
      const targets = marked.length ? marked : el.children;
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
