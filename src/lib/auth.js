/**
 * Minimal single-admin auth: a password from ADMIN_PASSWORD (in .env.local)
 * and an HMAC-signed, httpOnly session cookie. Uses Web Crypto so it also
 * runs inside proxy.js.
 */
export const SESSION_COOKIE = "mo_admin";
export const SESSION_HOURS = 12;

const enc = new TextEncoder();

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

async function hmac(value) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function checkPassword(input) {
  if (!adminConfigured() || typeof input !== "string") return false;
  // Compare HMACs so the comparison time doesn't depend on the password.
  return safeEqual(await hmac(`pw:${input}`), await hmac(`pw:${process.env.ADMIN_PASSWORD}`));
}

export async function createSessionToken() {
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  return `${exp}.${await hmac(`session:${exp}`)}`;
}

export async function verifySessionToken(token) {
  if (!token || !adminConfigured()) return false;
  const [exp, sig] = String(token).split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(`session:${exp}`));
}
