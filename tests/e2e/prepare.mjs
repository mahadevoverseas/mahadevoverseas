// Fresh throwaway content for every e2e run (copied from content/site.json).
import { cpSync, mkdirSync, rmSync, writeFileSync } from "fs";
rmSync(".test-content", { recursive: true, force: true });
mkdirSync(".test-content/uploads", { recursive: true });
cpSync("content/site.json", ".test-content/site.json");
writeFileSync(".test-content/enquiries.json", "[]\n");
console.log("e2e: prepared .test-content");
