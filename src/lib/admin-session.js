import { cookies } from "next/headers";
import { connection } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

export async function isAdmin() {
  await connection(); // session checks are always per-request
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Your session has expired. Please log in again.");
}
