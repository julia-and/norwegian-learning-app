import initSqlJs, { type Database } from 'sql.js';
import JSZip from 'jszip';
import { decompress } from 'fzstd';
import type { ParsedApkg, AnkiNote, AnkiCard, AnkiModel, AnkiDeck } from './types';

let sqlPromise: ReturnType<typeof initSqlJs> | null = null;

function getSql() {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
  }
  return sqlPromise;
}

export async function parseApkgFile(file: File): Promise<ParsedApkg> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const SQL = await getSql();

  // Prefer anki21b (modern format with full data)
  const anki21bFile = zip.file('collection.anki21b');
  if (anki21bFile) {
    const compressed = await anki21bFile.async('uint8array');
    const decompressed = decompress(compressed);
    const db = new SQL.Database(decompressed);
    try {
      return extractDataV2(db);
    } finally {
      db.close();
    }
  }

  // Fall back to legacy anki2 format
  const anki2File = zip.file('collection.anki2');
  if (!anki2File) {
    throw new Error('Invalid .apkg file: no collection database found.');
  }

  const dbData = await anki2File.async('uint8array');
  const db = new SQL.Database(dbData);
  try {
    return extractDataLegacy(db);
  } finally {
    db.close();
  }
}

/**
 * Modern anki21b format:
 * - Note types in `notetypes` table
 * - Field definitions in `fields` table
 * - Decks in `decks` table
 */
function extractDataV2(db: Database): ParsedApkg {
  // Extract note types and their fields
  const notetypesResult = db.exec('SELECT id, name FROM notetypes');
  const fieldsResult = db.exec('SELECT ntid, ord, name FROM fields ORDER BY ntid, ord');

  const models: Record<number, AnkiModel> = {};

  for (const row of notetypesResult[0]?.values ?? []) {
    const id = row[0] as number;
    models[id] = {
      id,
      name: row[1] as string,
      fields: [],
    };
  }

  for (const row of fieldsResult[0]?.values ?? []) {
    const ntid = row[0] as number;
    if (models[ntid]) {
      models[ntid].fields.push({
        name: row[2] as string,
        ord: row[1] as number,
      });
    }
  }

  // Extract decks
  const decksResult = db.exec('SELECT id, name FROM decks');
  const decks: Record<number, AnkiDeck> = {};
  for (const row of decksResult[0]?.values ?? []) {
    const id = row[0] as number;
    decks[id] = { id, name: row[1] as string };
  }

  // Extract notes and cards (same schema as legacy)
  const notes = extractNotes(db);
  const cards = extractCards(db);

  return { notes, cards, models, decks };
}

/**
 * Legacy anki2 format:
 * - Models and decks stored as JSON in `col` table
 */
function extractDataLegacy(db: Database): ParsedApkg {
  const colResult = db.exec('SELECT models, decks FROM col LIMIT 1');
  if (!colResult.length || !colResult[0].values.length) {
    throw new Error('Invalid Anki database: no collection data found.');
  }

  const modelsJson = JSON.parse(colResult[0].values[0][0] as string);
  const decksJson = JSON.parse(colResult[0].values[0][1] as string);

  const models: Record<number, AnkiModel> = {};
  for (const [id, m] of Object.entries(modelsJson) as [string, Record<string, unknown>][]) {
    models[Number(id)] = {
      id: Number(id),
      name: m.name as string,
      fields: (m.flds as { name: string; ord: number }[])
        .sort((a, b) => a.ord - b.ord)
        .map(f => ({ name: f.name, ord: f.ord })),
    };
  }

  const decks: Record<number, AnkiDeck> = {};
  for (const [id, d] of Object.entries(decksJson) as [string, Record<string, unknown>][]) {
    decks[Number(id)] = { id: Number(id), name: d.name as string };
  }

  const notes = extractNotes(db);
  const cards = extractCards(db);

  return { notes, cards, models, decks };
}

function extractNotes(db: Database): AnkiNote[] {
  const result = db.exec('SELECT id, mid, tags, flds FROM notes');
  return (result[0]?.values ?? []).map(row => ({
    id: row[0] as number,
    mid: row[1] as number,
    tags: row[2] as string,
    fields: (row[3] as string).split('\x1f'),
  }));
}

function extractCards(db: Database): AnkiCard[] {
  const result = db.exec(
    'SELECT id, nid, ord, type, queue, due, ivl, reps, lapses FROM cards'
  );
  return (result[0]?.values ?? []).map(row => ({
    id: row[0] as number,
    nid: row[1] as number,
    ord: row[2] as number,
    type: row[3] as number,
    queue: row[4] as number,
    due: row[5] as number,
    ivl: row[6] as number,
    reps: row[7] as number,
    lapses: row[8] as number,
  }));
}
