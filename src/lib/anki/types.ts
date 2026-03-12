import type { ReviewStatus } from '@/lib/db';

/** Raw note extracted from Anki SQLite database */
export interface AnkiNote {
  id: number;
  mid: number;
  tags: string;
  fields: string[];
}

/** Raw card extracted from Anki SQLite database */
export interface AnkiCard {
  id: number;
  nid: number;
  ord: number;
  type: number;   // 0=new, 1=learning, 2=review, 3=relearning
  queue: number;  // -1=suspended, 0=new, 1=learning, 2=review, 3=day-learn
  due: number;
  ivl: number;    // interval in days (negative = seconds for learning)
  reps: number;
  lapses: number;
}

/** Model (note type) definition from col table */
export interface AnkiModel {
  id: number;
  name: string;
  fields: { name: string; ord: number }[];
}

/** Deck definition from col table */
export interface AnkiDeck {
  id: number;
  name: string;
}

/** Parsed .apkg contents */
export interface ParsedApkg {
  notes: AnkiNote[];
  cards: AnkiCard[];
  models: Record<number, AnkiModel>;
  decks: Record<number, AnkiDeck>;
}

/** Field mapping configuration for import */
export interface AnkiFieldMapping {
  norwegianFieldIndex: number;
  englishFieldIndex: number;
  notesFieldIndex?: number;
}

/** AnkiConnect settings persisted to localStorage */
export interface AnkiConnectConfig {
  enabled: boolean;
  deckName: string;
  noteType: string;
  norwegianField: string;
  englishField: string;
  notesField?: string;
  lastSyncedAt?: string;
}

/** Result of a vocab import/sync operation */
export interface ImportResult {
  added: number;
  updated: number;
  skipped: number;
}

/** Vocab data ready to be inserted (before id/timestamps) */
export interface MappedVocabData {
  norwegian: string;
  english: string;
  notes?: string;
  reviewStatus: ReviewStatus;
}
