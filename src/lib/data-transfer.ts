/**
 * Export and import the entire IndexedDB. Keyed off the canonical STORES list
 * from db.ts so adding a table never silently skips it in export. Per-table
 * date-field maps rehydrate strings into Date instances during import.
 */
import Dexie from 'dexie';
import { db, STORES } from '@/lib/db';

type StoreName = (typeof STORES)[number];

const DATE_FIELDS: Record<StoreName, string[]> = {
  practiceTasks:        ['createdAt'],
  dailyCheckoffs:       ['completedAt'],
  vocabEntries:         ['createdAt', 'updatedAt'],
  timerSessions:        ['startedAt', 'endedAt'],
  writingSubmissions:   ['createdAt'],
  consumedResources:    ['consumedAt'],
  difficultyRatings:    ['ratedAt'],
  grammarProgress:      ['updatedAt'],
  conversationSessions: ['createdAt', 'completedAt'],
  prepositionSessions:  ['completedAt'],
  feedPosts:            ['generatedAt', 'readAt'],
};

export interface ExportFile {
  exportedAt: string;
  version: 1;
  data: Partial<Record<StoreName, unknown[]>>;
}

export async function exportAllData(): Promise<ExportFile> {
  const data: Partial<Record<StoreName, unknown[]>> = {};
  for (const name of STORES) {
    data[name] = await db.table(name).toArray();
  }
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    data,
  };
}

export function downloadExport(file: ExportFile): void {
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `norsk-tracker-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function rehydrate(row: Record<string, unknown>, dateFields: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = { ...row };
  for (const field of dateFields) {
    const v = out[field];
    if (typeof v === 'string') out[field] = new Date(v);
  }
  return out;
}

export interface ImportResult {
  perStore: Record<string, { added: number; error?: string }>;
  totalAdded: number;
  errors: string[];
}

/**
 * Replaces the entire DB with the contents of the export file in a single
 * transaction. If any table fails, the whole transaction aborts and the DB
 * is left untouched.
 *
 * Accepts both the new shape `{ version, data: {...} }` and the legacy flat
 * shape `{ practiceTasks: [...], dailyCheckoffs: [...], ... }`.
 */
export async function importAllData(parsed: unknown): Promise<ImportResult> {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Import file is not a JSON object');
  }
  const top = parsed as Record<string, unknown>;
  const data: Record<string, unknown> =
    top.data && typeof top.data === 'object' && !Array.isArray(top.data)
      ? (top.data as Record<string, unknown>)
      : top;

  const tables = STORES.map(name => db.table(name));
  const result: ImportResult = { perStore: {}, totalAdded: 0, errors: [] };

  await db.transaction('rw', tables, async () => {
    for (const name of STORES) {
      const rows = data[name];
      if (!Array.isArray(rows)) continue;
      try {
        await db.table(name).clear();
        const hydrated = rows.map(r => rehydrate(r as Record<string, unknown>, DATE_FIELDS[name]));
        // bulkPut works for stores with primary keys (incl. grammarProgress which
        // uses ruleId); bulkAdd would throw on duplicates.
        await (db.table(name) as Dexie.Table).bulkPut(hydrated);
        result.perStore[name] = { added: hydrated.length };
        result.totalAdded += hydrated.length;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        result.perStore[name] = { added: 0, error: msg };
        result.errors.push(`${name}: ${msg}`);
        throw err; // abort transaction — partial imports are worse than no import
      }
    }
  });

  return result;
}
