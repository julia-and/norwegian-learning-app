/**
 * Generic HTML scraper utilities for extracting article lists from web pages.
 * Used as a fallback when RSS feeds aren't available.
 */

/**
 * Fetch a page and extract article links using a regex pattern.
 * @param {string} pageUrl - URL of the page to scrape
 * @param {object} options - Scraping options
 * @param {string} options.sourceId - Parent resource ID
 * @param {string} options.contentType - "listening" | "reading" | "both"
 * @param {string[]} options.cefrLevels - CEFR levels for this source
 * @param {RegExp} options.linkPattern - Regex to match article links (must have named groups: url, title)
 * @param {string} options.baseUrl - Base URL for relative links
 * @param {number} [options.maxItems=30] - Max items to return
 * @returns {Promise<object[]>} Normalized resource items
 */
export async function scrapeArticleList(pageUrl, options) {
  const { sourceId, contentType, cefrLevels, linkPattern, baseUrl, maxItems = 30 } = options;

  const response = await fetch(pageUrl, {
    headers: { 'User-Agent': 'NorskTracker-Indexer/1.0' },
  });

  if (!response.ok) {
    throw new Error(`Scrape failed for ${pageUrl}: HTTP ${response.status}`);
  }

  const html = await response.text();
  const items = [];
  const seenUrls = new Set();
  let match;

  while ((match = linkPattern.exec(html)) !== null && items.length < maxItems) {
    const rawUrl = match.groups?.url || match[1];
    const title = match.groups?.title || match[2] || '';

    if (!rawUrl || !title) continue;

    const fullUrl = rawUrl.startsWith('http') ? rawUrl : `${baseUrl}${rawUrl}`;

    if (seenUrls.has(fullUrl)) continue;
    seenUrls.add(fullUrl);

    items.push({
      sourceId,
      url: fullUrl,
      title: decodeEntities(stripHtml(title)).trim(),
      description: '',
      contentType,
      cefrLevels,
      publishedAt: new Date().toISOString(),
    });
  }

  return items;
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}
