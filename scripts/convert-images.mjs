/**
 * SARFI Collection — Image Conversion Script
 * Converts all property photos to WebP (3 sizes) and copies them to public/images/
 * Handles HEIC files (iPhone photos with wrong .JPG extension) via sips → JPEG → sharp → WebP
 * Run: node scripts/convert-images.mjs
 */

import { createRequire } from "module";
import { existsSync, mkdirSync, readdirSync, writeFileSync, unlinkSync } from "fs";
import { join, extname, basename, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { tmpdir } from "os";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");
const FOTOS_ROOT = join(PROJECT_ROOT, "FOTOS");
const PUBLIC_IMAGES = join(PROJECT_ROOT, "public", "images");

// Quality settings
const QUALITY = 85;
const SIZES = {
  full: 1920,
  medium: 800,
  thumb: 400,
};

// Mapping: source folder → output folder → hero index
const FOLDERS = [
  {
    src: join(FOTOS_ROOT, "HAUS28"),
    dest: join(PUBLIC_IMAGES, "haus28", "gallery"),
    heroIndex: 2, // Haus_28_250523_160.jpg (3rd file when sorted = index 2)
    heroDestDir: join(PUBLIC_IMAGES, "haus28"),
  },
  {
    src: join(FOTOS_ROOT, "B5"),
    dest: join(PUBLIC_IMAGES, "schoenblick", "b5", "gallery"),
    heroIndex: 0,
    heroDestDir: join(PUBLIC_IMAGES, "schoenblick", "b5"),
  },
  {
    src: join(FOTOS_ROOT, "B6"),
    dest: join(PUBLIC_IMAGES, "schoenblick", "b6", "gallery"),
    heroIndex: 0,
    heroDestDir: join(PUBLIC_IMAGES, "schoenblick", "b6"),
  },
  {
    src: join(FOTOS_ROOT, "B8"),
    dest: join(PUBLIC_IMAGES, "schoenblick", "b8", "gallery"),
    heroIndex: 0,
    heroDestDir: join(PUBLIC_IMAGES, "schoenblick", "b8"),
  },
  {
    src: join(FOTOS_ROOT, "A2"),
    dest: join(PUBLIC_IMAGES, "schoenblick", "a2", "gallery"),
    heroIndex: 0,
    heroDestDir: join(PUBLIC_IMAGES, "schoenblick", "a2"),
  },
  {
    src: join(FOTOS_ROOT, "Außenbereich Haus Schönblick", "jpeg"),
    dest: join(PUBLIC_IMAGES, "schoenblick", "aussen", "gallery"),
    heroIndex: 0,
    heroDestDir: join(PUBLIC_IMAGES, "schoenblick", "aussen"),
  },
];

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".JPG", ".JPEG", ".png", ".PNG", ".heic", ".HEIC"]);

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`  📁 Created: ${dir.replace(PROJECT_ROOT, "")}`);
  }
}

function getImageFiles(dir) {
  if (!existsSync(dir)) {
    console.warn(`  ⚠️  Directory not found: ${dir}`);
    return [];
  }
  return readdirSync(dir)
    .filter((f) => SUPPORTED_EXTENSIONS.has(extname(f)))
    .sort()
    .map((f) => join(dir, f));
}

/**
 * Detect if a file is actually HEIC regardless of extension.
 * Checks the first 12 bytes for ftyp box (HEIC/HEIF magic bytes).
 */
