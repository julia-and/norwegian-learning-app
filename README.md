# Norsk Tracker

A personal Norwegian language learning tracker. Track daily practice, manage vocabulary, consume curated resources, write exercises, and monitor progress over time.

All data lives in the browser via IndexedDB (Dexie.js) with optional cross-device sync through Dexie Cloud.

## Features

- **Daily dashboard** — streak counter, progress percentage, study timer, and checklist
- **Vocabulary** — Norwegian–English entries with review status (new / learning / known)
- **Resources** — curated listening and reading materials with difficulty ratings (1–5)
- **Writing** — submit exercises, get AI corrections via Claude, track fluency over time
- **Grammar** — structured grammar progress tracking
- **Conversation** — AI-driven scenario practice with corrections
- **Timer** — category-based study timer (reading, writing, listening, speaking, vocabulary)
- **Settings** — full data export/import and optional Dexie Cloud sync

## Stack

- Next.js 16 (App Router, static export)
- TypeScript, CSS Modules
- Dexie.js v4 + Dexie Cloud addon
- Deployed to Scaleway S3

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment

```bash
npm run build
./scripts/deploy.sh
```

Builds a static export and syncs to the Scaleway S3 bucket (`lang-learning-tracking-app`, `fr-par`). Audio files managed externally are excluded from the sync.
