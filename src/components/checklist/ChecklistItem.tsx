'use client';

import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/Checkbox';
import { CATEGORY_CONFIG } from '@/lib/constants';
import type { PracticeTask, DailyCheckoff } from '@/lib/db';
import styles from './checklist-item.module.css';

interface ChecklistItemProps {
  task: PracticeTask;
  checkoff?: DailyCheckoff;
  onToggle: () => void;
  onEditCheckoff: (checkoff: DailyCheckoff) => void;
}

export function ChecklistItem({ task, checkoff, onToggle, onEditCheckoff }: ChecklistItemProps) {
  const config = CATEGORY_CONFIG[task.category];
  const isCompleted = !!checkoff;

  return (
    <div
      className={`${styles.item} ${isCompleted ? styles.completed : ''}`}
      onClick={onToggle}
    >
      <span
        className={styles.categoryDot}
        style={{ backgroundColor: config.colorVar }}
      />
      <Checkbox
        checked={isCompleted}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
      />
      <div className={styles.taskInfo}>
        <span className={styles.emoji}>{config.emoji}</span>
        <span className={styles.taskName}>{task.name}</span>
      </div>
      {checkoff && (
        <div className={styles.checkoffMeta}>
          <button
            className={styles.completedAt}
            onClick={e => { e.stopPropagation(); onEditCheckoff(checkoff); }}
            title="Rediger"
          >
            {format(checkoff.completedAt, 'HH:mm')}
            {checkoff.durationMinutes ? ` · ${checkoff.durationMinutes}m` : ''}
          </button>
          {checkoff.notes && (
            <span className={styles.notes}>{checkoff.notes}</span>
          )}
        </div>
      )}
    </div>
  );
}
