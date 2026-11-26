"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntro } from "@/lib/loader-store";
import { useSite } from "@/components/providers/ContentProvider";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

/** Floating WhatsApp chat button, bottom-right on every page. */
export default function WhatsAppFloat() {
  const { contact, whatsappFloat } = useSite();
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(ref.current, { scale: 0, autoAlpha: 0 });
      return onIntro(() => gsap.to(ref.current, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(2)", delay: 0.8 }));
    },
    { scope: ref }
  );

  if (whatsappFloat?.enabled === false || !contact?.whatsapp) return null;

  return (
    <a
      ref={ref}
      href={whatsappLink(contact)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsappFloat?.label || "Chat with us on WhatsApp"}
      className="group fixed right-4 bottom-4 z-[60] flex items-center gap-3 rounded-full bg-[#1DA851] p-3.5 text-white shadow-[0_12px_30px_-8px_rgba(29,168,81,0.7)] transition-colors hover:bg-[#25D366] md:right-6 md:bottom-6"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.4s]" aria-hidden="true" />
      <WhatsAppIcon className="size-7" />
      {whatsappFloat?.label && (
        <span className="hidden max-w-0 overflow-hidden pr-0 text-sm font-bold whitespace-nowrap transition-[max-width,padding] duration-500 ease-out-expo group-hover:max-w-48 group-hover:pr-2 md:inline">
          {whatsappFloat.label}
        </span>
      )}
    </a>
  );
}
