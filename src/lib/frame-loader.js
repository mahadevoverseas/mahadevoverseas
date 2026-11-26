"use client";

/**
 * Loads an image sequence in a smart order:
 *  1. the first `priority` frames (so the sequence can start immediately)
 *  2. then progressively finer passes (every 8th, 4th, 2nd, then all) so a
 *     fast scroll always has a nearby frame to show.
 *
 * Performance: drawing a WebP the browser hasn't decoded yet blocks the main
 * thread (~12 ms for a 1920px frame), and browsers throw decoded frames away
 * under memory pressure. So we:
 *  - decode frames *ahead* of the scroll position off the main thread (`warm`)
 *  - only ever draw frames we know are decoded (`nearestReady`), falling back
 *    to the closest ready frame for an instant instead of stalling.
 */
const READY_TTL = 6000; // ms a decoded frame is trusted to still be decoded

export function createFrameLoader({ count, src, priority = 30, concurrency = 6, onFrame, onPriorityProgress }) {
  const images = new Array(count).fill(null);
  const readyAt = new Float64Array(count); // last time frame i was known-decoded
  const decoding = new Uint8Array(count);
  const queued = new Uint8Array(count);
  const order = [];
  const push = (i) => {
    if (i >= 0 && i < count && !queued[i]) {
      queued[i] = 1;
      order.push(i);
    }
  };
  const firstN = Math.min(priority, count);
  for (let i = 0; i < firstN; i++) push(i);
  for (const stride of [8, 4, 2, 1]) for (let i = 0; i < count; i += stride) push(i);

  let cursor = 0;
  let active = 0;
  let priorityLoaded = 0;
  let aborted = false;
  let started = false;

  const markReady = (i) => {
    readyAt[i] = performance.now();
  };
  const isReady = (i) => images[i] && performance.now() - readyAt[i] < READY_TTL;

  const decode = (i) => {
    const img = images[i];
    if (!img || decoding[i] || isReady(i)) return;
    decoding[i] = 1;
    const done = () => {
      decoding[i] = 0;
      if (aborted) return;
      markReady(i);
      onFrame?.(i, img);
    };
    if (img.decode) img.decode().then(done, done);
    else done();
  };

  const pump = () => {
    while (!aborted && active < concurrency && cursor < order.length) {
      const i = order[cursor++];
      active++;
      const img = new Image();
      img.decoding = "async";
      if (i < firstN) img.fetchPriority = "high";
      const finish = (ok) => {
        active--;
        if (aborted) return;
        if (ok) {
          images[i] = img;
          markReady(i);
          onFrame?.(i, img);
        }
        if (i < firstN) {
          priorityLoaded++;
          onPriorityProgress?.(priorityLoaded / firstN);
        }
        pump();
      };
      img.onload = () => {
        if (img.decode) img.decode().then(() => finish(true), () => finish(true));
        else finish(true);
      };
      img.onerror = () => finish(false);
      img.src = src(i);
    }
  };

  return {
    images,
    start() {
      if (started) return;
      started = true;
      pump();
    },
    abort() {
      aborted = true;
    },
    /** Note that frame i was just drawn (drawing keeps it decoded). */
    touch(i) {
      if (images[i]) markReady(i);
    },
    /** Decode frames around `i`, mostly in the scroll direction, off the main thread. */
    warm(i, dir = 1, ahead = 18, behind = 4) {
      for (let k = 1; k <= ahead; k++) decode(i + dir * k);
      for (let k = 1; k <= behind; k++) decode(i - dir * k);
      decode(i);
    },
    /** Closest frame to `i` that can be drawn without blocking (prefers the exact one). */
    nearestReady(i) {
      if (isReady(i)) return i;
      for (let d = 1; d < count; d++) {
        if (i - d >= 0 && isReady(i - d)) return i - d;
        if (i + d < count && isReady(i + d)) return i + d;
      }
      // Nothing known-decoded: fall back to any loaded frame (may block once).
      for (let d = 0; d < count; d++) {
        if (i - d >= 0 && images[i - d]) return i - d;
        if (i + d < count && images[i + d]) return i + d;
      }
      return -1;
    },
  };
}
