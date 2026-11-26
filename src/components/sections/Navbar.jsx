"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/ContentProvider";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import Magnetic from "@/components/ui/Magnetic";
import { getLenis } from "@/components/providers/SmoothScroll";
import { onIntro } from "@/lib/loader-store";

export default function Navbar() {
  const { nav, cta, contact } = useSite();
  const pathname = usePathname();
  const isActive = (href) => href !== "/" && (pathname === href || pathname.startsWith(href + "/"));
  const barRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  // Solid after scrolling; hide on scroll down, show on scroll up.
  useGSAP(() => {
    const bar = barRef.current;
    gsap.set(bar, { yPercent: -100 });
    const off = onIntro(() => gsap.to(bar, { yPercent: 0, duration: 0.9, ease: "expo.out", delay: 0.3 }));
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        setSolid(self.scroll() > 80);
        const shouldHide = self.direction === 1 && self.scroll() > 400;
        if (shouldHide !== hidden) {
          hidden = shouldHide;
          gsap.to(bar, { yPercent: hidden ? -100 : 0, duration: 0.5, ease: "power3.out", overwrite: true });
        }
      },
    });
    return () => {
      off();
      st.kill();
    };
  });

  // Full-screen mobile menu with staggered links.
  useEffect(() => {
    const menu = menuRef.current;
    const links = menu.querySelectorAll("[data-menu-item]");
    const reduce = prefersReducedMotion();
    if (open) {
      getLenis()?.stop();
      document.body.style.overflow = "hidden";
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(menu, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: reduce ? 0 : 0.8, ease: "expo.inOut" });
      gsap.fromTo(links, { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: reduce ? 0 : 0.7, stagger: 0.06, delay: reduce ? 0 : 0.3, ease: "expo.out" });
    } else if (menu.style.display === "flex") {
      gsap.to(menu, {
        clipPath: "circle(0% at 100% 0%)",
        duration: reduce ? 0 : 0.6,
        ease: "expo.inOut",
        onComplete: () => gsap.set(menu, { display: "none" }),
      });
      getLenis()?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        ref={barRef}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          solid ? "bg-charcoal/95 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav aria-label="Main" className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <Link href="/" className="shrink-0" aria-label="Mahadev Overseas — home">
            <Image src="/brand/logo-on-dark.png" alt="Mahadev Overseas" width={1417} height={832} priority className="h-11 w-auto md:h-13" />
          </Link>

          <ul className="hidden items-center gap-7 xl:flex">
            {nav.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="group relative py-2 text-[0.82rem] font-semibold tracking-wide text-ink/85 transition-colors hover:text-ink aria-[current=page]:text-ink"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-right scale-x-0 bg-brand-red transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100 group-aria-[current=page]:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={whatsappLink(contact)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="grid size-11 place-items-center rounded-[10px] border border-white/15 text-ink transition-colors hover:border-[#25D366] hover:text-[#25D366]"
            >
              <WhatsAppIcon className="size-5" />
            </a>
            <div className="hidden sm:block">
              <Magnetic>
                <Link href={cta.href} className="btn btn-red">
                  {cta.label}
                </Link>
              </Magnetic>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-[60] grid size-11 place-items-center rounded-[10px] border border-white/15 text-ink xl:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className="fixed inset-0 z-[49] hidden flex-col justify-between bg-charcoal px-6 pt-28 pb-10"
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <div className="globe-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <ul className="relative flex flex-col gap-1">
          {nav.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <Link
                data-menu-item
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display flex items-baseline gap-4 py-1 text-[clamp(2.6rem,11vw,4.5rem)] text-ink"
              >
                <span className="font-sans text-xs font-bold tracking-widest text-brand-red">0{i + 1}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div data-menu-item className="relative flex flex-col gap-3">
          <Link href={cta.href} onClick={() => setOpen(false)} className="btn btn-red w-full">
            {cta.label}
          </Link>
          <a href={`tel:${contact.phoneHref}`} className="btn btn-ghost w-full">
            <Phone className="size-4" /> {contact.phone}
          </a>
        </div>
      </div>
    </>
  );
}
