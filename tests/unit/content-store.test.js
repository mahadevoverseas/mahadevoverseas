import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";

vi.mock("next/cache", () => ({ cacheTag: () => {} }));

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mo-content-"));
let store;

beforeAll(async () => {
  vi.stubEnv("LOCAL_CONTENT_DIR", dir);
  vi.stubEnv("MONGODB_URI", "mongodb+srv://should-never-be-used");
  store = await import("@/lib/content");
});
afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("content store (local file mode)", () => {
  it("never uses MongoDB when LOCAL_CONTENT_DIR is set", async () => {
    const { mongoEnabled } = await import("@/lib/mongodb");
    expect(mongoEnabled()).toBe(false);
    expect(store.CONTENT_DIR).toBe(path.resolve(dir));
  });

  it("falls back to defaults when nothing is saved", async () => {
    const { defaultContent } = await import("@/lib/site");
    const c = await store.readContent();
    expect(c.hero).toEqual(defaultContent.hero);
  });

  it("saves a section and reads it back, keeping other sections", async () => {
    await store.writeSection("hero", { eyebrow: "Test eyebrow" });
    const c = await store.readContent();
    expect(c.hero.eyebrow).toBe("Test eyebrow");
    expect(c.stats.items.length).toBeGreaterThan(0);
  });

  it("refuses unknown sections", async () => {
    await expect(store.writeSection("hacker", {})).rejects.toThrow(/Unknown section/);
  });

  it("adds, updates and deletes enquiries (newest first)", async () => {
    await store.addEnquiry({ name: "First" });
    await store.addEnquiry({ name: "Second" });
    let list = await store.readEnquiries();
    expect(list.map((e) => e.name)).toEqual(["Second", "First"]);
    expect(list[0].status).toBe("new");
    await store.updateEnquiry(list[0].id, { status: "contacted" });
    await store.updateEnquiry(list[1].id, null);
    list = await store.readEnquiries();
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ name: "Second", status: "contacted" });
  });
});

describe("mongoEnabled", () => {
  it("ignores a URI that still contains a placeholder", async () => {
    vi.resetModules();
    vi.stubEnv("LOCAL_CONTENT_DIR", "");
    vi.stubEnv("MONGODB_URI", "mongodb+srv://<db_username>:pw@host/");
    const { mongoEnabled } = await import("@/lib/mongodb");
    expect(mongoEnabled()).toBe(false);
    vi.stubEnv("MONGODB_URI", "mongodb+srv://user:pw@host/");
    expect(mongoEnabled()).toBe(true);
  });
});
