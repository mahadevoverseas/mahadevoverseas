/**
 * One-time move of local data into MongoDB (and uploaded images into R2).
 *
 *   npm run db:migrate
 *
 * - content/site.json        → MongoDB "content" collection (one doc per section)
 * - content/enquiries.json   → MongoDB "enquiries" collection
 * - content/uploads/*        → R2 bucket "uploads/…" (if R2 is configured);
 *                              /media/… links in the content are rewritten.
 * Safe to run more than once (upserts).
 */
import { readFile, readdir } from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { need } from "./env.mjs";

need("MONGODB_URI");
const r2 = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_URL"].every((k) => process.env[k]);

const readJson = async (f, fallback) => {
  try {
    return JSON.parse(await readFile(f, "utf8"));
  } catch {
    return fallback;
  }
};

let site = await readJson("content/site.json", {});
const enquiries = await readJson("content/enquiries.json", []);

// 1. Uploaded images → R2
if (r2) {
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
  });
  const types = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif" };
  const files = (await readdir("content/uploads").catch(() => [])).filter((f) => types[path.extname(f).toLowerCase()]);
  const base = process.env.R2_PUBLIC_URL.replace(/\/$/, "");
  for (const f of files) {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: `uploads/${f}`,
        Body: await readFile(path.join("content/uploads", f)),
        ContentType: types[path.extname(f).toLowerCase()],
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
  }
  site = JSON.parse(JSON.stringify(site).replaceAll('"/media/', `"${base}/uploads/`));
  console.log(`R2: uploaded ${files.length} image(s).`);
} else {
  console.log("R2 not configured — skipping image upload (images keep their /media/ links).");
}

// 2. Content + enquiries → MongoDB
const client = await new MongoClient(process.env.MONGODB_URI).connect();
const db = client.db(process.env.MONGODB_DB || "mahadev_overseas");

const sections = Object.entries(site);
if (sections.length) {
  await db.collection("content").bulkWrite(
    sections.map(([key, value]) => ({
      updateOne: { filter: { _id: key }, update: { $set: { value, updatedAt: new Date() } }, upsert: true },
    }))
  );
}
if (enquiries.length) {
  await db.collection("enquiries").bulkWrite(
    enquiries.map(({ id, ...rest }) => ({ updateOne: { filter: { _id: id }, update: { $set: rest }, upsert: true } }))
  );
}
await db.collection("enquiries").createIndex({ receivedAt: -1 });
console.log(`MongoDB: ${sections.length} content section(s), ${enquiries.length} enquiry(ies).`);
await client.close();
