import { MongoClient } from "mongodb";

/**
 * Shared MongoDB connection. Configure in .env.local / your host:
 *   MONGODB_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net
 *   MONGODB_DB=mahadev_overseas   (optional, this is the default)
 */
// Ignored while the URI still contains a placeholder such as <db_username>,
// and always off when LOCAL_CONTENT_DIR is set (automated tests).
export const mongoEnabled = () =>
  !process.env.LOCAL_CONTENT_DIR && Boolean(process.env.MONGODB_URI) && !/<[^>]+>/.test(process.env.MONGODB_URI);

const g = globalThis;

export async function getDb() {
  if (!mongoEnabled()) throw new Error("MONGODB_URI is not set.");
  // Reuse one client across hot reloads and serverless invocations.
  if (!g.__moMongo) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      appName: "mahadev-overseas-web",
    });
    g.__moMongo = client.connect().catch((err) => {
      g.__moMongo = undefined;
      throw err;
    });
  }
  const client = await g.__moMongo;
  return client.db(process.env.MONGODB_DB || "mahadev_overseas");
}

export const COLLECTIONS = {
  content: "content", // one document per section: { _id: "hero", value: {...}, updatedAt }
  enquiries: "enquiries", // { _id: "<id>", name, phone, email, status, receivedAt, ... }
};
