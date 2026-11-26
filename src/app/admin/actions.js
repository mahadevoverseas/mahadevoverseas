"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { SESSION_COOKIE, SESSION_HOURS, adminConfigured, checkPassword, createSessionToken } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin-session";
import { CONTENT_TAG, readContent, updateEnquiry, writeSection } from "@/lib/content";
import { defaultContent } from "@/lib/site";

export async function login(_prev, formData) {
  if (!adminConfigured()) return { error: "Admin is not set up. Add ADMIN_PASSWORD to .env.local and restart the server." };
  const ok = await checkPassword(String(formData.get("password") ?? ""));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "Incorrect password." };
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

function refreshSite() {
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

/** Save one or more top-level content sections: { hero: {...}, stats: {...} } */
export async function saveSections(patch) {
  await requireAdmin();
  if (!patch || typeof patch !== "object") throw new Error("Nothing to save.");
  for (const [key, value] of Object.entries(patch)) {
    if (!(key in defaultContent)) throw new Error(`Unknown section "${key}".`);
    // Keep the shape sane: same top-level type as the default.
    if (Array.isArray(defaultContent[key]) !== Array.isArray(value) || typeof value !== typeof defaultContent[key]) {
      throw new Error(`"${key}" has the wrong format.`);
    }
    await writeSection(key, value);
  }
  refreshSite();
  return { ok: true, content: await readContent() };
}

export async function resetSections(keys) {
  await requireAdmin();
  for (const key of keys) {
    if (!(key in defaultContent)) throw new Error(`Unknown section "${key}".`);
    await writeSection(key, defaultContent[key]);
  }
  refreshSite();
  return { ok: true, content: await readContent() };
}

export async function setEnquiryStatus(id, status) {
  await requireAdmin();
  if (!["new", "contacted", "closed"].includes(status)) throw new Error("Invalid status.");
  await updateEnquiry(String(id), { status });
  return { ok: true };
}

export async function deleteEnquiry(id) {
  await requireAdmin();
  await updateEnquiry(String(id), null);
  return { ok: true };
}
