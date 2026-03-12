'use client';

import { useState } from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { stripHtml } from '@/lib/anki/field-mapper';
import type { AnkiModel, AnkiNote, AnkiFieldMapping } from '@/lib/anki/types';
import styles from './field-mapping.module.css';

interface FieldMappingStepProps {
  models: AnkiModel[];
  selectedModel: AnkiModel | null;
  onSelectModel: (model: AnkiModel) => void;
  notes: AnkiNote[];
  onConfirm: (mapping: AnkiFieldMapping) => void;
}

export function FieldMappingStep({
  models, selectedModel, onSelectModel, notes, onConfirm,
}: FieldMappingStepProps) {
  const [norwegianIdx, setNorwegianIdx] = useState(0);
  const [englishIdx, setEnglishIdx] = useState(1);
  const [notesIdx, setNotesIdx] = useState<number | undefined>(undefined);

  const fields = selectedModel?.fields ?? [];
  const fieldOptions = fields.map((f, i) => ({ value: String(i), label: f.name }));
  const notesOptions = [{ value: '', label: '(ingen)' }, ...fieldOptions];

  // Find a sample note for this model
  const sampleNote = selectedModel
    ? notes.find(n => n.mid === selectedModel.id)
    : notes[0];

  const handleConfirm = () => {
    onConfirm({
      norwegianFieldIndex: norwegianIdx,
      englishFieldIndex: englishIdx,
      notesFieldIndex: notesIdx,
    });
  };

  return (
    <div className={styles.container}>
      {models.length > 1 && (
        <div className={styles.modelSelect}>
          <Select
            label="Notetype"
            value={selectedModel ? String(selectedModel.id) : ''}
            onChange={(e) => {
              const model = models.find(m => String(m.id) === e.target.value);
              if (model) onSelectModel(model);
            }}
            options={models.map(m => ({ value: String(m.id), label: m.name }))}
          />
        </div>
      )}

      {selectedModel && (
        <>
          <p className={styles.info}>
            Knytt Anki-feltene til ordforrådskolonnene. Første eksempel vises nedenfor.
          </p>

          <div className={styles.mappingGrid}>
            <Select
              label="Norsk felt"
              value={String(norwegianIdx)}
              onChange={e => setNorwegianIdx(Number(e.target.value))}
              options={fieldOptions}
            />
            <Select
              label="Engelsk felt"
              value={String(englishIdx)}
              onChange={e => setEnglishIdx(Number(e.target.value))}
              options={fieldOptions}
            />
            <Select
              label="Notatfelt (valgfritt)"
              value={notesIdx !== undefined ? String(notesIdx) : ''}
              onChange={e => setNotesIdx(e.target.value ? Number(e.target.value) : undefined)}
              options={notesOptions}
            />
          </div>

          {sampleNote && (
            <div className={styles.sampleSection}>
              <div className={styles.sampleLabel}>Eksempel</div>
              <div className={styles.sampleCard}>
                {fields.map((field, i) => (
                  <div key={i} className={styles.sampleField}>
                    <span className={styles.sampleFieldName}>{field.name}:</span>
                    <span className={styles.sampleFieldValue}>
                      {stripHtml(sampleNote.fields[i] ?? '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleConfirm}>
            Fortsett
          </Button>
        </>
      )}
    </div>
  );
}
