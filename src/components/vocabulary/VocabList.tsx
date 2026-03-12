'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { VocabForm } from './VocabForm';
import { useVocab } from '@/lib/hooks/use-vocab';
import { REVIEW_STATUS_CONFIG } from '@/lib/constants';
import type { ReviewStatus } from '@/lib/db';
import styles from './vocab-list.module.css';

const STATUS_OPTIONS: { value: ReviewStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'new', label: 'Ny' },
  { value: 'learning', label: 'Lærer' },
  { value: 'known', label: 'Kan' },
];

export function VocabList() {
  const [formOpen, setFormOpen] = useState(false);
  const vocab = useVocab();

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Ordforråd</h1>
          <span className={styles.count}>{vocab.counts.total} ord totalt</span>
        </div>
        <Button onClick={() => setFormOpen(true)} size="md">
          <Plus size={16} /> Legg til ord
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="Søk etter ord..."
          value={vocab.search}
          onChange={e => vocab.setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.statusFilters}>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.filterBtn} ${vocab.statusFilter === opt.value ? styles.filterBtnActive : ''}`}
              onClick={() => vocab.setStatusFilter(opt.value)}
            >
              {opt.label}
              {opt.value !== 'all' && ` (${vocab.counts[opt.value]})`}
            </button>
          ))}
        </div>
      </div>

      {vocab.entries.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📝</div>
          <p>
            {vocab.search || vocab.statusFilter !== 'all'
              ? 'Ingen ord funnet.'
              : 'Ingen ord ennå. Begynn å bygge ordforrådet ditt! 📝'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {vocab.entries.map(entry => {
            const statusConfig = REVIEW_STATUS_CONFIG[entry.reviewStatus];
            return (
              <div key={entry.id} className={styles.card}>
                <div className={styles.wordInfo}>
                  <div className={styles.norwegian}>{entry.norwegian}</div>
                  <div className={styles.english}>{entry.english}</div>
                  {entry.notes && <div className={styles.notes}>{entry.notes}</div>}
                  {entry.category && (
                    <Badge variant="default" style={{ marginTop: 'var(--space-2)' }}>
                      {entry.category}
                    </Badge>
                  )}
                </div>
                <div className={styles.cardActions}>
                  <div className={styles.statusBtns}>
                    {(['new', 'learning', 'known'] as ReviewStatus[]).map(status => (
                      <button
                        key={status}
                        className={styles.statusBtn}
                        style={
                          entry.reviewStatus === status
                            ? {
                                background: `var(--color-${status === 'new' ? 'muted' : status === 'learning' ? 'accent-light' : 'success-light'})`,
                                borderColor: 'transparent',
                                color: `var(--color-${status === 'new' ? 'text-secondary' : status === 'learning' ? 'accent' : 'success'})`,
                              }
                            : undefined
                        }
                        onClick={() => vocab.setStatus(entry.id, status)}
                      >
                        {REVIEW_STATUS_CONFIG[status].label}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    onClick={() => vocab.deleteEntry(entry.id)}
                    aria-label="Slett ord"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <VocabForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={vocab.addEntry}
        categories={vocab.categories}
      />
    </div>
  );
}
