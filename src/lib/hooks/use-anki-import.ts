'use client';

import { useState, useCallback } from 'react';
import { db, type VocabEntry } from '@/lib/db';
import { parseApkgFile } from '@/lib/anki/apkg-parser';
import { mapNoteToVocabData } from '@/lib/anki/field-mapper';
import type { ParsedApkg, AnkiFieldMapping, AnkiModel, AnkiCard, ImportResult, MappedVocabData } from '@/lib/anki/types';

export type ImportStep = 'select-file' | 'map-fields' | 'preview' | 'importing' | 'done';
export type DuplicateStrategy = 'skip' | 'update';

export interface PreviewEntry extends MappedVocabData {
  isDuplicate: boolean;
}

export function useAnkiImport() {
  const [step, setStep] = useState<ImportStep>('select-file');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedApkg | null>(null);
  const [selectedModel, setSelectedModel] = useState<AnkiModel | null>(null);
  const [mapping, setMapping] = useState<AnkiFieldMapping | null>(null);
  const [duplicateStrategy, setDuplicateStrategy] = useState<DuplicateStrategy>('skip');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewEntries, setPreviewEntries] = useState<PreviewEntry[]>([]);

  const handleFile = useCallback(async (file: File) => {
    try {
      setError(null);
      setLoading(true);
      const data = await parseApkgFile(file);
      setParsed(data);
      const modelList = Object.values(data.models);
      if (modelList.length === 1) setSelectedModel(modelList[0]);
      setStep('map-fields');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmMapping = useCallback(async (m: AnkiFieldMapping) => {
    if (!parsed) return;
    setMapping(m);

    // Build preview
    const cardsByNote = groupCardsByNote();
    const notesToPreview = getFilteredNotes();
    const existing = await db.vocabEntries.toArray();
    const existingSet = new Set(existing.map(e => e.norwegian.toLowerCase()));

    const preview: PreviewEntry[] = [];
    for (const note of notesToPreview.slice(0, 100)) {
      const cards = cardsByNote.get(note.id) ?? [];
      const data = mapNoteToVocabData(note, cards, m);
      if (!data) continue;
      preview.push({
        ...data,
        isDuplicate: existingSet.has(data.norwegian.toLowerCase()),
      });
    }
    setPreviewEntries(preview);
    setStep('preview');

    function groupCardsByNote() {
      const map = new Map<number, AnkiCard[]>();
      for (const card of parsed!.cards) {
        const arr = map.get(card.nid) ?? [];
        arr.push(card);
        map.set(card.nid, arr);
      }
      return map;
    }

    function getFilteredNotes() {
      return selectedModel
        ? parsed!.notes.filter(n => n.mid === selectedModel.id)
        : parsed!.notes;
    }
  }, [parsed, selectedModel]);

  const executeImport = useCallback(async () => {
    if (!parsed || !mapping) return;
    setStep('importing');
    setProgress(0);

    const cardsByNote = new Map<number, typeof parsed.cards>();
    for (const card of parsed.cards) {
      const arr = cardsByNote.get(card.nid) ?? [];
      arr.push(card);
      cardsByNote.set(card.nid, arr);
    }

    const notesToImport = selectedModel
      ? parsed.notes.filter(n => n.mid === selectedModel.id)
      : parsed.notes;

    const existing = await db.vocabEntries.toArray();
    const existingByNorwegian = new Map(
      existing.map(e => [e.norwegian.toLowerCase(), e])
    );

    let added = 0, updated = 0, skipped = 0;
    const toAdd: VocabEntry[] = [];
    const toUpdate: { id: string; changes: Partial<VocabEntry> }[] = [];

    for (let i = 0; i < notesToImport.length; i++) {
      const note = notesToImport[i];
      const cards = cardsByNote.get(note.id) ?? [];
      const vocabData = mapNoteToVocabData(note, cards, mapping);
      if (!vocabData) { skipped++; continue; }

      const existingEntry = existingByNorwegian.get(vocabData.norwegian.toLowerCase());
      if (existingEntry) {
        if (duplicateStrategy === 'update') {
          toUpdate.push({
            id: existingEntry.id,
            changes: {
              ...vocabData,
              category: category || existingEntry.category,
              updatedAt: new Date(),
            },
          });
          updated++;
        } else {
          skipped++;
        }
      } else {
        const now = new Date();
        toAdd.push({
          id: crypto.randomUUID(),
          ...vocabData,
          category: category || undefined,
          createdAt: now,
          updatedAt: now,
        });
        added++;
      }

      if (i % 50 === 0) setProgress(Math.round((i / notesToImport.length) * 100));
    }

    if (toAdd.length > 0) await db.vocabEntries.bulkAdd(toAdd);
    for (const { id, changes } of toUpdate) {
      await db.vocabEntries.update(id, changes);
    }

    setResult({ added, updated, skipped });
    setProgress(100);
    setStep('done');
  }, [parsed, mapping, selectedModel, duplicateStrategy, category]);

  const reset = useCallback(() => {
    setStep('select-file');
    setParsed(null);
    setSelectedModel(null);
    setMapping(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setLoading(false);
    setPreviewEntries([]);
    setCategory('');
  }, []);

  const models = parsed ? Object.values(parsed.models) : [];
  const totalNotes = selectedModel
    ? parsed?.notes.filter(n => n.mid === selectedModel.id).length ?? 0
    : parsed?.notes.length ?? 0;

  return {
    step, error, loading, parsed, models, totalNotes,
    selectedModel, setSelectedModel,
    mapping, duplicateStrategy, setDuplicateStrategy,
    category, setCategory, result, progress, previewEntries,
    handleFile, confirmMapping, executeImport, reset,
  };
}
