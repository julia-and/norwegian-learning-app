'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { DuplicateStrategy, PreviewEntry } from '@/lib/hooks/use-anki-import';
import { REVIEW_STATUS_CONFIG } from '@/lib/constants';
import styles from './import-preview.module.css';

interface ImportPreviewProps {
  entries: PreviewEntry[];
  totalNotes: number;
  duplicateStrategy: DuplicateStrategy;
  onDuplicateStrategyChange: (s: DuplicateStrategy) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  onImport: () => void;
  onBack: () => void;
}

export function ImportPreview({
  entries, totalNotes, duplicateStrategy, onDuplicateStrategyChange,
  category, onCategoryChange, onImport, onBack,
}: ImportPreviewProps) {
  const duplicateCount = entries.filter(e => e.isDuplicate).length;
  const newCount = entries.filter(e => !e.isDuplicate).length;

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <span className={styles.summaryItem}>
          <span className={styles.summaryValue}>{totalNotes}</span> notater i kortstokken
        </span>
        <span className={styles.summaryItem}>
          <span className={styles.summaryValue}>{newCount}</span> nye
        </span>
        {duplicateCount > 0 && (
          <span className={styles.summaryItem}>
            <span className={styles.summaryValue}>{duplicateCount}</span> finnes allerede
          </span>
        )}
      </div>

      <div className={styles.options}>
        {duplicateCount > 0 && (
          <div className={styles.optionField}>
            <Select
              label="Når ord allerede finnes"
              value={duplicateStrategy}
              onChange={e => onDuplicateStrategyChange(e.target.value as DuplicateStrategy)}
              options={[
                { value: 'skip', label: 'Hopp over duplikater' },
                { value: 'update', label: 'Oppdater status fra Anki' },
              ]}
            />
          </div>
        )}
        <div className={styles.optionField}>
          <Input
            label="Kategori (valgfritt)"
            value={category}
            onChange={e => onCategoryChange(e.target.value)}
            placeholder="f.eks. Anki-kortstokkens navn"
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Norsk</th>
              <th>Engelsk</th>
              <th>Status</th>
              <th>Duplikat</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i} className={entry.isDuplicate ? styles.duplicate : ''}>
                <td>{entry.norwegian}</td>
                <td>{entry.english}</td>
                <td>
                  <Badge variant={
                    entry.reviewStatus === 'known' ? 'success' :
                    entry.reviewStatus === 'learning' ? 'accent' : 'default'
                  }>
                    {REVIEW_STATUS_CONFIG[entry.reviewStatus].label}
                  </Badge>
                </td>
                <td>{entry.isDuplicate ? 'Ja' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onBack}>Tilbake</Button>
        <Button onClick={onImport}>
          Importer {totalNotes} ord
        </Button>
      </div>
    </div>
  );
}
