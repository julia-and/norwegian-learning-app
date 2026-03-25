'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BookPlus, X } from 'lucide-react';
import { db } from '@/lib/db';
import styles from './WordTooltip.module.css';

interface WordTooltipProps {
  word: string;
  translation: string | null;
  rect: DOMRect;
  onClose: () => void;
}

export function WordTooltip({ word, translation, rect, onClose }: WordTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const addToVocab = async () => {
    try {
      await db.vocabEntries.add({
        id: crypto.randomUUID(),
        norwegian: word,
        english: translation ?? '',
        reviewStatus: 'new',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch {
      // Duplicate — already exists
    }
    onClose();
  };

  // Position: above the word, centered; flip below if near top
  const tooltipHeight = 80;
  const tooltipWidth = 200;
  const margin = 8;

  const top = rect.top > tooltipHeight + margin
    ? rect.top - tooltipHeight - margin
    : rect.bottom + margin;

  const left = Math.min(
    Math.max(margin, rect.left + rect.width / 2 - tooltipWidth / 2),
    window.innerWidth - tooltipWidth - margin,
  );

  const content = (
    <div
      ref={tooltipRef}
      className={styles.tooltip}
      style={{ top, left, width: tooltipWidth }}
    >
      <button className={styles.close} onClick={onClose} aria-label="Lukk">
        <X size={12} />
      </button>
      <div className={styles.word}>{word}</div>
      <div className={styles.translation}>
        {translation ?? <span className={styles.noTranslation}>Ikke i ordliste</span>}
      </div>
      {translation && (
        <button className={styles.addButton} onClick={addToVocab}>
          <BookPlus size={12} />
          Legg til ordbok
        </button>
      )}
    </div>
  );

  return createPortal(content, document.body);
}
