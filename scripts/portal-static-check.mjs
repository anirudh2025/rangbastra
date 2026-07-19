import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

const homepage = read("dist/index.html");
for (const text of [
  "Rangbastra",
  "online luxury couture platform",
  "Why we request Google account information",
  "Continue with Google",
  "/privacy-policy",
  "/terms-and-conditions",
]) expect(homepage.includes(text), `Homepage disclosure missing: ${text}`);

expect(homepage.includes("data-auth-pending"), "Auth restoration skeleton is missing");
expect(homepage.includes("data-auth-signed-out"), "Signed-out navigation is missing");
expect(homepage.includes("data-auth-signed-in"), "Signed-in profile navigation is missing");
expect(homepage.includes("Leaving your private couture space?"), "Log Out confirmation is missing");

const product = read("dist/products/gulnaar/index.html");
for (const text of ["Client Community", "Not yet rated", "No approved comments yet", "Submit for review"])
  expect(product.includes(text), `Product community state missing: ${text}`);

const migration = read("supabase/migrations/007_premium_customer_portal_foundation.sql");
for (const text of [
  "appointments_slot_active_unique",
  "alter table public.product_comments enable row level security",
  "alter table public.product_ratings enable row level security",
  "alter table public.product_likes enable row level security",
  "moderation_status='approved'",
  "customer-avatars",
]) expect(migration.includes(text), `Migration security invariant missing: ${text}`);
expect(!migration.includes('Customers upload own private avatar'), "Direct avatar upload policy must remain disabled");

console.log("Premium portal static checks passed.");
