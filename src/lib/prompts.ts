import type { CEFRLevel } from './resources';

export interface WritingPrompt {
  id: string;
  level: CEFRLevel;
  topic: string;
  prompt: string;
  promptEn: string;
  hints?: string[];
  wordCountTarget: number;
}

/**
 * Lazy-loads the writing prompts array. Next.js bundles this as a separate
 * chunk, so the ~13 KB of prompt data isn't in the main JS bundle.
 *
 * Result is cached at module scope; first call kicks off the fetch, all
 * subsequent calls await the same promise.
 */
let cache: Promise<WritingPrompt[]> | null = null;
export function loadWritingPrompts(): Promise<WritingPrompt[]> {
  if (!cache) {
    cache = import('./prompts-data').then(m => m.WRITING_PROMPTS);
  }
  return cache;
}
