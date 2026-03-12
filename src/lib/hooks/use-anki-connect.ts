'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';
import * as ankiConnect from '@/lib/anki/anki-connect';
import { mapAnkiScheduleToStatus, bestStatus, stripHtml } from '@/lib/anki/field-mapper';
import type { AnkiConnectConfig, ImportResult } from '@/lib/anki/types';

const CONFIG_KEY = 'anki-connect-config';

const defaultConfig: AnkiConnectConfig = {
  enabled: false,
  deckName: '',
  noteType: '',
  norwegianField: '',
  englishField: '',
};

export function useAnkiConnect() {
  const [config, setConfigState] = useState<AnkiConnectConfig>(defaultConfig);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dropdown data
  const [decks, setDecks] = useState<string[]>([]);
  const [modelNames, setModelNames] = useState<string[]>([]);
  const [fieldNames, setFieldNames] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      try {
        setConfigState(JSON.parse(stored));
      } catch {
        // ignore corrupt config
      }
    }
  }, []);

  const setConfig = useCallback((updates: Partial<AnkiConnectConfig>) => {
    setConfigState(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const checkConnection = useCallback(async () => {
    setError(null);
    const ok = await ankiConnect.testConnection();
    setConnected(ok);
    if (ok) {
      try {
        const [d, m] = await Promise.all([
          ankiConnect.getDeckNames(),
          ankiConnect.getModelNames(),
        ]);
        setDecks(d);
        setModelNames(m);
      } catch {
        // Connected but failed to fetch metadata
      }
    }
    return ok;
  }, []);

  const loadFieldNames = useCallback(async (modelName: string) => {
    try {
      const fields = await ankiConnect.getModelFieldNames(modelName);
      setFieldNames(fields);
    } catch {
      setFieldNames([]);
    }
  }, []);

  const sync = useCallback(async () => {
    if (!config.deckName || !config.norwegianField || !config.englishField) {
      setError('Please configure deck name and field mappings first.');
      return;
    }

    setSyncing(true);
    setError(null);
    setSyncResult(null);

    try {
      // Fetch notes
      const noteIds = await ankiConnect.findNotes(`deck:"${config.deckName}"`);
      if (noteIds.length === 0) {
        setSyncResult({ added: 0, updated: 0, skipped: 0 });
        setSyncing(false);
        return;
      }

      const allNotes: ankiConnect.AnkiConnectNoteInfo[] = [];
      for (let i = 0; i < noteIds.length; i += 100) {
        const batch = noteIds.slice(i, i + 100);
        allNotes.push(...await ankiConnect.getNotesInfo(batch));
      }

      // Fetch cards for scheduling data
      const cardIds = await ankiConnect.findCards(`deck:"${config.deckName}"`);
      const allCards: ankiConnect.AnkiConnectCardInfo[] = [];
      for (let i = 0; i < cardIds.length; i += 100) {
        const batch = cardIds.slice(i, i + 100);
        allCards.push(...await ankiConnect.getCardsInfo(batch));
      }

      // Group cards by note
      const cardsByNote = new Map<number, ankiConnect.AnkiConnectCardInfo[]>();
      for (const card of allCards) {
        const arr = cardsByNote.get(card.note) ?? [];
        arr.push(card);
        cardsByNote.set(card.note, arr);
      }

      // Map and upsert
      const existing = await db.vocabEntries.toArray();
      const existingByNorwegian = new Map(
        existing.map(e => [e.norwegian.toLowerCase(), e])
      );

      let added = 0, updated = 0, skipped = 0;

      for (const note of allNotes) {
        const norwegian = stripHtml(note.fields[config.norwegianField]?.value ?? '');
        const english = stripHtml(note.fields[config.englishField]?.value ?? '');
        if (!norwegian || !english) { skipped++; continue; }

        const noteCards = cardsByNote.get(note.noteId) ?? [];
        const statuses = noteCards.map(c => mapAnkiScheduleToStatus({
          id: c.cardId, nid: c.note, ord: 0,
          type: c.type, queue: c.queue, due: c.due,
          ivl: c.interval, reps: c.reps, lapses: c.lapses,
        }));
        const reviewStatus = statuses.length > 0 ? bestStatus(statuses) : 'new';

        const notes = config.notesField
          ? stripHtml(note.fields[config.notesField]?.value ?? '') || undefined
          : undefined;

        const existingEntry = existingByNorwegian.get(norwegian.toLowerCase());
        if (existingEntry) {
          await db.vocabEntries.update(existingEntry.id, {
            english, notes, reviewStatus, updatedAt: new Date(),
          });
          updated++;
        } else {
          const now = new Date();
          await db.vocabEntries.add({
            id: crypto.randomUUID(),
            norwegian, english, notes, reviewStatus,
            createdAt: now, updatedAt: now,
          });
          added++;
        }
      }

      setConfig({ lastSyncedAt: new Date().toISOString() });
      setSyncResult({ added, updated, skipped });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }, [config, setConfig]);

  return {
    config, setConfig,
    connected, checkConnection,
    decks, modelNames, fieldNames, loadFieldNames,
    syncing, sync, syncResult, error,
  };
}
