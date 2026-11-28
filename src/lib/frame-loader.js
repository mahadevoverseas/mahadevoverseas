"use client";

/**
 * Loads an image sequence without hurting page-load speed:
 *  1. only the first `priority` frames download right away;
 *  2. the rest download after the page has finished loading and the browser
 *     is idle, in progressively finer passes (every 8th, 4th, 2nd, then all)
 *     so a fast scroll always has a nearby frame;
 *  3. frames are decoded only when they are about to be shown (`warm`), never
 *     all at once — decoding hundreds of frames during load blocked the page.
 *
 * Drawing a frame that isn't decoded yet blocks the main thread (~12 ms at
 * 1920px), so `nearestReady` only returns frames known to be decoded.
 */
const READY_TTL = 6000; // ms a decoded frame is trusted to still be decoded

/** Resolves once the page has loaded and the browser has a quiet moment. */
function whenPageIdle() {
  return new Promise((resolve) => {
    const idle = () => (window.requestIdleCallback ? requestIdleCallback(() => resolve(), { timeout: 2000 }) : setTimeout(resolve, 300));
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

export function createFrameLoader({ count, src, priority = 12, concurrency = 6, onFrame, onPriorityProgress }) {
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
  let bulkAllowed = false;

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
      if (cursor >= firstN && !bulkAllowed) return; // wait for page load + idle
      const i = order[cursor++];
      active++;
      const img = new Image();
      img.decoding = "async";
      if (i < firstN) img.fetchPriority = "high";
      else img.fetchPriority = "low";
      const finish = (ok) => {
        active--;
        if (aborted) return;
        if (ok) {
          images[i] = img; // downloaded (compressed); decoded later on demand
          onFrame?.(i, img);
        }
        if (i < firstN) {
          priorityLoaded++;
          onPriorityProgress?.(priorityLoaded / firstN);
        }
        pump();
      };
      img.onload = () => finish(true);
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
      whenPageIdle().then(() => {
        bulkAllowed = true;
        pump();
      });
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
      decode(i);
      for (let k = 1; k <= ahead; k++) decode(i + dir * k);
      for (let k = 1; k <= behind; k++) decode(i - dir * k);
    },
    /** Closest frame to `i` that can be drawn without blocking (prefers the exact one). */
    nearestReady(i) {
      if (isReady(i)) return i;
      for (let d = 1; d < count; d++) {
        if (i - d >= 0 && isReady(i - d)) return i - d;
        if (i + d < count && isReady(i + d)) return i + d;
      }
      return -1; // nothing decoded yet — keep showing the poster
    },
  };
}
