'use client';

import { useCallback } from 'react';
import { Loader2, RefreshCw, Newspaper } from 'lucide-react';
import { useFeed } from '@/lib/hooks/use-feed';
import { useTimer } from '@/lib/hooks/use-timer';
import { usePreferredLevel } from '@/lib/hooks/use-preferred-level';
import { formatDuration } from '@/lib/utils';
import { FeedPostCard } from '@/components/feed/FeedPostCard';
import { FeedTimerBar } from '@/components/feed/FeedTimerBar';
import type { CEFRLevel } from '@/lib/resources';
import styles from './page.module.css';

const LEVEL_OPTIONS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function FeedPage() {
  const [level, setLevel] = usePreferredLevel();
  const { posts, loading, error, generateMore, upvotePost, markRead } = useFeed(level);
  const timer = useTimer();

  const handleStartTimer = useCallback(() => {
    timer.setCategory('reading');
    timer.start();
  }, [timer]);

  const handleStop = useCallback(async () => {
    await timer.stop();
  }, [timer]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Newspaper size={20} />
          <h1 className={styles.title}>Lesefeed</h1>
          {timer.status === 'idle' ? (
            <button className={styles.startTimer} onClick={handleStartTimer}>
              Start lesetimer
            </button>
          ) : (
            <span className={styles.timerBadge}>{formatDuration(timer.elapsed)}</span>
          )}
        </div>

        <div className={styles.levelFilter}>
          {LEVEL_OPTIONS.map(l => (
            <button
              key={l}
              className={`${styles.levelBtn} ${level === l ? styles.levelBtnActive : ''}`}
              onClick={() => setLevel(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.feed}>
        {posts.length === 0 && loading && (
          <div className={styles.loadingState}>
            <Loader2 size={24} className={styles.spinner} />
            <p>Genererer innlegg…</p>
          </div>
        )}

        {posts.length === 0 && !loading && error && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={generateMore}>
              Prøv igjen
            </button>
          </div>
        )}

        {posts.map(post => (
          <FeedPostCard
            key={post.id}
            post={post}
            onUpvote={upvotePost}
            onMarkRead={markRead}
          />
        ))}

        {posts.length > 0 && (
          <button
            className={styles.loadMore}
            onClick={generateMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={14} className={styles.spinner} />
                Laster…
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                Last inn flere innlegg
              </>
            )}
          </button>
        )}
      </div>

      {(timer.status === 'running' || timer.status === 'paused') && (
        <FeedTimerBar
          status={timer.status}
          elapsed={timer.elapsed}
          onPause={timer.pause}
          onResume={timer.resume}
          onStop={handleStop}
        />
      )}
    </div>
  );
}
