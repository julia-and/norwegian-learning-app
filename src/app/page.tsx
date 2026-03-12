'use client';

import { Flame, Clock, BookOpen, Target } from 'lucide-react';
import { DailyChecklist } from '@/components/checklist/DailyChecklist';
import { StudyTimer } from '@/components/timer/StudyTimer';
import { useStats } from '@/lib/hooks/use-stats';
import { formatMinutes } from '@/lib/utils';
import styles from './page.module.css';

export default function Dashboard() {
  const stats = useStats();

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>Hei! 🇳🇴</h1>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--color-accent)' }}>
            <Flame size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {stats.currentStreak}
          </span>
          <span className={styles.statLabel}>Dagers rekke</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--color-primary)' }}>
            <Target size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {Math.round(stats.todayCompletion * 100)}%
          </span>
          <span className={styles.statLabel}>Dagens fremgang</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--color-success)' }}>
            <Clock size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {formatMinutes(stats.todayStudySeconds)}
          </span>
          <span className={styles.statLabel}>Studietid i dag</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--color-listening)' }}>
            <BookOpen size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {stats.vocabCount}
          </span>
          <span className={styles.statLabel}>Ord lært</span>
        </div>
      </div>

      <div className={styles.twoCol}>
        <DailyChecklist />
        <StudyTimer />
      </div>
    </div>
  );
}
