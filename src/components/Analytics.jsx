"use client";

import { useEffect } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { track, isValidGtmId } from "@/lib/analytics";

/**
 * Google Tag Manager + click tracking for contact links.
 * Events: whatsapp_click, phone_click, email_click (plus generate_lead from forms).
 */
export default function Analytics({ gtmId }) {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      const location = a.closest("header") ? "header" : a.closest("footer") ? "footer" : a.closest("#contact") ? "contact" : "page";
      if (href.startsWith("https://wa.me/")) track("whatsapp_click", { link_location: location });
      else if (href.startsWith("tel:")) track("phone_click", { link_location: location });
      else if (href.startsWith("mailto:")) track("email_click", { link_location: location });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!isValidGtmId(gtmId)) return null;
  return <GoogleTagManager gtmId={gtmId.trim()} />;
}
