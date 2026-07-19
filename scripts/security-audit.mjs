import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const excluded = new Set([".git", "node_modules", "dist", ".astro", "test-results"]);
const patterns = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["provider credential", /(?:sk_live_|sk_test_|sk-proj-|ghp_|github_pat_|AKIA[0-9A-Z]{16})/],
  ["JWT-shaped value", /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["secret assignment", /(?:secret|password|token|api[_-]?key)\s*[:=]\s*["'][^"']{12,}["']/i],
];
const findings = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile() && (await stat(path)).size < 5_000_000) {
      const localPath = relative(root, path).replaceAll("\\", "/");
      if (localPath === "scripts/security-audit.mjs" || localPath === "src/assets/branding/RB Web Logo.svg") continue;
      let content; try { content = await readFile(path, "utf8"); } catch { continue; }
      content.split(/\r?\n/).forEach((line, index) => patterns.forEach(([name, pattern]) => {
        if (pattern.test(line)) findings.push(`${relative(root, path)}:${index + 1}: ${name}`);
      }));
    }
  }
}
await walk(root);
if (findings.length) {
  console.error("Potential secret patterns (values redacted):\n" + findings.join("\n"));
  process.exitCode = 1;
} else console.log("No high-confidence secret patterns found.");
