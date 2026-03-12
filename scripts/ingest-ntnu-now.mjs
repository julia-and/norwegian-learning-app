#!/usr/bin/env node
/**
 * One-time ingestion script: NTNU Norwegian on the Web audio files.
 *
 * Downloads ZIP archives from NTNU, extracts audio, uploads to S3, and
 * writes public/ntnu-now-resources.json for the app to serve.
 *
 * Usage:
 *   node scripts/ingest-ntnu-now.mjs            # full run
 *   node scripts/ingest-ntnu-now.mjs --dry-run  # discover files, no uploads
 *
 * Prerequisites:
 *   - awscli configured with 'scaleway' profile (same as deploy.sh)
 *   - unzip available in PATH
 *   - Node 18+
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, basename, extname, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Config ──────────────────────────────────────────────────────────────────

const BUCKET   = process.env.SCW_BUCKET  ?? 'lang-learning-tracking-app';
const REGION   = process.env.SCW_REGION  ?? 'fr-par';
const ENDPOINT = `https://s3.${REGION}.scw.cloud`;
const PROFILE  = process.env.AWS_PROFILE ?? 'scaleway';
const BASE_URL = `https://${BUCKET}.s3-website.${REGION}.scw.cloud`;
const DRY_RUN  = process.argv.includes('--dry-run');

const S3_AUDIO_PREFIX = 'audio/ntnu-now';
const SOURCE_ID = 'ntnu-now';
const NOW_PAGE  = 'https://www.ntnu.edu/now';
// Stable "published" date — these are evergreen course materials
const PUBLISHED_AT = '2023-09-01T00:00:00Z';

const SOURCES = [
  {
    zipUrl: 'https://www.hf.ntnu.no/now/audio/zipped_audio_files/all_chapters_normal_speed.zip',
    cefrLevels: ['A1', 'A2'],
    prefix: 'now1',
    label: 'NoW 1',
  },
  {
    zipUrl: 'https://www.hf.ntnu.no/now/now2/div/Tekster_now2.zip',
    cefrLevels: ['A2', 'B1'],
    prefix: 'now2',
    label: 'NoW 2',
  },
];

const AUDIO_EXTS = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.aac']);
const CONTENT_TYPES = {
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function hashUrl(url) {
  return createHash('sha256').update(url).digest('hex').slice(0, 16);
}

/** Recursively collect audio files under a directory. */
function findAudioFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findAudioFiles(full));
    } else if (AUDIO_EXTS.has(extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results.sort();
}

/** Turn a raw filename into a human-readable title. */
function parseTitle(filename, sourceLabel) {
  const name = basename(filename, extname(filename))
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Capitalise first letter
  const cleaned = name.charAt(0).toUpperCase() + name.slice(1);
  return `${sourceLabel} – ${cleaned}`;
}

function aws(args) {
  const cmd = `aws ${args} --endpoint-url "${ENDPOINT}" --profile "${PROFILE}"`;
  if (DRY_RUN) {
    console.log(`  [dry-run] ${cmd}`);
    return;
  }
  execSync(cmd, { stdio: 'inherit' });
}

// ── Main ─────────────────────────────────────────────────────────────────────

const tmpDir = mkdtempSync(join(tmpdir(), 'ntnu-now-'));
console.log(`Working directory: ${tmpDir}`);
if (DRY_RUN) console.log('DRY RUN — no files will be uploaded.\n');

const allEntries = [];

try {
  for (const source of SOURCES) {
    console.log(`\n── ${source.label} ─────────────────────────────`);
    console.log(`Downloading ${source.zipUrl}`);

    // Download
    const zipPath = join(tmpDir, `${source.prefix}.zip`);
    execSync(`curl -L -o "${zipPath}" "${source.zipUrl}"`, { stdio: 'inherit' });

    // Extract
    const extractDir = join(tmpDir, source.prefix);
    execSync(`unzip -q -o "${zipPath}" -d "${extractDir}"`, { stdio: 'inherit' });

    // Find audio files
    const audioFiles = findAudioFiles(extractDir);
    console.log(`Found ${audioFiles.length} audio file(s)`);

    if (audioFiles.length === 0) {
      console.log('  No audio files found in this archive — skipping.');
      continue;
    }

    for (const filePath of audioFiles) {
      const filename = basename(filePath);
      const ext      = extname(filename).toLowerCase();
      const s3Key    = `${S3_AUDIO_PREFIX}/${source.prefix}/${filename}`;
      const audioUrl = `${BASE_URL}/${s3Key}`;
      const contentType = CONTENT_TYPES[ext] ?? 'audio/mpeg';

      // Upload
      console.log(`  Uploading ${filename}`);
      aws(
        `s3 cp "${filePath}" "s3://${BUCKET}/${s3Key}" ` +
        `--content-type "${contentType}" ` +
        `--cache-control "public, max-age=31536000, immutable" ` +
        `--acl public-read`
      );

      allEntries.push({
        id: hashUrl(audioUrl),
        sourceId: SOURCE_ID,
        url: NOW_PAGE,
        title: parseTitle(filename, source.label),
        description:
          `Listening exercise from Norwegian on the Web (NTNU), ` +
          `${source.cefrLevels.join('–')} level. ` +
          `© NTNU — used for educational purposes.`,
        contentType: 'listening',
        cefrLevels: source.cefrLevels,
        publishedAt: PUBLISHED_AT,
        audioUrl,
      });
    }
  }
} finally {
  // Clean up temp dir
  rmSync(tmpDir, { recursive: true, force: true });
  console.log('\nCleaned up temp files.');
}

if (allEntries.length === 0) {
  console.log('\nNo entries generated — nothing to write.');
  process.exit(0);
}

// ── Write manifest ───────────────────────────────────────────────────────────

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  attribution: 'Norwegian on the Web by NTNU (ntnu.edu/now). Free educational resource.',
  resources: allEntries,
};

const outPath = join(ROOT, 'public', 'ntnu-now-resources.json');
if (!DRY_RUN) {
  writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(`\nWrote ${allEntries.length} entries to ${outPath}`);

  // Upload manifest to S3 so it's immediately live
  aws(
    `s3 cp "${outPath}" "s3://${BUCKET}/ntnu-now-resources.json" ` +
    `--content-type "application/json" ` +
    `--cache-control "public, max-age=3600"`
  );
  console.log('Uploaded ntnu-now-resources.json to S3.');
} else {
  console.log(`\n[dry-run] Would write ${allEntries.length} entries:`);
  for (const e of allEntries) {
    console.log(`  ${e.id}  ${e.title}`);
  }
}
