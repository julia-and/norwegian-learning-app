import { parseRssFeed } from './rss.js';

/**
 * Podcast sources with their RSS feed URLs and metadata.
 * Podcast RSS feeds are the most reliable source — they always exist and follow a standard format.
 */

const PODCAST_SOURCES = [
  {
    // Norsk for Beginners — beginner podcast by Marius Stangeland (Lær Norsk Nå)
    // Norwegian spoken clearly and slowly, with English explanations
    // Website: https://laernorsknaa.com
    feedUrl: 'https://anchor.fm/s/4adac90c/podcast/rss',
    sourceId: 'norsk-for-beginners',
    contentType: 'listening',
    cefrLevels: ['A1', 'A2'],
  },
  {
    // Lær Norsk Nå — intermediate podcast by Marius Stangeland
    // Website: https://laernorsknaa.com
    feedUrl: 'https://anchor.fm/s/19b5cbd8/podcast/rss',
    sourceId: 'laer-norsk-naa',
    contentType: 'listening',
    cefrLevels: ['B1', 'B2'],
  },
  {
    // NRK Språkteigen — Norwegian language program
    feedUrl: 'https://podkast.nrk.no/program/spraakteigen.rss',
    sourceId: 'nrk-spraakteigen',
    contentType: 'listening',
    cefrLevels: ['B1', 'B2'],
  },
];

export async function fetchPodcasts() {
  const results = await Promise.allSettled(
    PODCAST_SOURCES.map(source =>
      parseRssFeed(source.feedUrl, {
        sourceId: source.sourceId,
        contentType: source.contentType,
        cefrLevels: source.cefrLevels,
        maxItems: 20,
      })
    )
  );

  const items = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i].status === 'fulfilled') {
      items.push(...results[i].value);
    } else {
      console.warn(`Failed to fetch podcast ${PODCAST_SOURCES[i].sourceId}:`, results[i].reason?.message);
    }
  }

  return items;
}
