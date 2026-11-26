"use client";

import { useRef } from "react";
import ScrollSequence from "@/components/ScrollSequence";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntro } from "@/lib/loader-store";
import { FRAME_COUNTS } from "@/lib/frames";
import { useSite } from "@/components/providers/ContentProvider";

/**
 * Scroll-scrubbed video scene with an animated title.
 *
 * mode="header": opens a page — the title is visible on load and slides away
 *                as you scroll into the film.
 * mode="scene":  sits mid-page — the title rises in, holds, then fades out.
 */
export default function FilmScene({ name, page, eyebrow, title, text, mode = "scene", length = 220, mobileLength = 160, align = "left", id, posterAlt = "", accentLast = true }) {
  const { pages } = useSite();
  // `page` pulls eyebrow/title/text from the admin-editable page banners.
  const banner = page ? pages?.[page] : undefined;
  const heading = title ?? banner?.title;
  const kicker = eyebrow ?? banner?.eyebrow;
  const body = text ?? banner?.text;
  const overlayRef = useRef(null);
  const isHeader = mode === "header";
  const [frames, mobileFrames] = FRAME_COUNTS[name] ?? [0, 0];
  const words = String(heading ?? "").split(" ");

  // Header: entrance right after the intro loader / page change.
  useGSAP(
    () => {
      if (!isHeader || prefersReducedMotion()) return;
      const el = overlayRef.current;
      const w = el.querySelectorAll("[data-fs-word]");
      const f = el.querySelectorAll("[data-fs-fade]");
      gsap.set(w, { yPercent: 110 });
      gsap.set(f, { autoAlpha: 0, y: 20 });
      return onIntro(() => {
        gsap.to(w, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.06 });
        gsap.to(f, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.25 });
      });
    },
    { scope: overlayRef }
  );

  const onTimeline = (tl) => {
    const el = overlayRef.current;
    const content = el.querySelector("[data-fs-content]");
    if (isHeader) {
      tl.to(content, { autoAlpha: 0, y: -80, duration: 0.25, ease: "power2.in" }, 0.12);
    } else {
      tl.from(el.querySelectorAll("[data-fs-word]"), { yPercent: 110, duration: 0.18, stagger: 0.025, ease: "power3.out" }, 0.1)
        .from(el.querySelectorAll("[data-fs-fade]"), { autoAlpha: 0, y: 30, duration: 0.14 }, 0.22)
        .to(content, { autoAlpha: 0, scale: 1.06, duration: 0.12, ease: "power2.in" }, 0.82);
    }
  };

  if (!frames) return null;
  const Heading = isHeader ? "h1" : "h2";
  const centered = align === "center";

  return (
    <ScrollSequence
      id={id}
      name={name}
      frames={frames}
      mobileFrames={mobileFrames}
      length={length}
      mobileLength={mobileLength}
      reportProgress={isHeader}
      priorityPoster={isHeader}
      posterAlt={posterAlt}
      onTimeline={onTimeline}
    >
      <div ref={overlayRef} className={`relative flex h-full flex-col px-5 md:px-10 ${centered ? "items-center justify-center text-center" : "justify-end pb-20 md:pb-24"}`}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/10 to-charcoal/85" />
        <div data-fs-content className={`relative w-full ${centered ? "max-w-6xl" : "mx-auto max-w-[1440px]"}`}>
          {kicker && (
            <p data-fs-fade className="eyebrow mb-6 text-brand-cyan">
              {kicker}
            </p>
          )}
          <Heading className={`font-display text-ink drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] ${isHeader ? "max-w-6xl text-[clamp(3.2rem,10vw,9.5rem)]" : "text-[clamp(3rem,9vw,9rem)]"}`}>
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.04em] align-bottom">
                <span data-fs-word className={`inline-block ${accentLast && i === words.length - 1 ? "text-brand-red" : ""}`}>
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </Heading>
          {body && (
            <p data-fs-fade className={`mt-6 max-w-xl text-base font-semibold text-ink/85 md:text-lg ${centered ? "mx-auto" : ""}`}>
              {body}
            </p>
          )}
        </div>
      </div>
    </ScrollSequence>
  );
}
