export type ResourceType = 'listening' | 'reading' | 'both';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  levels: CEFRLevel[];
  description: string;
  tags: string[];
  free: boolean;
}

export interface CuratedResource {
  id: string;
  sourceId: string;
  url: string;
  title: string;
  description: string;
  contentType: ResourceType;
  cefrLevels: CEFRLevel[];
  publishedAt: string;
  audioUrl?: string;
  durationMinutes?: number;
}

export interface CuratedResourcesManifest {
  version: number;
  generatedAt: string;
  resources: CuratedResource[];
}

let cachedResources: CuratedResource[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchManifest(path: string): Promise<CuratedResource[]> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const manifest: CuratedResourcesManifest = await res.json();
  return manifest.resources;
}

export async function fetchCuratedResources(): Promise<CuratedResource[]> {
  const now = Date.now();
  if (cachedResources && now - cacheTimestamp < CACHE_TTL) {
    return cachedResources;
  }

  // Fetch dynamic index + static NTNU audio in parallel; failures are non-fatal
  const [dynamic, ntnu] = await Promise.allSettled([
    fetchManifest('/curated-resources.json'),
    fetchManifest('/ntnu-now-resources.json'),
  ]);

  const combined: CuratedResource[] = [];

  if (dynamic.status === 'fulfilled') {
    combined.push(...dynamic.value);
  } else {
    // Fall back to localStorage cache if network fails
    const cached = localStorage.getItem('curated-resources-cache');
    if (cached) {
      combined.push(...(JSON.parse(cached) as CuratedResourcesManifest).resources);
    }
  }

  if (ntnu.status === 'fulfilled') {
    // Deduplicate by id against dynamic entries
    const seen = new Set(combined.map(r => r.id));
    for (const r of ntnu.value) {
      if (!seen.has(r.id)) combined.push(r);
    }
  }

  if (combined.length > 0) {
    cachedResources = combined;
    cacheTimestamp = now;
  }

  return combined;
}

