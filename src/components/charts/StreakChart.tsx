'use client';

import { format, subDays, parseISO } from 'date-fns';
import { Card, CardHeader } from '@/components/ui/Card';
import { useCompletionByDay } from '@/lib/hooks/use-stats';
import styles from './streak-chart.module.css';

export function StreakChart() {
  const { data } = useCompletionByDay(84); // 12 weeks

  const weeks: typeof data[] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <Card>
      <CardHeader title="Aktivitet" subtitle="Siste 12 uker" />
      <div className={styles.grid}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map((day) => {
              const level =
                day.rate === 0 ? 0 : day.rate < 0.5 ? 1 : day.rate < 1 ? 2 : 3;
              return (
                <div
                  key={day.date}
                  className={`${styles.cell} ${styles[`level${level}`]}`}
                  title={`${format(parseISO(day.date), 'MMM d')}: ${Math.round(day.rate * 100)}%`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Mindre</span>
        <div className={`${styles.cell} ${styles.level0}`} />
        <div className={`${styles.cell} ${styles.level1}`} />
        <div className={`${styles.cell} ${styles.level2}`} />
        <div className={`${styles.cell} ${styles.level3}`} />
        <span className={styles.legendLabel}>Mer</span>
      </div>
    </Card>
  );
}
