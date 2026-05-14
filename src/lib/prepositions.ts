import type { CEFRLevel } from '@/lib/resources';
import { shuffle } from '@/lib/utils';

export interface PrepGuideEntry {
  id: string;
  word: string;
  level: CEFRLevel;
  explanationNorsk: string;
  explanationEnglish: string;
  examples: { norwegian: string; english: string }[];
  exceptions?: { norwegian: string; english: string; note: string }[];
}

export interface PrepExercise {
  id: string;
  level: CEFRLevel;
  sentence: string;   // ___ marks the blank
  answer: string;
  explanationNorsk: string;
  explanationEnglish: string;
}

/**
 * Lazy-loaded data. ~26 KB combined, code-split into its own chunk.
 */
let guideCache: Promise<PrepGuideEntry[]> | null = null;
export function loadPrepGuide(): Promise<PrepGuideEntry[]> {
  if (!guideCache) {
    guideCache = import('./prepositions-data').then(m => m.PREP_GUIDE);
  }
  return guideCache;
}

let exercisesCache: Promise<PrepExercise[]> | null = null;
export function loadPrepExercises(): Promise<PrepExercise[]> {
  if (!exercisesCache) {
    exercisesCache = import('./prepositions-data').then(m => m.PREP_EXERCISES);
  }
  return exercisesCache;
}

const LEVEL_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

/** Pick up to `n` exercises at the given level, plus one level below for variety. */
export function sampleExercises(
  exercises: PrepExercise[],
  level: CEFRLevel,
  n = 10,
): PrepExercise[] {
  const idx = LEVEL_ORDER.indexOf(level);
  const allowed = idx > 0 ? [level, LEVEL_ORDER[idx - 1]] : [level];
  const pool = exercises.filter(e => allowed.includes(e.level));
  return shuffle(pool).slice(0, n);
}
