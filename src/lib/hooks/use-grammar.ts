'use client';

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { GRAMMAR_RULES } from '@/lib/grammar-rules';
import { usePreferredLevel } from '@/lib/hooks/use-preferred-level';
import type { CEFRLevel } from '@/lib/resources';
import type { GrammarCategory } from '@/lib/grammar-rules';

const BOOKMARKS_KEY = 'norsk-grammar-bookmarks';

function readBookmarks(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export interface UseGrammarReturn {
  rules: import('@/lib/grammar-rules').GrammarRule[];
  search: string;
  setSearch: (q: string) => void;
  levelFilter: CEFRLevel | 'all';
  setLevelFilter: (l: CEFRLevel | 'all') => void;
  categoryFilter: GrammarCategory | 'all';
  setCategoryFilter: (c: GrammarCategory | 'all') => void;
  progressMap: Map<string, 'learning' | 'known' | undefined>;
  setMastery: (ruleId: string, status: 'learning' | 'known' | null) => Promise<void>;
  notesMap: Map<string, string>;
  setNote: (ruleId: string, note: string) => Promise<void>;
  bookmarks: Set<string>;
  toggleBookmark: (ruleId: string) => void;
  expandedRuleId: string | null;
  setExpandedRuleId: (id: string | null) => void;
}

export function useGrammar(): UseGrammarReturn {
  const [preferredLevel] = usePreferredLevel();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<CEFRLevel | 'all'>(preferredLevel);
  const [categoryFilter, setCategoryFilter] = useState<GrammarCategory | 'all'>('all');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(readBookmarks);

  const progressRows = useLiveQuery(() => db.grammarProgress.toArray()) ?? [];
  const progressMap = useMemo(
    () => new Map(progressRows.map(r => [r.ruleId, r.status])),
    [progressRows]
  );
  const notesMap = useMemo(
    () => new Map(progressRows.filter(r => r.userNotes).map(r => [r.ruleId, r.userNotes!])),
    [progressRows]
  );

  // Reset expanded card when filters change
  useEffect(() => {
    setExpandedRuleId(null);
  }, [levelFilter, categoryFilter]);

  const rules = useMemo(() => {
    let base = GRAMMAR_RULES;

    if (levelFilter !== 'all') {
      base = base.filter(r => r.level === levelFilter);
    }
    if (categoryFilter !== 'all') {
      base = base.filter(r => r.category === categoryFilter);
    }

    if (!search.trim()) return base;

    // Run Fuse on the filtered subset
    const subset = new Fuse(base, {
      keys: [
        { name: 'title', weight: 0.35 },
        { name: 'tags', weight: 0.25 },
        { name: 'explanation', weight: 0.20 },
        { name: 'explanationEnglish', weight: 0.15 },
        { name: 'examples.norwegian', weight: 0.05 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });

    return subset.search(search).map(r => r.item);
  }, [search, levelFilter, categoryFilter]);

  const setMastery = async (ruleId: string, status: 'learning' | 'known' | null) => {
    const existing = await db.grammarProgress.where('ruleId').equals(ruleId).first();
    if (status === null) {
      if (existing?.userNotes) {
        // Keep the row for the notes, just clear the status
        await db.grammarProgress.put({ ...existing, status: undefined, updatedAt: new Date() });
      } else {
        if (existing) await db.grammarProgress.delete(existing.id);
      }
    } else {
      await db.grammarProgress.put({
        id: existing?.id ?? crypto.randomUUID(),
        ruleId,
        ...existing,
        status,
        updatedAt: new Date(),
      });
    }
  };

  const setNote = async (ruleId: string, note: string) => {
    const existing = await db.grammarProgress.where('ruleId').equals(ruleId).first();
    const userNotes = note.trim() || undefined;
    if (!existing && !userNotes) return;
    await db.grammarProgress.put({
      id: existing?.id ?? crypto.randomUUID(),
      ruleId,
      ...existing,
      userNotes,
      updatedAt: existing?.updatedAt ?? new Date(),
    });
  };

  const toggleBookmark = (ruleId: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  return {
    rules,
    search,
    setSearch,
    levelFilter,
    setLevelFilter,
    categoryFilter,
    setCategoryFilter,
    progressMap,
    setMastery,
    notesMap,
    setNote,
    bookmarks,
    toggleBookmark,
    expandedRuleId,
    setExpandedRuleId,
  };
}
