import { existsSync } from "fs";

// Load .env.local (and .env) so the scripts see the same settings as Next.js.
for (const f of [".env.local", ".env"]) if (existsSync(f)) process.loadEnvFile(f);

export function need(...names) {
  const missing = names.filter((n) => !process.env[n] || /<[^>]+>/.test(process.env[n]));
  if (missing.length) {
    console.error(`Missing or still a placeholder in .env.local: ${missing.join(", ")}`);
    process.exit(1);
  }
}
