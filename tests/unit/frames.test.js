import { describe, expect, it, vi } from "vitest";

describe("frameUrl", () => {
  it("adds the cache-busting version to built-in media", async () => {
    const { frameUrl, FRAMES_VERSION } = await import("@/lib/frames");
    expect(frameUrl("/frames/hero/frame_0001.webp")).toBe(`/frames/hero/frame_0001.webp?v=${FRAMES_VERSION}`);
    expect(frameUrl("/gallery/visa.mp4")).toBe(`/gallery/visa.mp4?v=${FRAMES_VERSION}`);
  });

  it("leaves other URLs untouched", async () => {
    const { frameUrl } = await import("@/lib/frames");
    expect(frameUrl("/brand/logo-on-dark.png")).toBe("/brand/logo-on-dark.png");
    expect(frameUrl("https://example.com/x.jpg")).toBe("https://example.com/x.jpg");
    expect(frameUrl("")).toBe("");
    expect(frameUrl(undefined)).toBeUndefined();
  });

  it("prefixes the Cloudflare base URL when configured", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_FRAMES_BASE_URL", "https://media.example.com/");
    const { frameUrl } = await import("@/lib/frames");
    expect(frameUrl("/frames/hero/poster.webp")).toMatch(/^https:\/\/media\.example\.com\/frames\/hero\/poster\.webp\?v=/);
    vi.unstubAllEnvs();
  });

  it("has a frame count for every sequence that has files", async () => {
    const fs = await import("fs");
    const { FRAME_COUNTS } = await import("@/lib/frames");
    for (const [name, [desktop, mobile]] of Object.entries(FRAME_COUNTS)) {
      const d = fs.readdirSync(`public/frames/${name}`).filter((f) => f.startsWith("frame_")).length;
      const m = fs.readdirSync(`public/frames/${name}-mobile`).filter((f) => f.startsWith("frame_")).length;
      expect([name, d, m]).toEqual([name, desktop, mobile]);
    }
  });
});
