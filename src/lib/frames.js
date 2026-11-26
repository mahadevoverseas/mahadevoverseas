/**
 * Video frame sequences (public/frames) and built-in gallery media (public/gallery).
 *
 * Bump FRAMES_VERSION whenever you regenerate the frames from new videos —
 * frames are cached by browsers for a year, so the version in the URL is what
 * forces everyone to download the new images. Keep the matching "?v=" in
 * next.config.mjs in sync.
 *
 * To serve frames from Cloudflare (R2 + CDN) instead of this server, upload
 * them (and public/gallery) with `npm run frames:upload` and set NEXT_PUBLIC_FRAMES_BASE_URL to the
 * bucket's public URL (e.g. https://media.yourdomain.com).
 */
export const FRAMES_VERSION = "2";

const BASE = (process.env.NEXT_PUBLIC_FRAMES_BASE_URL || "").replace(/\/$/, "");

/** Built-in media (frame sequences and gallery videos) can be moved to Cloudflare. */
const MANAGED = ["/frames/", "/gallery/"];

export const frameUrl = (src) => (src && MANAGED.some((p) => src.startsWith(p)) ? `${BASE}${src}?v=${FRAMES_VERSION}` : src);

/** Frame counts per sequence: [desktop (30fps, 1920w), mobile (every 2nd, 960w)]. */
export const FRAME_COUNTS = {
  hero: [448, 224],
  burst: [448, 224],
  journey: [448, 224],
  visa: [238, 119],
  takeoff: [238, 119],
  destinations: [238, 119],
};
