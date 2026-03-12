import type { ReviewStatus } from '@/lib/db';
import type { AnkiCard, AnkiNote, AnkiFieldMapping, MappedVocabData } from './types';

/**
 * Map Anki card scheduling data to the app's ReviewStatus.
 *
 * - queue=0 or type=0 → 'new'
 * - queue=1,3 or type=1,3 → 'learning'
 * - queue=2, ivl >= 21 → 'known' (mature)
 * - queue=2, ivl < 21 → 'learning' (young)
 * - queue=-1 (suspended): infer from reps/ivl
 */
export function mapAnkiScheduleToStatus(card: AnkiCard): ReviewStatus {
  if (card.queue === 0 || card.type === 0) return 'new';
  if (card.queue === 1 || card.queue === 3 || card.type === 1 || card.type === 3) return 'learning';
  if (card.queue === 2) return card.ivl >= 21 ? 'known' : 'learning';
  // Suspended cards
  if (card.queue === -1) {
    if (card.reps === 0) return 'new';
    return card.ivl >= 21 ? 'known' : 'learning';
  }
  return 'new';
}

/**
 * For a note with multiple cards, pick the "best" status.
 * Priority: known > learning > new
 */
export function bestStatus(statuses: ReviewStatus[]): ReviewStatus {
  if (statuses.includes('known')) return 'known';
  if (statuses.includes('learning')) return 'learning';
  return 'new';
}

/**
 * Strip HTML tags and entities that Anki fields may contain.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Build a vocab data object from an Anki note + its cards.
 * Returns null if required fields are empty.
 */
export function mapNoteToVocabData(
  note: AnkiNote,
  cards: AnkiCard[],
  mapping: AnkiFieldMapping,
): MappedVocabData | null {
  const norwegian = stripHtml(note.fields[mapping.norwegianFieldIndex] ?? '');
  const english = stripHtml(note.fields[mapping.englishFieldIndex] ?? '');
  if (!norwegian || !english) return null;

  const noteText = mapping.notesFieldIndex !== undefined
    ? stripHtml(note.fields[mapping.notesFieldIndex] ?? '') || undefined
    : undefined;

  const statuses = cards.map(mapAnkiScheduleToStatus);
  const reviewStatus = statuses.length > 0 ? bestStatus(statuses) : 'new';

  return { norwegian, english, notes: noteText, reviewStatus };
}
