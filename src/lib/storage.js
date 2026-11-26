import { promises as fs } from "fs";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UPLOADS_DIR } from "./content";

/**
 * Image storage for admin uploads.
 *
 * Production: Cloudflare R2 (S3-compatible). Set in .env.local / your host:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 *   R2_PUBLIC_URL   public URL of the bucket, e.g. https://media.yourdomain.com
 *                   (an R2 custom domain) or https://pub-xxxx.r2.dev
 *
 * Fallback when R2 is not configured: content/uploads, served at /media/…
 */
export const r2Enabled = () =>
  Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET && process.env.R2_PUBLIC_URL);

let client;
export function r2Client() {
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
  });
  return client;
}

/** Stores an uploaded image or video and returns its public URL. */
export async function saveImage({ name, contentType, data }) {
  if (r2Enabled()) {
    const key = `uploads/${name}`;
    await r2Client().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: data,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    return `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, name), data);
  return `/media/${name}`;
}
