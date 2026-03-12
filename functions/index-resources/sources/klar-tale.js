import { parseRssFeed } from './rss.js';
import { scrapeArticleList } from './scraper.js';

const RSS_URL = 'https://www.klartale.no/rss';
const FALLBACK_URL = 'https://www.klartale.no';

export async function fetchKlarTale() {
  // Try RSS first
  try {
    const items = await parseRssFeed(RSS_URL, {
      sourceId: 'klar-tale',
      contentType: 'reading',
      cefrLevels: ['A2', 'B1'],
      maxItems: 30,
    });
    if (items.length > 0) return items;
  } catch (err) {
    console.warn('Klar Tale RSS failed, falling back to scraping:', err.message);
  }

  // Fallback: scrape article links from the homepage
  return scrapeArticleList(FALLBACK_URL, {
    sourceId: 'klar-tale',
    contentType: 'reading',
    cefrLevels: ['A2', 'B1'],
    linkPattern: /<a[^>]+href="(?<url>\/[^"]*\/\d{4}\/[^"]+)"[^>]*>(?<title>[^<]+)<\/a>/gi,
    baseUrl: 'https://www.klartale.no',
    maxItems: 30,
  });
}
