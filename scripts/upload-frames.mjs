/**
 * Uploads public/frames (video frame sequences + posters) and public/gallery
 * (gallery videos + covers) to Cloudflare R2.
 *
 *   npm run frames:upload
 *
 * Then set NEXT_PUBLIC_FRAMES_BASE_URL to R2_PUBLIC_URL and rebuild — the
 * site will load frames from Cloudflare's CDN instead of your server.
 * Files already in the bucket with the same size are skipped (pass --force
 * to re-upload everything, e.g. after regenerating frames).
 */
import { readdir, readFile, stat } from "fs/promises";
import path from "path";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { need } from "./env.mjs";

need("R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET");
const force = process.argv.includes("--force");
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (TYPES[path.extname(p)]) out.push(p);
  }
  return out;
}

const TYPES = { ".webp": "image/webp", ".mp4": "video/mp4", ".jpg": "image/jpeg", ".png": "image/png" };
const files = [...(await walk("public/frames")), ...(await walk("public/gallery"))];
let done = 0;
let skipped = 0;
let i = 0;

async function worker() {
  while (i < files.length) {
    const file = files[i++];
    const key = path.relative("public", file).split(path.sep).join("/"); // frames/hero/frame_0001.webp
    const size = (await stat(file)).size;
    if (!force) {
      try {
        const head = await s3.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
        if (head.ContentLength === size) {
          skipped++;
          continue;
        }
      } catch {
        /* not there yet */
      }
    }
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: await readFile(file),
        ContentType: TYPES[path.extname(file)],
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    done++;
    if (done % 100 === 0) console.log(`  ${done} uploaded…`);
  }
}

console.log(`Uploading ${files.length} media files to R2 bucket "${process.env.R2_BUCKET}"…`);
await Promise.all(Array.from({ length: 16 }, worker));
console.log(`Done: ${done} uploaded, ${skipped} already up to date.`);
