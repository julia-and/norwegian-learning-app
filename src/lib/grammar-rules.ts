import type { CEFRLevel } from '@/lib/resources';

export type GrammarCategory =
  | 'nouns' | 'verbs' | 'adjectives' | 'pronouns' | 'prepositions'
  | 'sentence-structure' | 'conjunctions' | 'word-order' | 'tense' | 'adverbs';

export interface GrammarExample {
  norwegian: string;
  english: string;
  notes?: string;
}

export interface GrammarExercise {
  type: 'fill-in-the-blank' | 'multiple-choice';
  prompt: string;
  answer: string;
  options?: string[];
  hint?: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  category: GrammarCategory;
  level: CEFRLevel;
  explanation: string;
  explanationEnglish: string;
  examples: GrammarExample[];
  tags: string[];
  exercises: GrammarExercise[];
}

export const CATEGORY_LABELS: Record<GrammarCategory, string> = {
  nouns: 'Substantiver',
  verbs: 'Verb',
  adjectives: 'Adjektiver',
  pronouns: 'Pronomen',
  prepositions: 'Preposisjoner',
  'sentence-structure': 'Setningsstruktur',
  conjunctions: 'Konjunksjoner',
  'word-order': 'Ordstilling',
  tense: 'Tempus',
  adverbs: 'Adverb',
};

/**
 * Lazy-loads the grammar rules. ~37 KB of data, code-split into its own
 * chunk by Next.js so the main bundle stays slim.
 */
let cache: Promise<GrammarRule[]> | null = null;
export function loadGrammarRules(): Promise<GrammarRule[]> {
  if (!cache) {
    cache = import('./grammar-rules-data').then(m => m.GRAMMAR_RULES);
  }
  return cache;
}
