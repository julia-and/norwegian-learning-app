/**
 * YouTube source — fetches videos from playlists and channels via YouTube Data API v3.
 *
 * Requires YOUTUBE_API_KEY environment variable.
 * Free quota: 10,000 units/day. Each playlistItems.list or search.list call = ~1-2 units.
 * At 6-hour intervals with a handful of sources, usage is negligible.
 */

const API_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * YouTube sources to index.
 *
 * Each source needs a `playlistId`. Use explicit playlist IDs from the channel page
 * rather than the UC→UU uploads playlist trick (which doesn't work for all channels).
 */
const YOUTUBE_SOURCES = [
  {
    // Ola Norwegian — comprehensible input playlist at various levels
    // Playlist: https://www.youtube.com/playlist?list=PLftjnRQZ8O1ZJ2-7uJ2L5AXXdWxCiBlEt
    playlistId: "PLftjnRQZ8O1ZJ2-7uJ2L5AXXdWxCiBlEt",
    sourceId: "ola-norwegian",
    contentType: "listening",
    cefrLevels: ["A2", "B1"],
    maxItems: 30,
  },
  {
    // Norsk med Anita — beginner comprehensible input with pictures/stories
    // Channel: https://www.youtube.com/@norskmedanita
    playlistId: "PLFUwZD_kZs2_QDkZGm8Bx4izQTtrbvTKP",
    sourceId: "norsk-med-anita",
    contentType: "listening",
    cefrLevels: ["A1", "A2"],
    maxItems: 30,
  },
  {
    // Norsk med Anita — second playlist
    playlistId: "PLFUwZD_kZs2-yVBXuyKR5lR99HVr_PseU",
    sourceId: "norsk-med-anita",
    contentType: "listening",
    cefrLevels: ["A1", "A2"],
    maxItems: 30,
  },
];

export async function fetchYouTube() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY not set — skipping YouTube sources");
    return [];
  }

  const results = await Promise.allSettled(
    YOUTUBE_SOURCES.map((source) => fetchPlaylist(apiKey, source)),
  );

  const items = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i].status === "fulfilled") {
      items.push(...results[i].value);
    } else {
      console.warn(
        `Failed to fetch YouTube source ${YOUTUBE_SOURCES[i].sourceId}:`,
        results[i].reason?.message,
      );
    }
  }

  return items;
}

/**
 * Fetch videos from a YouTube playlist via the playlistItems API.
 * This is the cheapest API call (1 quota unit per request, 50 items per page).
 */
async function fetchPlaylist(apiKey, source) {
  const {
    playlistId,
    sourceId,
    contentType,
    cefrLevels,
    maxItems = 30,
  } = source;
  const items = [];
  let pageToken = "";

  while (items.length < maxItems) {
    const params = new URLSearchParams({
      part: "snippet",
      playlistId,
      maxResults: String(Math.min(50, maxItems - items.length)),
      key: apiKey,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const headers = { "User-Agent": "NorskTracker-Indexer/1.0" };
    if (process.env.YOUTUBE_API_REFERER) {
      headers["Referer"] = process.env.YOUTUBE_API_REFERER;
    }

    const res = await fetch(`${API_BASE}/playlistItems?${params}`, { headers });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `YouTube API error for playlist ${playlistId}: HTTP ${res.status} — ${body.slice(0, 200)}`,
      );
    }

    const data = await res.json();

    for (const item of data.items || []) {
      const snippet = item.snippet;
      // Skip deleted/private videos
      if (
        snippet.title === "Deleted video" ||
        snippet.title === "Private video"
      )
        continue;

      items.push({
        sourceId,
        url: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`,
        title: snippet.title,
        description: truncate(snippet.description || "", 200),
        contentType,
        cefrLevels,
        publishedAt: snippet.publishedAt,
      });
    }

    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return items.slice(0, maxItems);
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trimEnd() + "…";
}
