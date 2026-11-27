import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    include: ["tests/unit/**/*.test.js"],
    environment: "node",
    // Never let unit tests reach the live database or bucket.
    env: { MONGODB_URI: "", R2_ACCOUNT_ID: "", NEXT_PUBLIC_FRAMES_BASE_URL: "" },
  },
});
