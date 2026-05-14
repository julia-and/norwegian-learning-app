import type { CEFRLevel } from '@/lib/resources';

export type WordChoiceCategory =
  | 'conjunctions' | 'verbs' | 'prepositions' | 'pronouns' | 'adverbs';

export interface WordChoiceExample {
  norwegian: string;
  english: string;
}

export interface WordChoiceEntry {
  word: string;
  meaning: string;
  meaningEnglish: string;
  examples: WordChoiceExample[];
}

export interface WordChoiceGroup {
  id: string;
  title: string;
  level: CEFRLevel;
  category: WordChoiceCategory;
  tip?: string;
  tipEnglish?: string;
  words: WordChoiceEntry[];
  tags: string[];
}

export const WORD_CHOICE_CATEGORY_LABELS: Record<WordChoiceCategory, string> = {
  conjunctions: 'Konjunksjoner',
  verbs: 'Verb',
  prepositions: 'Preposisjoner',
  pronouns: 'Pronomen',
  adverbs: 'Adverb',
};

/**
 * Lazy-loads the word-choice groups. See `prompts.ts` for the pattern.
 */
let cache: Promise<WordChoiceGroup[]> | null = null;
export function loadWordChoiceGroups(): Promise<WordChoiceGroup[]> {
  if (!cache) {
    cache = import('./word-choices-data').then(m => m.WORD_CHOICE_GROUPS);
  }
  return cache;
}
