'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { GrammarRuleCard } from '@/components/grammar/GrammarRuleCard';
import { useGrammar } from '@/lib/hooks/use-grammar';
import { CATEGORY_LABELS } from '@/lib/grammar-rules';
import type { GrammarCategory } from '@/lib/grammar-rules';
import type { CEFRLevel } from '@/lib/resources';
import styles from './page.module.css';

const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2'];
const CATEGORIES: (GrammarCategory | 'all')[] = [
  'all', 'nouns', 'verbs', 'adjectives', 'pronouns', 'prepositions',
  'sentence-structure', 'conjunctions', 'word-order', 'tense', 'adverbs',
];

export default function GrammarPage() {
  const {
    rules,
    search, setSearch,
    levelFilter, setLevelFilter,
    categoryFilter, setCategoryFilter,
    progressMap, setMastery,
    notesMap, setNote,
    bookmarks, toggleBookmark,
    expandedRuleId, setExpandedRuleId,
  } = useGrammar();

  const [bookmarkFilter, setBookmarkFilter] = useState(false);

  const displayRules = bookmarkFilter ? rules.filter(r => bookmarks.has(r.id)) : rules;

  const learningCount = [...progressMap.values()].filter(s => s === 'learning').length;
  const knownCount = [...progressMap.values()].filter(s => s === 'known').length;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Grammatikk</h1>

      <div className={styles.searchRow}>
        <Input
          placeholder="Søk etter regler, f.eks. «definite» eller «bestemt»..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className={`${styles.bookmarkBtn} ${bookmarkFilter ? styles.bookmarkBtnActive : ''}`}
          onClick={() => setBookmarkFilter(v => !v)}
        >
          <Star size={15} fill={bookmarkFilter ? 'currentColor' : 'none'} />
          Bokmerkede
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          {LEVELS.map(l => (
            <button
              key={l}
              className={`${styles.filterBtn} ${levelFilter === l ? styles.filterBtnActive : ''}`}
              onClick={() => setLevelFilter(l)}
            >
              {l === 'all' ? 'Alle nivåer' : l}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`${styles.filterBtn} ${categoryFilter === c ? styles.filterBtnActive : ''}`}
              onClick={() => setCategoryFilter(c)}
            >
              {c === 'all' ? 'Alle kategorier' : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.meta}>
        <span>{displayRules.length} regler</span>
        {learningCount > 0 && <span>{learningCount} lærer</span>}
        {knownCount > 0 && <span>{knownCount} kan</span>}
      </div>

      {displayRules.length === 0 ? (
        <div className={styles.empty}>
          {bookmarkFilter ? 'Ingen bokmerkede regler.' : 'Ingen regler matcher søket ditt.'}
        </div>
      ) : (
        <div className={styles.rules}>
          {displayRules.map(rule => (
            <GrammarRuleCard
              key={rule.id}
              rule={rule}
              isExpanded={expandedRuleId === rule.id}
              onToggle={() => setExpandedRuleId(expandedRuleId === rule.id ? null : rule.id)}
              masteryStatus={progressMap.get(rule.id)}
              onSetMastery={setMastery}
              isBookmarked={bookmarks.has(rule.id)}
              onToggleBookmark={toggleBookmark}
              userNote={notesMap.get(rule.id) ?? ''}
              onSetNote={setNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
