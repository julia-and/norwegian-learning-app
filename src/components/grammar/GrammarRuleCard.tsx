'use client';

import { useState, useEffect, useRef } from 'react';
import { Brain, CheckCircle, Star, ChevronDown } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { GrammarExercise } from './GrammarExercise';
import { CATEGORY_LABELS } from '@/lib/grammar-rules';
import type { GrammarRule } from '@/lib/grammar-rules';
import styles from './grammar-rule-card.module.css';

interface GrammarRuleCardProps {
  rule: GrammarRule;
  isExpanded: boolean;
  onToggle: () => void;
  masteryStatus: 'learning' | 'known' | undefined;
  onSetMastery: (ruleId: string, status: 'learning' | 'known' | null) => Promise<void>;
  isBookmarked: boolean;
  onToggleBookmark: (ruleId: string) => void;
  userNote: string;
  onSetNote: (ruleId: string, note: string) => Promise<void>;
}

const LEVEL_CLASS: Record<string, string> = {
  A1: styles.levelA1,
  A2: styles.levelA2,
  B1: styles.levelB1,
  B2: styles.levelB2,
  C1: styles.levelC1,
};

function cycleStatus(
  current: 'learning' | 'known' | undefined,
  ruleId: string,
  onSet: (id: string, s: 'learning' | 'known' | null) => Promise<void>
) {
  if (!current) return onSet(ruleId, 'learning');
  if (current === 'learning') return onSet(ruleId, 'known');
  return onSet(ruleId, null);
}

export function GrammarRuleCard({
  rule,
  isExpanded,
  onToggle,
  masteryStatus,
  onSetMastery,
  isBookmarked,
  onToggleBookmark,
  userNote,
  onSetNote,
}: GrammarRuleCardProps) {
  const [localNote, setLocalNote] = useState(userNote);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync if external value changes (e.g. after import)
  useEffect(() => { setLocalNote(userNote); }, [userNote]);

  const handleNoteChange = (value: string) => {
    setLocalNote(value);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => onSetNote(rule.id, value), 600);
  };
  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.header} onClick={onToggle} role="button" tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      >
        <div className={styles.badges}>
          <span className={`${styles.levelBadge} ${LEVEL_CLASS[rule.level] ?? ''}`}>
            {rule.level}
          </span>
          <span className={styles.categoryBadge}>
            {CATEGORY_LABELS[rule.category]}
          </span>
        </div>

        <div className={styles.titleRow}>
          <span className={styles.title}>{rule.title}</span>
          <div className={styles.actions}>
            <button
              className={`${styles.iconBtn} ${masteryStatus ? styles.masteryActive : ''}`}
              onClick={e => { e.stopPropagation(); cycleStatus(masteryStatus, rule.id, onSetMastery); }}
              title={masteryStatus === 'known' ? 'Kan' : masteryStatus === 'learning' ? 'Lærer' : 'Merk fremgang'}
            >
              {masteryStatus === 'known'
                ? <CheckCircle size={16} />
                : <Brain size={16} />
              }
            </button>
            <button
              className={`${styles.iconBtn} ${isBookmarked ? styles.bookmarkActive : ''}`}
              onClick={e => { e.stopPropagation(); onToggleBookmark(rule.id); }}
              title={isBookmarked ? 'Fjern bokmerke' : 'Bokmerke'}
            >
              <Star size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.body}>
          <div className={styles.explanation}>
            <Tooltip content={rule.explanationEnglish}>
              <span>{rule.explanation}</span>
            </Tooltip>
          </div>

          {rule.examples.length > 0 && (
            <ul className={styles.examples}>
              {rule.examples.map((ex, i) => (
                <li key={i} className={styles.example}>
                  <Tooltip content={ex.english} position="bottom">
                    <span className={styles.exampleNorwegian}>{ex.norwegian}</span>
                  </Tooltip>
                  {ex.notes && <span className={styles.exampleNote}> — {ex.notes}</span>}
                </li>
              ))}
            </ul>
          )}

          {rule.exercises.length > 0 && (
            <GrammarExercise exercises={rule.exercises} />
          )}

          <div className={styles.notesSection}>
            <label className={styles.notesLabel} htmlFor={`note-${rule.id}`}>
              Mine notater
            </label>
            <textarea
              id={`note-${rule.id}`}
              className={styles.notesTextarea}
              value={localNote}
              onChange={e => handleNoteChange(e.target.value)}
              placeholder="Skriv dine egne notater her..."
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}
