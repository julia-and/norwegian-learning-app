'use client';

import { format } from 'date-fns';
import { X } from 'lucide-react';
import { CATEGORY_CONFIG } from '@/lib/constants';
import type { DailyCheckoff } from '@/lib/db';
import styles from './checklist-item.module.css';
import adHocStyles from './ad-hoc-item.module.css';

interface AdHocItemProps {
  checkoff: DailyCheckoff;
  onDelete: (id: string) => void;
}

export function AdHocItem({ checkoff, onDelete }: AdHocItemProps) {
  const config = checkoff.adHocCategory ? CATEGORY_CONFIG[checkoff.adHocCategory] : null;

  return (
    <div className={`${styles.item} ${styles.completed} ${adHocStyles.adHoc}`}>
      <span
        className={styles.categoryDot}
        style={{ backgroundColor: config?.colorVar ?? 'var(--color-text-tertiary)' }}
      />
      <div className={styles.taskInfo}>
        <span className={styles.emoji}>{config?.emoji ?? '✅'}</span>
        <span className={styles.taskName}>{checkoff.label}</span>
      </div>
      <span className={styles.completedAt}>
        {format(checkoff.completedAt, 'HH:mm')}
        {checkoff.durationMinutes ? ` · ${checkoff.durationMinutes}m` : ''}
      </span>
      <button
        className={adHocStyles.deleteBtn}
        onClick={() => onDelete(checkoff.id)}
        title="Slett"
      >
        <X size={14} />
      </button>
    </div>
  );
}
