import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end tests run against a production build of the site that uses a
 * throwaway copy of the content (.test-content) — never the live MongoDB or
 * Cloudflare R2.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testIgnore: /admin\.spec/ },
    { name: "reduced-motion", use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" }, testMatch: /(pages|home)\.spec/ },
  ],
  webServer: {
    command: `node tests/e2e/prepare.mjs && next build && next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
    env: {
      NEXT_DIST_DIR: ".next-test",
      LOCAL_CONTENT_DIR: ".test-content",
      ADMIN_PASSWORD: "e2e-test-password",
      ADMIN_SECRET: "e2e-test-secret",
      MONGODB_URI: "",
      R2_ACCOUNT_ID: "",
      R2_ACCESS_KEY_ID: "",
      R2_SECRET_ACCESS_KEY: "",
      R2_BUCKET: "",
      R2_PUBLIC_URL: "",
      NEXT_PUBLIC_FRAMES_BASE_URL: "",
    },
  },
});
