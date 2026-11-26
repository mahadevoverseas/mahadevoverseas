import path from "path";
import { isAdmin } from "@/lib/admin-session";
import { saveImage } from "@/lib/storage";

const IMAGES = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif" };
const VIDEOS = { "video/mp4": ".mp4", "video/webm": ".webm" };
const ALLOWED = { ...IMAGES, ...VIDEOS };
const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_VIDEO = 100 * 1024 * 1024;

/** Admin image/video upload → Cloudflare R2 (or content/uploads locally). */
export async function POST(request) {
  if (!(await isAdmin())) return Response.json({ error: "Please log in again." }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return Response.json({ error: "No file received." }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return Response.json({ error: "Use a PNG, JPG, WebP, GIF or AVIF image, or an MP4/WebM video." }, { status: 415 });
  const isVideo = file.type in VIDEOS;
  if (file.size > (isVideo ? MAX_VIDEO : MAX_IMAGE)) {
    return Response.json({ error: isVideo ? "Video must be 100 MB or smaller." : "Image must be 5 MB or smaller." }, { status: 413 });
  }

  const base = path
    .basename(file.name || "image", path.extname(file.name || ""))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "image";
  const name = `${Date.now().toString(36)}-${base}${ext}`;
  try {
    const url = await saveImage({ name, contentType: file.type, data: Buffer.from(await file.arrayBuffer()) });
    return Response.json({ url });
  } catch (err) {
    console.error("[upload]", err);
    return Response.json({ error: "Upload failed. Check the image storage settings." }, { status: 500 });
  }
}
