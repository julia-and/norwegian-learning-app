import { useState, useCallback } from 'react';
import type { CEFRLevel } from '@/lib/resources';

const STORAGE_KEY = 'norsk-preferred-level';
const DEFAULT_LEVEL: CEFRLevel = 'A2';

function readStored(): CEFRLevel {
  if (typeof window === 'undefined') return DEFAULT_LEVEL;
  const v = localStorage.getItem(STORAGE_KEY);
  return (v as CEFRLevel) ?? DEFAULT_LEVEL;
}

export function usePreferredLevel() {
  const [level, setLevelState] = useState<CEFRLevel>(readStored);

  const setLevel = useCallback((next: CEFRLevel) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLevelState(next);
  }, []);

  return [level, setLevel] as const;
}
