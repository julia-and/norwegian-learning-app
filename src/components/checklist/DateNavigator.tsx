'use client';

import { format, parseISO, isToday as isTodayFn } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { todayISO } from '@/lib/utils';
import styles from './date-navigator.module.css';

interface DateNavigatorProps {
  dateStr: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function DateNavigator({ dateStr, onPrev, onNext, onToday }: DateNavigatorProps) {
  const date = parseISO(dateStr);
  const isToday = isTodayFn(date);
  const canGoNext = dateStr < todayISO();

  return (
    <div className={styles.nav}>
      <Button variant="ghost" size="sm" iconOnly onClick={onPrev} aria-label="Forrige dag">
        <ChevronLeft size={18} />
      </Button>
      <span className={`${styles.dateLabel} ${isToday ? styles.todayLabel : ''}`}>
        {isToday ? 'I dag' : format(date, 'EEE, d. MMM', { locale: nb })}
      </span>
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Neste dag"
      >
        <ChevronRight size={18} />
      </Button>
      {!isToday && (
        <button className={styles.todayButton} onClick={onToday}>
          I dag
        </button>
      )}
    </div>
  );
}
