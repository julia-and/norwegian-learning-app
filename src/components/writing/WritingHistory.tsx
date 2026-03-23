'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { FileText } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { WritingResults } from './WritingResults';
import { useWritingHistory } from '@/lib/hooks/use-writing';
import type { WritingSubmission } from '@/lib/db';
import styles from './writing-history.module.css';

export function WritingHistory() {
  const { submissions } = useWritingHistory();
  const [selected, setSelected] = useState<WritingSubmission | null>(null);

  if (submissions.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Historikk</h2>
      <div className={styles.list}>
        {submissions.map(sub => (
          <button
            key={sub.id}
            className={styles.item}
            onClick={() => setSelected(sub)}
          >
            <div className={styles.itemLeft}>
              <span className={styles.itemDate}>
                {format(parseISO(sub.date), 'd. MMM', { locale: nb })}
              </span>
              <span className={styles.itemTopic}>
                {sub.promptId === null && <span className={styles.freeTag}>fri</span>}
                {sub.promptText.slice(0, 60)}{sub.promptText.length > 60 ? '…' : ''}
              </span>
            </div>
            <div className={styles.itemRight}>
              <div className={styles.fluencyDots}>
                {[1, 2, 3, 4, 5].map(n => (
                  <div
                    key={n}
                    className={`${styles.dot} ${n <= sub.fluencyRating ? styles.dotFilled : ''}`}
                  />
                ))}
              </div>
              <span className={styles.wordCount}>{sub.wordCount}w</span>
            </div>
          </button>
        ))}
      </div>

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? format(parseISO(selected.date), 'd. MMMM yyyy', { locale: nb }) : ''}
      >
        {selected && (
          <div className={styles.detail}>
            <div className={styles.detailMeta}>
              <span>Nivå: {selected.level}</span>
              <span>{selected.wordCount} ord</span>
            </div>
            <div className={styles.detailOriginal}>
              <div className={styles.detailLabel}>Din tekst</div>
              <div className={styles.detailText}>{selected.originalText}</div>
            </div>
            {selected.selfCorrections.length > 0 && (
              <div className={styles.detailSelfCorrection}>
                <div className={styles.detailLabel}>Egenkorreksjon</div>
                <div className={styles.scSummary}>
                  {selected.selfCorrections.filter(a => a.wasCorrect).length}/{selected.selfCorrections.length} riktig
                </div>
              </div>
            )}
            <WritingResults result={selected.correctionResult} />
          </div>
        )}
      </Dialog>
    </div>
  );
}
