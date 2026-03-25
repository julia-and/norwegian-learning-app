'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronUp, ArrowBigUp } from 'lucide-react';
import type { FeedPost } from '@/lib/db';
import { TappableText } from './TappableText';
import { WordTooltip } from './WordTooltip';
import styles from './FeedPostCard.module.css';

interface TooltipState {
  word: string;
  translation: string | null;
  rect: DOMRect;
}

interface FeedPostCardProps {
  post: FeedPost;
  onUpvote: (id: string) => void;
  onMarkRead: (id: string) => void;
}

export function FeedPostCard({ post, onUpvote, onMarkRead }: FeedPostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const markedRef = useRef(false);

  // Mark as read when the card enters the viewport
  useEffect(() => {
    if (post.readAt || markedRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !markedRef.current) {
          markedRef.current = true;
          onMarkRead(post.id);
        }
      },
      { threshold: 0.5 },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [post.id, post.readAt, onMarkRead]);

  const handleWordTap = useCallback((word: string, translation: string | null, rect: DOMRect) => {
    setTooltip(prev => prev?.word === word ? null : { word, translation, rect });
  }, []);

  // Format a plausible fake timestamp
  const fakeTime = (() => {
    const hours = Math.floor((Date.now() - post.generatedAt.getTime()) / 3600000) % 24 + 1;
    return `${hours}t siden`;
  })();

  return (
    <article ref={cardRef} className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.subreddit}>{post.subreddit}</span>
        <span className={styles.dot}>·</span>
        <span className={styles.author}>u/{post.author}</span>
        <span className={styles.dot}>·</span>
        <span className={styles.time}>{fakeTime}</span>
      </div>

      <h2 className={styles.title}>
        <TappableText text={post.title} vocabulary={post.vocabulary} onWordTap={handleWordTap} />
      </h2>

      {post.body && (
        <p className={styles.body}>
          <TappableText text={post.body} vocabulary={post.vocabulary} onWordTap={handleWordTap} />
        </p>
      )}

      <div className={styles.actions}>
        <button
          className={`${styles.upvoteButton} ${post.upvotedByUser === 1 ? styles.upvoted : ''}`}
          onClick={() => onUpvote(post.id)}
          aria-label={post.upvotedByUser === 1 ? 'Fjern stemme' : 'Stem opp'}
        >
          <ArrowBigUp size={16} fill={post.upvotedByUser === 1 ? 'currentColor' : 'none'} />
          {post.upvotes + (post.upvotedByUser === 1 ? 1 : 0)}
        </button>

        <button
          className={styles.commentsToggle}
          onClick={() => setCommentsOpen(o => !o)}
        >
          {commentsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {post.comments.length} kommentar{post.comments.length !== 1 ? 'er' : ''}
        </button>
      </div>

      {commentsOpen && (
        <div className={styles.comments}>
          {post.comments.map((comment, i) => (
            <div key={i} className={styles.comment}>
              <div className={styles.commentMeta}>
                <span className={styles.commentAuthor}>u/{comment.author}</span>
                <span className={styles.commentUpvotes}>
                  <ArrowBigUp size={12} /> {comment.upvotes}
                </span>
              </div>
              <p className={styles.commentBody}>
                <TappableText
                  text={comment.body}
                  vocabulary={post.vocabulary}
                  onWordTap={handleWordTap}
                />
              </p>
            </div>
          ))}
        </div>
      )}

      {tooltip && (
        <WordTooltip
          word={tooltip.word}
          translation={tooltip.translation}
          rect={tooltip.rect}
          onClose={() => setTooltip(null)}
        />
      )}
    </article>
  );
}
