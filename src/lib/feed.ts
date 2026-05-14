import { proxyFetch } from '@/lib/api-client';

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
  return proxyFetch<GenerateFeedResult>(
    FEED_API_URL,
    { level, count, subreddits },
    {
      required: ['posts'],
      shape: { posts: 'array' },
    },
    'Feed API',
  );
}
