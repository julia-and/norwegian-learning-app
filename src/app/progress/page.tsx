'use client';

import { Flame, Trophy, BookOpen, Clock, PenLine } from 'lucide-react';
import { CompletionChart } from '@/components/charts/CompletionChart';
import { TimeChart } from '@/components/charts/TimeChart';
import { StreakChart } from '@/components/charts/StreakChart';
import { FluencyChart } from '@/components/charts/FluencyChart';
import { DifficultyChart } from '@/components/charts/DifficultyChart';
import { useStats } from '@/lib/hooks/use-stats';
import { useWritingHistory } from '@/lib/hooks/use-writing';
import { formatMinutes } from '@/lib/utils';
import styles from './page.module.css';

export default function ProgressPage() {
  const stats = useStats();
  const writing = useWritingHistory();

  const totalStudySeconds = stats.allSessions.reduce((sum, s) => sum + s.durationSeconds, 0);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Fremgang</h1>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--color-accent)' }}>
            <Flame size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {stats.currentStreak}
          </span>
          <span className={styles.statLabel}>Nåværende rekke</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--color-accent)' }}>
            <Trophy size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {stats.longestStreak}
          </span>
          <span className={styles.statLabel}>Lengste rekke</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--color-success)' }}>
            <Clock size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {formatMinutes(totalStudySeconds)}
          </span>
          <span className={styles.statLabel}>Total studietid</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--color-listening)' }}>
            <BookOpen size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {stats.vocabCount}
          </span>
          <span className={styles.statLabel}>Ord lært</span>
        </div>
        {writing.totalCount > 0 && (
          <div className={styles.statCard}>
            <span className={styles.statValue} style={{ color: 'var(--color-primary)' }}>
              <PenLine size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {writing.totalCount}
            </span>
            <span className={styles.statLabel}>
              Skriveinnleveringer{writing.avgFluency > 0 ? ` · snitt ${writing.avgFluency.toFixed(1)}/5` : ''}
            </span>
          </div>
        )}
      </div>

      <div className={styles.chartGrid}>
        <StreakChart />
        <CompletionChart />
        <TimeChart />
        <FluencyChart />
        <DifficultyChart />
      </div>
    </div>
  );
}