function isHeicFile(filePath) {
  try {
    const { readFileSync } = require("fs");
    const buf = readFileSync(filePath);
    // HEIC/HEIF files have "ftyp" at bytes 4-7
    if (buf.length < 12) return false;
    const ftyp = buf.toString("ascii", 4, 8);
    if (ftyp !== "ftyp") return false;
    const brand = buf.toString("ascii", 8, 12);
    return ["heic", "heis", "heix", "hevc", "hevx", "mif1"].includes(brand.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Convert a HEIC file to JPEG via macOS sips, return the temp JPEG path.
 */
function heicToJpeg(srcPath) {
  const tmpJpeg = join(tmpdir(), `sarfi_${Date.now()}_${basename(srcPath, extname(srcPath))}.jpg`);
  execSync(`/usr/bin/sips -s format jpeg -s formatOptions 95 "${srcPath}" --out "${tmpJpeg}"`, {
    stdio: "pipe",
  });
  return tmpJpeg;
}

async function convertImage(srcPath, destPath, maxWidth) {
  if (existsSync(destPath)) {
    return false; // Already converted, skip
  }

  let actualSrc = srcPath;
  let tempFile = null;

  try {
    // Check if this is a HEIC file (possibly misnamed as .jpg)
    if (isHeicFile(srcPath)) {
      tempFile = heicToJpeg(srcPath);
      actualSrc = tempFile;
    }

    await sharp(actualSrc)
      .rotate() // auto-rotate from EXIF orientation (critical for iPhone photos)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(destPath);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed: ${basename(srcPath)} → ${err.message.split("\n")[0]}`);
    return false;
  } finally {
    if (tempFile && existsSync(tempFile)) {
      unlinkSync(tempFile);
    }
  }
}

async function sharpFromSrc(srcPath, maxWidth, destPath, quality = QUALITY) {
  if (existsSync(destPath)) return false;

  let actualSrc = srcPath;
  let tempFile = null;

  try {
    if (isHeicFile(srcPath)) {
      tempFile = heicToJpeg(srcPath);
      actualSrc = tempFile;
    }

    await sharp(actualSrc)
      .rotate() // auto-rotate from EXIF orientation
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(destPath);
    return true;
  } catch (err) {
    console.error(`  ❌ Hero failed: ${basename(srcPath)} → ${err.message.split("\n")[0]}`);
    return false;
  } finally {
    if (tempFile && existsSync(tempFile)) {
      unlinkSync(tempFile);
    }
  }
}

async function processFolder(config) {
  const { src, dest, heroIndex, heroDestDir } = config;
  const files = getImageFiles(src);

  if (files.length === 0) {
    console.log(`  ⚠️  No images found in ${src.replace(PROJECT_ROOT, "")}`);
    return [];
  }

  ensureDir(dest);
  ensureDir(heroDestDir);

  console.log(`\n  Processing ${files.length} images...`);

  const results = [];
  let converted = 0;
  let skipped = 0;

  for (let i = 0; i < files.length; i++) {
    const srcPath = files[i];
    const name = basename(srcPath, extname(srcPath))
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-");

    const fullDest = join(dest, `${name}.webp`);
    const medDest = join(dest, `m_${name}.webp`);
    const thumbDest = join(dest, `t_${name}.webp`);

    const r1 = await convertImage(srcPath, fullDest, SIZES.full);
    const r2 = await convertImage(srcPath, medDest, SIZES.medium);
    const r3 = await convertImage(srcPath, thumbDest, SIZES.thumb);

    if (r1 || r2 || r3) {
      converted++;
      process.stdout.write(`  ✓ [${i + 1}/${files.length}] ${basename(srcPath)}\n`);
    } else {
      skipped++;
    }

    // Write hero for heroIndex
    if (i === heroIndex) {
      const heroDest = join(heroDestDir, "hero.webp");
      const heroThumbDest = join(heroDestDir, "hero-thumb.webp");
      const h1 = await sharpFromSrc(srcPath, 1920, heroDest, 88);
      const h2 = await sharpFromSrc(srcPath, 800, heroThumbDest, 85);
      if (h1) console.log(`  ⭐ Hero: ${heroDest.replace(PROJECT_ROOT, "")}`);
    }

    results.push({
      src: srcPath,
      full: fullDest.replace(join(PROJECT_ROOT, "public"), ""),
      medium: medDest.replace(join(PROJECT_ROOT, "public"), ""),
      thumb: thumbDest.replace(join(PROJECT_ROOT, "public"), ""),
      name,
      originalFilename: basename(srcPath),
    });
  }

  console.log(`  → ${converted} converted, ${skipped} already existed`);
  return results;
}

async function run() {
  console.log("🏔️  SARFI Collection — Image Conversion\n");
  console.log(`Source: ${FOTOS_ROOT}`);
  console.log(`Output: ${PUBLIC_IMAGES}\n`);

  const allResults = {};

  for (const config of FOLDERS) {
    const folderName = config.src.replace(FOTOS_ROOT + "/", "");
    console.log(`\n📂 ${folderName}`);
    const results = await processFolder(config);
    allResults[folderName] = results;
  }

  console.log("\n\n═══════════════════════════════════════════════════════");
  console.log("✅ Conversion complete! Public image paths summary:\n");

  for (const [folder, results] of Object.entries(allResults)) {
    console.log(`\n── ${folder} (${results.length} images) ──`);
    results.slice(0, 5).forEach((r) => {
      console.log(`   ${r.full}`);
    });
    if (results.length > 5) console.log(`   ... and ${results.length - 5} more`);
  }

  const manifestPath = join(PROJECT_ROOT, "scripts", "image-manifest.json");
  writeFileSync(manifestPath, JSON.stringify(allResults, null, 2));
  console.log(`\n📋 Manifest written to: scripts/image-manifest.json`);
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
