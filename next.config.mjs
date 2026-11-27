// Hosts for Cloudflare R2 images (admin uploads + optional frames CDN).
const remoteHosts = [process.env.R2_PUBLIC_URL, process.env.NEXT_PUBLIC_FRAMES_BASE_URL]
  .filter(Boolean)
  .map((u) => new URL(u))
  .map((u) => ({ protocol: u.protocol.replace(":", ""), hostname: u.hostname, pathname: "/**" }));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tests build into their own folder so they never replace your real build.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    remotePatterns: [{ protocol: "https", hostname: "flagcdn.com" }, ...remoteHosts],
    // Frame images carry a ?v= version to bust caches — keep this in sync with
    // FRAMES_VERSION in src/lib/frames.js.
    localPatterns: [
      { pathname: "/frames/**", search: "?v=2" },
      { pathname: "/gallery/**", search: "?v=2" },
      { pathname: "/**", search: "" },
    ],
  },
  async headers() {
    return [
      {
        // Frame sequences never change for a given filename.
        source: "/frames/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
