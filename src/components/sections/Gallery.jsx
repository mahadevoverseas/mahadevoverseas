"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import { getLenis } from "@/components/providers/SmoothScroll";
import SplitReveal from "@/components/ui/SplitReveal";
import { frameUrl } from "@/lib/frames";

/** Muted looping preview that only loads and plays while on screen. */
function VideoTile({ item }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (video.preload !== "auto") video.preload = "auto";
          video.play().catch(() => {});
        } else video.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [item.video]);

  return (
    <video
      ref={ref}
      src={item.video}
      poster={item.image || undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
    />
  );
}

function Lightbox({ items, index, onClose, onMove }) {
  const item = items[index];
  const touch = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[80] flex flex-col bg-charcoal/97 backdrop-blur-sm"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touch.current ?? 0);
        if (Math.abs(dx) > 50) onMove(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <p className="text-xs font-bold tracking-[0.25em] text-muted uppercase">
          {index + 1} / {items.length} · {item.category}
        </p>
        <button type="button" onClick={onClose} aria-label="Close" className="grid size-11 place-items-center rounded-[10px] border border-white/15 text-ink hover:border-white/40" autoFocus>
          <X className="size-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        {item.video ? (
          <video key={item.video} src={item.video} poster={item.image || undefined} controls autoPlay playsInline className="max-h-full max-w-full rounded-[10px]" />
        ) : (
          <div className="relative h-full w-full">
            <Image key={item.image} src={item.image} alt={item.title} fill sizes="100vw" className="object-contain" />
          </div>
        )}
        <button
          type="button"
          onClick={() => onMove(-1)}
          aria-label="Previous"
          className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-ink hover:bg-brand-red md:left-6"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          aria-label="Next"
          className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-ink hover:bg-brand-red md:right-6"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>

      <div className="px-5 py-5 text-center md:px-8">
        <p className="font-display text-2xl text-ink md:text-3xl">{item.title}</p>
        {item.caption && <p className="mx-auto mt-1 max-w-2xl text-sm text-muted">{item.caption}</p>}
      </div>
    </div>
  );
}

export default function Gallery() {
  const { gallery } = useSite();
  const gridRef = useRef(null);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);

  // Built-in /gallery/… files may be served from Cloudflare; see lib/frames.js.
  const all = (gallery?.items ?? [])
    .filter((i) => i.image || i.video)
    .map((i) => ({ ...i, image: frameUrl(i.image), video: frameUrl(i.video) }));
  const categories = ["All", ...new Set(all.map((i) => i.category).filter(Boolean))];
  const items = filter === "All" ? all : all.filter((i) => i.category === filter);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(gridRef.current.children, {
        y: 50,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
      });
    },
    { dependencies: [filter], scope: gridRef }
  );

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  return (
    <section aria-labelledby="gallery-title" className="relative bg-charcoal py-20 md:py-28">
      <div className="globe-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5 text-brand-cyan">{gallery.eyebrow}</p>
            <SplitReveal className="font-display text-[clamp(2.6rem,6.5vw,5.5rem)] text-ink">
              <span id="gallery-title">{gallery.title}</span>
            </SplitReveal>
            {gallery.intro && <p className="mt-5 max-w-xl text-muted">{gallery.intro}</p>}
          </div>
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={filter === c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold tracking-wide transition-colors ${
                    filter === c ? "border-brand-red bg-brand-red text-white" : "border-white/15 text-ink/80 hover:border-white/40 hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <ul ref={gridRef} key={filter} className="grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const isVideo = Boolean(item.video);
            return (
              <li key={`${item.title}-${i}`} className={isVideo ? "sm:col-span-2" : ""}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  data-cursor="hover"
                  aria-label={`Open ${item.title}`}
                  className={`group relative block w-full overflow-hidden rounded-[10px] bg-card ${isVideo ? "aspect-video" : "aspect-[4/5] sm:aspect-square"}`}
                >
                  {isVideo ? (
                    <VideoTile item={item} />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                    />
                  )}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                  {isVideo && (
                    <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.2em] text-white uppercase backdrop-blur">
                      <Play className="size-3 fill-current" /> Video
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 p-5 text-left">
                    <span className="block text-[0.65rem] font-bold tracking-[0.25em] text-brand-cyan uppercase">{item.category}</span>
                    <span className="font-display mt-1 block text-2xl text-ink md:text-3xl">{item.title}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {open !== null && <Lightbox items={items} index={open} onClose={close} onMove={move} />}
    </section>
  );
}
