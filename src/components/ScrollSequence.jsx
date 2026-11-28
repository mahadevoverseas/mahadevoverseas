"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { createFrameLoader } from "@/lib/frame-loader";
import { loaderStore } from "@/lib/loader-store";
import { frameUrl } from "@/lib/frames";

const pad = (n) => String(n).padStart(4, "0");

/**
 * Full-screen, scroll-scrubbed image sequence drawn on a <canvas>.
 *
 * Frames live in /public/frames/{name}/frame_0001.webp (desktop, 1920w)
 * and /public/frames/{name}-mobile/frame_0001.webp (mobile, 960w, every 2nd frame).
 *
 * The timeline handed to `onTimeline(tl, { mobile })` runs from 0 → 1 while the
 * section is pinned, so overlay animations can be positioned with 0–1 values.
 * Overlay children should look correct un-animated — that is what users with
 * prefers-reduced-motion see (on top of the poster image).
 */
export default function ScrollSequence({
  id,
  name,
  frames,
  mobileFrames,
  length = 300, // pinned scroll distance in % of viewport height (desktop)
  mobileLength,
  reportProgress = false, // feed the intro loader (hero only)
  priorityPoster = false,
  posterAlt = "",
  onTimeline,
  fadeOut = true,
  className = "",
  children,
}) {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(
    () => {
      if (reportProgress) loaderStore.expect();
      const mm = gsap.matchMedia();
      mm.add(
        {
          mobile: "(max-width: 767px)",
          desktop: "(min-width: 768px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { mobile, reduce } = ctx.conditions;
          if (reduce) {
            if (reportProgress) loaderStore.finish();
            return;
          }

          const section = sectionRef.current;
          const canvas = canvasRef.current;
          const c2d = canvas.getContext("2d", { alpha: false });
          const count = mobile ? mobileFrames : frames;
          const folder = mobile ? `${name}-mobile` : name;
          const state = { frame: 0 };
          let drawn = -1; // frame index currently on the canvas
          let wanted = -1; // frame index the scroll position asks for
          let lastIdx = 0;
          let raf = 0;
          const maxW = mobile ? 960 : 1920; // frames' real width — no point drawing bigger

          const paint = (i) => {
            const img = loader.images[i];
            if (!img) return;
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;
            const scale = Math.max(cw / iw, ch / ih); // cover-fit
            const w = iw * scale;
            const h = ih * scale;
            c2d.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
            loader.touch(i);
            drawn = i;
            canvas.style.opacity = "1";
          };

          const draw = (force = false) => {
            const idx = Math.min(count - 1, Math.max(0, Math.round(state.frame)));
            wanted = idx;
            const dir = idx >= lastIdx ? 1 : -1;
            lastIdx = idx;
            // While scrolling, decode well ahead; at rest (first paint, resize) only a few.
            loader.warm(idx, dir, force ? 2 : 18, force ? 1 : 4);
            const ready = loader.nearestReady(idx); // never block on a sync decode
            if (ready < 0 || (!force && ready === drawn)) return;
            paint(ready);
          };
          const requestDraw = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => draw(true));
          };

          const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
            const { clientWidth, clientHeight } = canvas;
            // Cap the backing store at the source resolution (cover-fit keeps aspect).
            const scale = Math.min(dpr, maxW / Math.max(1, clientWidth));
            canvas.width = Math.max(1, Math.round(clientWidth * Math.max(scale, 0.5)));
            canvas.height = Math.max(1, Math.round(clientHeight * Math.max(scale, 0.5)));
            c2d.imageSmoothingQuality = "high";
            draw(true);
          };

          const loader = createFrameLoader({
            count,
            src: (i) => frameUrl(`/frames/${folder}/frame_${pad(i + 1)}.webp`),
            priority: 12,
            concurrency: mobile ? 4 : 6,
            // A frame became ready: repaint if it is closer to what we want than what's shown.
            onFrame: (i) => {
              if (drawn === -1 || (wanted >= 0 && Math.abs(i - wanted) < Math.abs(drawn - wanted))) requestDraw();
            },
            onPriorityProgress: reportProgress
              ? (p) => (p >= 1 ? loaderStore.finish() : loaderStore.setProgress(p))
              : undefined,
          });

          const ro = new ResizeObserver(resize);
          ro.observe(canvas);

          // Hero starts loading right away; the others when they get close.
          let io;
          if (reportProgress) loader.start();
          else {
            io = new IntersectionObserver(
              (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                  loader.start();
                  io.disconnect();
                }
              },
              { rootMargin: "200% 0px 200% 0px" }
            );
            io.observe(section);
          }

          const pinLength = mobile ? mobileLength ?? Math.round(length * 0.7) : length;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: `+=${pinLength}%`,
              pin: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(state, { frame: count - 1, duration: 1, onUpdate: () => draw() }, 0);

          if (fadeOut) {
            tl.to(mediaRef.current, { scale: 1.08, autoAlpha: 0.15, duration: 0.12, ease: "power1.in" }, 0.88);
          }

          onTimeline?.(tl, { mobile });

          return () => {
            loader.abort();
            ro.disconnect();
            io?.disconnect();
            cancelAnimationFrame(raf);
            canvas.style.opacity = "0";
          };
        }
      );
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    // The wrapper div keeps GSAP's pin-spacer out of React's way during route changes.
    <div>
    <section ref={sectionRef} id={id} className={`relative h-svh w-full overflow-hidden bg-charcoal ${className}`}>
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <Image
          src={frameUrl(`/frames/${name}/poster.webp`)}
          alt={posterAlt}
          fill
          sizes="100vw"
          priority={priorityPoster}
          quality={70}
          className="object-cover"
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(18,21,28,0.75)_100%)]" />
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </section>
    </div>
  );
}
