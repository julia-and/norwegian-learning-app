'use client';

import { useState } from 'react';
import styles from './difficulty-rating-widget.module.css';

const LABELS = ['Veldig lett', 'Lett', 'Middels', 'Vanskelig', 'Veldig vanskelig'];

interface Props {
  onRate: (n: number) => void;
  onSkip: () => void;
}

export function DifficultyRatingWidget({ onRate, onSkip }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={styles.widget}>
      <p className={styles.prompt}>Hvor vanskelig var det?</p>
      <div className={styles.buttons}>
        {LABELS.map((label, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              className={styles.btn}
              onClick={() => onRate(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`${n} — ${label}`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <span className={styles.label}>
        {hovered !== null ? LABELS[hovered - 1] : '\u00A0'}
      </span>
      <button className={styles.skip} onClick={onSkip}>
        Hopp over
      </button>
    </div>
  );
}
