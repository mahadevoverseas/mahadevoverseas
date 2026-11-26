"use client";

/**
 * Tiny global store connecting the hero <ScrollSequence> (which reports
 * how many of its first frames have loaded) with the intro <Loader>.
 */
const state = { progress: 0, done: false, expected: false };
const listeners = new Set();

export const loaderStore = {
  get: () => state,
  /** Called by a frame sequence that wants the loader to wait for it. */
  expect() {
    state.expected = true;
  },
  setProgress(p) {
    if (state.done) return;
    state.progress = Math.max(state.progress, Math.min(1, p));
    listeners.forEach((l) => l(state));
  },
  finish() {
    if (state.done) return;
    state.progress = 1;
    state.done = true;
    listeners.forEach((l) => l(state));
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

/** Fired once the loader has fully left the screen. */
export const INTRO_EVENT = "mo:intro";

export function onIntro(cb) {
  if (typeof window === "undefined") return () => {};
  if (window.__moIntroDone) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, cb);
}
