"use client";

import { useEffect } from "react";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import { track, isValidGtmId, isValidClarityId } from "@/lib/analytics";

/**
 * Google Tag Manager + click tracking for contact links.
 * Events: whatsapp_click, phone_click, email_click (plus generate_lead from forms).
 */
export default function Analytics({ gtmId, clarityId }) {
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

  const clarity = isValidClarityId(clarityId) ? clarityId.trim() : null;
  return (
    <>
      {isValidGtmId(gtmId) && <GoogleTagManager gtmId={gtmId.trim()} />}
      {/* Microsoft Clarity — loads last, once the page is idle, so it never slows the site. */}
      {clarity && (
        <Script id="ms-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`}
        </Script>
      )}
    </>
  );
}