export function getRandomResource(
  resources: CuratedResource[],
  type: ResourceType | 'all',
  level: CEFRLevel | 'all',
  excludeIds: Set<string> = new Set(),
): CuratedResource | null {
  let filtered = resources;

  if (type !== 'all') {
    filtered = filtered.filter(r =>
      r.contentType === type || r.contentType === 'both'
    );
  }

  if (level !== 'all') {
    filtered = filtered.filter(r => r.cefrLevels.includes(level));
  }

  // Prefer unseen resources
  const unseen = filtered.filter(r => !excludeIds.has(r.id));
  const pool = unseen.length > 0 ? unseen : filtered;

  if (pool.length === 0) return null;

  // Weight toward newer content: 70% chance from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recent = pool.filter(r => new Date(r.publishedAt) >= thirtyDaysAgo);
  const older = pool.filter(r => new Date(r.publishedAt) < thirtyDaysAgo);

  if (recent.length > 0 && older.length > 0 && Math.random() < 0.7) {
    return recent[Math.floor(Math.random() * recent.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export const RESOURCES: Resource[] = [
  // Listening
  {
    id: 'nrk-super',
    title: 'NRK Super',
    url: 'https://nrksuper.no',
    type: 'listening',
    levels: ['A1', 'A2'],
    description: "NRK's children's channel. Simple language, slow speech, visual context. Great for absolute beginners.",
    tags: ['video', 'children', 'free'],
    free: true,
  },
  {
    id: 'norsk-for-beginners',
    title: 'Norsk for Beginners',
    url: 'https://laernorsknaa.com',
    type: 'listening',
    levels: ['A1', 'A2'],
    description: 'Beginner podcast by Lær Norsk Nå. Each episode has Norwegian spoken slowly, then English explanations of the vocabulary.',
    tags: ['podcast', 'learner-focused', 'bilingual'],
    free: true,
  },
  {
    id: 'laer-norsk-naa',
    title: 'Lær Norsk Nå',
    url: 'https://laernorsknaa.com',
    type: 'listening',
    levels: ['B1', 'B2'],
    description: 'Podcast for intermediate Norwegian learners. Clear, slow speech on history, culture, science, and language. Transcripts available.',
    tags: ['podcast', 'learner-focused', 'transcripts'],
    free: true,
  },
  {
    id: 'norskpodden',
    title: 'Norskpodden',
    url: 'https://podcasts.apple.com/podcast/norskpodden/id1539582792',
    type: 'listening',
    levels: ['A2', 'B1'],
    description: 'Norwegian learning podcast with conversations on everyday topics. Transcripts available.',
    tags: ['podcast', 'learner-focused', 'transcripts'],
    free: true,
  },
  {
    id: 'klar-tale-audio',
    title: 'Klar Tale (Audio)',
    url: 'https://www.klartale.no',
    type: 'listening',
    levels: ['A2', 'B1'],
    description: 'Simplified Norwegian news with audio. Articles are read aloud in clear, measured speech.',
    tags: ['news', 'audio', 'simplified'],
    free: true,
  },
  {
    id: 'nrk-spraakteigen',
    title: 'NRK Språkteigen',
    url: 'https://radio.nrk.no/podkast/spraakteigen',
    type: 'listening',
    levels: ['B1', 'B2'],
    description: 'NRK Radio program about the Norwegian language — its history, dialects, and peculiarities.',
    tags: ['podcast', 'language', 'native'],
    free: true,
  },
  {
    id: 'nrk-radio',
    title: 'NRK Radio',
    url: 'https://radio.nrk.no',
    type: 'listening',
    levels: ['B1', 'B2', 'C1'],
    description: 'Norwegian public radio. Wide range of programs: news, culture, debates. Native-level content.',
    tags: ['radio', 'native', 'variety'],
    free: true,
  },
  {
    id: 'ola-norwegian',
    title: 'Ola Norwegian',
    url: 'https://www.youtube.com/playlist?list=PLftjnRQZ8O1ZJ2-7uJ2L5AXXdWxCiBlEt',
    type: 'listening',
    levels: ['A2', 'B1'],
    description: 'YouTube comprehensible input — slow, clear Norwegian with visual context. Topics range from daily life to Norwegian culture.',
    tags: ['video', 'comprehensible-input', 'youtube'],
    free: true,
  },
  {
    id: 'norsk-med-anita',
    title: 'Norsk med Anita',
    url: 'https://www.youtube.com/@norskmedanita',
    type: 'listening',
    levels: ['A1', 'A2'],
    description: 'Beginner-friendly comprehensible input with pictures and stories. Very slow, clear speech aimed at absolute beginners.',
    tags: ['video', 'comprehensible-input', 'youtube', 'beginner'],
    free: true,
  },
  // Reading
  {
    id: 'klar-tale',
    title: 'Klar Tale',
    url: 'https://www.klartale.no',
    type: 'reading',
    levels: ['A2', 'B1'],
    description: 'Simplified Norwegian news. Short articles with simple sentence structures and common vocabulary.',
    tags: ['news', 'simplified'],
    free: true,
  },
  {
    id: 'ntnu-now',
    title: 'Norwegian on the Web (NTNU)',
    url: 'https://www.ntnu.edu/now',
    type: 'both',
    levels: ['A1', 'A2', 'B1'],
    description: "NTNU's free online Norwegian course. Grammar explanations, exercises, and reading texts.",
    tags: ['course', 'grammar', 'university'],
    free: true,
  },
  {
    id: 'bokselskap',
    title: 'Bokselskap.no',
    url: 'https://www.bokselskap.no',
    type: 'reading',
    levels: ['B1', 'B2', 'C1'],
    description: 'Free Norwegian classic literature online. Ibsen, Hamsun, Undset and more.',
    tags: ['literature', 'classics', 'free'],
    free: true,
  },
  {
    id: 'nrk-nyheter',
    title: 'NRK Nyheter',
    url: 'https://www.nrk.no/nyheter/',
    type: 'reading',
    levels: ['B1', 'B2', 'C1'],
    description: 'Norwegian public broadcaster news. Full-length articles at native level.',
    tags: ['news', 'native'],
    free: true,
  },
  {
    id: 'aftenposten',
    title: 'Aftenposten',
    url: 'https://www.aftenposten.no',
    type: 'reading',
    levels: ['B2', 'C1'],
    description: "Norway's largest newspaper. In-depth journalism, opinion pieces, and cultural coverage.",
    tags: ['news', 'native', 'journalism'],
    free: false,
  },
];
