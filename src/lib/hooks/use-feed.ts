'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type FeedPost } from '@/lib/db';
import { generateFeedPosts } from '@/lib/feed';

const MIN_POSTS = 10;
const BATCH_SIZE = 5;
const STALE_DAYS = 7;

export function useFeed(level: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const posts = useLiveQuery(
    () =>
      db.feedPosts
        .where('level')
        .equals(level)
        .toArray()
        .then(arr => arr.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())),
    [level],
  ) ?? [];

  const generateMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateFeedPosts(level, BATCH_SIZE);
      const now = new Date();
      await db.feedPosts.bulkAdd(
        result.posts.map(p => ({
          ...p,
          id: crypto.randomUUID(),
          upvotedByUser: 0,
          generatedAt: now,
        })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate posts');
    } finally {
      setLoading(false);
    }
  }, [level, loading]);

  // On mount / level change: prune stale posts, then generate if below minimum
  useEffect(() => {
    const cutoff = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000);
    db.feedPosts
      .where('level')
      .equals(level)
      .filter(p => p.generatedAt < cutoff)
      .delete()
      .then(() => db.feedPosts.where('level').equals(level).count())
      .then(count => {
        if (count < MIN_POSTS) {
          generateMore();
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const upvotePost = useCallback(async (id: string) => {
    const post = await db.feedPosts.get(id);
    if (!post) return;
    await db.feedPosts.update(id, {
      upvotedByUser: post.upvotedByUser === 1 ? 0 : 1,
    });
  }, []);

  const markRead = useCallback(async (id: string) => {
    const post = await db.feedPosts.get(id);
    if (!post || post.readAt) return;
    await db.feedPosts.update(id, { readAt: new Date() });
  }, []);

  return {
    posts: posts as FeedPost[],
    loading,
    error,
    generateMore,
    upvotePost,
    markRead,
  };
}
