'use client';

import { Input } from '@/components/ui/Input';
import { WordChoiceCard } from '@/components/ordvalg/WordChoiceCard';
import { useWordChoices } from '@/lib/hooks/use-word-choices';
import { WORD_CHOICE_CATEGORY_LABELS } from '@/lib/word-choices';
import type { WordChoiceCategory } from '@/lib/word-choices';
import type { CEFRLevel } from '@/lib/resources';
import styles from './page.module.css';

const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2'];
const CATEGORIES: (WordChoiceCategory | 'all')[] = [
  'all', 'conjunctions', 'verbs', 'adverbs', 'pronouns', 'prepositions',
];

export default function OrdvalgPage() {
  const {
    groups,
    search, setSearch,
    levelFilter, setLevelFilter,
    categoryFilter, setCategoryFilter,
    expandedGroupId, setExpandedGroupId,
  } = useWordChoices();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Ordvalg</h1>

      <Input
        placeholder="Søk etter ord, f.eks. «om» eller «believe»..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

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
              {c === 'all' ? 'Alle kategorier' : WORD_CHOICE_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.meta}>
        <span>{groups.length} ordgrupper</span>
      </div>

      {groups.length === 0 ? (
        <div className={styles.empty}>Ingen ordgrupper matcher søket ditt.</div>
      ) : (
        <div className={styles.groups}>
          {groups.map(group => (
            <WordChoiceCard
              key={group.id}
              group={group}
              isExpanded={expandedGroupId === group.id}
              onToggle={() => setExpandedGroupId(expandedGroupId === group.id ? null : group.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
