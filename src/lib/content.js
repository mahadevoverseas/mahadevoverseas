import { promises as fs } from "fs";
import path from "path";
import { cacheTag } from "next/cache";
import { defaultContent } from "./site";
import { COLLECTIONS, getDb, mongoEnabled } from "./mongodb";

/**
 * Website content + enquiries store, edited from /admin.
 *
 * Production: MongoDB (set MONGODB_URI).
 *   content    — one document per section  { _id: "hero", value, updatedAt }
 *   enquiries  — one document per lead
 *
 * Fallback when MONGODB_URI is not set (local development):
 *   content/site.json and content/enquiries.json
 * Tests: LOCAL_CONTENT_DIR=<folder> forces the file store in that folder.
 *
 * Any section missing from the store falls back to the defaults in site.js.
 */
// LOCAL_CONTENT_DIR (used by the automated tests) points the site at a
// throwaway folder and disables MongoDB / R2 entirely.
export const CONTENT_DIR = process.env.LOCAL_CONTENT_DIR ? path.resolve(process.env.LOCAL_CONTENT_DIR) : path.join(process.cwd(), "content");
const SITE_FILE = path.join(CONTENT_DIR, "site.json");
const ENQUIRIES_FILE = path.join(CONTENT_DIR, "enquiries.json");
export const UPLOADS_DIR = path.join(CONTENT_DIR, "uploads");

export const CONTENT_TAG = "content";
const MAX_ENQUIRIES_FILE = 2000;

/* ---------- file helpers (fallback) ---------- */

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJsonAtomic(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
}

/* ---------- content ---------- */

async function readSaved() {
  if (!mongoEnabled()) return readJson(SITE_FILE, {});
  const db = await getDb();
  const docs = await db.collection(COLLECTIONS.content).find({}).toArray();
  return Object.fromEntries(docs.filter((d) => d._id in defaultContent).map((d) => [d._id, d.value]));
}

/** Uncached read (used by the admin). */
export async function readContent() {
  return { ...defaultContent, ...(await readSaved()) };
}

/** Cached read for the public website; invalidated when the admin saves. */
export async function getContent() {
  "use cache";
  cacheTag(CONTENT_TAG);
  return readContent();
}

export async function writeSection(key, value) {
  if (!(key in defaultContent)) throw new Error(`Unknown section "${key}"`);
  if (mongoEnabled()) {
    const db = await getDb();
    await db.collection(COLLECTIONS.content).updateOne({ _id: key }, { $set: { value, updatedAt: new Date() } }, { upsert: true });
    return;
  }
  const current = await readJson(SITE_FILE, {});
  current[key] = value;
  await writeJsonAtomic(SITE_FILE, current);
}

/* ---------- enquiries ---------- */

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const fromDoc = ({ _id, ...rest }) => ({ id: String(_id), ...rest });

export async function readEnquiries() {
  if (!mongoEnabled()) return readJson(ENQUIRIES_FILE, []);
  const db = await getDb();
  const docs = await db.collection(COLLECTIONS.enquiries).find({}).sort({ receivedAt: -1 }).limit(5000).toArray();
  return docs.map(fromDoc);
}

export async function addEnquiry(lead) {
  const entry = { status: "new", ...lead };
  if (mongoEnabled()) {
    const db = await getDb();
    await db.collection(COLLECTIONS.enquiries).insertOne({ _id: newId(), ...entry });
    return;
  }
  const list = await readEnquiries();
  list.unshift({ id: newId(), ...entry });
  await writeJsonAtomic(ENQUIRIES_FILE, list.slice(0, MAX_ENQUIRIES_FILE));
}

/** patch === null deletes the enquiry. */
export async function updateEnquiry(id, patch) {
  if (mongoEnabled()) {
    const col = (await getDb()).collection(COLLECTIONS.enquiries);
    if (patch === null) await col.deleteOne({ _id: id });
    else await col.updateOne({ _id: id }, { $set: patch });
    return;
  }
  const list = await readEnquiries();
  const next = patch === null ? list.filter((e) => e.id !== id) : list.map((e) => (e.id === id ? { ...e, ...patch } : e));
  await writeJsonAtomic(ENQUIRIES_FILE, next);
}
