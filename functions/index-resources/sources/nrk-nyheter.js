import { parseRssFeed } from './rss.js';

/**
 * NRK news RSS feeds.
 *
 * Available feeds listed at https://www.nrk.no/rss/
 * Attribution required: content must be clearly marked as from NRK,
 * titles must not be altered, and links must point directly to nrk.no.
 */

const NRK_FEEDS = [
  {
    // General/domestic news — good mix of topics
    feedUrl: 'https://www.nrk.no/norge/toppsaker.rss',
    sourceId: 'nrk-nyheter',
    contentType: 'reading',
    cefrLevels: ['B1', 'B2', 'C1'],
    maxItems: 15,
  },
  {
    // Culture — often more accessible language
    feedUrl: 'https://www.nrk.no/kultur/toppsaker.rss',
    sourceId: 'nrk-nyheter',
    contentType: 'reading',
    cefrLevels: ['B1', 'B2'],
    maxItems: 10,
  },
  {
    // Livsstil — lifestyle, generally approachable
    feedUrl: 'https://www.nrk.no/livsstil/toppsaker.rss',
    sourceId: 'nrk-nyheter',
    contentType: 'reading',
    cefrLevels: ['B1', 'B2'],
    maxItems: 10,
  },
  {
    // Science — interesting vocabulary
    feedUrl: 'https://www.nrk.no/viten/toppsaker.rss',
    sourceId: 'nrk-nyheter',
    contentType: 'reading',
    cefrLevels: ['B2', 'C1'],
    maxItems: 10,
  },
];

export async function fetchNrkNyheter() {
  const results = await Promise.allSettled(
    NRK_FEEDS.map(feed =>
      parseRssFeed(feed.feedUrl, {
        sourceId: feed.sourceId,
        contentType: feed.contentType,
        cefrLevels: feed.cefrLevels,
        maxItems: feed.maxItems,
      })
    )
  );

  const items = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i].status === 'fulfilled') {
      items.push(...results[i].value);
    } else {
      console.warn(`NRK feed ${NRK_FEEDS[i].feedUrl} failed:`, results[i].reason?.message);
    }
  }

  return items;
}
