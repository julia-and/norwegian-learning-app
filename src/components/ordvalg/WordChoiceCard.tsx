'use client';

import { ChevronDown } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { WORD_CHOICE_CATEGORY_LABELS } from '@/lib/word-choices';
import type { WordChoiceGroup } from '@/lib/word-choices';
import styles from './word-choice-card.module.css';

interface WordChoiceCardProps {
  group: WordChoiceGroup;
  isExpanded: boolean;
  onToggle: () => void;
}

const LEVEL_CLASS: Record<string, string> = {
  A1: styles.levelA1,
  A2: styles.levelA2,
  B1: styles.levelB1,
  B2: styles.levelB2,
  C1: styles.levelC1,
};

export function WordChoiceCard({ group, isExpanded, onToggle }: WordChoiceCardProps) {
  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
      <div
        className={styles.header}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      >
        <div className={styles.badges}>
          <span className={`${styles.levelBadge} ${LEVEL_CLASS[group.level] ?? ''}`}>
            {group.level}
          </span>
          <span className={styles.categoryBadge}>
            {WORD_CHOICE_CATEGORY_LABELS[group.category]}
          </span>
        </div>

        <div className={styles.titleRow}>
          <span className={styles.title}>{group.title}</span>
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className={styles.body}>
          {group.tip && (
            <div className={styles.tip}>
              <Tooltip content={group.tipEnglish ?? ''}>
                <span>{group.tip}</span>
              </Tooltip>
            </div>
          )}

          {group.words.map((entry) => (
            <div key={entry.word} className={styles.wordSection}>
              <h3 className={styles.wordHeading}>{entry.word}</h3>
              <Tooltip content={entry.meaningEnglish}>
                <p className={styles.wordMeaning}>{entry.meaning}</p>
              </Tooltip>

              {entry.examples.length > 0 && (
                <ul className={styles.examples}>
                  {entry.examples.map((ex, i) => (
                    <li key={i} className={styles.example}>
                      <Tooltip content={ex.english} position="bottom">
                        <span className={styles.exampleNorwegian}>{ex.norwegian}</span>
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
