import { pathToFileURL } from "url";
import { createHash } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fetchKlarTale } from "./sources/klar-tale.js";
import { fetchNrkNyheter } from "./sources/nrk-nyheter.js";
import { fetchPodcasts } from "./sources/podcasts.js";
import { fetchYouTube } from "./sources/youtube.js";

const MAX_AGE_DAYS = 90;

function hashUrl(url) {
  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

function isRecent(publishedAt) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_AGE_DAYS);
  return new Date(publishedAt) >= cutoff;
}

async function uploadToS3(filename, body) {
  const region = process.env.S3_REGION || "fr-par";
  const client = new S3Client({
    region,
    endpoint: `https://s3.${region}.scw.cloud`,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
  });

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || "lang-learning-tracking-app",
      Key: filename,
      Body: body,
      ContentType: "application/json",
      CacheControl: "public, max-age=3600",
    }),
  );
}

export const handle = async (event, context, callback) => {
  console.log("Starting resource indexing...");

  // Fetch all sources in parallel — one failure doesn't break the rest
  const results = await Promise.allSettled([
    fetchKlarTale(),
    fetchNrkNyheter(),
    fetchPodcasts(),
    fetchYouTube(),
  ]);

  const sourceNames = ["Klar Tale", "NRK Nyheter", "Podcasts", "YouTube"];
  const allResources = [];

  for (let i = 0; i < results.length; i++) {
    if (results[i].status === "fulfilled") {
      const items = results[i].value;
      console.log(`${sourceNames[i]}: ${items.length} items`);
      allResources.push(...items);
    } else {
      console.error(`${sourceNames[i]} failed:`, results[i].reason?.message);
    }
  }

  // Deduplicate by URL
  const seenUrls = new Set();
  const deduplicated = [];
  for (const resource of allResources) {
    if (!resource.url || seenUrls.has(resource.url)) continue;
    seenUrls.add(resource.url);
    deduplicated.push(resource);
  }

  // Filter out old items, assign IDs, sort by date
  const resources = deduplicated
    .filter((r) => isRecent(r.publishedAt))
    .map((r) => ({ ...r, id: hashUrl(r.url) }))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    resources,
  };

  const body = JSON.stringify(manifest);
  console.log(`Total resources: ${resources.length} (${body.length} bytes)`);

  // Upload to S3
  if (process.env.S3_ACCESS_KEY) {
    await uploadToS3("curated-resources.json", body);
    console.log("Uploaded to S3");
  } else {
    console.log("No S3_ACCESS_KEY set — skipping S3 upload");
    // For local testing, write to disk
    if (process.env.LOCAL_TEST) {
      const { writeFileSync } = await import("fs");
      writeFileSync("curated-resources.json", body);
      console.log("Wrote curated-resources.json locally");
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      count: resources.length,
      sources: sourceNames.map((name, i) => ({
        name,
        status: results[i].status,
        count: results[i].status === "fulfilled" ? results[i].value.length : 0,
        error:
          results[i].status === "rejected"
            ? results[i].reason?.message
            : undefined,
      })),
    }),
  };
};

// Local testing
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.env.LOCAL_TEST = "1";
  handle({}, {}, () => {})
    .then((result) => {
      console.log("Result:", JSON.parse(result.body));
    })
    .catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
}
