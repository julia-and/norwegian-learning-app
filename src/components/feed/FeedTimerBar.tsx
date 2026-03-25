'use client';

import { Pause, Play, Square } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import styles from './FeedTimerBar.module.css';

interface FeedTimerBarProps {
  status: 'running' | 'paused';
  elapsed: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function FeedTimerBar({ status, elapsed, onPause, onResume, onStop }: FeedTimerBarProps) {
  return (
    <div className={styles.bar}>
      <span className={styles.label}>📖 Lesing</span>
      <span className={styles.elapsed}>{formatDuration(elapsed)}</span>
      <div className={styles.controls}>
        {status === 'running' ? (
          <button className={styles.btn} onClick={onPause} aria-label="Pause">
            <Pause size={14} />
          </button>
        ) : (
          <button className={styles.btn} onClick={onResume} aria-label="Fortsett">
            <Play size={14} />
          </button>
        )}
        <button className={`${styles.btn} ${styles.stop}`} onClick={onStop} aria-label="Stopp">
          <Square size={14} />
          Stopp
        </button>
      </div>
    </div>
  );
}
