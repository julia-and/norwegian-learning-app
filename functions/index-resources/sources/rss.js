/**
 * Generic RSS feed parser using built-in Node.js fetch + regex XML extraction.
 * Lightweight — no external XML parser dependency.
 */

/**
 * Parse an RSS feed URL and return normalized items.
 * @param {string} feedUrl - URL of the RSS feed
 * @param {object} options - Source-specific options
 * @param {string} options.sourceId - Parent resource ID
 * @param {string} options.contentType - "listening" | "reading" | "both"
 * @param {string[]} options.cefrLevels - CEFR levels for this source
 * @param {number} [options.maxItems=50] - Max items to return
 * @returns {Promise<object[]>} Normalized resource items
 */
export async function parseRssFeed(feedUrl, options) {
  const { sourceId, contentType, cefrLevels, maxItems = 50 } = options;

  const response = await fetch(feedUrl, {
    headers: { 'User-Agent': 'NorskTracker-Indexer/1.0' },
  });

  if (!response.ok) {
    throw new Error(`RSS fetch failed for ${feedUrl}: HTTP ${response.status}`);
  }

  const xml = await response.text();
  const items = extractItems(xml);

  return items.slice(0, maxItems).map(item => ({
    sourceId,
    url: item.link,
    title: decodeEntities(item.title),
    description: truncate(decodeEntities(stripHtml(item.description)), 200),
    contentType,
    cefrLevels,
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    audioUrl: item.enclosureUrl || undefined,
    durationMinutes: item.duration ? parseDuration(item.duration) : undefined,
  }));
}

function extractItems(xml) {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    items.push({
      title: extractTag(itemXml, 'title'),
      link: extractTag(itemXml, 'link'),
      description: extractTag(itemXml, 'description'),
      pubDate: extractTag(itemXml, 'pubDate'),
      enclosureUrl: extractEnclosureUrl(itemXml),
      duration: extractTag(itemXml, 'itunes:duration'),
    });
  }

  return items;
}

function extractTag(xml, tagName) {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tagName}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tagName}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function extractEnclosureUrl(xml) {
  const match = xml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function parseDuration(duration) {
  // Handle HH:MM:SS, MM:SS, or seconds
  if (!duration) return undefined;
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) return Math.round(parts[0] * 60 + parts[1] + parts[2] / 60);
  if (parts.length === 2) return Math.round(parts[0] + parts[1] / 60);
  if (parts.length === 1) return Math.round(parts[0] / 60);
  return undefined;
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec)));
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trimEnd() + '…';
}
