// Shared by server (ID check) and browser (track) — so no "use client" here.

/**
 * Pushes an event to Google Tag Manager's dataLayer. Never send personal data
 * (names, phone numbers, emails) — Google's policies forbid it.
 */
export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export const isValidGtmId = (id) => /^GTM-[A-Z0-9]{4,12}$/.test(String(id ?? "").trim());
