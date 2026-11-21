/**
 * Small copies of every thumbnail for srcset: <name>.webp (1200×750) → <name>-600.webp (600×375).
 * Cards and article cards show thumbnails at 112–400px wide; phones load the small file.
 *
 *   node scripts/thumb-variants.mjs            # all thumbnails missing a small copy
 *   node scripts/thumb-variants.mjs --force    # rebuild every small copy
 *
 * capture-thumbnails.mjs calls makeVariant() itself after each capture.
 */
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const DIR = fileURLToPath(new URL("../public/thumbnails/", import.meta.url));
export const SMALL_WIDTH = 600;

export async function makeVariant(file, { force = false } = {}) {
  if (!file.endsWith(".webp") || file.endsWith(`-${SMALL_WIDTH}.webp`)) return false;
  const src = join(DIR, file);
  const out = join(DIR, file.replace(/\.webp$/, `-${SMALL_WIDTH}.webp`));
  if (!force) {
    const [a, b] = await Promise.all([stat(src), stat(out).catch(() => null)]);
    if (b && b.mtimeMs >= a.mtimeMs) return false;
  }
  sharp.cache(false);
  await sharp(src).resize({ width: SMALL_WIDTH }).webp({ quality: 78 }).toFile(out);
  return true;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const force = process.argv.includes("--force");
  let made = 0;
  for (const f of await readdir(DIR)) if (await makeVariant(f, { force })) made++;
  console.log(`${made} small thumbnail(s) written to public/thumbnails`);
}
