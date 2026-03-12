'use client';

import styles from './day-picker.module.css';

const DAY_LABELS = ['S', 'M', 'T', 'O', 'T', 'F', 'L'] as const;
const DAY_NAMES = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'] as const;

interface DayPickerProps {
  activeDays: number;
  onChange: (activeDays: number) => void;
}

export function DayPicker({ activeDays, onChange }: DayPickerProps) {
  const toggleDay = (i: number) => {
    const next = activeDays ^ (1 << i);
    if (next === 0) return; // must keep at least one day
    onChange(next);
  };

  return (
    <div className={styles.picker}>
      {activeDays === 127 && <span className={styles.everyDay}>Hver dag</span>}
      <div className={styles.days}>
        {DAY_LABELS.map((label, i) => (
          <button
            key={i}
            type="button"
            aria-label={DAY_NAMES[i]}
            aria-pressed={(activeDays & (1 << i)) !== 0}
            className={`${styles.day} ${(activeDays & (1 << i)) ? styles.dayActive : ''}`}
            onClick={() => toggleDay(i)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
