export interface FeedCommentData {
  author: string;
  body: string;
  upvotes: number;
}

export interface FeedPostData {
  subreddit: string;
  title: string;
  body: string;
  author: string;
  upvotes: number;
  comments: FeedCommentData[];
  vocabulary: Record<string, string>;
  level: string;
}

export interface GenerateFeedResult {
  posts: FeedPostData[];
}

const FEED_API_URL = process.env.NEXT_PUBLIC_FEED_API_URL;

export async function generateFeedPosts(
  level: string,
  count: number,
  subreddits?: string[],
): Promise<GenerateFeedResult> {
  if (!FEED_API_URL) {
    throw new Error(
      'Feed API is not configured. The NEXT_PUBLIC_FEED_API_URL environment variable is missing.',
    );
  }

  const response = await fetch(FEED_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, count, subreddits }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(body.error || `API error (${response.status})`);
  }

  return (await response.json()) as GenerateFeedResult;
}
