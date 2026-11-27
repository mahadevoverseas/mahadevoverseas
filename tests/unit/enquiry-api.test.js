import { beforeEach, describe, expect, it, vi } from "vitest";

const saved = [];
vi.mock("@/lib/content", () => ({ addEnquiry: vi.fn(async (lead) => saved.push(lead)) }));
const { POST } = await import("@/app/api/enquiry/route");

const post = (body) => POST(new Request("http://test/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) }));
const valid = { name: "Asha", phone: "+91 98765 43210", email: "asha@example.com", country: "Canada", source: "contact-form" };

describe("POST /api/enquiry", () => {
  beforeEach(() => (saved.length = 0));

  it("saves a valid enquiry", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ name: "Asha", email: "asha@example.com", source: "contact-form" });
    expect(saved[0].receivedAt).toMatch(/^\d{4}-/);
  });

  it("rejects missing name, bad phone and bad email", async () => {
    const res = await post({ name: "", phone: "12", email: "nope" });
    expect(res.status).toBe(422);
    expect((await res.json()).error).toMatch(/name.*phone.*email/);
    expect(saved).toHaveLength(0);
  });

  it("rejects invalid JSON", async () => {
    expect((await post("{not json")).status).toBe(400);
  });

  it("silently drops bots that fill the honeypot", async () => {
    const res = await post({ ...valid, website: "http://spam" });
    expect(res.status).toBe(200);
    expect(saved).toHaveLength(0);
  });

  it("trims and length-limits fields", async () => {
    await post({ ...valid, name: "  Asha  ", message: "x".repeat(5000) });
    expect(saved[0].name).toBe("Asha");
    expect(saved[0].message.length).toBe(2000);
  });
});
