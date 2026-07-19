import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
const root = join(process.cwd(), "dist");
const forbidden = [/SUPABASE_SERVICE_ROLE_KEY/, /RESEND_API_KEY/, /WEBHOOK_SECRET/, /OWNER_NOTIFICATION_EMAIL/, /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/];
const hits = [];
async function walk(directory) { for (const entry of await readdir(directory, { withFileTypes: true })) { const path = join(directory, entry.name); if (entry.isDirectory()) await walk(path); else { const text = await readFile(path, "utf8").catch(() => ""); if (forbidden.some((pattern) => pattern.test(text))) hits.push(relative(root, path)); } } }
await walk(root);
if (hits.length) { console.error(`Server-only identifier found in client output: ${hits.join(", ")}`); process.exitCode = 1; }
else console.log("Client bundle contains no server-only secret identifiers.");
