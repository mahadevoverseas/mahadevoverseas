"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntro } from "@/lib/loader-store";

/**
 * Headline that reveals line by line, each line sliding up from a mask.
 * `trigger="intro"` plays right after the loader; default plays on scroll.
 */
export default function SplitReveal({ as: Tag = "h2", children, className = "", delay = 0, trigger = "scroll", start = "top 85%", id }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current;
      let anim;
      let off;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          anim?.kill();
          anim = gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            delay,
            paused: trigger === "intro",
            scrollTrigger: trigger === "scroll" ? { trigger: el, start, once: true } : undefined,
          });
          if (trigger === "intro") off = onIntro(() => anim.play());
          return anim;
        },
      });
      return () => {
        off?.();
        split.revert();
      };
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
