import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkPassword, createSessionToken, verifySessionToken, adminConfigured } from "@/lib/auth";

describe("admin auth", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_PASSWORD", "correct horse");
    vi.stubEnv("ADMIN_SECRET", "unit-test-secret");
  });

  it("accepts only the right password", async () => {
    expect(adminConfigured()).toBe(true);
    expect(await checkPassword("correct horse")).toBe(true);
    expect(await checkPassword("wrong")).toBe(false);
    expect(await checkPassword("")).toBe(false);
    expect(await checkPassword(undefined)).toBe(false);
  });

  it("refuses every login when no password is configured", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(adminConfigured()).toBe(false);
    expect(await checkPassword("")).toBe(false);
  });

  it("issues session tokens that verify", async () => {
    const t = await createSessionToken();
    expect(await verifySessionToken(t)).toBe(true);
  });

  it("rejects tampered, expired, signed-with-another-secret or junk tokens", async () => {
    const t = await createSessionToken();
    const [exp, sig] = t.split(".");
    expect(await verifySessionToken(`${Number(exp) + 1}.${sig}`)).toBe(false);
    expect(await verifySessionToken(`${exp}.${sig.slice(0, -1)}0`)).toBe(false);
    expect(await verifySessionToken(`${Date.now() - 1000}.${sig}`)).toBe(false);
    expect(await verifySessionToken("")).toBe(false);
    expect(await verifySessionToken("abc")).toBe(false);
    vi.stubEnv("ADMIN_SECRET", "different-secret");
    expect(await verifySessionToken(t)).toBe(false);
  });
});
