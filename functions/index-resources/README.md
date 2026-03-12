# Resource Indexer

Scaleway Serverless Function that fetches Norwegian learning resources from RSS feeds, web pages, and YouTube, then uploads a `curated-resources.json` manifest to the S3 bucket where the frontend is hosted.

## Sources

| Source | Type | CEFR | Method |
|--------|------|------|--------|
| Klar Tale | reading | A2-B1 | RSS, HTML scraping fallback |
| NRK Nyheter | reading | B1-C1 | RSS (multiple feeds: norge, kultur, livsstil, viten) |
| Norsk for Beginners | listening | A1-A2 | Podcast RSS (`anchor.fm/s/4adac90c/podcast/rss`) |
| Lær Norsk Nå | listening | B1-B2 | Podcast RSS (`anchor.fm/s/19b5cbd8/podcast/rss`) |
| NRK Språkteigen | listening | B1-B2 | Podcast RSS |
| Ola Norwegian | listening | A2-B1 | YouTube Data API (playlist) |
| Norsk med Anita | listening | A1-A2 | YouTube Data API (channel uploads) |

## NRK attribution

NRK RSS feeds are used per their [published terms](https://www.nrk.no/rss/):

- Content is clearly marked as from NRK in the frontend
- Titles and descriptions are not altered
- Links point directly to nrk.no
- No images are copied or stored

## Local testing

```bash
cd functions/index-resources
npm install
node handler.js
```

This fetches all RSS feeds/pages, prints a summary, and writes `curated-resources.json` to the current directory. No S3 credentials needed — the S3 upload is skipped when `SCW_ACCESS_KEY` is not set. YouTube sources are skipped when `YOUTUBE_API_KEY` is not set.

To include YouTube sources locally:

```bash
YOUTUBE_API_KEY=<your-key> node handler.js
```

To copy the output into the frontend for local dev:

```bash
cp curated-resources.json ../../public/curated-resources.json
```

Then `npm run dev` from the project root and visit `/resources`.

## Deployment

See `scripts/deploy-indexer.sh` for full instructions. Summary:

```bash
# One-time: create the function and cron trigger (see script comments)

# Deploy:
export SCW_FUNCTION_NAMESPACE_ID=<your-namespace-id>
export SCW_INDEXER_FUNCTION_ID=<your-function-id>
./scripts/deploy-indexer.sh
```

The function runs on a cron schedule (every 6 hours) and uploads the manifest directly to the S3 bucket. The frontend fetches `/curated-resources.json` at page load.

## Adding a new source

1. Create a new file in `sources/` (see `sources/klar-tale.js` for the pattern)
2. Export an async function that returns an array of resource objects
3. Import and add it to the `Promise.allSettled` call in `handler.js`
4. Add the source name to `sourceNames` in the same order
