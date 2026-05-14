'use client';

import { useState, useCallback } from 'react';
import type { CEFRLevel } from '@/lib/resources';
import { isCEFRLevel } from '@/lib/utils';

const STORAGE_KEY = 'norsk-preferred-level';
const DEFAULT_LEVEL: CEFRLevel = 'A2';

function readStored(): CEFRLevel {
  if (typeof window === 'undefined') return DEFAULT_LEVEL;
  const v = localStorage.getItem(STORAGE_KEY);
  return isCEFRLevel(v) ? v : DEFAULT_LEVEL;
}

export function usePreferredLevel() {
  const [level, setLevelState] = useState<CEFRLevel>(readStored);

  const setLevel = useCallback((next: CEFRLevel) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Quota exceeded or private browsing; carry on with in-memory state.
    }
    setLevelState(next);
  }, []);

  return [level, setLevel] as const;
}
