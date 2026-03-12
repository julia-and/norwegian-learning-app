const ANKI_CONNECT_URL = 'http://localhost:8765';

async function invoke<T>(action: string, params: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(ANKI_CONNECT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, version: 6, params }),
  });
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result.result as T;
}

export async function testConnection(): Promise<boolean> {
  try {
    await invoke<number>('version');
    return true;
  } catch {
    return false;
  }
}

export async function getDeckNames(): Promise<string[]> {
  return invoke<string[]>('deckNames');
}

export async function getModelNames(): Promise<string[]> {
  return invoke<string[]>('modelNames');
}

export async function getModelFieldNames(modelName: string): Promise<string[]> {
  return invoke<string[]>('modelFieldNames', { modelName });
}

export interface AnkiConnectNoteInfo {
  noteId: number;
  modelName: string;
  tags: string[];
  fields: Record<string, { value: string; order: number }>;
  mod: number;
}

export interface AnkiConnectCardInfo {
  cardId: number;
  note: number;
  type: number;
  queue: number;
  due: number;
  interval: number;
  reps: number;
  lapses: number;
}

export async function findNotes(query: string): Promise<number[]> {
  return invoke<number[]>('findNotes', { query });
}

export async function getNotesInfo(notes: number[]): Promise<AnkiConnectNoteInfo[]> {
  return invoke<AnkiConnectNoteInfo[]>('notesInfo', { notes });
}

export async function findCards(query: string): Promise<number[]> {
  return invoke<number[]>('findCards', { query });
}

export async function getCardsInfo(cards: number[]): Promise<AnkiConnectCardInfo[]> {
  return invoke<AnkiConnectCardInfo[]>('cardsInfo', { cards });
}
