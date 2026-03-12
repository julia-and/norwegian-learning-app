'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { Play, Pause, Square } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTimer } from '@/lib/hooks/use-timer';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { db, type TimerCategory } from '@/lib/db';
import { todayISO, formatDuration, formatMinutes } from '@/lib/utils';
import styles from './study-timer.module.css';

const CATEGORIES: TimerCategory[] = ['reading', 'writing', 'listening', 'speaking', 'vocabulary'];

export function StudyTimer() {
  const timer = useTimer();
  const config = CATEGORY_CONFIG[timer.category];

  const todaySessions = useLiveQuery(
    () => db.timerSessions.where('date').equals(todayISO()).toArray(),
    []
  ) ?? [];

  const totalToday = todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0);

  return (
    <Card>
      <CardHeader
        title="Studietimer ⏱️"
        subtitle={totalToday > 0 ? `${formatMinutes(totalToday)} i dag` : undefined}
      />

      <div className={styles.timer}>
        {timer.status === 'idle' && (
          <div className={styles.categorySelect}>
            {CATEGORIES.map(cat => {
              const c = CATEGORY_CONFIG[cat];
              return (
                <button
                  key={cat}
                  className={`${styles.categoryOption} ${timer.category === cat ? styles.categoryOptionActive : ''}`}
                  style={timer.category === cat ? { backgroundColor: c.colorVar } : undefined}
                  onClick={() => timer.setCategory(cat)}
                >
                  {c.emoji} {c.label}
                </button>
              );
            })}
          </div>
        )}

        {timer.status !== 'idle' && (
          <Badge variant={timer.category as 'reading' | 'writing' | 'listening' | 'speaking' | 'vocabulary'}>
            {config.emoji} {config.label}
          </Badge>
        )}

        <div className={`${styles.display} ${timer.status === 'running' ? styles.running : ''}`}>
          <div
            className={styles.breatheRing}
            style={{ background: `radial-gradient(circle, ${config.colorVar}40, transparent)` }}
          />
          <span className={styles.time}>{formatDuration(timer.elapsed)}</span>
        </div>

        <div className={styles.controls}>
          {timer.status === 'idle' && (
            <Button onClick={timer.start} size="md">
              <Play size={16} /> Start
            </Button>
          )}
          {timer.status === 'running' && (
            <>
              <Button variant="secondary" onClick={timer.pause} size="md">
                <Pause size={16} /> Pause
              </Button>
              <Button variant="danger" onClick={timer.stop} size="md">
                <Square size={16} /> Stopp
              </Button>
            </>
          )}
          {timer.status === 'paused' && (
            <>
              <Button onClick={timer.resume} size="md">
                <Play size={16} /> Fortsett
              </Button>
              <Button variant="danger" onClick={timer.stop} size="md">
                <Square size={16} /> Stopp
              </Button>
            </>
          )}
        </div>
      </div>

      {todaySessions.length > 0 && (
        <div className={styles.sessionList}>
          {todaySessions.map(session => {
            const sc = CATEGORY_CONFIG[session.category];
            return (
              <div key={session.id} className={styles.sessionItem}>
                <span className={styles.sessionCategory}>
                  <span>{sc.emoji}</span>
                  <span>{sc.label}</span>
                </span>
                <span className={styles.sessionDuration}>
                  {formatDuration(session.durationSeconds)}
                </span>
                <span className={styles.sessionTime}>
                  {format(session.startedAt, 'HH:mm')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
